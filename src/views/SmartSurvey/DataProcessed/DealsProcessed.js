import { Skeleton } from '@material-ui/lab';
import { isEqual } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { reload, setLoading, setSuccess } from '../../../action/loadingActions';
import { Async } from '../../../basecomponents/async/async';
import {
  SELECTED_SURVEY_OPPTYS,
  UPDATE_MARKET_PERFORMANCE_FILTERS,
} from '../../../constants/general';
import { DataGrid } from '@material-ui/data-grid';
import { Tooltip } from '@material-ui/core';
import {
  getAnalyticsForStories,
  getOpptyListDetailsForSolution,
} from '../../../util/promises/customer_analysis';
import { dispatch, ShortNumber } from '../../../util/utils';
import Header from './components/Header/Header';
import './DealsProcessed.style.scss';

const DEFAULT_CLASSNAME = 'survey-data-processed';

class DealsProcessedImpl extends Component {
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
      selectedTile: 'Total',
      opptyStatusList: [],
      dataProcessedList: [],
      columns: [
        {
          headerName: 'Account',
          field: 'accountName',
          flex: 2,
          renderCell: (params) => (
            <Tooltip title={params.value}>
              <span>{params.value}</span>
            </Tooltip>
          ),
          headerClassName: `${DEFAULT_CLASSNAME}-header`,
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'Oppty Name',
          field: 'opportunityName',
          flex: 1.5,
          headerClassName: `${DEFAULT_CLASSNAME}-header`,
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'Amount',
          field: 'opportunityAmount',
          flex: 1,
          headerClassName: `${DEFAULT_CLASSNAME}-header`,
          cellClassName: 'fresh-stories-row-cell',
          renderCell: (params) => '$ ' + (ShortNumber(params.value) || 0),
        },
        {
          headerName: 'Stage',
          field: 'opportunityStatus',
          flex: 1,
          headerClassName: `${DEFAULT_CLASSNAME}-header`,
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'Calls',
          field: 'callCount',
          flex: 1,
          headerClassName: `${DEFAULT_CLASSNAME}-header`,
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'Emails',
          field: 'emailCount',
          flex: 1,
          headerClassName: `${DEFAULT_CLASSNAME}-header`,
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'Surveys',
          field: 'surveyCount',
          flex: 1,
          headerClassName: `${DEFAULT_CLASSNAME}-header`,
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'Docs',
          field: 'documentCount',
          flex: 1,
          headerClassName: `${DEFAULT_CLASSNAME}-header`,
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: ' ',
          field: 'action',
          flex: 0.75,
          headerClassName: `${DEFAULT_CLASSNAME}-header`,
          renderCell: (params) => (
            <button
              key={`btn-${params.id}`}
              className={`button`}
              onClick={() => this.handleDealSummaryNav(params.row)}
            >
              View
            </button>
          ),
        },
      ],
    };
  }

  componentDidUpdate(prevProps) {
    const { filter } = this.props;
    if (!isEqual(filter, prevProps.filter)) {
      this.getPromise().then((res) => {
        this.loadData(res.data);
      });
    }
  }

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

  handleDealSummaryNav = (story) => {
    this.props.history.push(
      `/dealgametape/storyId/${story.storyId}/opptyId/${story?.opportunityId}`
    );
  };

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
    const responseData = [];
    return new Promise((resolve, reject) => {
      this.setState({ isLoading: true });
      const payload = {};
      if (industry !== null) payload.industryList = [industry.value];
      if (segment !== null) payload.marketList = [segment.value];
      if (region !== null) payload.regionList = [region.value];
      if (market !== null) payload.solutionId = market.value;
      if (opptyStatus != null) payload.opptyStatus = opptyStatus.value;
      if (crmOpptyType != null) payload.crmOpptyType = crmOpptyType.value;
      if (closePeriod != null) payload.closePeriod = closePeriod.value;
      if (searchString !== null) payload.searchString = searchString;
      if (showLiveOpptys === 'Y') payload.isOpenOppty = oppty?.value;
      let opptyListPromise;
      if (opptyStatus && crmOpptyType) {
        try {
          opptyListPromise = getOpptyListDetailsForSolution(payload);
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
        } catch (e) {
          reject(e);
        }
      }
    });
  };

  loadData = (response) => {
    setLoading('survey-analytics-tab');
    const { opptyStatusList } = this.state;
    const stories = response && response[0] ? response[0] : opptyStatusList;
    const storyIdList = stories.reduce(
      (memo, curr) => [...memo, curr.storyId],
      []
    );
    this.setState({ storyIdList }, () => this.getDealsAnalytics(storyIdList));
  };

  getDealsAnalytics = async (storyIdList) => {
    try {
      const response = await getAnalyticsForStories(storyIdList);
      this.setState({
        dataProcessedList: response.data?.analyticsCountBeans || [],
        isLoading: false,
      });
      setSuccess('survey-analytics-tab');
    } catch (error) {
      console.error(error);
    }
  };

  renderContent = () => {
    const { dataProcessedList, columns, isLoading } = this.state;
    const modifiedDataProcessedList = dataProcessedList.map((data) => ({
      ...data,
      id: data.storyId,
    }));

    return (
      <React.Fragment>
        <Header storyIdList={modifiedDataProcessedList} />
        {isLoading ? this.renderShimmer() : <div className={`${DEFAULT_CLASSNAME}-table`}>
          <DataGrid
            rows={modifiedDataProcessedList}
            columns={columns}
            loading={isLoading}
            className={'survey-data-processed-grid'}
          />
        </div>}        
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
        <div className={`${DEFAULT_CLASSNAME}-table mt-4`}>{rows}</div>
      </div>
    );
  };

  render() {
    return (
      <Async
        identifier="survey-analytics-tab"
        promise={this.getPromise}
        content={this.renderContent}
        handlePromiseResponse={this.loadData}
        loader={this.renderShimmer}
        error={<div>Error...</div>}
      />
    );
  }
}

function mapStateToProps(state) {
  const {
    industry,
    segment,
    market,
    region,
    opptyStatus,
    closeDate,
    tabData,
    searchString,
    opptyType,
    oppty,
    showLiveOpptys,
  } = state.marketPerformanceFilters;
  return {
    filter: {
      industry,
      segment,
      region,
      market,
      closePeriod: closeDate,
      opptyStatus,
      tabData,
      searchString,
      crmOpptyType: opptyType,
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
  connect(mapStateToProps, mapDispatchToProps)(DealsProcessedImpl)
);
