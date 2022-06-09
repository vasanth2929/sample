import React from 'react';
import PropTypes from 'prop-types';
import { Control } from 'react-redux-form';

import './styles/CheckBox.style.scss';

export const MultipleCheckBoxControl = (props) => {
    return (
        <section className="controlled-checkboxes">
            <div className="row">
                {props.choices !== null ? props.choices.map((item, key) => (
                    <div className="col-4" key={props.customKey ? `${key}_${props.customKey}` : `${key}`}>
                        <label
                            htmlFor={props.customKey ? `${key}_${props.customKey}` : `${key}`}
                            key={props.customKey ? `${key}_${props.customKey}` : `${key}`}
                            className={props.fieldsData.indexOf(item) > -1 ? 'checked checkbox-container' : 'checkbox-container'}>
                            {item}
                            <Control.checkbox
                                id={props.customKey ? `${key}_${props.customKey}` : `${key}`}
                                model={props.model}
                                updateOn={['change']}
                                ignore={['focus', 'blur']}
                                disabled={props.disabled}
                                value={item} />
                            <span className="checkmark" />
                        </label>
                    </div>
                )) : <div />}
            </div>
        </section>
    );
};

MultipleCheckBoxControl.propTypes = {
    model: PropTypes.string.isRequired,
    defaultValue: PropTypes.bool
};
