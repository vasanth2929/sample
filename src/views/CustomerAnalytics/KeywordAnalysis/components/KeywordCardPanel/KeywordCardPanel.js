import React from 'react';
import KeywordCards from '../KeywordCards/KeywordCards';
import './KeywordCardPanel.style.scss';

const DEFAULT_CLASSNAME = 'keyword-panel';

export default function KeywordCardPanel() {
  const keywordRow = (title) => {
    return (
      <div className={`${DEFAULT_CLASSNAME}-row`}>
        <div className={`${DEFAULT_CLASSNAME}-header`}>
          <div className={`${DEFAULT_CLASSNAME}-header-title`}>{title}</div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}-body`}>
          <KeywordCards title="pain points"/>
          <KeywordCards title="KPIs"/>
          <KeywordCards title="Use cases"/>
          <KeywordCards title="Triggers"/>
        </div>
      </div>
    );
  };
  return (
    <div className={DEFAULT_CLASSNAME}>
      {keywordRow("Needs")}
      {keywordRow("Decision Criteria")}
    </div>
  );
}
