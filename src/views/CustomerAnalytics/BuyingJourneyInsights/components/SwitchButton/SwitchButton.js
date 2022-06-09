import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import './SwitchButton.style.scss';
import classNames from 'classnames';

const DEFAULT_CLASSENAME = "switch-button-container";

export class SwitchButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: "",
            selectedButton: this.props.defaultSelection ? this.props.defaultSelection : null
        };
    }

    handleClick = (selectedButton) => {
        const { onClick } = this.props;
        this.setState({ selectedButton });
        if (onClick) onClick(selectedButton);
    }

    render() {
        const { labels, className, isDisabled } = this.props;
        const { selectedButton } = this.state;
        return (
          <div
            className={`${DEFAULT_CLASSENAME} ${className} ${
              isDisabled ? 'disabled' : ''
            }`}
          >
            {labels &&
              labels.map((i, index) => (
                <div
                  key={`switch-btn-${index}`}
                  role="button"
                  className={
                    `${DEFAULT_CLASSENAME}-button ${
                      selectedButton === i ? 'selected' : ''
                    } ` +
                    classNames({
                      disabled:
                        this.props.indexToDisabledCondition &&
                        this.props.indexToDisabled === index,
                    })
                  }
                  onClick={() => this.handleClick(i)}
                >
                  {i}
                </div>
              ))}
          </div>
        );
    }
}

SwitchButton.defaultProps = {
    defaultSelection: 'Internal',
    isDisabled: false
};


SwitchButton.propTypes = {
    className: PropTypes.string,
    labels: PropTypes.array,
    defaultSelection: PropTypes.string,
    isDisabled: PropTypes.bool
};
