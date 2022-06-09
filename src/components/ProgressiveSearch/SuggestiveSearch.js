import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import { getPBCardUsingText } from '../../util/promises/playbooks_promise';
import './ProgressiveSearch.style.scss';

const DEFAULT_CLASSNAMES = 'progressive-search-box';

class SuggestiveSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typedValue: '',
      inputValue: null,
      suggestions: [],
    };
  }

  loadOptions = (inputValue) => {
    getPBCardUsingText(inputValue).then((response) => {
      const suggestions = response.data || [];
      this.setState({ suggestions });
    });
  };

  handleChange = (e, newValue) => {
    const { onSelect, onCreate } = this.props;

    if (typeof newValue === 'string') {
      this.setState({ inputValue: { name: newValue } });

      if (onCreate) onCreate(newValue);
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      this.setState({ inputValue: { name: newValue.inputValue } });

      if (onCreate) onCreate(newValue.inputValue);
    } else {
      this.setState({ inputValue: newValue });

      if (newValue && onSelect) {
        onSelect(newValue);
      } else if (onCreate) {
        onCreate('');
      }
    }
  };

  handleBlur = (e) => {
    const { inputValue } = this.state;

    if (
      !inputValue ||
      (inputValue && inputValue.name && inputValue.name !== e.target.value)
    ) {
      this.props.onCreate(e.target.value);
    }
  };

  handleInputChange = (e, newValue) => {
    this.loadOptions(newValue);
  };

  handleFilterOptions = (options, params) => {
    const filter = createFilterOptions();
    const filtered = filter(options, params);

    // Suggest the creation of a new value
    // if (params.inputValue !== '') {
    //   filtered.unshift({
    //     inputValue: params.inputValue,
    //     name: `Press Enter to add "${params.inputValue}"`,
    //   });
    // }

    return filtered;
  };

  handleGetOptionLabel = (option) => {
    // Value selected with enter, right from the input
    if (typeof option === 'string') {
      return option;
    }
    // Add option created dynamically
    if (option.inputValue) {
      return option.inputValue;
    }
    // Regular option
    return option.name;
  };

  render() {
    const { suggestions, inputValue } = this.state;
    return (
      <div className={`${DEFAULT_CLASSNAMES}`}>
        <Autocomplete
          value={inputValue}
          options={suggestions}
          size="small"
          freeSolo
          getOptionLabel={this.handleGetOptionLabel}
          filterOptions={this.handleFilterOptions}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          // onInputChange={this.handleInputChange}
          renderOption={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              placeholder="Enter Card title"
              variant="outlined"
              label={this.props.label}
              required
            />
          )}
        />
      </div>
    );
  }
}

export default SuggestiveSearch;
