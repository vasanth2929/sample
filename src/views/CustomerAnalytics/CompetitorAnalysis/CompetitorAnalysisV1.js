import isEqual from 'lodash.isequal';
import { PropTypes } from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  ADD_ANALYZE_CARDS,
  SELECT_NOTE_CARD,
  UPDATE_MARKET_PERFORMANCE_FILTERS,
} from '../../../constants/general';
import {
  getCompetitorCardsList,
  getOpptyListForCompetitor,
} from '../../../util/promises/playbooks_promise';
import { dispatch, isEmpty } from '../../../util/utils';
import { Loader } from '../../../_tribyl/components/_base/Loader/Loader';
import './CompetitorAnalysis.style.scss';
import DetailVIew from './components/DetailView/DetailVIew';
import Header from './components/Header/Header';
import SwotContainer from './components/SwotContainer/SwotContainer';
import TopWins from './components/TopWins/TopWins';

const DEFAULT_CLASSNAME = 'competitor-swot';

class CompetitorAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metrics: [],
      isLoading: false,
      competitorData: [],
      accounts: [],
      isAllView: false,
      compFilter: { selectedComp: null },
    };
  }

  componentDidMount() {
    this.loadCompetitor();
  }

  componentDidUpdate = (prevProps) => {
    const { filter } = this.props;
    if (!isEqual(filter.market, prevProps.filter.market)) {
      this.loadCompetitor();
    }
    if (!isEqual(filter, prevProps.filter)) {
      this.loadMetricsData();
    }
  };

  componentWillUnmount() {
    dispatch({
      type: SELECT_NOTE_CARD,
      payload: null,
    });
    dispatch({
      type: ADD_ANALYZE_CARDS,
      payload: [],
    });
  }

  loadCompetitor = async () => {
    const { filter } = this.props;
    const marketId = filter.market ? filter.market.value : null;

    try {
      const response = await getCompetitorCardsList(marketId);
      const competitorData =
        response && !isEmpty(response.data) ? response.data : [];
      // set initial competitor

      if (!isEmpty(competitorData)) {
        const selectedComp = {
          label: competitorData[0].name,
          value: competitorData[0].id,
          floatingLabel: 'COMPETITOR',
        };
        this.setFilter('competitor', selectedComp);
      } else {
        const selectedComp = {
          value: 'All',
          label: 'All',
          floatingLabel: 'COMPETITOR',
        };
        this.setFilter('competitor', selectedComp);
      }

      this.setState({ competitorData });
    } catch (error) {
      console.error(error);
    }
  };

  loadMetricsData = async () => {
    this.setState({ isLoading: true });
    const { filter } = this.props;
    const { selectedComp } = this.state.compFilter;
    const cardId = selectedComp ? selectedComp.value : null;
    const filterObject = [];
    // change {market:value} -> {name: market, value: value} to map in the post method
    const keys = Object.keys(filter);
    keys.forEach((key) => {
      if (key === 'market' && filter[key] !== null) {
        filterObject.push({
          name: 'salesPlayId',
          value: filter[key]?.value ? filter[key].value : filter[key],
        });
      } else if (filter[key] !== null) {
        filterObject.push({
          name: key,
          value: filter[key]?.value ? filter[key].value : filter[key],
        });
      }
    });
    if (cardId) {
      getOpptyListForCompetitor(cardId, filterObject).then((response) => {
        const metrics =
          response && response.data.metrics
            ? response.data.metrics.commonOpptyMetrics
            : [];
        const accounts =
          response && response.data.opportunityList
            ? response.data.opportunityList
            : [];
        this.setState({ metrics, accounts });
        //      () => {
        //     this.filterMetricByStage();
        // });
      });
    }
    this.setState({ isLoading: false });
  };

  filterMetricByStage = () => {
    const { opptyStatus } = this.props.filter;
    const { metricsData } = this.state;
    switch (opptyStatus) {
      case 'Closed-lost':
        this.setState({ metrics: metricsData ? metricsData.lossMetrics : [] });
        break;
      case 'No-Decision':
        this.setState({
          metrics: metricsData ? metricsData.noDecisionMetrics : [],
        });
        break;
      case 'Closed-won':
        this.setState({ metrics: metricsData ? metricsData.winMetrics : [] });
        break;
      default:
    }
  };

  toggleShowAll = () => {
    const { isAllView } = this.state;
    this.setState({ isAllView: !isAllView });
  };

  renderTopWins = (compFilter, accounts, isLoading) => {
    return (
      <React.Fragment>
        {!isLoading ? (
          <div className={`${DEFAULT_CLASSNAME}-container-top-wins`}>
            <TopWins
              selectedComp={compFilter.selectedComp}
              accounts={accounts}
            />
          </div>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  };

  renderStrengthWeakness = (compFilter, isAllView) => {
    return (
      <div
        className={`${DEFAULT_CLASSNAME}-container-analysis  ${
          isAllView && 'viewAll'
        }`}
      >
        <SwotContainer
          selectedComp={compFilter.selectedComp}
          isAllView={isAllView}
          settoggleShowAll={this.toggleShowAll}
        />
      </div>
    );
  };

  setFilter = (type, value) => {
    const { compFilter } = this.state;
    const { changeGlobalFilter } = this.props;
    switch (type) {
      case 'competitor':
        compFilter.selectedComp = value;
        changeGlobalFilter({ compCompetitor: value });
        dispatch({
          type: SELECT_NOTE_CARD,
          payload: null,
        });

        this.setState({ compFilter }, () => {
          this.loadMetricsData();
        });
        break;
      default:
      // do nothing
    }
  };

  render() {
    const selectedCard1 = {
      name: 'Multi-channel customer experience',
      id: 1485,
      cardSubType: 'Us Cases',
      winRatePerc: 100,
    };

    const {
      competitorData,
      compFilter,
      metrics,
      accounts,
      isAllView,
      isLoading,
    } = this.state;
    return (
      <div className={DEFAULT_CLASSNAME}>
        <Header
          onFilterSelect={this.setFilter}
          compFilter={compFilter}
          compData={competitorData}
          metrics={metrics}
        />
        <div className={`${DEFAULT_CLASSNAME}-container`}>
          {this.renderTopWins(compFilter, accounts, isLoading)}
          {this.renderStrengthWeakness(compFilter, isAllView)}
          <div className={`${DEFAULT_CLASSNAME}-container-sidebar`}>
            <DetailVIew selectedCard={selectedCard1} newVersion="new" />
          </div>
        </div>
      </div>
    );
  }
}

CompetitorAnalysis.propTypes = { filter: PropTypes.object };

function mapStateToProps(state) {
  const {
    market,
    industry,
    segment,
    region,
    opptyStatus,
    closeDate,
    verifiedCard,
    opptyType,
  } = state.marketPerformanceFilters;
  return {
    filter: {
      market,
      industry,
      segment,
      region,
      opptyStatus: opptyStatus,
      closePeriod: closeDate,
      VerifiedCardsOnly: verifiedCard,
      crmOpptyType: opptyType,
    },
  };
}

function mapDispatchToProps() {
  return bindActionCreators(
    {
      resetfilter: () =>
        dispatch({
          type: UPDATE_MARKET_PERFORMANCE_FILTERS,
          payload: {
            market: null,
            industry: null,
            segment: null,
            region: null,
            searchString: '',
          },
        }),
      changeGlobalFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitorAnalysis);
