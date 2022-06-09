import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import isEqual from 'lodash.isequal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './SurveyAnalytics.style.scss';
import { Loader } from '../../../basecomponents/Loader/Loader';
import { closePeriodOptions } from '../../CustomerAnalytics/util/Util';
import { DataGrid } from '@material-ui/data-grid';

import {
  getOpptyListDetailsForSolution,
  getOpptyListDetailsForSolutionForSurveyStatus,
  getStageDropdownLabels,
} from '../../../util/promises/customer_analysis';
import {
  SELECTED_SURVEY_OPPTYS,
  SURVEY_ACTIVE_INDEX,
  SURVEY_COMPLETED_CATEGORY,
  UPDATE_MARKET_PERFORMANCE_FILTERS,
} from '../../../constants/general';
import PaginationManage from '../../../components/PaginationManage/PaginationManage';
import Header from './component/Header/Header';
import { getSurveyStats } from '../../../util/promises/smart-survey';
import { dispatch, ShortNumber } from '../../../util/utils';
import StoryTable from '../../../components/StoryTable/StoryTable';
import { Async } from '../../../basecomponents/async/async';
import { reload } from '../../../action/loadingActions';
import { Skeleton } from '@material-ui/lab';
import { Button } from '@material-ui/core';

const DEFAULT_CLASSNAME = 'survey-analytics';

const invertDirection = {
  asc: 'desc',
  desc: 'asc',
};

const typeValues = [
  { label: 'Sent', value: 'sent' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'No activity yet', value: 'no-activity' },
  { label: 'Not Sent', value: 'not-sent' },
  { label: 'Not Started', value: 'not-started' },
];
class SurveyTableImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
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
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'ACCOUNT',
          field: 'accountName',
          flex: 1,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'INDUSTRY',
          field: 'industryName',
          flex: 1,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'MARKET',
          field: 'marketValue',
          flex: 1,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'CLOSE STATUS',
          field: 'opportunityStatus',
          flex: 1,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'CLOSE PERIOD',
          field: 'dealClosed',
          flex: 0.75,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'DEAL SIZE',
          field: 'opptyAmount',
          flex: 0.75,
          headerClassName: 'fresh-stories-column-header',
          renderCell: (params) => '$ ' + ShortNumber(params.value),
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'OPPORTUNITY OWNER',
          field: 'opportunityOwner',
          flex: 1,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'ACTION',
          field: 'action',
          flex: 0.75,
          headerClassName: 'fresh-stories-column-header',
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
      opptyStatusList: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { filter } = this.props;
    if (!isEqual(filter, prevProps.filter)) {
      reload('survey-analytics-tab');
    }
    // if (!isEqual(searchString, prevProps.searchString)) {
    //     this.filterStories();
    // }
    if (prevProps.cardAnalysisArray !== this.props.cardAnalysisArray) {
      reload('survey-analytics-tab');
    }
  }

  // componentDidMount() {
  //   this.loadOpptyAndClosedPeriodStatus();
  // }

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
      showLiveOpptys,
      oppty,
    } = filter;
    const { sortCriterion, sortOrder, selectedTile } = this.state;
    const responseData = [];
    return new Promise((resolve, reject) => {
      getStageDropdownLabels()
        .then((response) => {
          const opptyStatusList = response
            ? response.data.map((i) => ({
                ...i,
                value: i.picklistValue,
                label: i.picklistLabel,
                floatingLabel: 'STAGE',
              }))
            : [];
          if (!opptyStatus) {
            changeFilter({
              smartSurveyOpptystatus: opptyStatusList.find(
                (status) => status.defaultFlag
              ),
              smartSurveyClosedDate:
                filter.closePeriod || closePeriodOptions[1],
            });
          }
          responseData.push(opptyStatusList); //load opptyStatus
          const payload = {};
          if (industry !== null) payload.industryList = [industry.value];
          if (segment !== null) payload.marketList = [segment.value];
          if (region !== null) payload.regionList = [region.value];
          if (market !== null) payload.solutionId = market.value;
          if (sortCriterion !== null) payload.sortCriterion = sortCriterion;
          if (sortOrder !== null) payload.sortOrder = sortOrder;
          if (opptyStatus != null) payload.opptyStatus = opptyStatus.value;
          if (closePeriod != null) payload.closePeriod = closePeriod.value;
          if (searchString !== null) payload.searchString = searchString;
          let opptyListPromise;
          if (opptyStatus) {
            if (selectedTile !== 'Total') {
              const foundValue = typeValues.find(
                (i) => i.label === selectedTile
              );
              payload.surveyStatus = foundValue ? foundValue.value : '';
              opptyListPromise =
                getOpptyListDetailsForSolutionForSurveyStatus(payload);
            } else {
              if (showLiveOpptys === 'Y') payload.isOpenOppty = oppty?.value;
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
        })
        .catch(() => reject());
    });
  };

  filterStories = () => {
    const { searchString } = this.props;
    const { stories } = this.state;
    let filteredStories = [];
    if (searchString) {
      const serachregex = new RegExp(searchString, 'gi');
      filteredStories = stories.filter((i) => i.accountName.match(serachregex));
      this.getCurrentPosts(filteredStories);
    } else {
      reload('survey-analytics-tab');
    }
  };

  loadData = (response) => {
    const { opptyStatusList, stories } = this.state;
    const opptystatus = response && response[0] ? response[0] : opptyStatusList;
    const newstories = response && response[1] ? response[1] : stories;
    this.setState({ opptyStatusList: opptystatus, stories: newstories }, () => {
      this.getCurrentPosts();
    });
  };

  handleSelectedTile = (type) => {
    this.setState({ selectedTile: type });
    if (type === 'Total') {
      reload('survey-analytics-tab');
    }
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

  sortData = (columnName) => {
    const { stories } = this.state;
    const direction =
      this.state.columnToSort === columnName
        ? invertDirection[this.state.sortDirection]
        : 'asc';
    const newSortData = [...stories];
    if (columnName === 'dealClosed') {
      newSortData.sort(this.fiscalSortData(columnName, direction));
    } else {
      newSortData.sort(this.alphabeticalSort(columnName, direction));
    }
    this.setState(
      {
        stories: newSortData,
        columnToSort: columnName,
        sortDirection: direction,
        isLoading: true,
      },
      () => this.getCurrentPosts()
    );
  };

  fiscalSortData = (columnName, sortDirection) => {
    const comparer = (a, b) => {
      const first = a[columnName].split('-')[1] + a[columnName].split('-')[0];
      const second = b[columnName].split('-')[1] + b[columnName].split('-')[0];
      if (sortDirection === 'asc') {
        return first > second ? 1 : -1;
      }
      return first > second ? -1 : 1;
    };

    return comparer;
  };

  alphabeticalSort = (columnName, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'asc') {
        return a[columnName] > b[columnName] ? 1 : -1;
      }
      return a[columnName] > b[columnName] ? -1 : 1;
    };
    return comparer;
  };

  getCurrentPosts = (inputStories = []) => {
    const storiesToFilter =
      inputStories.length > 0 ? inputStories : this.state.stories;
    const indexOfLastPost = this.state.currentPage * this.state.postPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postPerPage;
    const currentPosts = storiesToFilter
      ? storiesToFilter.slice(indexOfFirstPost, indexOfLastPost)
      : [];
    this.setState({ currentPosts, isLoading: false });
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber, isLoading: true }, () => {
      this.getCurrentPosts();
    });
  };

  renderPage = () => {
    const { postPerPage, stories, currentPage } = this.state;
    return (
      <PaginationManage
        postPerPage={postPerPage}
        totalPost={stories.length}
        paginate={this.paginate}
        currentPage={currentPage}
      />
    );
  };

  handlePageSizeChange = (params) => {
    this.setState({ pageSize: params.pageSize });
  };

  renderContent = () => {
    const {
      currentPosts,
      isLoading,
      stories,
      sortDirection,
      surveyStats,
      Columns,
      selectedTile,
      opptyStatusList,
      pageSize,
    } = this.state;
    const rows = currentPosts.map((post) => ({
      ...post,
      id: post.accountId,
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
        <div
          className="my-1 d-flex justify-content-between"
          style={{ width: '800px' }}
        >
          <Skeleton variant="rect" width={110} height={70} />
          <Skeleton variant="rect" width={110} height={70} />
          <Skeleton variant="rect" width={110} height={70} />
          <Skeleton variant="rect" width={110} height={70} />
          <Skeleton variant="rect" width={110} height={70} />
          <Skeleton variant="rect" width={110} height={70} />
        </div>
        <div className={`${DEFAULT_CLASSNAME}-table mt-4`}>{rows}</div>
      </div>
    );
  };

  render() {
    const {
      currentPosts,
      isLoading,
      stories,
      sortDirection,
      surveyStats,
      Columns,
      selectedTile,
      opptyStatusList,
      pageSize,
    } = this.state;
    return (
      <div className={DEFAULT_CLASSNAME}>
        <Header
          surveyStats={surveyStats}
          isLoading={isLoading}
          handleSelectedTile={this.handleSelectedTile}
          selectedTile={selectedTile}
          opptyStatusList={opptyStatusList}
          stories={stories}
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
      opptyStatus: opptyStatus,
      closePeriod: closeDate,
      searchString,
      oppty,
      showLiveOpptys,
    },
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
  connect(mapStateToProps, mapDispatchToProps)(SurveyTableImpl)
);
