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

        let onClick: any;
        let catClass: string = "cats-crumb-label";
        let cat: Category = this.props.category;

        if(cat.id==="???" || cat.enabled===true) {
            onClick=this.selectCategory;
            catClass += " cats-crumb-label-active"
        }
        return (
            <div
                className="cats-crumb"
            >
                <span
                    className={catClass}
                    onClick={onClick}
                >
                    {cat.title}
                </span>
            </div>
        );
    }
}