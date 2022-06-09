import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import './MetricsBox.style.scss';

const DEFAULT_CLASSNAME = 'survey-metrics-box';

const typeClass = [
  { label: 'Sent', class: 'sent' },
  { label: 'Total', class: 'total' },
  { label: 'Not Sent', class: 'not-sent' },
  { label: 'In Progress', class: 'inprogress' },
  { label: 'Completed', class: 'completed' },
  { label: 'Not Started', class: 'deactive' },
  { label: 'avg completion time', class: 'avgcomp' },
];

class MetricsBox extends Component {
  render() {
    const { type, deals, text, handleSelectedTile, selectedTile } = this.props;
    const foundLabel = typeClass.find((i) => i.label === type);
    return (
      <div
        role="button"
        className={`${DEFAULT_CLASSNAME} ${
          selectedTile === type ? 'selected' : ''
        }`}
        onClick={() => handleSelectedTile(type)}
      >
        <div className={`${DEFAULT_CLASSNAME}-info`}>
          <div className="heading">{deals}</div>
          <div className="sub-headingm mr-1">{text}</div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}-status ${foundLabel.class}`}>
          {foundLabel.label}
        </div>
      </div>
    );
  }
}

MetricsBox.propTypes = {
  type: PropTypes.string,
  deals: PropTypes.number,
  text: PropTypes.string,
  selected: PropTypes.bool,
  handleSelectedTile: PropTypes.func,
  selectedTile: PropTypes.string,
};

export default MetricsBox;
