import { DataGrid } from '@material-ui/data-grid';
import { Skeleton } from '@material-ui/lab';
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { reload } from '../../../action/loadingActions';
import { Async } from '../../../basecomponents/async/async';
import PaginationManage from '../../../components/PaginationManage/PaginationManage';
import {
  SURVEY_ACTIVE_INDEX,
  SURVEY_COMPLETED_CATEGORY,
  UPDATE_MARKET_PERFORMANCE_FILTERS,
} from '../../../constants/general';
import {
  getOpptyListDetailsForSolution,
  getOpptyListMetricsForExecutiveDashBoard,
} from '../../../util/promises/customer_analysis';
import { dispatch, ShortNumber } from '../../../util/utils';
import KeyHighlightFilters from './component/KeyHighlightFilters/KeyHighlightFilters';
import StoryMetrics from './component/StoryMetrics';
import './KeyHighlights.style.scss';

const DEFAULT_CLASSNAME = 'Key-highlights';

const invertDirection = {
  asc: 'desc',
  desc: 'asc',
};

class KeyHighlights extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [],
      isLoading: false,
      currentPosts: [],
      currentPage: 1,
      postPerPage: 10,
      filteredStories: null,
      competitor: null,
      sortCriterion: null,
      columnToSort: '',
      storyStats: null,
      sortDirection: '',
      isStatsLoading: true,
      isDataLoading: false,
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
          renderCell: (row) => {
            if (row.value.toLowerCase() === 'notmapped') return '';
            return row.value;
          },
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
              View
            </button>
          ),
        },
      ],
    };
  }

  componentDidUpdate(prevProps) {
    const { filter, searchString } = this.props;
    if (!isEqual(omit(filter, 'oppty'), omit(prevProps.filter, 'oppty'))) {
      reload('key-highlights');
    }
  }

  getPromise = () => {
    const responseData = [];
    return new Promise(async (resolve, reject) => {
      try {
        const {
          industry,
          segment,
          region,
          market,
          opptyStatus,
          closePeriod,
          searchString,
          opptyType,
          oppty,
          showLiveOpptys,
        } = this.props.filter;
        const { sortCriterion, sortOrder } = this.state;
        let stories = [];
        let statsRepsonse = [];
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
        if (opptyType !== null) payload.crmOpptyType = opptyType.value;
        if (showLiveOpptys === 'Y') payload.isOpenOppty = oppty?.value;
        if (closePeriod && closePeriod && payload.solutionId) {
          this.setState({ isDataLoading: true });
          const Opptyresponse = await getOpptyListDetailsForSolution(payload);
          stories =
            Opptyresponse &&
            Opptyresponse.data.map((story) => ({
              ...story,
              accountName: story.accountName.trim(),
              likes: 12,
              Owner: story.opportunityOwner,
              statusDeal: this.renderStatus(story.isWon, story.isClosed),
              dealClosed: `${story.closeQuarter}-${story.closeYear}`,
              marketValue: this.filterNullMarket(story.market),
            }));
          statsRepsonse = await getOpptyListMetricsForExecutiveDashBoard(
            payload
          );
        }
        const storyStats = statsRepsonse.data ? statsRepsonse.data : null;
        responseData.push(stories);
        responseData.push(storyStats);
        if (payload.solutionId) this.setState({ isDataLoading: false });
        resolve({ data: responseData });
      } catch (e) {
        reject(e);
      }
    });
  };

  loadData = (response) => {
    const stories = response && response[0] ? response[0] : [];
    const storyStats = response && response[1] ? response[1] : [];
    this.setState({ stories, storyStats });
    this.getCurrentPosts();
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
      reload('key-highlights');
    }
  };

  handleSelectedTile = (type) => {
    this.setState({ selectedTile: type });
    if (type === 'Total') {
      reload('key-highlights');
    }
    this.loadData(type);
  };

  hanldeSurveyAnalytics = (story) => {
    const { history } = this.props;
    if (story.storyId) {
      history.push(
        `dealgametape/storyId/${story.storyId}/opptyId/${story.opptyId}`
      );
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

  renderStatus = (isWon, isClosed) => {
    if (isClosed !== 'Y') {
      return 'Live';
    }
    if (isWon === 'Y') {
      return 'Won';
    }
    return 'Loss';
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
    this.setState({ currentPosts: storiesToFilter, isLoading: false });
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

  renderStatus = (storyStats) => {
    return (
      <div className={`${DEFAULT_CLASSNAME}-metrics`}>
        <StoryMetrics
          stats={
            storyStats && storyStats.totalAmount ? storyStats.totalAmount : 0
          }
          type="Amount"
        />
        <StoryMetrics
          stats={
            storyStats && storyStats.totalNumberOfOpptys
              ? storyStats.totalNumberOfOpptys
              : 0
          }
          type="Opptys"
        />
        <StoryMetrics
          stats={
            storyStats && storyStats.avgDealSize ? storyStats.avgDealSize : 0
          }
          type="Deal Size"
        />
        <StoryMetrics
          stats={
            storyStats && storyStats.avgSalesCycleDays
              ? storyStats.avgSalesCycleDays
              : 0
          }
          type="Sales Cycle"
        />
      </div>
    );
  };

  handlePageSizeChange = (params) => {
    this.setState({ pageSize: params.pageSize });
  };

  renderContent = () => {
    const {
      currentPosts,
      isLoading,
      Columns,
      storyStats,
      pageSize,
      isDataLoading,
    } = this.state;
    const rows = currentPosts.map((post) => ({
      ...post,
      id: post.storyId,
    }));

    if (isDataLoading) return this.renderShimmer();

    return (
      <React.Fragment>
        {this.renderStatus(storyStats)}
        <div className={`${DEFAULT_CLASSNAME}-table`}>
          {!isLoading ? (
            <DataGrid
              rows={rows}
              columns={Columns}
              className={'key-highlights-table'}
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
      </React.Fragment>
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
          style={{ width: '100%' }}
        >
          <Skeleton variant="rect" width={340} height={150} />
          <Skeleton variant="rect" width={340} height={150} />
          <Skeleton variant="rect" width={340} height={150} />
          <Skeleton variant="rect" width={340} height={150} />
        </div>
        <div className={`${DEFAULT_CLASSNAME}-table mt-4`}>{rows}</div>
      </div>
    );
  };

  render() {
    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        <KeyHighlightFilters />
        <Async
          identifier="key-highlights"
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
    opptyStatus,
    closeDate,
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
      opptyType,
      oppty,
      showLiveOpptys,
    },
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
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(KeyHighlights)
);
