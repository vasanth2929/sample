import React, { Component } from 'react';
import './CustomeCarousels.style.scss';


const DEFAULT_CLASSNAME = "custome_carousels";

export class CustomeCarousels extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0
        };
    }

    onClick = (value) => {
        const { children } = this.props;
        const total = children.length - 1;
        if (value >= 0 && value <= total) {
            this.setState({ activeIndex: value });
        }
    }

    render() {
        const { children } = this.props;
        const { activeIndex } = this.state;
        return (
            <div className={`${DEFAULT_CLASSNAME}`}>
                <div className={`${DEFAULT_CLASSNAME}-prev`}>
                    <span onClick={() => this.onClick(activeIndex - 1)} className="material-icons" role="link">
                        keyboard_arrow_left
                    </span>
                </div>
                <div className={`${DEFAULT_CLASSNAME}-content`}>
                    {children && children[activeIndex]}
                </div>
                <div className={`${DEFAULT_CLASSNAME}-next`}>
                    <span onClick={() => this.onClick(activeIndex + 1)} className="material-icons" role="link">
                        keyboard_arrow_right
                    </span>
                </div>
                <div className={`${DEFAULT_CLASSNAME}-indicator`}>
                    {children && children.map((i, index) => (
                        <div key={`custom-carousel-${index}`} className={`${index === activeIndex ? "active" : ""}`} />
                    ))}
                </div>
            </div>
        );
    }
}

