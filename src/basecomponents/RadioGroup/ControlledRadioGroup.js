import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Control } from 'react-redux-form';

import './styles/RadioGroup.style.scss';

export class ControlledRadioGroup extends PureComponent {
    render() {
        const { props } = this;
        const {
            radioOptions = [],
            // name,
            // value, 
            model,
            customClass,
            handleValueChange,
            required,
            disabled,
            checkmarkCustomClass
        } = props;
        return (
            <section className="controlled-radio-group form-group radio-form-group">
                <div className="row">
                    {radioOptions.map((item, key) => 
                    (  
                        <div className="col-4" key={key}>
                            <label
                                htmlFor={item}
                                key={key}
                                className={`radio-container ${customClass}`}>
                                {item}
                                <Control.radio
                                    id={item}
                                    // defaultChecked={item === value}
                                    model={model}
                                    // name={name}
                                    updateOn={['change']}
                                    ignore={['focus', 'blur']}
                                    value={item}
                                    required={required}
                                    disabled={disabled !== null && typeof disabled !== 'undefined' ? disabled : false}
                                    onChange={() => handleValueChange(item)} />
                                <span className={`checkmark ${checkmarkCustomClass}`} />
                            </label>
                        </div>
                    ))}
                </div>
            </section>
        );
    }
}

ControlledRadioGroup.propTypes = {
    radioOptions: PropTypes.array,
    name: PropTypes.string,
    value: PropTypes.string
};
