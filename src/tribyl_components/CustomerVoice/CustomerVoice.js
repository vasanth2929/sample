import React from 'react';
import ConversationAnalysis from '../ConversationAnalysis';

import "./CustomerVoice.style.scss";

const DEFAULT_CLASSNAME = 'customer-voice';


const CustomerVoice = (props) => {
  return (
    <div className={`${DEFAULT_CLASSNAME}`}>
      <ConversationAnalysis />
    </div>
  );
};

export default CustomerVoice;
