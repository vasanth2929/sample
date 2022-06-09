import React from 'react';

import "./BackPill.style.scss";

import DownChevron from '../../assets/iconsV2/chevron-down-orange.svg';
import Close from '../../assets/iconsV2/close.svg';

const DEFAULT_CLASSNAME = 'back-pill';

const BackPill = (props) => {
  const { label, text } = props;
  const onClose = props.onClose ? props.onClose : () => { };
  return (
    <div className={`${DEFAULT_CLASSNAME}`}>
      <div className={`${DEFAULT_CLASSNAME}-text-block`}>
        <div className={`${DEFAULT_CLASSNAME}-text-block-title`}>
          {label}
        </div>
        <div className={`${DEFAULT_CLASSNAME}-text-block-subtitle`}>
          {text}
        </div>
      </div>
      {/* <div className={`${DEFAULT_CLASSNAME}-chevron-block`}><img src={ props.onClose ? Close : DownChevron} /></div> */}
    </div>
  );
};

export default BackPill;
