import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import {
  getMatchedCardsForStories,
  getPlaybookAndNetNewCollection,
} from '../../../../util/promises/playbooks_promise';
import { getAllTopicsWithoutCards } from '../../../../util/promises/storyboard_promise';
import { dispatch, getLoggedInUser } from '../../../../util/utils';
import { Loader } from '../../../../_tribyl/components/_base/Loader/Loader';
import { verifySort } from '../../../CustomerAnalytics/util/Util';
import CustomerNeeds from './CustomerNeeds/CustomerNeeds';
import DecisionCriteria from './DecisionCriteria/DecisionCriteria';
import './Container.style.scss';
import { bindActionCreators } from 'redux';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../../constants/general';
import { withRouter } from 'react-router';
import {
  CustomerNeedsModel,
  DecisionCriteriaModel,
} from '../../../../model/DealGameTapeModel/DealGameTapeModel';

const customerNeedsTopicArray = [
  'Use Cases',
  'Pain Points',
  'KPI',
  'compelling_event',
];
const decisionCriteriaTopicArray = [
  'product',
  'pricing',
  'positioning',
  'success',
  'Competition',
];

class Container extends Component {
  constructor(props) {
    const confidence = new URLSearchParams(window.location.search).get(
      'confidence'
    );

    super(props);
    this.state = {
      isLoading: true,
      cards: {},
      cardMode: '',
      showWAWUMatchedCards: false,
      showWUMatchedCards: false,
      customerNeedsCards: [],
      decisionCriteriaCards: [],
      topicList: [],
      confidencFilter: verifySort[1],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.type !== prevProps.type) {
      this.getCards();
    }
  }

  componentDidMount() {
    this.initialLoad();
  }

  initialLoad = () => {
    this.getCards();
    this.getTopicList();
  };

  async getTopicList() {
    const response = await getAllTopicsWithoutCards();
    this.setState({ topicList: response.data });
  }

  async getCards(filterChange = false) {
    const { confidencFilter } = this.state;
    this.setState({ isLoading: true });
    const { storyId, type } = this.props;
    const { userId } = getLoggedInUser();
    let cnCards = CustomerNeedsModel.list().map((i) => i.props);
    let dcCards = DecisionCriteriaModel.list().map((i) => i.props);

    //if data is not present or confidence filter is change only then call the api
    CustomerNeedsModel.deleteAll();
    DecisionCriteriaModel.deleteAll();
    const topicList =
      type === 'customer-needs'
        ? customerNeedsTopicArray
        : decisionCriteriaTopicArray;
    const response = await getPlaybookAndNetNewCollection(
      topicList,
      'partial',
      null,
      storyId,
      userId,
      confidencFilter?.value
    );

    if (response) {
      const AllTopicCards = response.data.cards;
      // main topic is used to get the topic Id in create payload and topic is basically a sutype of that main topic, except use cases and pain points
      if (type === 'customer-needs') {
        cnCards = [
          {
            topic: 'Use Cases',
            mainTopic: 'Use Cases',
            data: this.getTopicCards(AllTopicCards, 'Use Cases'),
          },
          {
            topic: 'Pain Points',
            mainTopic: 'Pain Points',
            data: this.getTopicCards(AllTopicCards, 'Pain Points'),
          },
          {
            topic: 'KPIs',
            mainTopic: 'Economic Driver',
            data: this.getTopicCards(AllTopicCards, 'KPI'),
          },
          {
            topic: 'Triggers',
            mainTopic: 'Economic Driver',
            data: this.getTopicCards(AllTopicCards, 'compelling_event'),
          },
        ];
        new CustomerNeedsModel(cnCards).$save();
      } else {
        dcCards = [
          {
            topic: 'Product',
            mainTopic: 'Value Proposition',
            data: this.getTopicCards(AllTopicCards, 'product'),
          },
          {
            topic: 'Positioning',
            mainTopic: 'Value Proposition',
            data: this.getTopicCards(AllTopicCards, 'positioning'),
          },
          {
            topic: 'Pricing',
            mainTopic: 'Value Proposition',
            data: this.getTopicCards(AllTopicCards, 'pricing'),
          },
          {
            topic: 'Success',
            mainTopic: 'Value Proposition',
            data: this.getTopicCards(AllTopicCards, 'success'),
          },
          {
            topic: 'Competitors',
            mainTopic: 'Competitors',
            data: this.getTopicCards(AllTopicCards, 'Competition'),
          },
        ];
        new DecisionCriteriaModel(dcCards).$save();
      }
      this.setState({
        customerNeedsCards: cnCards,
        decisionCriteriaCards: dcCards,
        isLoading: false,
      });
    }
  }

  getTopicCards = (TopicCards, topicName) => {
    if (!TopicCards) return [];
    const topicCard = TopicCards?.filter((i) => i.subTopicName === topicName);
    return topicCard.length > 0
      ? topicCard.sort((a, b) => Number(a.rank) - Number(b.rank))
      : [];
  };

  handleFilterChange = (selected) => {
    const { changeFilter } = this.props;
    this.setState({ confidencFilter: selected }, () => {
      // changeFilter({ isVerifiedCards: selected });
      this.getCards(true);
    });
  };

  render() {
    const { type, storyId, goPrevious, onComplete, uiType, isVerifiedCards } =
      this.props;
    const {
      customerNeedsCards,
      decisionCriteriaCards,
      isLoading,
      topicList,
      confidencFilter,
    } = this.state;

    if (isLoading) return <Loader />;

    return (
      <React.Fragment>
        <div className="goal-dropdown-wrapper">
          Confidence Filter:
          <Select
            className="basic-single"
            classNamePrefix="select"
            options={verifySort}
            value={confidencFilter}
            onChange={this.handleFilterChange}
          />
        </div>
        {type === 'customer-needs' ? (
          <CustomerNeeds
            storyId={Number(storyId)}
            cardData={customerNeedsCards}
            reload={() => this.getCards()}
            topicList={topicList}
          />
        ) : (
          <DecisionCriteria
            storyId={storyId}
            cardData={decisionCriteriaCards}
            reload={() => this.getCards()}
            topicList={topicList}
          />
        )}
        <div className="footer">
          <button className="previous" onClick={goPrevious}>
            Previous
          </button>
          <button className="save" onClick={onComplete}>
            {uiType === 'dgt' ? 'Next' : 'Save and proceed'}
          </button>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { isVerifiedCards, performanceVerifiedCard } =
    state.marketPerformanceFilters;
  return {
    filter: {},
  };
}

function mapDispatchToProps() {
  return bindActionCreators(
    {
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Container)
);
