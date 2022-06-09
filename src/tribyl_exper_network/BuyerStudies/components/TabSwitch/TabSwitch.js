import React, { Component } from 'react';
import './TabSwitch.style.scss';

const DEFAULT_CLASSNAME = "expert-network-tabSwitch";

class TabSwitch extends Component {
    
    render() {
        return (
            <div className={`${DEFAULT_CLASSNAME}`}>
                <span className={`${DEFAULT_CLASSNAME} selected text text-large`}>Share Insights</span>
                <span className={`${DEFAULT_CLASSNAME} text text-large`}>View insights</span>
            </div>
        );
    }
}

export default TabSwitch;
