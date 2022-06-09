import React from 'react';

import './Breadcrumbs.style.scss';

const DEFAULT_CLASSNAME = 'breadcrumbs';

const Breadcrumbs = (props) => {
  return (
    <div className={`${DEFAULT_CLASSNAME}`}>
      {props.parts.map((part, i, arr) => {
        const content = (
          <span
            key={`${DEFAULT_CLASSNAME}-entry-${i}`}
            className={`${DEFAULT_CLASSNAME}-text`}
          >
            {part.text}
          </span>
        );
        return i == arr.length - 1
          ? content
          : [
              content,
              <div
                key={`divider-${i}`}
                className={`${DEFAULT_CLASSNAME}-divider`}
              />,
            ];
      })}
    </div>
  );
};

export default Breadcrumbs;
