import React, { useState } from 'react';
import './Collapsible.style.scss';

const DEFUALT_CLASSNAME = "collapsibleV2";

export const CollapsibleV2 = ({ title, headerOptions, body, footer, className, openDefault, isnonCollapsible }) => {
    const DefaultOpen = !!openDefault;
    const [isOpen, setisOpen] = useState(DefaultOpen);

    const handleOpen = (status) => {
        if (!isnonCollapsible) {
            setisOpen(status);
        }
    };

    return (
        <div className={`${DEFUALT_CLASSNAME} ${className}`}>
            <div className={`${DEFUALT_CLASSNAME}-header`} onClick={() => handleOpen(!isOpen)} role="button" aria-expanded={isOpen}>
                <div className={`${DEFUALT_CLASSNAME}-header-title`}>
                    {title}
                </div>
                <div className={`${DEFUALT_CLASSNAME}-header-options`}>
                    {headerOptions}
                    {(!isnonCollapsible && isOpen) ? <span className="material-icons">
                        keyboard_arrow_up
                                                     </span> :
                        <span className="material-icons">
                            keyboard_arrow_down
                        </span>}
                </div>
            </div>
            {isOpen &&
                <React.Fragment>
                    <div className={`${DEFUALT_CLASSNAME}-body`}> {body}</div>
                    <div className={`${DEFUALT_CLASSNAME}-footer`}>{footer}</div>
                </React.Fragment>
            }
        </div>
    );
};

