import React, { PureComponent } from 'react';
import ReactHighcharts from 'react-highcharts';

export class ConversationsChart extends PureComponent {
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
                color: '#FC7D58',
                data,
                name: "# of Conversations",
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
