import { eLoadingState, FlowComponent, FlowField, FlowObjectData, FlowObjectDataArray } from "flow-component-model";
import React, { CSSProperties } from "react";
import { Categories, Category, CategoryConfig } from "./Category";
import './CategoryBrowser.css';
import CategoryCrumb from "./CategoryCrumb";
import CategoryExpander from "./CategoryExpander";
import CategoryItem from "./CategoryItem";
import SearchBox from "./SearchBox";

declare const manywho: any;

export default class CategoryBrowser extends FlowComponent {

    categories: Categories;
    searchBox: SearchBox;

    constructor(props: any){
        super(props);
        this.moveHappened = this.moveHappened.bind(this);
        this.loadCategories = this.loadCategories.bind(this);
        this.search = this.search.bind(this);
        this.expandCategory = this.expandCategory.bind(this);
        this.collapseExpander = this.collapseExpander.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        
        this.state = {value: "", expander: null}
    }

    async componentDidMount(){
        await super.componentDidMount();   
        (manywho as any).eventManager.addDoneListener(this.moveHappened, this.componentId);
        this.loadCategories();
    }

    async componentWillUnmount(): Promise<void> {
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    moveHappened(xhr: XMLHttpRequest, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {
            this.loadCategories();
        }
    }

    loadCategories() {
        let selectedId: string;
        let conf: CategoryConfig = new CategoryConfig();
        conf.idColumn = this.model.displayColumns[0]?.developerName;
        conf.lvl1Column = this.model.displayColumns[1]?.developerName;
        conf.lvl2Column = this.model.displayColumns[2]?.developerName;
        conf.lvl3Column = this.model.displayColumns[3]?.developerName;
        conf.idSepCharacter = this.getAttribute("idSeparatorCharacter","-");
        this.model.dataSource.items.forEach((item: FlowObjectData) => {
            if(item.isSelected) {
                selectedId=item.properties[conf.idColumn]?.value as string;
            }
        });
        this.categories = Categories.parse(this.model.dataSource,conf);
        this.setState({expander: null, expandedCategory: null, selectedCategory: selectedId});
    }

    async search(e: any) {
        if(this.outcomes["onSearch"]) {
            this.triggerOutcome("onSearch")
        }
    }

    expandCategory(cat: Category, forceExpanded: boolean) {
        //are we expanded ?
        if(this.state.expander) {
            // yes, but is it the passed one?
            if(this.state.expandedCategory === cat.id) {
                // it's the same, hide it
                this.setState({expander: null, expandedCategory: null});
            }
            else {
                // no it's different, show a new one
                let expander = (
                    <CategoryExpander 
                        root={this}
                        category={cat}
                        expanded={forceExpanded}
                    />
                );
                this.setState({expander: expander, expandedCategory: cat.id});
            }
        }
        // no, just show it
        else {
            let expander = (
                <CategoryExpander 
                    root={this}
                    category={cat}
                    expanded={forceExpanded}
                />
            );
    
            this.setState({expander: expander, expandedCategory: cat.id});
        }
    }

    collapseExpander() {
        this.setState({expander: null, expandedCategory: null});
    }

    async selectCategory(id: string) {
        this.setState({expander: null, expandedCategory: null, selectedCategory: id});
        await this.setStateValue(this.categories.getById(id)?.objectData? this.categories.getById(id).objectData : new FlowObjectDataArray());
        let onSelectCoutcomeName: string = this.getAttribute("selectOutcomeName","onSelect");
        if(this.outcomes[onSelectCoutcomeName]) {
            this.triggerOutcome(onSelectCoutcomeName);
        }
    }

    async setSearchString(searchString: string) {
        let srchStringFieldName: string = this.getAttribute("searchStringFieldName");
        if(srchStringFieldName) {
            let srchStringField: FlowField = await this.loadValue(srchStringFieldName);
            if(srchStringField) {
                srchStringField.value = searchString;
                await this.updateValues(srchStringField);
                let onSearchCoutcomeName: string = this.getAttribute("searchOutcomeName","onSearch");
                if(this.outcomes[onSearchCoutcomeName]) {
                    this.triggerOutcome(onSearchCoutcomeName);
                }
            }
        }
    }

    render() {
        const style: CSSProperties = {};
        style.width = 'fit-content';
        
        if (this.model.visible === false) {
            style.display = 'none';
        }
        if (this.model.width) {
            style.width = this.model.width + 'px';
        }
        if (this.model.height) {
            style.height = this.model.height + 'px';
        }

        let items: any[] = [];

        if(this.getAttribute("rootModeLabel","").toLowerCase().trim() === "") {
            this.categories?.items.forEach((cat: Category) => {
                items.push(
                    <CategoryItem 
                        root={this}
                        category={cat}
                    />
                );
            });
        }
        else {
            items.push(
                <CategoryItem 
                    root={this}
                    label={this.getAttribute("rootModeLabel")}
                />
            );
        }      
        

        let crumbs: any[] = [];
        if(this.state.selectedCategory) {
            let selcat: Category = this.categories.getById(this.state.selectedCategory);
            if(selcat && selcat.id !=="???"){
                
                let ccat = selcat;
                while (ccat.parent) {
                    crumbs.splice(0,0,
                        <CategoryCrumb
                            root={this}
                            category={ccat}
                        />
                    );
                    crumbs.splice(0,0,
                        <span
                            className="cats-crumb-sep"
                        >
                            &gt;    
                        </span>
                    );
                    ccat = ccat.parent;
                }
                crumbs.splice(0,0,
                    <CategoryCrumb
                        root={this}
                        category={ccat}
                    />
                );

                crumbs.splice(0,0,
                    <span
                        className="cats-crumb-sep"
                    >
                        &gt;    
                    </span>
                );

                crumbs.splice(0,0,
                    <CategoryCrumb
                        root={this}
                        category={this.categories.getById(null)}
                    />
                );
            }
        }
        return (
            <div
                style={style}
                className='cats'
            >
                <SearchBox 
                    catBrowser={this}
                    ref={(element: SearchBox) => {this.searchBox = element}}
                />
                <div
                    className='cats-nav'
                >
                    {items}
                    {this.state.expander}
                </div>
                <div
                    className='cats-crumbs'
                >
                    {crumbs}
                </div>
                
                
            </div>
        );
    }
}

manywho.component.register('CategoryBrowser', CategoryBrowser);