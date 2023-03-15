import React from "react";
import { Category } from "./Category";
import CategoryBrowser from "./CategoryBrowser";
import "./CategoryExpander.css";
import CategoryExpanderSection from "./CategoryExpanderSection";


export default class CategoryExpander extends React.Component<any,any> {

    elements: Map<string,CategoryExpanderSection>;

    constructor(props: any) {
        super(props);
        this.selectCategory = this.selectCategory.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.colapse = this.colapse.bind(this);
        this.elements = new Map();
    }

    selectCategory(id: string) {
        let root: CategoryBrowser = this.props.root;
        root.selectCategory(id);
    }

    mouseOut(e: any) {
        let root: CategoryBrowser = this.props.root;
        root.collapseExpander()
    }

    colapse(exclude: string) {
        let root: CategoryBrowser = this.props.root;

        this.elements?.forEach((element: CategoryExpanderSection, id: string) => {
            if(id != exclude) {
                element.colapse(exclude);
            }
        })
    }

    render() {

        let root: CategoryBrowser = this.props.root;
        let cat: Category = this.props.category;

        let sections: any[] = [];
        let expanded: boolean = this.props.expanded;
        cat.children.forEach((child: Category) => {
            sections.push(
                <CategoryExpanderSection 
                    root={root}
                    parent={this}
                    category={child}
                    level={0}
                    ref={(element: CategoryExpanderSection) =>{this.elements.set(child.id,element)}}
                    expanded={expanded}
                />
            );
            expanded=false;
        });

        return(
            <div
                className="cat-expand"
                onMouseLeave={this.mouseOut}
            >
                {sections}
            </div>
        );
    }
}