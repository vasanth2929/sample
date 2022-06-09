import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

const StyledCheckbox = withStyles({
  root: {
    '&$disabled': {
      color: green[200],
    },
    padding: 0,
  },
  disabled: {},
})(Checkbox);

const TribylCheckbox = ({ isDisabled, isChecked }) => {
  return <StyledCheckbox disabled={isDisabled} checked={isChecked} />;
};

TribylCheckbox.propTypes = {
  isDisabled: PropTypes.bool,
  isChecked: PropTypes.bool,
};

TribylCheckbox.defaultProps = {
  isDisabled: true,
};

export default TribylCheckbox;
