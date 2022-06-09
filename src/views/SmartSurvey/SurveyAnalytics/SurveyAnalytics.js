import { DataGrid } from '@material-ui/data-grid';
import { Skeleton } from '@material-ui/lab';
import filter from 'lodash.filter';
import isEqual from 'lodash.isequal';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { reload } from '../../../action/loadingActions';
import { Async } from '../../../basecomponents/async/async';
import { Loader } from '../../../basecomponents/Loader/Loader';
import {
  SELECTED_SURVEY_OPPTYS,
  SURVEY_ACTIVE_INDEX,
  SURVEY_COMPLETED_CATEGORY,
  UPDATE_MARKET_PERFORMANCE_FILTERS,
} from '../../../constants/general';
import {
  FilterClosePeriodModel,
  FilterOpptyTypeModel,
  FilterStageModel,
} from '../../../model/GlobalFilterModels/GlobalFilterModels';
import {
  getOpptyListDetailsForSolution,
  getOpptyListDetailsForSolutionForSurveyStatus,
} from '../../../util/promises/customer_analysis';
import { dispatch, ShortNumber } from '../../../util/utils';
import Header from './component/Header/Header';
import './SurveyAnalytics.style.scss';

const DEFAULT_CLASSNAME = 'survey-analytics';

const invertDirection = {
  asc: 'desc',
  desc: 'asc',
};

const typeValues = [
  // { label: 'Sent', value: 'sent' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'No activity yet', value: 'no-activity' },
  { label: 'Not Sent', value: 'not-sent' },
  // { label: 'Not Started', value: 'not-started' },
];
class SurveyAnalyticsImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      stories: [],
      currentPosts: [],
      currentPage: 1,
      postPerPage: 10,
      filteredStories: null,
      competitor: null,
      sortCriterion: null,
      columnToSort: '',
      sortDirection: '',
      pageSize: 10,
      Columns: [
        {
          field: 'id',
          headerName: 'ID',
          flex: 1,
          hide: true,
          headerClassName: 'survey-analytics-column-header',
          cellClassName: 'survey-analytics-row-cell',
        },
        {
          headerName: 'ACCOUNT',
          field: 'accountName',
          flex: 1,
          headerClassName: 'survey-analytics-column-header',
          cellClassName: 'survey-analytics-row-cell',
        },
        {
          headerName: 'INDUSTRY',
          field: 'industryName',
          flex: 1,
          headerClassName: 'survey-analytics-column-header',
          cellClassName: 'survey-analytics-row-cell',
          renderCell: (row) => {
            if (row.value.toLowerCase() === 'notmapped') return '';
            return row.value;
          },
        },
        {
          headerName: 'MARKET',
          field: 'marketValue',
          flex: 1,
          headerClassName: 'survey-analytics-column-header',
          cellClassName: 'survey-analytics-row-cell',
        },
        {
          headerName: 'STATUS',
          field: 'opportunityStatus',
          flex: 1,
          headerClassName: 'survey-analytics-column-header',
          cellClassName: 'survey-analytics-row-cell',
        },
        {
          headerName: 'PERIOD',
          field: 'dealClosed',
          flex: 0.75,
          headerClassName: 'survey-analytics-column-header',
          cellClassName: 'survey-analytics-row-cell',
          sortComparator: (v1, v2) => {
            const modifiedV1 = v1.split('-');
            const modifiedV2 = v2.split('-');

            return `${modifiedV1[1]}-${modifiedV1[0]}`.localeCompare(
              `${modifiedV2[1]}-${modifiedV2[0]}`
            );
          },
        },
        {
          headerName: 'DEAL SIZE',
          field: 'opptyAmount',
          flex: 0.75,
          headerClassName: 'survey-analytics-column-header',
          renderCell: (params) => '$ ' + ShortNumber(params.value),
          cellClassName: 'survey-analytics-row-cell',
        },
        {
          headerName: 'OWNER',
          field: 'opportunityOwner',
          flex: 1,
          headerClassName: 'survey-analytics-column-header',
          cellClassName: 'survey-analytics-row-cell',
        },
        {
          headerName: 'ACTION',
          field: 'action',
          flex: 0.75,
          headerClassName: 'survey-analytics-column-header',
          renderCell: (params) => (
            <button
              key={`btn-${params.id}`}
              className={`button`}
              onClick={() => this.hanldeSurveyAnalytics(params.row)}
            >
              Manage
            </button>
          ),
        },
      ],
      selectedTile: 'Total',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { filter } = this.props;
    if (!isEqual(filter, prevProps.filter)) {
      this.setState({ selectedTile: 'Total' });
      reload('survey-analytics-tab');
    }
    if (prevProps.cardAnalysisArray !== this.props.cardAnalysisArray) {
      this.setState({ selectedTile: 'Total' });
      reload('survey-analytics-tab');
    }
    if (!isEqual(this.state.stories, prevState.stories)) {
      this.getCurrentPosts();
    }
  }

  getPromise = () => {
    const { changeFilter, filter } = this.props;
    const {
      industry,
      segment,
      region,
      market,
      opptyStatus,
      closePeriod,
      searchString,
      crmOpptyType,
      oppty,
      showLiveOpptys,
    } = filter;
    const { sortCriterion, sortOrder, selectedTile } = this.state;
    const responseData = [];
    return new Promise((resolve, reject) => {
      const payload = {};
      if (industry !== null) payload.industryList = [industry.value];
      if (segment !== null) payload.marketList = [segment.value];
      if (region !== null) payload.regionList = [region.value];
      if (market !== null) payload.solutionId = market.value;
      if (sortCriterion !== null) payload.sortCriterion = sortCriterion;
      if (sortOrder !== null) payload.sortOrder = sortOrder;
      if (opptyStatus != null) payload.opptyStatus = opptyStatus.value;
      if (crmOpptyType != null) payload.crmOpptyType = crmOpptyType.value;
      if (closePeriod != null) payload.closePeriod = closePeriod.value;
      if (searchString !== null) payload.searchString = searchString;
      if (showLiveOpptys === 'Y') payload.isOpenOppty = oppty?.value;
      let opptyListPromise;
      if (opptyStatus && crmOpptyType) {
        if (selectedTile !== 'Total') {
          const foundValue = typeValues.find((i) => i.label === selectedTile);
          payload.surveyStatus = foundValue ? foundValue.value : '';
          opptyListPromise =
            getOpptyListDetailsForSolutionForSurveyStatus(payload);
        } else {
          opptyListPromise = getOpptyListDetailsForSolution(payload);
        }
        opptyListPromise.then((response) => {
          const stories =
            response &&
            response.data.map((story) => ({
              ...story,
              accountName: story.accountName.trim(),
              likes: 12,
              Owner: 'John doe',
              statusDeal: this.renderStatus(story.isWon, story.isClosed),
              dealClosed: `${story.closeQuarter}-${story.closeYear}`,
              marketValue: this.filterNullMarket(story.market),
            }));
          responseData.push(stories); // load stories
          resolve({ data: responseData });
        });
      }
    });
  };

  loadData = (response) => {
    const { stories } = this.state;
    const newstories = response && response[0] ? response[0] : stories;
    this.setState({ stories: newstories }, () =>
      reload('survey-analytics-header')
    );
  };

  handleSelectedTile = (type) => {
    this.setState({ selectedTile: type });
    reload('survey-analytics-tab');
  };

  handleSurveyAnalytics = (story) => {
    const { history } = this.props;
    if (story.storyId) {
      history.push(`/manage-survey/${story.storyId}/${story.opptyId}`);
      dispatch({
        type: SURVEY_ACTIVE_INDEX,
        payload: null,
      });
      dispatch({
        type: SURVEY_COMPLETED_CATEGORY,
        payload: null,
      });
    } else {
      window.open(`#/newdealSummary/${story.opptyPlanId}/summary/all`, '_self');
    }
  };

  renderStatus = (isWon, isClosed) => {
    if (isClosed !== 'Y') {
      return 'Live';
    }
    if (isWon === 'Y') {
      return 'Won';
    }
    return 'Loss';
  };

  hanldeSurveyAnalytics = (story) => {
    const { history } = this.props;
    if (story.storyId) {
      history.push(`manage-survey/${story.storyId}/${story.opptyId}`);
      dispatch({
        type: SURVEY_ACTIVE_INDEX,
        payload: null,
      });
      dispatch({
        type: SURVEY_COMPLETED_CATEGORY,
        payload: null,
      });
    } else {
      window.open(`newdealSummary/${story.opptyPlanId}/summary/all`, '_self');
    }
  };

  filterNullMarket = (market) => {
    return market === null ? '' : market;
  };

  getCurrentPosts = (inputStories = []) => {
    const storiesToFilter =
      inputStories.length > 0 ? inputStories : this.state.stories;
    this.setState({ currentPosts: storiesToFilter, isLoading: false });
  };

  handlePageSizeChange = (params) => {
    this.setState({ pageSize: params.pageSize });
  };

  renderContent = () => {
    const { currentPosts, isLoading, Columns, pageSize } = this.state;
    const rows = currentPosts.map((post) => ({
      ...post,
      id: post.storyId,
    }));

    return (
      <div className={`${DEFAULT_CLASSNAME}-table`}>
        {!isLoading ? (
          <DataGrid
            rows={rows}
            columns={Columns}
            className={'analytics-table'}
            pageSize={pageSize}
            onPageSizeChange={this.handlePageSizeChange}
            pagination
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
          />
        ) : (
          <Loader />
        )}
      </div>
    );
  };

  renderShimmer = () => {
    const rows = [];
    for (let i = 0; i < 15; i++) {
      rows.push(<Skeleton variant="text" />);
    }
    return (
      <div>
        <div className={`${DEFAULT_CLASSNAME}-table mt-4`}>{rows}</div>
      </div>
    );
  };

  render() {
    const { stories, selectedTile } = this.state;
    const { opptyTypesList, closePeriodList, stageList } = this.props;

    return (
      <div className={DEFAULT_CLASSNAME}>
        <Header
          handleSelectedTile={this.handleSelectedTile}
          selectedTile={selectedTile}
          opptyStatusList={stageList}
          opptyTypeList={opptyTypesList}
          stories={stories}
          closePeriodOptions={closePeriodList}
        />
        <Async
          identifier="survey-analytics-tab"
          promise={this.getPromise}
          content={this.renderContent}
          handlePromiseResponse={this.loadData}
          loader={this.renderShimmer}
          error={<div>Error...</div>}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    industry,
    segment,
    market,
    region,
    searchString,
    closeDate,
    opptyStatus,
    opptyType,
    oppty,
    showLiveOpptys,
  } = state.marketPerformanceFilters;
  return {
    cardAnalysisArray: state.marketAnalysisReducer.AnalyzeCards,
    filter: {
      industry,
      segment,
      region,
      market,
      opptyStatus,
      closePeriod: closeDate,
      searchString,
      crmOpptyType: opptyType,
      oppty,
      showLiveOpptys,
    },
    stageList: FilterStageModel.list().map((item) => item.props),
    opptyTypesList: FilterOpptyTypeModel.list().map((item) => item.props),
    closePeriodList: FilterClosePeriodModel.list().map((item) => item.props),
  };
}

function mapDispatchToProps() {
  return bindActionCreators(
    {
      saveSelectedOpptys: (opptyArray) => {
        return dispatch({
          type: SELECTED_SURVEY_OPPTYS,
          payload: opptyArray,
        });
      },
      removeAllOpptys: () =>
        dispatch({
          type: SELECTED_SURVEY_OPPTYS,
          payload: [],
        }),
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SurveyAnalyticsImpl)
);
