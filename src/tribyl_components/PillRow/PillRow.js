import React from 'react';
import { Link } from 'react-router-dom';
import Pill from './Pill.js';

import './PillRow.style.scss';

const DEFAULT_CLASSNAME = 'pills-row';

const PillRow = ({ keywords = [], ...props }) => {
  return (
    <div className={`${DEFAULT_CLASSNAME}`}>
      {keywords.slice(0, 5).map((datum, datumIdx) => {
        return <Pill {...datum} key={`keyword-pill-${datumIdx}`} />;
      })}
      {keywords.length > 5 && (
        <Link to={'#'} className={`${DEFAULT_CLASSNAME}-show-more`}>
          Show more...
        </Link>
      )}
    </div>
  );
};

export default PillRow;
