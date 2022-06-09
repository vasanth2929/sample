import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles/RadioGroup.style.scss';

export class RadioGroup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { value: props.value, };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value, });
    }

    render() {
        const { props } = this;
        const {
 radioOptions = [], name, onClickHandler, onClickListener, errorMessage, isValid, buttonClass, columnClass = 'col-4' 
} = props;
        return (
          <div className="form-group radio-form-group row">
            {radioOptions.map((item, key) =>
            (<label
                htmlFor={item.idValue}
                className={`${buttonClass} ${columnClass} radio-container ${item.disabled ? 'disabled' : ''}`}
                key={[item.text, key].join('_')}>
                {`${item.text}${Object.prototype.hasOwnProperty.call(item, 'count') ? ' (' + item.count + ')' : ''}`}
                <input 
                    className="radio-custom"
                    checked={item.value === this.state.value}
                    type="radio"
                    name={name}
                    id={item.idValue}
                    value={item.value}
                    onChange={onClickHandler} 
                    onClick={onClickListener} 
                    disabled={item.disabled || false} />
                <span className={item.disabled ? 'checkmark disabled' : 'checkmark'} />
             </label>))}
              {isValid === 'false' && <p className="errormessage">{errorMessage}</p>}
          </div>
        );
    }
}

RadioGroup.propTypes = {
    errorMessage: PropTypes.node,
    disabled: PropTypes.bool,
    isValid: PropTypes.bool,
    name: PropTypes.string,
    onClickHandler: PropTypes.func,
    onClickListener: PropTypes.func,
    radioOptions: PropTypes.array,
    value: PropTypes.string
};

RadioGroup.defaultProps = {
    disabled: false,
    isValid: true,
    name: '',
    onClickHandler: () => {},
    onClickListener: () => {},
    radioOptions: [],
    value: ''
};
