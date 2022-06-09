import React, { Component } from 'react';
import Select from 'react-select';
import './SelectPill.style.scss';
import close from '../../../../../assets/iconsV2/close.svg';

class SelectPill extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedValue: null };
  }

  handleOnChange = (value) => {
    const { onChange } = this.props;
    if (onChange) onChange(value);
    this.setState({ selectedValue: value });
  };

  renderCardAnalysisDropdown = (options) => {
    const { selectedValue } = this.state;
    const formatedOptions = options.map((item) => {
      const cardSubType =
        item.cardSubType === 'compelling_event' ? 'Triggers' : item.cardSubType;

      return {
        label: (
          <span className="pill-select-item-wrapper">
            <span className="pill-select-item-name text-uppercase">
              {cardSubType}
            </span>
            <span className="pill-select-item-label">{item.name}</span>
          </span>
        ),
        value: item.id,
      };
    });
    return (
      <React.Fragment>
        <Select
          className="pill-dropdown"
          classNamePrefix="pill-dropdown"
          value={selectedValue || formatedOptions[0]}
          isDisabled
        />
      </React.Fragment>
    );
  };

  handleReset = () => {
    const { onReset } = this.props;
    onReset();
  };

  render() {
    const { options, isClearable } = this.props;
    return (
      <div>
        <div className="pill-select-container">
          {this.renderCardAnalysisDropdown(options)}
          {isClearable && (
            <div role="button">
              <img
                onClick={() => this.handleReset()}
                className="close-button"
                src={close}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SelectPill;
