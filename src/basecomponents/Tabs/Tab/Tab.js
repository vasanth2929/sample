import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Tab extends PureComponent {
    render() {
        const { props } = this;
        const {
 linkClass, isActive, tabIndex, content 
} = props;
        return (
            <li className="tab">
                <a 
                    role="button" 
                    className={`tab-link ${linkClass} ${isActive ? 'active' : ''}`}
                    id={linkClass}
                    onClick={(event) => {
                        event.preventDefault();
                        props.onClick(tabIndex);
                    }}>
                    <p className={`tab-icon ${linkClass}`}>{content}</p>
                </a>
            </li>
        );
    } 
}

Tab.propTypes = {
    linkClass: PropTypes.string,
    isActive: PropTypes.bool,
    tabIndex: PropTypes.node,
    content: PropTypes.node
};
