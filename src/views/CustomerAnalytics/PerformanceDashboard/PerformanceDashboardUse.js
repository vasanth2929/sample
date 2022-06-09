import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../constants/general';
import {
  getMatchedCardsSummaryForSolution,
  getOpptyListMetricsForSolution,
} from '../../../util/promises/customer_analysis';
import { ShortNumber } from '../../../util/utils';
import {
  MetricsOptions,
  verifySort,
  GoalOptions,
  testCardsOptions,
} from '../util/Util';
import Chart from './components/Chart/Chart';
import LeaderBoard from './components/LeaderBoard/LeaderBoard';
import './PerformanceDashboard.style.scss';
import TribylSelect from '../../../tribyl_components/TribylSelect/TribylSelect';
import { reload } from '../../../action/loadingActions';
import {
  FilterClosePeriodModel,
  FilterOpptyTypeModel,
  FilterStageModel,
} from '../../../model/GlobalFilterModels/GlobalFilterModels';
import { getCompetitorCardsList } from '../../../util/promises/playbooks_promise';
import omit from 'lodash.omit';

const DEFAULT_CLASSNAME = 'performance-dashboard';
class PerformanceDashboardUseImpl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMessaging: GoalOptions[0],
      isLoading: false,
      metrics: [],
      cards: [],
      cardType: 'All',
      competitorData: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { filter } = this.props;
    let considerComp = true;
    if (!isEqual(omit(filter, 'oppty'), omit(prevProps.filter, 'oppty'))) {
      if (!isEqual(filter.market, prevProps.filter.market)) {
        this.props.changeFilter({
          performanceCompetitor: {
            value: 'All',
            label: 'All',
            floatingLabel: 'COMPETITOR',
          },
        });
        considerComp = false;
      }
      console.log('DATA', filter, prevProps.filter);
      this.loadData(considerComp);
    }
    if (prevProps.cardAnalysisArray !== this.props.cardAnalysisArray) {
      this.loadData(considerComp);
    }
    if (this.props.performanceMetrics !== prevProps.performanceMetrics) {
      reload('performance-dashboard-chart');
    }
  }

  componentDidMount() {
    const { filter, changeFilter } = this.props;
    if (this.props.performanceMetrics === null) {
      changeFilter({ performanceMetrics: MetricsOptions[3] });
    }
    this.loadData();
  }

  componentWillUnmount() {
    this.props.changeFilter({ searchString: null });
  }

  setMessaging = (option) => {
    this.setState({ selectedMessaging: option, isLoading: false }, () =>
      this.loadData()
    );
  };

  async loadData(considerComp = true) {
    this.setState({ isLoading: true });
    const { filter } = this.props;
    let filterObject = [];
    const keys = Object.keys(filter);
    let competitorData = [];
    keys.forEach((key) => {
      if (key === 'market' && filter[key] !== null) {
        filterObject.push({
          name: 'salesPlayId',
          value: filter[key].value ? filter[key].value : filter[key],
        });
      } else if (key === 'isTestCard' && filter[key] !== null) {
        if (filter[key].value === 'MY_CARDS') {
          filterObject.push({ name: 'myTestCards', value: 'Y' });
          filterObject.push({
            name: 'isTestCard',
            value: 'Y',
          });
        } else
          filterObject.push({
            name: 'isTestCard',
            value: filter[key].value,
          });
      } else if (key === 'crmOpptyType' && filter[key] !== null) {
        filterObject.push({
          name: 'crmOpptyType',
          value: filter[key].value ? filter[key].value : filter[key],
        });
      } else if (filter[key] !== null && filter[key]?.value !== 'All') {
        filterObject.push({
          name: key,
          value: filter[key]?.value ? filter[key].value : filter[key],
        });
      } else if (key === 'VerifiedCardsOnly' && filter[key] !== null) {
        filterObject.push({
          name: key,
          value: filter[key]?.value ? filter[key].value : filter[key],
        });
      }
    });
    if (
      filter.performanceCompetitor &&
      filter.performanceCompetitor.label !== 'All' &&
      considerComp
    ) {
      filterObject.push({
        name: 'competitorCardId',
        value: filter.performanceCompetitor.value,
      });
    }
    if (filter.showLiveOpptys === 'Y')
      filterObject.push({ name: 'isOpenOppty', value: filter['oppty']?.value });

    const metricsPayload = {};
    let metrics;
    let MatchedCards;

    if (filter.industry !== null)
      metricsPayload.industryList = [filter.industry.value];
    if (filter.segment !== null)
      metricsPayload.marketList = [filter.segment.value];
    if (filter.region !== null)
      metricsPayload.regionList = [filter.region.value];
    if (filter.market !== null) metricsPayload.solutionId = filter.market.value;
    if (filter.closePeriod !== null && filter.closePeriod?.value !== 'All')
      metricsPayload.closePeriod = filter.closePeriod?.value;
    if (filter.opptystatus !== null && filter.opptystatus?.value !== 'All')
      metricsPayload.opptyStatus = filter.opptystatus?.value;
    if (filter.VerifiedCardsOnly !== null)
      metricsPayload.VerifiedCardsOnly = filter.VerifiedCardsOnly?.value;
    if (filter.crmOpptyType !== null)
      metricsPayload.crmOpptyType = filter.crmOpptyType?.value;
    if (filter.searchString !== null)
      metricsPayload.searchString = filter.searchString;
    if (
      filter.performanceCompetitor &&
      filter.performanceCompetitor?.label !== 'All' &&
      considerComp
    ) {
      metricsPayload.competitorCardId = filter.performanceCompetitor.value;
    }

    if (
      filter.closePeriod &&
      filter.opptystatus &&
      filter.crmOpptyType &&
      filter.market
    ) {
      try {
        const marketId = filter.market ? filter.market.value : null;
        const compRes = await getCompetitorCardsList(marketId);
        console.log(filterObject);
        const response1 = await getMatchedCardsSummaryForSolution(
          this.state.selectedMessaging.value,
          [],
          filterObject
        );
        if (filter.showLiveOpptys === 'Y')
          metricsPayload.isOpenOppty = filter?.oppty?.value;
        const repsonse2 = await getOpptyListMetricsForSolution(metricsPayload);
        metrics = repsonse2.data ? repsonse2.data.commonOpptyMetrics : [];
        MatchedCards = response1.data ? response1.data.playbookCards : [];
        competitorData = compRes?.data?.length
          ? compRes?.data?.map((i) => ({
              value: i.id,
              label: i.name,
              floatingLabel: 'COMPETITOR',
            }))
          : [];
        competitorData = [
          { value: 'All', label: 'All', floatingLabel: 'COMPETITOR' },
          ...competitorData,
        ];
      } catch (error) {
        metrics = [];
        MatchedCards = [];
      } finally {
        this.setState({
          cards: MatchedCards,
          MatchedCards,
          isLoading: false,
          metrics,
          competitorData,
        });
      }
    }

    this.setState({ isLoading: false });
  }

  getCardPerTopic = (MatchedCards, topic) => {
    switch (topic) {
      case 'Use Cases':
        return MatchedCards && MatchedCards.playbookCards
          ? MatchedCards.topUCCards
          : [];
      case 'Pain Points':
        return MatchedCards && MatchedCards.playbookCards
          ? MatchedCards.playbookCards
          : [];
      case 'product':
        return MatchedCards && MatchedCards.playbookCards
          ? MatchedCards.playbookCards.filter(
              (card) => card.cardSubType === topic
            )
          : [];
      case 'pricing':
        return MatchedCards && MatchedCards.playbookCards
          ? MatchedCards.playbookCards.filter(
              (card) => card.cardSubType === topic
            )
          : [];
      case 'positioning':
        return MatchedCards && MatchedCards.playbookCards
          ? MatchedCards.playbookCards.filter(
              (card) => card.cardSubType === topic
            )
          : [];
      case 'success':
        return MatchedCards && MatchedCards.playbookCards
          ? MatchedCards.playbookCards.filter(
              (card) => card.cardSubType === topic
            )
          : [];
      case 'KPI':
        return MatchedCards && MatchedCards.topEconomicDriverCards
          ? MatchedCards.topEconomicDriverCards.filter(
              (card) => card.cardSubType === topic
            )
          : [];
      case 'compelling_event':
        return MatchedCards && MatchedCards.topEconomicDriverCards
          ? MatchedCards.topEconomicDriverCards.filter(
              (card) => card.cardSubType === topic
            )
          : [];
      default:
        return [];
    }
  };

  renderMetrics = (metrics) => {
    const { isLoading } = this.state;
    if (isLoading)
      return (
        <div
          style={{
            minWidth: '440px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '68px',
          }}
        >
          Loading data...{' '}
        </div>
      );

    return (
      <div className="metrics-d">
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
    changeFilter({ [model]: selected });
  };

  optionGenerator = (type, value) => {
    if (value) {
      switch (type) {
        case 'stage':
          return {
            label: (
              <span className="goal-select-item-wrapper">
                <span className="goal-select-item-name">STAGE</span>
                <span className="goal-select-item-label">{value}</span>
              </span>
            ),
            value,
          };
        case 'close_period':
          return {
            label: (
              <span className="goal-select-item-wrapper">
                <span className="goal-select-item-name">ClOSE PERIOD</span>
                <span className="goal-select-item-label">{value}</span>
              </span>
            ),
            value,
          };
      }
    } else {
      return null;
    }
  };

  renderFilters = () => {
    const { selectedMessaging } = this.state;
    const {
      filter: { opptystatus, closePeriod, crmOpptyType },
      stageList,
      closePeriodList,
      opptyTypesList,
    } = this.props;

    return (
      <div className={`${DEFAULT_CLASSNAME}-filter`}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={GoalOptions}
              value={selectedMessaging}
              onChange={this.setMessaging}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={MetricsOptions}
              value={this.props.performanceMetrics}
              onChange={(value) =>
                this.handleChange('performanceMetrics', value)
              }
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={stageList}
              value={opptystatus}
              onChange={(option) => this.handleChange('opptyStatus', option)}
            />
          </div>

          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={closePeriodList}
              value={closePeriod}
              onChange={(value) => this.handleChange('closeDate', value)}
            />
          </div>

          <div className="goal-dropdown-wrapper">
            <TribylSelect
              options={opptyTypesList}
              value={crmOpptyType}
              onChange={(value) => this.handleChange('opptyType', value)}
            />
          </div>
        </div>
        {this.renderSecondaryFilters()}
      </div>
    );
  };

  renderSecondaryFilters = () => {
    const {
      filter: { VerifiedCardsOnly, performanceCompetitor },
      changeFilter,
    } = this.props;

    return (
      <div className={`${DEFAULT_CLASSNAME}-filter`}>
        <div className="goal-dropdown-wrapper">
          <TribylSelect
            options={this.state.competitorData}
            value={
              performanceCompetitor
                ? performanceCompetitor
                : { value: 'All', label: 'All', floatingLabel: 'COMPETITOR' }
            }
            onChange={(option) =>
              this.handleChange('performanceCompetitor', option)
            }
          />
        </div>

        <div className="goal-dropdown-wrapper">
          <TribylSelect
            options={verifySort}
            value={VerifiedCardsOnly}
            onChange={(value) => changeFilter({ verifiedCard: value })}
          />
        </div>
      </div>
    );
  };

  render() {
    const { selectedMessaging, isLoading, cards, metrics } = this.state;

    return (
      <div className={DEFAULT_CLASSNAME}>
        {this.renderFilters()}
        <div className={`${DEFAULT_CLASSNAME}-content`}>
          <div className="chart-with-filter">
            <div className="metrics-wrapper" style={{ alignItems: 'center' }}>
              <>
                {this.renderMetrics(metrics)}
                <div className={`${DEFAULT_CLASSNAME}-filter`}>
                  <div
                    style={{ marginLeft: '20px', marginBottom: '0px' }}
                    className="goal-dropdown-wrapper"
                  >
                    <TribylSelect
                      options={testCardsOptions}
                      value={this.props.filter.isTestCard}
                      onChange={(value) =>
                        this.props.changeFilter({ isTestCard: value })
                      }
                    />
                  </div>
                </div>
              </>
            </div>
            <Chart chartData={cards} isLoading={isLoading} />
          </div>
          <LeaderBoard
            solutionId={2}
            isLoading={isLoading}
            cardData={cards}
            topicType={selectedMessaging.label}
          />
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
    performanceSortCriteria,
    sortBy,
    performanceMetrics,
    searchString,
    opptyType,
    performanceCompetitor,
    oppty,
    showLiveOpptys,
    isTestCard,
  } = state.marketPerformanceFilters;
  return {
    filter: {
      market,
      industry,
      segment,
      region,
      opptystatus: opptyStatus,
      closePeriod: closeDate,
      VerifiedCardsOnly: verifiedCard,
      sortCriteria: performanceSortCriteria,
      sortOrder: performanceSortCriteria?.sortBy,
      searchString,
      crmOpptyType: opptyType,
      performanceCompetitor,
      oppty,
      isTestCard,
      showLiveOpptys,
    },
    stageList: FilterStageModel.list().map((item) => item.props),
    opptyTypesList: FilterOpptyTypeModel.list().map((item) => item.props),
    closePeriodList: FilterClosePeriodModel.list().map((item) => item.props),
    performanceMetrics,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetAlertsCount: () =>
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
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformanceDashboardUseImpl);
