import { faMagnifyingGlassArrowRight } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlassArrowRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { CSSProperties } from "react";
import CategoryBrowser from "./CategoryBrowser";
import './SearchBox.css';

declare const manywho: any;

export default class SearchBox extends React.Component<any,any> {

    constructor(props: any){
        super(props);
        this.search = this.search.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.valChanged = this.valChanged.bind(this);
        this.keyDown = this.keyDown.bind(this);
        this.state = {value: ""}
    }

    async search(e: any) {
        let catBrowser: CategoryBrowser = this.props.catBrowser;
        catBrowser.setSearchString(this.state.value, false);
    }

    clearSearch(e: any) {
        this.setState({value: ""});
        let catBrowser: CategoryBrowser = this.props.catBrowser;
        catBrowser.setSearchString("", true);
    }

    valChanged(e: any) {
        this.setState({value: e.currentTarget.value});
    }

    keyDown(e: any) {
        switch(e.key) {
            case "Delete":
                //e.preventDefault();
                //e.stopPropagation();
                e.currentTarget.value="";
                this.valChanged(e);
                break;

            case "Enter":
                e.preventDefault();
                e.stopPropagation();
                this.search(null);
                break;

            default: 
                //do nothing
                break;

        }
    }

    render() {
        let catBrowser: CategoryBrowser = this.props.catBrowser;
        return (
            <div
                className='srchbox'
                title="Search criteria"
            >
                <span
                    className="srchbox-label"
                >
                    {catBrowser.model.label}
                </span>
                <div
                    className="srchbox-input-container"
                >
                    <span
                        className="glyphicon glyphicon-search srchbox-button"
                        onClick={this.search}
                    />
                    <input 
                        className="srchbox-input"
                        type="text"
                        value={this.state.value}
                        onChange={this.valChanged}
                        onKeyDown={this.keyDown} 
                    />
                    <span
                        className="glyphicon glyphicon-remove srchbox-button"
                        role="button"
                        onClick={this.clearSearch}
                    />
                </div>
                
            </div>
        );
    }
}