import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../../../constants/general';
import TribylSelect from '../../../../../tribyl_components/TribylSelect/TribylSelect';
import {
  getOpptyListMetricsForSolution,
  getStageDropdownLabels,
} from '../../../../../util/promises/customer_analysis';
import { getCompetitorCardsList } from '../../../../../util/promises/playbooks_promise';
import { dispatch, ShortNumber } from '../../../../../util/utils';
import {
  sortOptions,
  verifySort,
  closePeriodOptions,
} from '../../../util/Util';
import { Async } from '../../../../../basecomponents/async/async';
import { Skeleton } from '@material-ui/lab';
import { reload } from '../../../../../action/loadingActions';
import './Header.style.scss';

const keywordsortOptions = [
  { value: 'Conversations', label: 'Conversations', floatingLabel: 'Sort' },
];
const keywordCounts = [
  { value: '10', label: '10', floatingLabel: 'keywords' },
  { value: '20', label: '20', floatingLabel: 'keywords' },
  { value: 'All', label: 'All', floatingLabel: 'keywords' },
];

class HeaderImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opptyStatusList: [],
      loadingMetrics: true,
    };
  }

  componentDidUpdate = (prevProps) => {
    const { filter, changeFilter } = this.props;
    const AnalyzeCards = this.props.cardAnalysisArray.AnalyzeCards;
    const PrevAnalyzeCards = prevProps.cardAnalysisArray.AnalyzeCards;

    if (!isEqual(filter.market, prevProps.filter.market)) {
      reload('bji-keyword-header');
    }

    if (!isEqual(filter, prevProps.filter)) {
      reload('bji-keyword-header');
    }
    if (filter.closePeriod === null) {
      changeFilter({ keywordClosePeriod: closePeriodOptions[1] });
    }
  };

  getPromise = () => {
    const {
      filter,
      cardAnalysisArray: { AnalyzeCards },
    } = this.props;
    const promises = [];

    return new Promise((resolve, reject) => {
      const metricsPayload = {};
      if (filter.industry !== null) {
        metricsPayload.industryList = [filter.industry?.value];
      }
      if (filter.segment !== null) {
        metricsPayload.marketList = [filter.segment?.value];
      }
      if (filter.region !== null) {
        metricsPayload.regionList = [filter.region?.value];
      }
      if (filter.market !== null)
        metricsPayload.solutionId = filter.market?.value;
      if (filter.closePeriod !== null) {
        metricsPayload.closePeriod = filter.closePeriod?.value;
      }
      if (filter.opptystatus !== null) {
        metricsPayload.opptyStatus = filter.opptystatus?.value;
      }
      if (filter.competitorCardId !== null) {
        metricsPayload.competitorCardId = filter.competitorCardId;
      }
      if (filter.isVerifiedCards !== null) {
        metricsPayload.VerifiedCardsOnly = filter.isVerifiedCards?.value;
      }
      if (AnalyzeCards.length > 0) {
        metricsPayload.pinnedCardIds = [AnalyzeCards[0].id];
      }
      if (filter.showLiveOpptys === 'Y')
        metricsPayload.isOpenOppty = filter.oppty?.value;
      // loading api only when there is no data available
      promises.push(getStageDropdownLabels());
      promises.push(getOpptyListMetricsForSolution(metricsPayload));
      Promise.all(promises)
        .then((response) => {
          const opptyStage = response && response[0] ? response[0].data : [];
          const metricsData = response && response[1] ? response[1].data : [];
          resolve({ data: { opptyStage, metricsData } });
        })
        .catch((e) => reject(e));
    });
  };

  loadData = ({ metricsData }) => {
    this.setState({ metrics: metricsData.commonOpptyMetrics });
  };

  loadMetricsBox = () => {
    const { metrics } = this.state;
    return (
      <div className="metrics">
        <React.Fragment>
          <div>
            <p className="small-text">AMOUNT</p>
            <p className="sub-heading bold">
              {metrics && metrics.totalAmount
                ? ShortNumber(metrics.totalAmount)
                : 0}
            </p>
          </div>
          <div>
            <p className="small-text">OPPTY</p>
            <p className="sub-heading bold">
              {metrics && metrics.opptyCount ? metrics.opptyCount : 0}
            </p>
          </div>
          <div>
            <p className="small-text">DEAL SIZE</p>
            <p className="sub-heading bold">
              {metrics && metrics.avgDealSize
                ? ShortNumber(metrics.avgDealSize)
                : 0}
            </p>
          </div>
          <div>
            <p className="small-text">SALES CYCLE</p>
            <p className="sub-heading bold">
              {metrics && metrics.salesCycle ? metrics.salesCycle : ''} days
            </p>
          </div>
        </React.Fragment>
      </div>
    );
  };

  handleChange = (model, selected) => {
    const { changeFilter } = this.props;
    if (selected === 'All') {
      changeFilter({ [model]: null });
    } else {
      const payload = { [model]: selected };
      if (selected.sortBy) {
        payload.sortBy = selected.sortBy;
      }
      changeFilter(payload);
    }
  };

  renderContent = () => {
    const {
      filter: { opptystatus, closePeriod },
    } = this.props;
    const { opptyStatusList } = this.state;

    return (
      <React.Fragment>
        <div className="filter">
          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={opptyStatusList}
              value={opptystatus}
              onChange={(option) => this.handleChange('opptyStatus', option)}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={closePeriodOptions}
              value={closePeriod ? closePeriod : closePeriodOptions[1]}
              onChange={(option) => this.handleChange('closeDate', option)}
            />
          </div>
          {/* {this.loadMetricsBox()} */}
        </div>
        <div className="filter2">
          <div className="goal-dropdown-wrapper">
            <TribylSelect options={keywordsortOptions} />
          </div>
          <div className="goal-dropdown-wrapper">
            <TribylSelect options={keywordCounts} />
          </div>
        </div>
      </React.Fragment>
    );
  };

  shimmer = () => {
    return <Skeleton varient="react" width={'100%'} height={100} />;
  };

  render() {
    return (
      <Async
        identifier="bji-keyword-header"
        promise={this.getPromise}
        content={this.renderContent}
        handlePromiseResponse={this.loadData}
        loader={this.shimmer}
        error={<div>Error...</div>}
      />
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
    oppty,
    showLiveOpptys,
  } = state.marketPerformanceFilters;
  return {
    filter: {
      market,
      industry,
      segment,
      region,
      opptystatus: opptyStatus,
      closePeriod: closeDate,
      isVerifiedCards: verifiedCard,
      oppty,
      showLiveOpptys,
    },
    cardAnalysisArray: state.marketAnalysisReducer,
    selectedSubTab: state.marketAnalysisReducer.selectedSubTab,
  };
}

function mapDispatchToProps() {
  return bindActionCreators(
    {
      resetGlobalFilter: () =>
        dispatch({
          type: UPDATE_MARKET_PERFORMANCE_FILTERS,
          payload: {
            market: '',
            industry: '',
            segment: '',
            region: '',
          },
        }),
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
      removeAnalyzeCard: () =>
        dispatch({ type: ADD_ANALYZE_CARDS, payload: [] }),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderImpl);
