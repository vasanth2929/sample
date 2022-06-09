import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { Icons, SWITCH_TABS, UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../constants/general';
import { dispatch } from '../../util/utils';
import './ExecutiveDashboard.style.scss';
import Filter from '../CustomerAnalytics/Filters/Filter';
import KeyHighlights from './KeyHighlights/KeyHighlights';

class ExecutiveDashboardImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMarketid: null,
      ActiveTabIndex: 0,
    };
  }

  componentDidUpdate(prevProps) {
    const { tabId } = this.props.tabData;
    if (tabId !== prevProps.tabData.tabId) {
      this.onTabClick(tabId);
    }
  }

  componentDidMount(){
    if(this.props.localChangedMarket === null) {
      this.props.changeFilter({localChangedMarket:this.props.defaultMarket,market:this.props.defaultMarket});
    }
  }

  onTabClick = (tabindex) => {
    this.setState({ ActiveTabIndex: tabindex });
    dispatch({
      type: SWITCH_TABS,
      payload: { tabId: tabindex, tabPayload: null },
    });
  };

  render() {
    return (
      <div>
        <MainPanel
          noSidebar
          viewName="Executive Summary"
          icons={[Icons.MAINMENU]}
          handleIconClick={this.handleHeaderIconClick}
        >
          <div className="executor-container">
            <div className="main-container">
              <Filter />
              <KeyHighlights />
            </div>
          </div>
        </MainPanel>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { defaultMarket, localChangedMarket } = state.marketPerformanceFilters;
  return {
    tabData: state.marketAnalysisReducer.tabData,
    defaultMarket,
    localChangedMarket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeFilter: (payload) =>
      dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ExecutiveDashboardImpl));
