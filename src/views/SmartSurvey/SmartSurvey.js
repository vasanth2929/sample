import React, { Component } from 'react';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import {
  Icons,
  UPDATE_MARKET_PERFORMANCE_FILTERS,
} from '../../constants/general';
import Filter from '../CustomerAnalytics/Filters/Filter';
import './SmartSurvey.style.scss';
import { dispatch } from '../../util/utils';
import { Tabs, Tab } from '@material-ui/core';
import SurveyAnalytics from './SurveyAnalytics/SurveyAnalytics';
import DealsProcessed from './DataProcessed/DealsProcessed';
import DataLoad from './DataLoad/DataLoad';
import { Skeleton } from '@material-ui/lab';
import moment from 'moment';
import { connect } from 'react-redux';

const DEFAULT_CLASSNAME = 'smart-survey-container';

class SmartSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = { ActiveTabIndex: 0 };
  }

  componentWillUnmount() {
    dispatch({
      type: UPDATE_MARKET_PERFORMANCE_FILTERS,
      payload: { searchString: null },
    });
  }

  onTabClick = (tabindex) => {
    const { ActiveTabIndex } = this.state;
    const card = null;
    if (tabindex !== ActiveTabIndex) {
      this.setState({ ActiveTabIndex: tabindex });
    }
  };

  render() {
    const { ActiveTabIndex } = this.state;
    return (
      <ErrorBoundary>
        <MainPanel
          noSidebar
          viewName="Tribyl Product Analytics"
          icons={[Icons.MAINMENU]}
          handleIconClick={this.handleHeaderIconClick}
        >
          <div className={`${DEFAULT_CLASSNAME}`}>
            <div className={`${DEFAULT_CLASSNAME}-body`}>
              <Filter isDGT={true} />
              <div className={`${DEFAULT_CLASSNAME}-body-tabs`}>
                <Tabs
                  value={ActiveTabIndex}
                  textColor="primary"
                  onChange={(e, newValue) => this.onTabClick(newValue)}
                >
                  <Tab className="smart-survey-tab" label="Survey Analytics" />
                  <Tab className="smart-survey-tab" label="Deals Processed" />
                  <Tab className="smart-survey-tab" label="Data Load" />
                </Tabs>

                {/* {!this.props.date && <Skeleton width={300} height={30} />} */}
                {this.props.date && this.props.showDate && (
                  <p style={{ marginBottom: '0px' }}>
                    Last Updated:{' '}
                    {moment(this.props.date).format('MMM DD, YYYY')}
                  </p>
                )}
              </div>
              <ErrorBoundary>
                <div className="mt-4">
                  {ActiveTabIndex === 0 && <SurveyAnalytics />}
                  {ActiveTabIndex === 1 && <DealsProcessed />}
                  {ActiveTabIndex === 2 && <DataLoad />}
                </div>
              </ErrorBoundary>
            </div>
          </div>
        </MainPanel>
      </ErrorBoundary>
    );
  }
}


const mapStateToProps = (state) => {
  const { date, showDate } = state.marketPerformanceFilters;
  return {
    date,
  };
};

export default connect(mapStateToProps)(SmartSurvey);
