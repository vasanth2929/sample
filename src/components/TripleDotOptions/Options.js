import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Options.style.scss';

class Options extends Component {
  constructor(props) {
    super(props);
    this.state = { options: this.props.options || [] };
  }

  handleClick = (value, data = null) => {
    const { onSelect } = this.props;
    if (onSelect) onSelect(value, data);
  };

  render() {
    const { options, className, noLink } = this.props;
    return (
      <React.Fragment>
        <div className={`dropdown ${className}`}>
          <div className="dropbtn">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
          {noLink ? (
            <div className="dropdown-content">
              {options.map(
                (option) =>
                  option && (
                    <div
                      key={option.id}
                      onClick={() => this.handleClick(option.id, option.data)}
                      role="button"
                      className={option.isDisabled ? 'disabled' : ''}
                    >
                      {option.label}
                    </div>
                  )
              )}
            </div>
          ) : (
            <div className="dropdown-content">
              {options.map(
                (option) =>
                  option && (
                    <span
                      key={option.id}
                      onClick={() => this.handleClick(option.id)}
                      href={option.id || '#'}
                      role="button11"
                      className={option.isDisabled ? 'disabled' : ''}
                    >
                      {option.label}
                    </span>
                  )
              )}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}
Options.propTypes = {
  options: PropTypes.array,
  className: PropTypes.string,
  noLink: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default Options;
