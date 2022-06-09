import { NavLink } from 'react-router-dom';
import {
  UPDATE_MARKET_PERFORMANCE_FILTERS,
  RESET_MARKET_PERFORMANCE_FILTERS,
} from '../constants/general';
import { opptyOptions } from '../views/CustomerAnalytics/Filters/util';
import { testCardsOptions } from '../views/CustomerAnalytics/util/Util';

const initialState = {
  market: null,
  defaultMarket: null,
  localChangedMarket: null,
  industry: null,
  segment: null,
  region: null,
  oppty: opptyOptions[1],
  localOppty: opptyOptions[1],
  performanceOpptystatus: null,
  performanceCompetitor: null,
  performanceClosePeriod: null,
  performanceSortCriteria: null,
  performanceMetrics: null,
  buyingClosePeriod: null,
  buyingOpptystatus: null,
  buyingCompetitorId: null,
  buyingSort: null,
  bjiOpptyType: null,
  compOpptystatus: null,
  compSort: null,
  compCompetitor: null,
  compClosePeriod: null,
  searchString: null,
  isVerifiedCards: null,
  selectedPlaybook: null,
  smartSurveyOpptystatus: null,
  smartSurveyClosedDate: null,
  smartCrmOpptyType: null,
  executiveOpptystatus: null,
  executiveClosedDate: null,
  executiveNeedOpptyStatus: null,
  executiveNeedClosedDate: null,
  executiveNeedTopicName: null,
  dataProcessedClosePeriod: null,
  dataProcessedOpptyStatus: null,
  dealsProcessedCrmOpptyType: null,
  sortBy: 'asc',
  toggleInsightsKeyowrds: 'keyword',
  dealOpptyStatus: null,
  dealCompetitor: null,
  dealClosePeriod: null,
  dealMatched: null,
  dealSurveyStatus: null,
  keywordOpptyStatus: null,
  keywordClosePeriod: null,
  storyList: null,
  performanceOpptyType: null,
  dealGameTapeOpptyType: null,
  executiveOpptyType: null,
  date: null,
  showDate: true,
  opptyType: null,
  opptyStatus: null,
  closeDate: null,
  verifiedCard: null,
  isDataLoading: false,
  isTestCard: testCardsOptions[0],
  isTestCardBJI: testCardsOptions[0],
  wait: false,
  showLiveOpptys: 'N',
};

const getInitialState = () => {
  try {
    if (sessionStorage.getItem('state')) {
      return JSON.parse(sessionStorage.getItem('state'))
        .marketPerformanceFilters;
    } else {
      return { ...initialState };
    }
  } catch (error) {
    return { ...initialState };
  }
};
function marketPerformanceFiltersReducer(state = getInitialState(), action) {
  switch (action.type) {
    case UPDATE_MARKET_PERFORMANCE_FILTERS:
      return Object.assign({}, state, { ...action.payload });
    case RESET_MARKET_PERFORMANCE_FILTERS:
      return initialState;
    default:
      return state;
  }
}

export default marketPerformanceFiltersReducer;
