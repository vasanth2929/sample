import React, { Component } from 'react';
import Header from './components/Header/Header';
import KeywordCardPanel from './components/KeywordCardPanel/KeywordCardPanel';
const DEFAULT_CLASSNAME = 'keyword-analysis-container';
import './KeywordAnalysis.style.scss';

export default class KeywordAnalysis extends Component {
  constructor(props) {
    super(props);
  }

  renderHeader = () => {
    return (
      <div className="header-metrics">
        <Header />
      </div>
    );
  };

  renderKeywordPanel = () => {
    return <KeywordCardPanel />;
  };

  render() {
    return (
      <div className={DEFAULT_CLASSNAME}>
        {this.renderHeader()}
        {this.renderKeywordPanel()}
      </div>
    );
  }
}
