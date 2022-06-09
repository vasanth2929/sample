import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  ADD_ANALYZE_CARDS,
  SWITCH_SUB_TABS,
  UPDATE_MARKET_PERFORMANCE_FILTERS,
} from '../../../constants/general';
import { StoryListModel } from '../../../model/myStoriesModels/MyStoriesModel';
import { dispatch } from '../../../util/utils';
import Header from './components/Header/Header';
import SummaryCard from './components/SummaryCard/SummaryCard';

class MessagingTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SolutionMetricsData: [],
      isLoading: false,
      selectedAnalysisCard: null,
      solutionId: 2,
      openNewSwot: false,
      metrics: [],
    };
  }

  componentDidMount() {
    const { selectedSubTab } = this.props;
    if (!selectedSubTab) {
      dispatch({
        type: SWITCH_SUB_TABS,
        payload: 'Messaging',
      });
    }
  }

  componentWillUnmount() {
    this.props.changeFilter({ searchString: null });
    this.props.removeAnalyzeCard();
  }

  setAnalysisCard = (card) => {
    this.setState({ selectedAnalysisCard: card });
  };

  openNewSwot = () => {
    this.setState({ openNewSwot: true });
  };

  render() {
    return (
      <div className="winloss-container">
        <div className="header-metrics">
          <Header />
        </div>
        <div className="card-container">
          <SummaryCard solutionId={2} direction="up" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    market,
    industry,
    segment,
    region,
    closeDate,
    opptyStatus,
    verifiedCard,
    buyingSort,
    sortBy,
    searchString,
    buyingCompetitorId,
  } = state.marketPerformanceFilters;
  return {
    selectedSubTab: state.marketAnalysisReducer.selectedSubTab,
    stories: StoryListModel.list().map((i) => i.props),
    filter: {
      market,
      industry,
      segment,
      region,
      opptystatus: opptyStatus,
      closePeriod: closeDate,
      VerifiedCardsOnly: verifiedCard,
      sortCriteria: buyingSort,
      sortOrder: buyingSort?.sortBy,
      searchString,
      competitorCardId: buyingCompetitorId,
    },
  };
}

function mapDispatchToProps() {
  return bindActionCreators(
    {
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
      removeAnalyzeCard: () =>
        dispatch({ type: ADD_ANALYZE_CARDS, payload: [] }),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagingTab);
