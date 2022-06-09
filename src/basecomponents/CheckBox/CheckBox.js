import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles/CheckBox.style.scss';

export class CheckBox extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { isChecked: props.isChecked };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ isChecked: nextProps.isChecked });
    }
    toggleCheckbox = () => {
        this.setState(state => ({ isChecked: !state.isChecked }), () => this.props.onChange(this.state.isChecked));
    };
    render () {
        const props = this.props;
        const { 
            id, 
            label, 
            customLabelClass, 
            disabled
        } = props;
        return (
            <label htmlFor={id} className={`checkbox-container ${customLabelClass} ${disabled ? 'is-disabled' : ''}`}>{label}
                <input 
                    id={id}
                    type="checkbox"
                    onChange={this.toggleCheckbox}
                    checked={this.state.isChecked}
                    disabled={disabled} />
                <span className="checkmark" />
            </label>
        );
    }
}

CheckBox.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

CheckBox.defaultProps = {
    disabled: false,
    onChange: () => {}
};
