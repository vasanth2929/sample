import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Keyword.scss';

const Keyword = (props) => {
  const [text, setText] = useState(props.text);
  const [isDeleting, setDeleting] = useState(false);
  const remove = () => {
    try {
      setDeleting(true);
      setText('Deleting keyword...');
      props.onRemove();
    } catch (error) {
      setDeleting(false);
      setText(props.text);
    }
  };
  return (
    <span
      className={
        `tribyl-keyword badge pill mb-2 mr-2 d-inline-flex align-items-center 
       ${props.source === 'machine-generated' ? 'machine' : ''} ` +
        `${isDeleting ? 'deleting' : ''}`
      }
    >
      {text}
      {props.isDisabled || isDeleting ? (
        ''
      ) : (
        <span
          style={{
            pointerEvents: props.isDeleting ? 'none' : 'all',
            opacity: props.isDeleting ? 0.7 : 1,
          }}
          className="material-icons close"
          onClick={remove}
          role="button"
        >
          close
        </span>
      )}
    </span>
  );
};

Keyword.propTypes = {
  isDisabled: PropTypes.bool,
  text: PropTypes.string,
  onRemove: PropTypes.func,
  source: PropTypes.string,
};

export default Keyword;
