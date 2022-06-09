import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { formatOptionLabel } from '../../views/CustomerAnalytics/util/Util';
import './TribylSelect.scss';

const TribylSelect = ({
  options,
  onChange,
  value,
  defaultValue,
  placeholder,
  isDisabled,
  className,
}) => {
  const handleChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Select
      className={'tribyl-select ' + className}
      classNamePrefix="tribyl-select"
      defaultValue={defaultValue || options[0]}
      value={value}
      formatOptionLabel={formatOptionLabel}
      onChange={handleChange}
      options={options}
      placeholder={placeholder}
      isDisabled={isDisabled}
    />
  );
};

TribylSelect.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  defaultValue: PropTypes.object,
  placeholder: PropTypes.any,
  isDisabled: PropTypes.boolean
};

TribylSelect.defaultProps = {
  options: [],
};

export default TribylSelect;
