import { CircularProgress } from '@material-ui/core';
import React, { Component } from 'react';
import { getProductAnalyticsData } from '../../../util/promises/customer_analysis';
import { formatCurrency } from '../../../util/utils';
const DEFAULT_CLASSNAME = 'load-data';
import './DataLoad.style.scss';

const dataArray = [
  { label: 'Accounts', value: 'totalAccounts' },
  { label: 'Opportunities', value: 'totalOpportunities' },
  { label: 'Contact', value: 'totalContacts' },
  { label: 'Deals processed', value: 'totalDealsProcessed' },
  { label: 'Cards', value: 'totalCards' },
  { label: 'Keywords', value: 'totalApprovedKeywords' },
  { label: 'Emails', value: 'totalEmails' },
  { label: 'Calls', value: 'totalCalls' },
  { label: 'Documents', value: 'totalDocuments' },
];

const DataCard = ({ title, count }) => {
  return (
    <div className="data-card">
      <div>
        <p className="heading">{title}</p>
        <div className="count">{count ? count.toLocaleString() : 0}</div>
      </div>
    </div>
  );
};

export default class DataLoad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      statsData: [],
    };
  }

  componentDidMount() {
    this.loadStats();
  }

  loadStats = async () => {
    const response = await getProductAnalyticsData();
    const stats = response ? response.data : [];
    this.setState({ statsData: stats, isLoading: false });
  };

  render() {
    const { isLoading, statsData } = this.state;
    return (
      <React.Fragment>
        {!isLoading ? (
          <div className={`${DEFAULT_CLASSNAME}`}>
            {dataArray.map((i) => (
              <DataCard title={i.label} count={statsData[i.value]} />
            ))}
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <CircularProgress />
          </div>
        )}
      </React.Fragment>
    );
  }
}
