import React from "react";
import { Category } from "./Category";
import CategoryBrowser from "./CategoryBrowser";
import "./CategoryCrumb.css";

export default class CategoryCrumb extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.selectCategory = this.selectCategory.bind(this);
    }

    selectCategory() {
        let root: CategoryBrowser = this.props.root;
        let cat: Category = this.props.category;
        root.selectCategory(cat.id);
    }

    render() {

        let cat: Category = this.props.category;
        return (
            <div
                className="cats-crumb"
            >
                <span
                    className="cats-crumb-label"
                    onClick={this.selectCategory}
                >
                    {cat.title}
                </span>
            </div>
        );
    }
}