/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import { Control } from 'react-redux-form';

import './styles/CheckBox.style.scss';

export const CheckBox = (props) => {
    return (
        <label
            className={props.isChecked ? 'checked checkbox-container' : 'checkbox-container'}>
            {props.label} {props.isChecked}
            <Control.checkbox
                model={props.model}
                updateOn={['change']}
                defaultChecked={props.defaultValue}
                ignore={['focus', 'blur']}
                value={props.isChecked}
            />
            <span className="checkmark" />
        </label>
    );
};

CheckBox.propTypes = {
    model: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    defaultValue: PropTypes.bool
};
