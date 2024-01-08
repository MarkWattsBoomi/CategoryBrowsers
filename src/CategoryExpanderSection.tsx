import React from "react";
import { Category } from "./Category";
import CategoryBrowser from "./CategoryBrowser";
import CategoryExpander from "./CategoryExpander";
import "./CategoryExpanderSection.css";


export default class CategoryExpanderSection extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.selectCategory = this.selectCategory.bind(this);
        this.expand = this.expand.bind(this);
        this.colapse = this.colapse.bind(this);
        this.state={expanded: this.props.expanded || false}
    }

    selectCategory(e: any) {
        let root: CategoryBrowser = this.props.root;
        let parent: CategoryExpander = this.props.parent;
        let cat: Category = this.props.category;
        root.selectCategory(cat.id);
    }

    expand() {
        let root: CategoryBrowser = this.props.root;
        let cat: Category = this.props.category;
        let parent: CategoryExpanderSection = this.props.parent;
        if(parent) {
            parent.colapse(parent.props.category.id);
        }
        this.setState({expanded: !this.state.expanded});
    }

    colapse(exclude: string) {
        let root: CategoryBrowser = this.props.root;
        let cat: Category = this.props.category;
        if(cat.id != exclude) {
            this.setState({expanded: false});
        }
    }

    render() {

        let root: CategoryBrowser = this.props.root;
        let cat: Category = this.props.category;
        let className: string = "cat-expand-sec cat-expand-sec-" + this.props.level

        let sections: any[] = [];
        let carret: any;
        if(cat.children?.size > 0) {
            if(this.state.expanded) {
                cat.getSortedItems().forEach((child: Category) => {
                //cat.children.forEach((child: Category) => {
                    sections.push(
                        <CategoryExpanderSection 
                            root={root}
                            parent={this}
                            category={child}
                            level={this.props.level+1}
                        />
                    );
                });
                carret = (
                    <span
                        className="cat-expand-sec-title-carret-open glyphicon glyphicon-play"
                        onClick={this.expand}
                        title="Collapse"
                    />
                );
            }
            else {
                carret = (
                    <span
                        className="glyphicon glyphicon-play"
                        onClick={this.expand}
                        title="Expand"
                    />
                );
            }
        }

        let onClick: any;
        let catClass: string = "cat-expand-sec-title-label";
 
        if(cat.enabled===true) {
            onClick=this.selectCategory;
            catClass += " cat-expand-sec-title-label-active"
        }

        return(
            <div
                className={className}
            >
                <div
                    className="cat-expand-sec-title"
                >
                    <div 
                        className={catClass}
                    >
                        <span
                            onClick={onClick}
                        >
                            {cat.title}
                        </span>
                    </div>
                    <div 
                        className="cat-expand-sec-title-carret"
                    >
                        {carret}
                    </div>
                    
                </div>
                <div
                    className="cat-expand-sec-body"
                >
                    {sections}
                </div>
                
            </div>
        );
    }
}