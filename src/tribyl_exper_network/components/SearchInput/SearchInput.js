import React, { Component } from 'react';
import './SearchInput.style.scss';

const DEFAULT_CLASSNAME = "expert-network-search";

export class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }

    handleChange = (e) => {
        const { onChange } = this.props;
        const value = e.target.value;
        this.setState({ value });
        if (onChange) onChange(value);
    }

    onInput = (e) => {
        const { onInput } = this.props;
        const value = e.target.value;
        this.setState({ value });
        if (onInput) onInput(value);
    }
    render() {
        const { className } = this.props;
        return (
            <div className={`${DEFAULT_CLASSNAME}-container ${className}`}>
                <input onChange={this.handleChange} onInput={this.onInput} value={this.state.value} className={`${DEFAULT_CLASSNAME}`} placeholder={this.props.placeholder || "Search"} />
                <span className="material-icons">search</span>
            </div >
        );
    }
}

