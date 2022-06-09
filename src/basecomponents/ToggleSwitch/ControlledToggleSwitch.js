import React, { PureComponent } from 'react';
import { Field } from 'react-redux-form';
import PropTypes from 'prop-types';

import './styles/ToggleSwitch.style.scss';

export class ControlledToggleSwitch extends PureComponent {
    // constructor (props) {
    //     super(props);
    //     this.state = {
    //         checkValue: props.checkValue
    //     };
    // }
    // componentWillReceiveProps(nextProps) {
    //    console.log('^^^', nextProps);
    // }
    // Clicked = () => {
    //     if (this.state.checkValue === 'on') {
    //         this.setState({
    //             checkValue: 'off'
    //         });
    //     } else {
    //         this.setState({
    //             checkValue: 'on'
    //         });
    //     }
    //     // this.props.handleToggleChange(this.state.checkValue);
    // }

    handleToggleChange = () => {
        this.props.handleToggleChange(this.props.checkValue);
    }
    render () {
        // const { checkValue } = this.state;
        const { 
            model, 
            required, 
            toggleSwitchClass, 
            activeText, 
            inactiveText,
            checkValue
        } = this.props;
        return (
            <Field
                model={model}
                required={required}
                updateOn={['change']}
                ignore={['focus', 'blur']}>
                <div className={toggleSwitchClass + ' react-toggle-switch'}>
                    <span className="switch-label left-label">{inactiveText}</span>
                    <label className="switch" htmlFor="switch">
                        <input type="checkbox" value={checkValue} />
                        <span value={checkValue} className="slider round" role="button" onClick={this.handleToggleChange} />
                    </label>
                    <span className="switch-label right-label">{activeText}</span>
                </div>
            </Field>
        );
    }
}

ControlledToggleSwitch.defaultProps = {
    checkValue: 'on',
    activeText: 'Active',
    inactiveText: 'Inactive'
};

ControlledToggleSwitch.propTypes = {
    checkValue: PropTypes.string,
    toggleSwitchClass: PropTypes.string,
    activeText: PropTypes.string,
    inactiveText: PropTypes.string,
    handleToggleChange: PropTypes.func
};
