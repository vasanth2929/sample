import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from '@material-ui/core';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { Icons, SELECT_NOTE_CARD, SWITCH_TABS, UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../constants/general';
import { dispatch } from '../../util/utils';
import BuyingJourneyInsights from './BuyingJourneyInsights/BuyingJourneyInsights';
import Filter from './Filters/Filter';
import FreshStories from './FreshStories/FreshStories';
import PerformanceDashboardUse from './PerformanceDashboard/PerformanceDashboardUse';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import './CustomerAnalytics.style.scss';
import { Skeleton } from '@material-ui/lab';
import moment from 'moment';

class CustomerAnalyticsImp extends Component {
  constructor(props) {
    super(props);
    const {
      match: { params },
    } = props;
    this.state = {
      selectedMarketid: null,
      ActiveTabIndex: params.tabIndex
        ? Number(params.tabIndex)
        : this.props.tabData.tabId
        ? this.props.tabData.tabId
        : 0,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { tabId } = this.props.tabData;
    if (tabId !== prevProps.tabData.tabId) {
      this.onTabClick(tabId);
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    dispatch({
      type: SWITCH_TABS,
      payload: { tabId: Number(params.tabIndex), tabPayload: null },
    });
    if (
      this.props.localChangedMarket === null &&
      Number(params.tabIndex) !== 2
    ) {
      this.props.changeFilter({
        localChangedMarket: this.props.defaultMarket,
        market: this.props.defaultMarket,
      });
    }
  }

  onTabClick = (tabindex) => {
    const { ActiveTabIndex } = this.state;
    if (this.props.localChangedMarket === null) {
      this.props.changeFilter({
        localChangedMarket: this.props.defaultMarket,
        market: this.props.defaultMarket,
      });
    }
    const card = null;
    if (tabindex !== ActiveTabIndex) {
      dispatch({
        type: SELECT_NOTE_CARD,
        payload: card,
      });
      dispatch({
        type: SWITCH_TABS,
        payload: { tabId: tabindex, tabPayload: null },
      });
      this.setState(
        { ActiveTabIndex: tabindex },
        this.props.history.push(`/market-performance/${tabindex}`)
      );
    }
  };

  render() {
    const { ActiveTabIndex, value } = this.state;

    return (
      <div>
        <MainPanel
          noSidebar
          viewName="Buyer Intelligence"
          icons={[Icons.MAINMENU]}
          handleIconClick={this.handleHeaderIconClick}
        >
          <div className="addressable-market-container">
            <div className="main-container">
              <Filter isDGT={ActiveTabIndex === 2} />
              <div className="main-container-tabs">
                <Tabs
                  value={ActiveTabIndex}
                  textColor="primary"
                  onChange={(e, newValue) => this.onTabClick(newValue)}
                >
                  <Tab
                    className="customer-analytics-tab"
                    label="Performance Dashboard"
                  />
                  <Tab
                    className="customer-analytics-tab"
                    label="Buying Journey Insights"
                  />
                  <Tab
                    className="customer-analytics-tab"
                    label="Deal Game Tapes"
                  />
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
                  {ActiveTabIndex === 0 && <PerformanceDashboardUse />}
                  {ActiveTabIndex === 1 && !this.props.wait ? (
                    <BuyingJourneyInsights />
                  ) : this.props.wait && ActiveTabIndex === 1 ? (
                    <Skeleton
                      style={{ marginTop: '-170px' }}
                      height={700}
                      animation="wave"
                    />
                  ) : (
                    ''
                  )}
                  {ActiveTabIndex === 2 && <FreshStories />}
                </div>
              </ErrorBoundary>
            </div>
          </div>
        </MainPanel>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { defaultMarket, localChangedMarket, date, showDate, wait } =
    state.marketPerformanceFilters;
  return {
    tabData: state.marketAnalysisReducer.tabData,
    defaultMarket,
    localChangedMarket,
    date,
    showDate,
    wait,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeFilter: (payload) =>
      dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomerAnalyticsImp)
);
