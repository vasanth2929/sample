import React from 'react';
import './Legend.style.scss';
import PropTypes from 'prop-types';
const DEFAULT_CLASSNAMES = 'legend';

const Legend = ({ color, text }) => {
  return (
    <div className={`${DEFAULT_CLASSNAMES}`}>
      <div
        className={`${DEFAULT_CLASSNAMES}-indicator`}
        style={{"background": color}}
      ></div>
      <div className={`${DEFAULT_CLASSNAMES}-text`}>{text}</div>
    </div>
  );
};

Legend.prototype = {
  color: PropTypes.string,
  text: PropTypes.string
}

Legend.defaultProps = {
  color: '#d24d4d'
};

export default Legend;
