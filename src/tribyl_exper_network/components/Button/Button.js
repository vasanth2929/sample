import React, { Component } from 'react';
import './Button.style.scss';

const DEFAULT_CLASSNAME = "expert-network-button";

export class Button extends Component {

    handleClick = (e) => {
        const { onClick } = this.props;
        if (onClick) onClick(e);
    }

    render() {
        const { className } = this.props;
        return (
            <button onClick={this.handleClick} className={`${DEFAULT_CLASSNAME} ${className}`}>
                {this.props.children}
            </button>
        );
    }
}

