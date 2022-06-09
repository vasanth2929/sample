import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles/ToggleSwitch.style.scss';

export class ToggleSwitch extends PureComponent {
    constructor (props) {
        super(props);
        this.state = { checkValue: props.checkValue };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ checkValue: nextProps.checkValue });
    }
    Clicked = () => {
        if (this.state.checkValue === 'on') {
            this.setState({ checkValue: 'off' });
            this.props.handleToggleChange('off');
        } else {
            this.setState({ checkValue: 'on' });
            this.props.handleToggleChange('on');
        }
    }
    render () {
        const { checkValue } = this.state;
        const { toggleSwitchClass, activeText, inactiveText } = this.props;
        return (
            <div className={toggleSwitchClass + ' react-toggle-switch'}>
                <span className="switch-label left-label">{inactiveText}</span>
                <label className="switch" htmlFor="switch">
                    <input type="checkbox" value={checkValue} onChange={this.Clicked} />
                    <span className="slider round" onClick={this.Clicked} role="button" />
                </label>
                <span className="switch-label right-label">{activeText}</span>
            </div>
        );
    }
}

ToggleSwitch.defaultProps = {
    checkValue: 'on',
    activeText: 'Active',
    inactiveText: 'Inactive'
};

ToggleSwitch.propTypes = {
    checkValue: PropTypes.string,
    toggleSwitchClass: PropTypes.string,
    activeText: PropTypes.string,
    inactiveText: PropTypes.string
};
