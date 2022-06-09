import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import './KeywordInput.style.scss';

const DEFAULT_CLASSNAME = 'keyword-input-form';

class KeywordInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addedvalue: '',
      valueArray: [],
      pill: [],
    };
  }

  renderPills = (valueArray) => {
    return (
      valueArray.length > 0 &&
      valueArray.map((keyword, index) => (
        <div className="pill" key={index}>
          <span>{keyword}</span>{' '}
          <span
            onClick={() => this.removeSelected(index)}
            className="material-icons close"
          >
            close
          </span>
        </div>
      ))
    );
  };

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ addedvalue: value }, () => this.props.onChange(value));
  };

  removeSelected = (index) => {
    const { valueArray } = this.state;
    const { onChange } = this.props;
    valueArray.splice(index, 1);
    this.setState({ valueArray }, () => {
      if (onChange) onChange(valueArray);
    });
  };

  render() {
    const { valueArray, addedvalue } = this.state;
    const { placeholder } = this.props;
    return (
      <div className={DEFAULT_CLASSNAME}>
        <TextField
          multiline
          minRows={3}
          variant="outlined"
          size="small"
          label="Keywords"
          fullWidth
          placeholder={placeholder}
          value={addedvalue}
          onChange={this.handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <div className={`${DEFAULT_CLASSNAME}-keywords`}>
          {this.renderPills(valueArray)}
        </div>
      </div>
    );
  }
}
KeywordInput.defaultProps = { placeholder: '' };

KeywordInput.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export default KeywordInput;
