import React, { Component } from 'react';
import './Pill.style.scss';

const DEFAULT_CLASSNAME = "pill";


class Pill extends Component {
    render() {
        const { text, selected } = this.props;
        return (
            <div className={`${DEFAULT_CLASSNAME}${selected ? " selected" : ""}`}>
            {selected && <span className="material-icons">done</span>}
                <span className="text-bold">
                    {text}
                </span>
            </div>
        );
    }
}

export default Pill;