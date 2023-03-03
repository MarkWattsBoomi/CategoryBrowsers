import CategoryBrowser from "./CategoryBrowser";
import { Category } from "./Category";
import React from "react";


export default class CategoryItem extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.expandCategory = this.expandCategory.bind(this);
    }

    expandCategory() {
        let root: CategoryBrowser = this.props.root;
        let cat: Category = this.props.category;
        root.expandCategory(cat);
    }

    render() {

        let root: CategoryBrowser = this.props.root;
        let cat: Category = this.props.category;

        let carret: any;
        if(root.state.expandedCategory === cat.id) {
            carret = (
                <span
                    className="cat-item-carret cat-item-carret-open glyphicon glyphicon-play"
                />
            );
        }
        else {
            carret = (
                <span
                    className="cat-item-carret glyphicon glyphicon-play"
                />
            );
        }
        return (
            <div
                className="cat-item"
                onClick={this.expandCategory}
            >
                <span
                    className="cat-item-label"
                >
                    {cat.title}
                </span>
                {carret}
            </div>
        );
    }
}