import React, { PureComponent } from 'react';
import ReactHighcharts from 'react-highcharts';

export class ViewsChart extends PureComponent {
    render() {
        const { data } = this.props;
        const config = {
            chart: {
                height: '300',
                animation: {
                    duration: 1000
                },
                style: {
                    fontFamily: 'Roboto-Regular'
                }
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            },
            yAxis: {
                min: 0,
                max: 35,
                tickInterval: 5,
                title: {
                    text: '',
                }
            },
            series: [{
                color: '#38C976',
                data,
                name: "# of Views",
                style: {
                    fontFamily: 'Roboto-Medium'
                },
            }]
        };
        return (
            <ReactHighcharts config={config} />
        );
    }
}
