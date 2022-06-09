import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import moment from 'moment';
import './TimelineChart.style.scss';
import sortBy from 'lodash.sortby';

const DEFAULT_CLASSNAME = 'timeline-chart';

export default class TimelineChart extends Component {
  getPromise = () => {
    return Promise((resolve, reject) => resolve({ data: [] }));
  };

  generateSeries = () => {
    const { data } = this.props;
    return this.reduceArray(data, 'convMonthAndYear', 'matchedConvCount');
  };

  reduceArray = (data, prop1, prop2) => {
    // output [[categories],[data]]
    return data.reduce(
      (chart, i) => {
        chart[0].push(i[prop1]);
        chart[1].push(i[prop2]);
        return chart;
      },
      [[], []]
    );
  };

  getConfig = () => {
    const { visualizeAs, yAxisAs } = this.props;
    let [categories, series] = this.generateSeries();
    let data = categories?.map((t, i) => {
      let date = t ? t.split('-') : '00';
      return {
        categories: t,
        series: series ? series[i] : 0,
        date: new Date(`${date[0]} ${date[1]}`),
      };
    });
    data = sortBy(data, 'date');
    if (categories?.length) {
      categories = data.map((t) => t.categories);
      series = data.map((t) => t.series);
    }
    return {
      chart: {
        type: 'column',
        height: 500,
      },
      title: {
        text: `${
          visualizeAs === 'Conversations' ? '#Conversations' : 'Close period'
        }`,
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
          text: '<div style="margin-top:20px">Test</div>',
          style: {
            fontSize: '15px',
            fontWeight: 'bold',
            transform: 'translateY(15px)',
          },
          useHtml: true,
        },
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          x: -10,
          text: `${
            visualizeAs === 'Conversations' ? '#Conversations' : yAxisAs
          }`,
          style: {
            fontSize: '15px',
            fontWeight: 'bold',
          },
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'gray',
          },
        },
        labels: {
          style: {
            fontWeight: 'bold',
          },
        },
      },
      legend: {
        enabled: false,
        // align: 'right',
        // x: -30,
        // verticalAlign: 'top',
        // y: 25,
        // floating: true,
        // backgroundColor: 'white',
        // borderColor: '#CCC',
        // borderWidth: 1,
        // shadow: false,
        // itemStyle: {
        //   fontWeight: 'bold',
        // },
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: 'Total: {point.stackTotal}',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
          },
        },
      },

      series: [
        {
          data: series,
          color: '#00B2CA',
        },
      ],
    };
  };

  render() {
    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        {!this.props.isLoadingConvData ? (
          <ReactHighcharts config={this.getConfig()} />
        ) : (
          <i>Loading chart data...</i>
        )}
      </div>
    );
  }
}
