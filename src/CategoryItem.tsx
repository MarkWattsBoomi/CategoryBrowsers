import CategoryBrowser from "./CategoryBrowser";
import { Category } from "./Category";
import React from "react";


export default class CategoryItem extends React.Component<any,any> {

    cat: Category;

    constructor(props: any) {
        super(props);
        this.expandCategory = this.expandCategory.bind(this);
    }

    expandCategory() {
        let root: CategoryBrowser = this.props.root;
        let cat: Category = this.props.category;
        root.expandCategory(this.cat);
    }

    render() {

        let root: CategoryBrowser = this.props.root;
        this.cat = this.props.category;
        if(!this.cat) {
            this.cat = new Category();
            this.cat.id = crypto.randomUUID();
            this.cat.title="Categories";
            this.cat.children=root.categories?.items;
        }

        let carret: any;
        if(root.state.expandedCategory === this.cat.id) {
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
                    {this.cat.title}
                </span>
                {carret}
            </div>
        );
    }
}