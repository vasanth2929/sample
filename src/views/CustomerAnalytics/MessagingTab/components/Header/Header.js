import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { isEqual } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reload } from '../../../../../action/loadingActions';
import { Async } from '../../../../../basecomponents/async/async';
import { ToggleButton } from '../../../../../basecomponents/ToggleButton/ToggleButton';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../../../constants/general';
import {
  FilterClosePeriodModel,
  FilterOpptyTypeModel,
  FilterStageModel,
} from '../../../../../model/GlobalFilterModels/GlobalFilterModels';
import TribylSelect from '../../../../../tribyl_components/TribylSelect/TribylSelect';
import {
  getClosePeriodDropdownValues,
  getOpptyTypeDropdownValues,
  getStageDropdownLabels,
} from '../../../../../util/promises/customer_analysis';
import { getCompetitorCardsList } from '../../../../../util/promises/playbooks_promise';
import { dispatch } from '../../../../../util/utils';
import { sortOptions, testCardsOptions, verifySort } from '../../../util/Util';

class HeaderImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      competitorData: [],
      opptyStatusList: [],
      loadingMetrics: true,
      opptyTypeList: [],
      closePeriodOptions: [],
    };
  }

  componentDidUpdate = (prevProps) => {
    const { filter, changeFilter } = this.props;
    const AnalyzeCards = this.props.cardAnalysisArray.AnalyzeCards;
    const PrevAnalyzeCards = prevProps.cardAnalysisArray.AnalyzeCards;

    if (!isEqual(filter.market, prevProps.filter.market)) {
      this.setState({ competitorData: [] });
      reload('bji-messaging-header');
    }
    if (!isEqual(AnalyzeCards, PrevAnalyzeCards)) {
      reload('bji-messaging-header');
    }
    if (!isEqual(filter, prevProps.filter)) {
      reload('bji-messaging-header');
    }
  };

  getPromise = () => {
    const { filter } = this.props;
    const marketId = filter.market ? filter.market.value : null;
    return getCompetitorCardsList(marketId);
  };

  loadData = (competitors) => {
    this.loadCompetitor(competitors);
  };

  loadCompetitor = async (response) => {
    let competitorData = response
      ? response.map((i) => ({
          value: i.id,
          label: i.name,
          floatingLabel: 'COMPETITOR',
        }))
      : [];
    competitorData = [
      { value: 'All', label: 'All', floatingLabel: 'COMPETITOR' },
      ...competitorData,
    ];
    this.setState({ competitorData });
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
      filter: {
        opptystatus,
        sort,
        closePeriod,
        competitorCardId,
        isVerifiedCards,
        bjiOpptyType,
      },
      changeFilter,
      stageList,
      opptyTypesList,
      closePeriodList,
      isDataLoading,
    } = this.props;
    const {
      competitorData,
      opptyStatusList,
      opptyTypeList,
      closePeriodOptions,
    } = this.state;
    const competitorValue =
      competitorData &&
      competitorData.find((option) => option.value === competitorCardId);
    const sortOptionValue =
      sort && sort.value
        ? sortOptions.find((option) => option.value === sort.value)
        : '';

    return (
      <React.Fragment>
        <div className="filter">
          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={stageList}
              value={opptystatus}
              onChange={(option) => this.handleChange('opptyStatus', option)}
              isDisabled={isDataLoading}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={closePeriodList}
              value={closePeriod}
              onChange={(option) => this.handleChange('closeDate', option)}
              isDisabled={isDataLoading}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={opptyTypesList}
              value={bjiOpptyType}
              onChange={(option) => this.handleChange('opptyType', option)}
              isDisabled={isDataLoading}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            {competitorData.length > 0 && (
              <TribylSelect
                options={competitorData}
                value={competitorValue}
                onChange={(option) =>
                  this.handleChange('buyingCompetitorId', option.value)
                }
                isDisabled={isDataLoading}
              />
            )}
          </div>
          <div className="goal-dropdown-wrapper">
            {
              <TribylSelect
                options={testCardsOptions}
                value={this.props.filter.isTestCard}
                onChange={(option) =>
                  this.props.changeFilter({ isTestCardBJI: option })
                }
                isDisabled={isDataLoading}
              />
            }
          </div>
        </div>
        <div className="filter2">
          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={sortOptions}
              value={sortOptionValue}
              onChange={(value) => this.handleChange('buyingSort', value)}
              isDisabled={isDataLoading}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={verifySort}
              value={isVerifiedCards}
              onChange={(value) => changeFilter({ verifiedCard: value })}
              isDisabled={isDataLoading}
            />
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
        identifier="bji-messaging-header"
        promise={this.getPromise}
        content={this.renderContent}
        handlePromiseResponse={this.loadData}
        // loader={this.shimmer}
        error={(e) => {
          console.log(e);
          return <div>Error...</div>;
        }}
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
    buyingSort,
    buyingCompetitorId,
    opptyType,
    isDataLoading,
    isTestCardBJI,
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
      sort: buyingSort,
      competitorCardId: buyingCompetitorId,
      bjiOpptyType: opptyType,
      isTestCard: isTestCardBJI,
    },
    stageList: FilterStageModel.list().map((item) => item.props),
    opptyTypesList: FilterOpptyTypeModel.list().map((item) => item.props),
    closePeriodList: FilterClosePeriodModel.list().map((item) => item.props),
    cardAnalysisArray: state.marketAnalysisReducer,
    selectedSubTab: state.marketAnalysisReducer.selectedSubTab,
    isDataLoading,
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
