import React from 'react';
import PropTypes from 'prop-types';
import './styles/ToggleButton.style.scss';

export class ToggleButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleToggle = (elem) => {
    this.props.handleToggle(elem.target.checked);
  };

  render() {
    const { customeClass, disabled = false } = this.props;
    const { value } = this.state;
    return (
      <section
        className={`toggle-button ${customeClass} ${
          disabled ? 'disabled' : ''
        }`}
      >
        <div className="checkbox">
          <input
            disabled={disabled}
            type="checkbox"
            checked={value}
            onChange={this.handleToggle}
          />
          <label className={disabled ? 'disabled' : ''} />
        </div>
      </section>
    );
  }
}

ToggleButton.propTypes = {
  value: PropTypes.bool,
  handleToggle: PropTypes.func,
  disabled: PropTypes.bool,
};

ToggleButton.defaultProps = {
  value: false,
  handleToggle: () => {},
  disabled: false,
};
