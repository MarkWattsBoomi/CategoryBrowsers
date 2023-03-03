import React from "react";
import { Category } from "./Category";
import CategoryBrowser from "./CategoryBrowser";
import CategoryExpander from "./CategoryExpander";
import "./CategoryExpanderSection.css";


export default class CategoryExpanderSection extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.selectCategory = this.selectCategory.bind(this);
    }

    selectCategory(id: string) {
        let root: CategoryBrowser = this.props.root;
        let parent: CategoryExpander = this.props.parent;
        parent.selectCategory(id);
    }

    render() {

        let root: CategoryBrowser = this.props.root;
        let cat: Category = this.props.category;

        let sections: any[] = [];
        cat.children.forEach((child: Category) => {
            sections.push(
                <div
                    className="cat-expand-sec-item"
                    onClick={(e: any) => {this.selectCategory(child.id)}}
                >
                    {child.title}
                </div>
            );
        });

        return(
            <div
                className="cat-expand-sec"
            >
                <div
                    className="cat-expand-sec-title"
                >
                    <span
                        onClick={(e: any) => {this.selectCategory(cat.id)}}
                    >
                        {cat.title}
                    </span>
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