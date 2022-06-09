import React from 'react';

import './TribylButton.style.scss';

const DEFAULT_CLASSNAME = 'tribyl-button';

const TribylButton = (props) => {
  const { text, onClick, variant } = props;

  let classname;
  switch (variant) {
    case 'splash':
      classname = 'splash';
      break;
    case 'secondary':
      classname = 'secondary';
      break;
    case 'primary-lowercase':
      classname = 'primary lowercase';
      break;
    case 'tertiary':
      classname = 'tertiary';
      break;
    case 'tertiary-lowercase':
      classname = 'tertiary lowercase';
      break;
    case 'primary':
    default:
      classname = 'primary';
  }
  return (
    <button
      className={`${DEFAULT_CLASSNAME} ${DEFAULT_CLASSNAME}-${classname}`}
      onClick={onClick ? onClick : () => {}}
    >
      {text || 'Click'}
    </button>
  );
};

export default TribylButton;
