import React from 'react';
import LaunchIcon from '@material-ui/icons/Launch';

import './MetricsBox.style.scss';
import { showCustomModal } from '../../components/CustomModal/CustomModal';
import StoryDetail from '../../views/DealGameTape/component/StoryDetail/StoryDetail';
import { Tooltip } from '@material-ui/core';

const DEFAULT_CLASSNAME = 'metrics-box';

const MetricsBox = (props) => {
  const renderValue = (value) => {
    return value && value.toLowerCase() === 'notmapped' ? (
      ''
    ) : (
      <Tooltip title={value}>
        <span>{value?.substring(0, 20)}</span>
      </Tooltip>
    );
  };

  const openModalPopUp = () => {
    const storyTitle = props.detail;
    showCustomModal(
      <div className="insight-modal-header">
        <h5 className="heading">Detail</h5>
      </div>,
      <div className="card-list">
        <StoryDetail detail={storyTitle} />
      </div>,
      'market-insight-modal'
    );
  };

  const { metrics } = props;
  return (
    <div className={`${DEFAULT_CLASSNAME}`}>
      {metrics &&
        metrics.map((metric, metricIdx) => {
          return (
            <div
              key={`metric-box-${metricIdx}`}
              className={`${DEFAULT_CLASSNAME}-entry`}
            >
              <div className={`${DEFAULT_CLASSNAME}-entry-label`}>
                {metric.label}
              </div>
              <div className={`${DEFAULT_CLASSNAME}-entry-value`}>
                {renderValue(metric.value)}
              </div>
            </div>
          );
        })}
      <LaunchIcon
        className="tearout"
        role="button"
        size="small"
        onClick={openModalPopUp}
      />
    </div>
  );
};

export default MetricsBox;
