import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reload } from '../../../../../action/loadingActions';
import {
  ADD_ANALYZE_CARDS,
  REMOVE_ANALYZE_CARDS,
  SELECT_NOTE_CARD,
  UPDATE_MARKET_PERFORMANCE_FILTERS,
} from '../../../../../constants/general';
import { StoryListModel } from '../../../../../model/myStoriesModels/MyStoriesModel';
import { getMatchedCardsSummaryForSolution } from '../../../../../util/promises/customer_analysis';
import { dispatch } from '../../../../../util/utils';
import { Loader } from '../../../../../_tribyl/components/_base/Loader/Loader';
import Insights from '../../../BuyerInsights/components/Insights/Insights';
import AllCard from './AllCards/AllCard';
import { Card } from './Card/Card';
import './SummaryCard.style.scss';

const DEFAULT_CLASSNAMES = 'summary-card-container';

const CardNameArray = [
  { value: 'customerNeeds', label: 'Customer Needs' },
  { value: 'topPerformers', label: 'Must-Haves' },
  { value: 'bottomPerformers', label: 'Nice-to-Haves' },
];

export class SummaryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MatchedCards: [],
      topBottomPerformerCards: [],
      customerNeedsCard: [],
      isLoading: false,
      selectedCardType: null,
      selectedCard: null,
      stories: null,
      kpiCards: [],
      ucCards: [],
      ppCards: [],
      triggerCards: [],
      productCards: [],
      positioningCards: [],
      pricingCards: [],
      successCards: [],
      isSubTopicLoading: {
        customerNeeds: true,
        topPerformers: true,
        bottomPerformers: true,
      },
      selectedSubType: {
        customerNeeds: 'Use Cases',
        topPerformers: 'product',
        bottomPerformers: 'product',
      },
    };
  }

  componentDidUpdate(prevProps) {
    const { filter, cardAnalysisArray } = this.props;
    let c = true;
    let { selectedSubType } = this.state;
    const selectedSubTopic = Array.from(
      new Set(Object.values(selectedSubType))
    );
    const { cardId, name } = cardAnalysisArray;
    if (!isEqual(filter.market, prevProps.filter.market)) {
      c = false;
    }
    if (!isEqual(omit(filter, 'oppty'), omit(prevProps.filter, 'oppty'))) {
      // remove any selected card
      this.setState({
        isSubTopicLoading: {
          customerNeeds: true,
          topPerformers: true,
          bottomPerformers: true,
        },
      });
      dispatch({
        type: SELECT_NOTE_CARD,
        payload: null,
      });
      if (cardAnalysisArray.length) {
        this.props.removeAnalyze();
      }
      this.loadData(selectedSubTopic, c);
    }
    if (prevProps.cardAnalysisArray !== this.props.cardAnalysisArray) {
      this.loadData(selectedSubTopic, c);
    }
  }

  componentDidMount() {
    let { selectedSubType } = this.state;
    const selectedSubTopic = Array.from(
      new Set(Object.values(selectedSubType))
    );
    if (this.props.filter.market) this.loadData(selectedSubTopic);
  }

  async loadData(selectedSubTopic, c = true) {
    const { cardAnalysisArray, changeFilter, pinnedCardsOpptyList } =
      this.props;
    this.setState({ isLoading: true });
    let { filter } = this.props;
    changeFilter({ isDataLoading: true });
    let {
      kpiCards,
      ucCards,
      ppCards,
      triggerCards,
      productCards,
      positioningCards,
      pricingCards,
      successCards,
    } = this.state;
    let { selectedSubType } = this.state;
    let customerNeedsCard = [];
    let topBottomPerformerCards = [];
    this.setState({ stories: null });
    filter = { ...filter, pinnedCardsOpptyList };
    StoryListModel.deleteAll();
    if (!filter.opptystatus) return;

    let response = [];
    let filterObject = [];
    // change {market:value} -> {name: market, value: value} to map in the post method
    const keys = Object.keys(filter);
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
      } else if (filter[key] !== null) {
        filterObject.push({
          name: key,
          value: filter[key]?.value ? filter[key]?.value : filter[key],
        });
      }
    });
    let MatchedCards;
    if (!c)
      filterObject = filterObject.filter((t) => t.name !== 'competitorCardId');
    if (filter.showLiveOpptys === 'Y')
      filterObject.push({ name: 'isOpenOppty', value: filter['oppty']?.value });
    try {
      dispatch({
        type: SELECT_NOTE_CARD,
        payload: null,
      });
      response = await getMatchedCardsSummaryForSolution(
        selectedSubTopic,
        cardAnalysisArray,
        filterObject
      );
      MatchedCards = response.data ? response.data : [];
      const storyIdList = response.data ? response.data.storyIdList : [];
      selectedSubTopic.map((subTopic) => {
        switch (subTopic) {
          case 'Use Cases':
            ucCards = this.filterCardBySubTopic(
              MatchedCards.playbookCards,
              'Use Cases'
            );
            this.setNoteCard(ucCards);
            break;
          case 'Pain Points':
            ppCards = this.filterCardBySubTopic(
              MatchedCards.playbookCards,
              'Pain Points'
            );
            this.setNoteCard(ppCards);
            break;
          case 'KPI':
            kpiCards = this.filterCardBySubTopic(
              MatchedCards.playbookCards,
              'KPI'
            );
            this.setNoteCard(kpiCards);
            break;
          case 'compelling_event':
            triggerCards = this.filterCardBySubTopic(
              MatchedCards.playbookCards,
              'compelling_event'
            );
            this.setNoteCard(triggerCards);
            break;
          case 'product':
            productCards = this.filterCardBySubTopic(
              MatchedCards.playbookCards,
              'product'
            );
            this.setNoteCard(productCards);
            break;
          case 'positioning':
            positioningCards = this.filterCardBySubTopic(
              MatchedCards.playbookCards,
              'positioning'
            );
            this.setNoteCard(positioningCards);
            break;
          case 'pricing':
            pricingCards = this.filterCardBySubTopic(
              MatchedCards.playbookCards,
              'pricing'
            );
            this.setNoteCard(pricingCards);
            break;
          case 'success':
            successCards = this.filterCardBySubTopic(
              MatchedCards.playbookCards,
              'success'
            );
            this.setNoteCard(successCards);
            break;
        }
      });
      customerNeedsCard = [
        ...ucCards,
        ...kpiCards,
        ...triggerCards,
        ...ppCards,
      ];
      topBottomPerformerCards = [
        ...positioningCards,
        ...pricingCards,
        ...productCards,
        ...successCards,
      ];
      const selectedCard =
        customerNeedsCard && customerNeedsCard.length > 0
          ? customerNeedsCard.filter(
              (i) => i.cardSubType === selectedSubType.customerNeeds
            )
          : [];
      if (!isEqual(this.props.storyList, storyIdList)) {
        changeFilter({
          storyList: storyIdList,
        });
        reload('story-stats');
      } else {
        changeFilter({ isDataLoading: false });
      }

      this.setState({
        ucCards,
        kpiCards,
        triggerCards,
        ppCards,
        positioningCards,
        pricingCards,
        productCards,
        successCards,
        MatchedCards,
        isLoading: false,
        customerNeedsCard,
        topBottomPerformerCards,
        selectedCard,
      });
      this.setState({
        isSubTopicLoading: {
          customerNeeds: false,
          topPerformers: false,
          bottomPerformers: false,
        },
      });
    } catch (error) {
      MatchedCards = [];
      this.setState({ isLoading: false });
      changeFilter({ isDataLoading: false });
    }
  }

  setNoteCard = (selectedCard) => {
    const { selectedNoteCard } = this.props;
    if (!selectedNoteCard) {
      // const newCard = selectedCard.find(
      //   (i) => i.id === cardAnalysisArray[0].id
      // );
      // This is to set the analysis array
      // dispatch({
      //   type: SELECT_NOTE_CARD,
      //   payload: newCard,
      // });
      dispatch({
        type: SELECT_NOTE_CARD,
        payload: selectedCard[0],
      });
    }
    // else {
    //   // this is to set the first card as a pinned card for the sidebar to work when selectedNotecard is empty
    //   dispatch({
    //     type: SELECT_NOTE_CARD,
    //     payload: selectedCard[0],
    //   });
    // }
  };

  filterCardBySubTopic = (data, subTopics) => {
    return data ? data.filter((card) => subTopics === card.cardSubType) : [];
  };

  renderAllCard = (type) => {
    const { selectedSubType, isSubTopicLoading } = this.state;
    let cards = [];
    switch (type) {
      case 'customerNeeds': {
        const { customerNeedsCard } = this.state;
        cards = customerNeedsCard;

        return (
          <AllCard
            setSubtType={this.setSubtType}
            selectedSubType={selectedSubType.customerNeeds}
            uiType="BJI"
            setViewAll={this.setViewAll}
            cardData={cards}
            cardType={CardNameArray[0].value}
            title={CardNameArray[0].label}
            direction="up"
            isLoading={isSubTopicLoading.customerNeeds}
          />
        );
      }
      case 'topPerformers': {
        const { topBottomPerformerCards } = this.state;
        cards = topBottomPerformerCards;
        return (
          <AllCard
            setSubtType={this.setSubtType}
            selectedSubType={selectedSubType.topPerformers}
            uiType="BJI"
            setViewAll={this.setViewAll}
            cardData={cards}
            cardType={CardNameArray[1].value}
            title={CardNameArray[1].label}
            direction="up"
            isLoading={isSubTopicLoading.topPerformers}
          />
        );
      }
      case 'bottomPerformers': {
        const { topBottomPerformerCards } = this.state;
        cards = [...topBottomPerformerCards].reverse();
        return (
          <AllCard
            setSubtType={this.setSubtType}
            selectedSubType={selectedSubType.bottomPerformers}
            uiType="BJI"
            setViewAll={this.setViewAll}
            cardData={cards}
            cardType={CardNameArray[2].value}
            title={CardNameArray[2].label}
            direction="down"
            isLoading={isSubTopicLoading.bottomPerformers}
          />
        );
      }
      default:
    }
  };

  setViewAll = (type) => {
    this.setState({ selectedCardType: type });
  };

  setSubtType = (type, subtype) => {
    const { selectedSubType, isSubTopicLoading } = this.state;
    selectedSubType[type] = subtype;
    isSubTopicLoading[type] = true;
    this.setState({ selectedSubType, isSubTopicLoading }, () =>
      this.loadData([subtype])
    );
  };

  onSort = (value) => {
    const { changeFilter } = this.props;
    changeFilter({ sortBy: value.value });
  };

  render() {
    const { solutionId } = this.props;
    const {
      selectedCardType,
      customerNeedsCard,
      topBottomPerformerCards,
      selectedSubType,
      isSubTopicLoading,
      selectedCard,
    } = this.state;

    return (
      <div
        className={`${DEFAULT_CLASSNAMES}${
          selectedCardType ? '-all-view' : ''
        }`}
      >
        <div className={`${DEFAULT_CLASSNAMES}-card-container`}>
          <div className="card-section">
            <React.Fragment>
              {selectedCardType && selectedCard ? (
                <React.Fragment>
                  {this.renderAllCard(selectedCardType)}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Card
                    selectedSubType={selectedSubType.customerNeeds}
                    setSubtType={this.setSubtType}
                    setViewAll={this.setViewAll}
                    solutionId={solutionId}
                    cardType={CardNameArray[0].value}
                    title={CardNameArray[0].label}
                    cardData={customerNeedsCard}
                    count={customerNeedsCard && customerNeedsCard.length}
                    direction="up"
                    isLoading={isSubTopicLoading.customerNeeds}
                  />
                  <Card
                    selectedSubType={selectedSubType.topPerformers}
                    setSubtType={this.setSubtType}
                    setViewAll={this.setViewAll}
                    solutionId={solutionId}
                    cardType={CardNameArray[1].value}
                    title={CardNameArray[1].label}
                    cardData={topBottomPerformerCards}
                    count={
                      topBottomPerformerCards && topBottomPerformerCards.length
                    }
                    direction="up"
                    isLoading={isSubTopicLoading.topPerformers}
                  />
                  {/* sending data in ascending order */}
                  <Card
                    selectedSubType={selectedSubType.bottomPerformers}
                    setSubtType={this.setSubtType}
                    setViewAll={this.setViewAll}
                    solutionId={solutionId}
                    cardType={CardNameArray[2].value}
                    title={CardNameArray[2].label}
                    cardData={Array.from(topBottomPerformerCards).reverse()}
                    count={
                      topBottomPerformerCards && topBottomPerformerCards.length
                    }
                    direction="down"
                    isLoading={isSubTopicLoading.bottomPerformers}
                  />
                </React.Fragment>
              )}
              <Insights
                disableCheckbox
                selectedNoteCard={selectedCard}
                newVersion="new"
              />
            </React.Fragment>
          </div>
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
    opptyType,
    oppty,
    isTestCardBJI,
    showLiveOpptys,
  } = state.marketPerformanceFilters;
  return {
    cardAnalysisArray: state.marketAnalysisReducer.AnalyzeCards,
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
      crmOpptyType: opptyType,
      oppty,
      isTestCard: isTestCardBJI,
      showLiveOpptys,
    },
    pinnedCardsOpptyList: state.marketAnalysisReducer.AnalyzeCards.length
      ? state.marketAnalysisReducer.AnalyzeCards[0].setOfOpptyIds.join(',')
      : null,
    storyList: state.marketPerformanceFilters.storyList,
    selectedNoteCard: state.marketAnalysisReducer.selectedNoteCard,
  };
}

const removeAnalyzecard = (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: ADD_ANALYZE_CARDS, payload: [] });
    resolve('done');
  });
};

function mapDispatchToProps() {
  return bindActionCreators(
    {
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
      removeAnalyze: () => (dispatch) => removeAnalyzecard(dispatch),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryCard);
