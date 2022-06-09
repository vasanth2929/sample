import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles/RadioGroup.style.scss';

export class DealCardRadioGroup extends PureComponent {
    render() {
        const { props } = this;
        const {
 radioOptions = [], name, onClickHandler, errorMessage, isValid, value, buttonClass 
} = props;
        return (
          <div className="flex-header clearfix form-group radio-form-group row">
            {radioOptions.map((item, key) =>
            (<label
                htmlFor={name + '-' + item}
                className={buttonClass + ' radio-container'}
                key={key}>
                {item}
                <input
                    className="radio-custom"
                    defaultChecked={item === value}
                    type="radio"
                    name={name}
                    data-name={name}
                    data-value={item}
                    id={name + '-' + item}
                    value={item}
                    onChange={onClickHandler} />
                <span className="checkmark" />
             </label>))}
              {isValid === 'false' && <p className="errormessage">{errorMessage}</p>}
          </div>
        );
    }
}

DealCardRadioGroup.propTypes = {
    radioOptions: PropTypes.array,
    name: PropTypes.string,
    onClickHandler: PropTypes.func,
    errorMessage: PropTypes.node,
    isValid: PropTypes.bool,
    value: PropTypes.string
};
