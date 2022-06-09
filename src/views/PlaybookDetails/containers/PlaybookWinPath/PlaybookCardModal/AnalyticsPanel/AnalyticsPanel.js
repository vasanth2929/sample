import React, { PureComponent } from 'react';
import Select from 'react-select';
import './styles/AnalyticsPanel.style.scss';
import { ViewsChart } from './containers/ViewsChart/ViewsChart';
import { ConversationsChart } from './containers/ConversationsChart/ConversationsChart';

export class AnalyticsPanel extends PureComponent {
    render() {
        const viewsData = [
            Math.floor(Math.random() * Math.floor(35)), 
            Math.floor(Math.random() * Math.floor(35)), 
            Math.floor(Math.random() * Math.floor(35)), 
            Math.floor(Math.random() * Math.floor(35)), 
            Math.floor(Math.random() * Math.floor(35)), 
            Math.floor(Math.random() * Math.floor(35))
        ];
        const viewsDataSum = viewsData.reduce((a, b) => a + b, 0);
        const conversationsData = [
            Math.floor(Math.random() * Math.floor(35)), 
            Math.floor(Math.random() * Math.floor(35)), 
            Math.floor(Math.random() * Math.floor(35)), 
            Math.floor(Math.random() * Math.floor(35)), 
            Math.floor(Math.random() * Math.floor(35)), 
            Math.floor(Math.random() * Math.floor(35))
        ];
        const conversationsDataSum = conversationsData.reduce((a, b) => a + b, 0);
        return (
            <section className="card-analytics-tab">
                <div className="dropdown-filter-container">
                    <label>Time Period</label>
                    <Select
                        id="time-select-control"
                        clearable={false}
                        name="time-select-control"
                        value={{ label: 'Last 12 Months', value: 'last12Months' }}
                        disabled
                        options={[
                            { label: 'Last 12 Months', value: 'last12Months' }
                        ]}
                        placeholder="Select a topic" />
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="chart-container">
                            <ViewsChart
                                data={viewsData}
                                dataSum={viewsDataSum} />
                        </div>
                        <p className="text-center sum-label">{viewsDataSum} Views</p>
                    </div>
                    <div className="col-6">
                        <div className="chart-container">
                            <ConversationsChart
                                data={conversationsData}
                                dataSum={conversationsDataSum} />
                        </div>
                        <p className="text-center sum-label">{conversationsDataSum} Conversations</p>
                    </div>
                </div>
            </section>
        );
    }
}
