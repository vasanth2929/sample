import { Switch } from '@material-ui/core';
import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import { Async } from '../../../../../../../basecomponents/async/async';
import './KeywordChart.style.scss';

const DEFAULT_CLASSNAME = 'keyword-chart';

export default class KeywordChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMachine: false,
      chartData: [],
    };
  }
  getPromise = () => {
    const { data } = this.props;
    return new Promise((resolve, reject) => resolve({ data: data }));
  };

  filterKeyword = (data, type) => {
    return data.filter((i) => i.keywordSource === type);
  };

  generateSeries = () => {
    const { data } = this.props;
    const { isMachine } = this.state;
    const filteredData = isMachine ? this.filterKeyword(data, 'Machine') : data;
    const chartData = filteredData
      ?.sort((a, b) => b.matchedConv - a.matchedConv)
      .reduce(
        (chart, i) => {
          chart[0].push(i.keyword);
          chart[1].push(i.matchedConv);
          return chart;
        },
        [[], []]
      );

    this.setState({ chartData });
  };

  componentDidMount() {
    this.generateSeries();
  }

  getConfig = () => {
    const { chartData, isMachine } = this.state;
    const [categories, series] = chartData;
    return {
      chart: {
        type: 'bar',
        height: '500',
      },
      title: {
        text: `${isMachine ? 'Machine Generated keywords' : 'All keywords'}`,
      },
      xAxis: {
        allowDecimals: false,
        categories,
        labels: {
          style: {
            fontWeight: 'bold',
          },
        },
        title: {
          text: null,
        },
      },
      yAxis: {
        allowDecimals: false,
        labels: {
          style: {
            fontWeight: 'bold',
          },
        },
        title: {
          text: '# Conversations',
          style: {
            fontWeight: 'bold',
            fontSize: '15px',
            transform: 'translateY(15px)',
          },
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      legend: {
        enabled: false,
        // layout: 'vertical',
        // align: 'right',
        // verticalAlign: 'top',
        // x: -40,
        // y: 80,
        // floating: true,
        // borderWidth: 1,
        // backgroundColor: '#FFFFFF',
        // shadow: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          data: series,
        },
      ],
    };
  };

  toggleKeywordType = (event) => {
    this.setState({ isMachine: event.target.checked }, () =>
      this.generateSeries()
    );
  };

  renderComponent = () => {
    const { isMachine } = this.state;
    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        <div className="d-flex justify-content-end">
          <div className="switch">
            All
            <Switch
              checked={isMachine}
              color="primary"
              onChange={this.toggleKeywordType}
            />
            Machine
          </div>
        </div>
        <ReactHighcharts config={this.getConfig()} />
      </div>
    );
  };
  render() {
    return (
      <Async
        identifier="messaging-keyword-chart"
        promise={this.getPromise}
        content={this.renderComponent}
        loader={<div>Loading data...</div>}
        error={<div>Error...</div>}
      />
    );
  }
}
