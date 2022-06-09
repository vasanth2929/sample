import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactHighcharts from 'react-highcharts';
import { dispatch, ShortNumber } from '../../../../../../util/utils';
import { SELECT_NOTE_CARD } from '../../../../../../constants/general';
import { showCustomModal } from '../../../../../../components/CustomModal/CustomModal';
import InsightModal from '../../InsightModal/InsightModal';
import PropTypes from 'prop-types';

import './BubbleChart.style.scss';
import { Async } from '../../../../../../basecomponents/async/async';
import CardListModal from '../../CardListModal/CardListModal';

const DEFAULT_CLASSNAME = 'performance-bubble-chart';

class BubbleChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBubble: null,
    };
  }

  getPromise = () => {
    const { chartData } = this.props;
    return new Promise((resolve, reject) => resolve({ data: chartData }));
  };

  XAxisMapping = (card) => {
    const { performanceMetrics } = this.props;
    switch (performanceMetrics.value) {
      case 'Historical Deal Size':
        return card.totalOpptyAmount;
      case 'Historical Sales Cycle':
        return card.avgSalesCycle;
      case 'Historical Win Rate':
        return card.winRatePerc;
      case 'TTM Win Rate':
        return card.ttmWinRatePerc;
      default:
    }
  };

  formSeries = (data) => {
    return data.length > 0
      ? data.map((card) => ({
          ...card,
          z: card.totalOpptyAmount,
          y: card.totalOpptyCountForCard,
          x: this.XAxisMapping(card),
          name: card.name,
          amount: ShortNumber(card.totalOpptyAmount),
        }))
      : [];
  };

  getMinMaxMiddle = (data, axis) => {
    const sorted = (data && data.sort((a, b) => a[axis] - b[axis])) || [];
    const min = sorted.length ? sorted[0][axis] : 0;
    const max = sorted.length ? sorted[sorted.length - 1][axis] : 0;
    const middle = (min + max) / 2;
    return { min, max, middle };
  };

  splitSeries = (data, divider) => {
    const { performanceMetrics } = this.props;
    const lowerseries = data.filter((i) => i.x <= divider);
    const upperseries = data.filter((i) => i.x > divider);
    const upperSeriesColor =
      performanceMetrics.value === 'Historical Sales Cycle'
        ? '#d65aa4'
        : '#1ed499';
    const lowerSeriesColor =
      performanceMetrics.value === 'Historical Sales Cycle'
        ? '#1ed499'
        : '#d65aa4';
    const upperseries1 = this.formSeriesWithEqualXY(
      upperseries,
      upperSeriesColor
    );
    const lowerseries1 = this.formSeriesWithEqualXY(
      lowerseries,
      lowerSeriesColor
    );

    return [lowerseries1, upperseries1];
  };

  formSeriesWithEqualXY = (data, color) => {
    const newData = [...data];

    //find the data with same x and y remove them from newData then push it into series
    const series = data.map((i, index) => {
      const doublicateArray = _.remove(
        newData,
        (n) => n.x === i.x && n.y === i.y
      );
      return { color, data: doublicateArray };
    });
    // now push remaining array with distinct data
    _.remove(series, _.isEmpty);
    return series;
  };

  onSelect = (bubble) => {
    this.setState({ selectedBubble: bubble }, () => this.showModal());
  };

  showModal = () => {
    const { selectedBubble } = this.state;
    if (selectedBubble.series.points.length > 1) {
      showCustomModal(
        <div className="insight-modal-header">
          <h5 className="heading">Please select a card from list</h5>
        </div>,
        <div className="card-list">
          <CardListModal
            cards={selectedBubble.series.points}
            onSelect={this.openInsighModal}
          />
        </div>,
        'market-insight-modal'
      );
    } else {
      this.openInsighModal(selectedBubble);
    }
  };

  openInsighModal = (selectedBubble, openInsighModal) => {
    dispatch({
      type: SELECT_NOTE_CARD,
      payload: selectedBubble,
    });
    showCustomModal(
      <div className="insight-modal-header">
        <div className="type">{selectedBubble.type}</div>
        <h5 className="heading">{selectedBubble.name}</h5>
        {selectedBubble.isTestCard && selectedBubble.isTestCard !== 'Y' ? (
          <div className="status">Approved</div>
        ) : (
          <div className="status test">Test</div>
        )}
      </div>,
      <div className="insight-modal-body">
        <InsightModal selectedNoteCard={selectedBubble} />
      </div>,
      'market-insight-modal',
      openInsighModal ? () => this.showModal() : () => {}
    );
    setTimeout(() => {
      const ele = document.querySelector(
        '.market-insight-modal .header-section'
      );
      if (ele) {
        if (selectedBubble.isTestCard === 'Y') {
          ele.classList.add('testing-card-header');
        } else ele.classList.remove('testing-card-header');
      }
    }, 200);
  };

  formatLabel = (value) => {};

  getConfig = (chartData) => {
    const { onSelect } = this;
    const { filter, performanceMetrics } = this.props;
    const series = chartData ? this.formSeries(chartData) : null;
    const MinMaxMiddleX = series && this.getMinMaxMiddle(series, 'x');
    const MinMaxMiddleY = series && this.getMinMaxMiddle(series, 'y');
    const [lowerSeries, upperSeries] = this.splitSeries(
      series,
      MinMaxMiddleX.middle
    );
    const xTickInterval =
      performanceMetrics.value !== 'Historical Deal Size'
        ? 5
        : performanceMetrics.value !== 'Historical Sales Cycle'
        ? 30
        : null;
    return {
      chart: {
        type: 'bubble',
        plotBorderWidth: 1,
        zoomType: 'xy',
        height: 622,
      },
      allowPointSelect: true,
      legend: { enabled: false },

      title: {
        text: '',
        reserveSpace: false,
      },

      // subtitle: {
      //     text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
      // },

      accessibility: {
        point: {
          valueDescriptionFormat:
            '{index}. {point.name}, fat: {point.x}g, sugar: {point.y}g, obesity: {point.z}%.',
        },
      },

      xAxis: {
        // tickInterval: MinMaxMiddleX.min,
        // gridLineWidth: 1,
        title: { text: `${performanceMetrics?.label}` },
        allowDecimals: false,
        // labels: {
        //     format: '{value} gr'
        // },
        plotLines: [
          {
            color: '#cccaca',
            dashStyle: 'solid',
            width: 1,
            value: MinMaxMiddleX.middle,
            // label: {
            //     rotation: 0,
            //     y: 15,
            //     style: {
            //         fontStyle: 'italic'
            //     },
            //     text: 'Safe fat intake 65g/day'
            // },
            zIndex: 3,
          },
        ],
        accessibility: { rangeDescription: 'Range: 60 to 100 grams.' },
        labels: {
          formatter: function () {
            if (performanceMetrics.value === 'Historical Deal Size') {
              return this.value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
              });
            }
            return this.value;
          },
        },
      },

      yAxis: {
        allowDecimals: false,
        gridLineWidth: 0,
        min: 0,
        title: { text: `Stage - ${filter.opptystatus} (# Opptys)` },
        legend: { enabled: false },
        // labels: {
        //     format: '{value} gr'
        // },
        plotLines: [
          {
            color: '#cccaca',
            dashStyle: 'solid',
            width: 1,
            value: MinMaxMiddleY.middle,
            // label: {
            //     align: 'right',
            //     style: {
            //         fontStyle: 'italic'
            //     },
            //     text: 'Safe sugar intake 50g/day',
            //     x: -10
            // },
            zIndex: 3,
          },
        ],
        accessibility: { rangeDescription: 'Range: 0 to 160 grams.' },
      },

      tooltip: {
        useHTML: true,
        headerFormat: '<table>',
        pointFormat:
          '<tr><th colspan="3"><h35>{point.name}</h5></th></tr>' +
          '<tr><td>{point.amount} |</td><td>{point.y} deals</td> </tr>',
        footerFormat: '</table>',
        followPointer: true,
      },

      plotOptions: {
        bubble: { minSize: 20, maxSize: 50 },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                onSelect(this);
              },
            },
          },
        },
        scatter: {
          jitter: {
            x: 0.24,
            y: 0,
          },
        },
      },
      series: [...lowerSeries, ...upperSeries],
    };
  };

  renderComponent = (chartData) => {
    const config = chartData ? this.getConfig(chartData) : {};
    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        <ReactHighcharts neverReflow config={config} />
      </div>
    );
  };

  render() {
    return (
      <Async
        identifier="performance-dashboard-chart"
        promise={this.getPromise}
        content={this.renderComponent}
        loader={<div>Loading data...</div>}
        error={<div>Error...</div>}
      />
    );
  }
}

BubbleChart.propTypes = {
  chartData: PropTypes.array,
  isLoading: PropTypes.bool,
};

function mapStateToProps(state) {
  const { opptyStatus, performanceMetrics } = state.marketPerformanceFilters;
  return {
    filter: { opptystatus: opptyStatus?.value },
    performanceMetrics,
  };
}

export default connect(mapStateToProps)(BubbleChart);
