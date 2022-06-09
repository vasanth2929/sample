import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Loader } from '../../../../../_tribyl/components/_base/Loader/Loader';
import BubbleChart from './Bubblechart/BubbleChart';
import './Chart.style.scss';

const DEFAULT_CLASSNAME = 'performance-dashboard-chart';

class Chart extends Component {
  renderBubbleChar = (chartData) => {
    return <BubbleChart chartData={chartData} />;
  };

  render() {
    const { chartData, isLoading } = this.props;

    if (isLoading)
      return (
        <div className={`${DEFAULT_CLASSNAME}`}>
          <Loader />
        </div>
      );

    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        {chartData?.length ? (
          this.renderBubbleChar(chartData)
        ) : (
          <div style={{ textAlign: 'center' }}>
            <i>No Insight yet.</i>
          </div>
        )}
      </div>
    );
  }
}

Chart.propTypes = {
  chartData: PropTypes.array,
  isLoading: PropTypes.bool,
};
export default Chart;
