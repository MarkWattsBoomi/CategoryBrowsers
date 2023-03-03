import React from "react";
import { Category } from "./Category";
import CategoryBrowser from "./CategoryBrowser";
import "./CategoryExpander.css";
import CategoryExpanderSection from "./CategoryExpanderSection";


export default class CategoryExpander extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.selectCategory = this.selectCategory.bind(this);
    }

    selectCategory(id: string) {
        let root: CategoryBrowser = this.props.root;
        root.selectCategory(id);
    }

    render() {

        let root: CategoryBrowser = this.props.root;
        let cat: Category = this.props.category;

        let sections: any[] = [];
        cat.children.forEach((child: Category) => {
            sections.push(
                <CategoryExpanderSection 
                    root={root}
                    parent={this}
                    category={child}
                />
            );
        });

        return(
            <div
                className="cat-expand"
            >
                {sections}
            </div>
        );
    }
}