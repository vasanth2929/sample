import React from 'react';
import classnames from 'classnames';

const DEFAULT_CLASSNAME = 'pills-row-pill';

const Pill = (props) => {
  const { selected, disabled, text, onClick } = props;
  return (
    <div
      className={classnames(`${DEFAULT_CLASSNAME}`, { selected, disabled })}
      onClick={onClick}
    >
      {text}
      {selected && <i className="material-icons">check</i>}
    </div>
  );
};

export default Pill;
