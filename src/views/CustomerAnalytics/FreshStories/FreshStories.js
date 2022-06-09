/* eslint-disable object-curly-newline */
import { DataGrid } from '@material-ui/data-grid';
import Skeleton from '@material-ui/lab/Skeleton';
import isEqual from 'lodash.isequal';
import sortBy from 'lodash.sortby';
import { PropTypes } from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import { bindActionCreators } from 'redux';
import { reload } from '../../../action/loadingActions';
import { Checkbox, Tooltip } from '@material-ui/core';
import { Async } from '../../../basecomponents/async/async';
import { showCustomModal } from '../../../components/CustomModal/CustomModal';
import { showAlert } from '../../../components/MessageModal/MessageModal';
import {
  SELECTED_SURVEY_OPPTYS,
  SURVEY_ACTIVE_INDEX,
  SURVEY_COMPLETED_CATEGORY,
  UPDATE_MARKET_PERFORMANCE_FILTERS,
} from '../../../constants/general';
import {
  FilterClosePeriodModel,
  FilterIndustryModel,
  FilterOpptyTypeModel,
  FilterStageModel,
} from '../../../model/GlobalFilterModels/GlobalFilterModels';
import {
  getOpptyListDetailsForSolution,
  sendSurveyLinksForMultipleOpptys,
} from '../../../util/promises/customer_analysis';
import { addAccountIndustryToOverrideList } from '../../../util/promises/meta-data-promise';
import {
  getCompetitorCardsList,
  updateDomain,
} from '../../../util/promises/playbooks_promise';
import { dispatch, isValidDomain, ShortNumber } from '../../../util/utils';
import { MatchesOptions, SurveysOptions } from '../util/Util';
import SendLink from './components/SendLink/SendLink';
import './FreshStories.style.scss';
import filter from 'lodash.filter';
import { IndeterminateCheckBox } from '@material-ui/icons';
import omit from 'lodash.omit';

const DEFAULT_CLASSNAME = 'fresh-stories';

const invertDirection = {
  asc: 'desc',
  desc: 'asc',
};

const RenderIndustrySelect = ({ id, value, api, field, industryList, row }) => {
  const optionGenerator = (data, key, value) => {
    const newArray = sortBy(data, (a) => a.name);
    return newArray.map((i) => ({
      value: i[key],
      label: i[value],
      accountId: row.accountId,
      industryId: i[key],
    }));
  };

  const handleChange = (value, event) => {
    api.setEditCellValue(
      {
        id,
        field,
        value: value.label,
        industryId: value.value,
        accountId: row.accountId,
      },
      event
    );
    api.commitCellChange({
      id,
      field,
      industryId: value.value,
      accountId: row.accountId,
    });
    api.setCellMode(id, field, 'view');
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      {industryList.length > 0 && (
        <Select
          className="single-industry"
          classNamePrefix="select"
          options={optionGenerator(industryList, 'qualifierId', 'value')}
          closeMenuOnSelect
          onChange={handleChange}
        />
      )}
    </div>
  );
};

class FreshStories extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      stories: null,
      currentPosts: [],
      currentPage: 0,
      postPerPage: 10,
      pageSize: 10,
      filteredStories: null,
      competitor: null,
      isSurveySent: false,
      totalSurveysent: 0,
      sortCriterion: null,
      sortOrder: null,
      opptyStatus: null,
      columnToSort: '',
      sortDirection: '',
      competitorData: [],
      ids: [],
      Columns: [
        {
          field: 'test',
          flex: 0.5,
          headerClassName: 'checkbox-header',
          cellClassName: 'checkbox-cell',
          sortable: false,
          renderHeader: (params) => {
            if (this.checkForIdExist() && this.getCurrentRows().length > 0)
              return (
                <Checkbox
                  checked={true}
                  className="checkbox-checked"
                  onClick={this.clear}
                />
              );
            else if (this.checkForIdExist(false))
              return (
                <IndeterminateCheckBox
                  className="checkbox-remove-icon"
                  onClick={this.clear}
                />
              );
            else return <Checkbox onClick={this.addAll} checked={false} />;
          },
          renderCell: (params) => {
            const checked = this.state.ids.includes(
              `${params.row.opptyId}-${params.row.storyId}`
            );
            return (
              <Checkbox
                className={checked ? 'checkbox-checked' : ''}
                checked={checked}
                onChange={(e) => this.checkBox(e, params)}
              />
            );
          },
        },
        {
          field: 'id',
          headerName: 'ID',
          flex: 10,
          hide: true,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'ACCOUNT',
          field: 'accountName',
          flex: 1,
          headerClassName: 'fresh-stories-column-header',
          renderCell: (params) => (
            <Tooltip title={params.value}>
              <span>{params.value}</span>
            </Tooltip>
          ),
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'DOMAIN',
          field: 'domainNames',
          flex: 1,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
          editable: true,
        },
        {
          headerName: 'INDUSTRY',
          field: 'industryName',
          flex: 1.7,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'industry',
          editable: true,
          renderCell: (row) => {
            if (row.value?.toLowerCase() === 'notmapped') return '';
            return row.value;
          },
          renderEditCell: (params) => (
            <RenderIndustrySelect
              {...params}
              industryList={
                this.props.industryList ? this.props.industryList : []
              }
            />
          ),
        },
        {
          headerName: 'MARKET',
          field: 'marketValue',
          flex: 1,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'STAGE',
          field: 'opportunityStatus',
          flex: 1,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'PERIOD',
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
          headerName: 'OWNER',
          field: 'opportunityOwner',
          flex: 1,
          headerClassName: 'fresh-stories-column-header',
          cellClassName: 'fresh-stories-row-cell',
        },
        {
          headerName: 'ACTION',
          field: 'action',
          flex: 0.75,
          headerClassName: 'fresh-stories-column-header action-cell',
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

  checkForIdExist = (isAll = true) => {
    const currentRows = this.getCurrentRows().map(
      (t) => `${t.opptyId}-${t.storyId}`
    );
    const { ids } = this.state;
    if (isAll) return currentRows.every((id) => ids.includes(id));
    else return currentRows.some((id) => ids.includes(id));
  };

  clear = () => {
    const current = this.getCurrentRows().map(
      (t) => `${t.opptyId}-${t.storyId}`
    );
    const removedIds = this.state.ids.filter((t) => {
      return !current.includes(t);
    });
    this.setState({ ids: removedIds }, () => {
      this.props.saveSelectedOpptys(removedIds);
    });
  };

  addAll = () => {
    const data = [
      ...this.state.ids,
      ...this.getCurrentRows().map((t) => `${t.opptyId}-${t.storyId}`),
    ];
    this.setState({ ids: data }, () => {
      this.props.saveSelectedOpptys(data);
    });
  };

  checkBox = (e, params) => {
    if (e.target.checked) {
      const data = [
        ...this.state.ids,
        `${params.row.opptyId}-${params.row.storyId}`,
      ];
      this.setState({ ids: data }, () => {
        this.props.saveSelectedOpptys(data);
      });
    } else {
      const data = [
        ...this.state.ids.filter(
          (id) => id !== `${params.row.opptyId}-${params.row.storyId}`
        ),
      ];
      this.setState({ ids: data }, () => {
        this.props.saveSelectedOpptys(data);
      });
    }
  };

  getCurrentRows = () => {
    const { currentPosts, currentPage, pageSize } = this.state;
    return currentPosts.slice(
      pageSize * currentPage,
      currentPage * pageSize + pageSize
    );
  };

  componentDidUpdate(prevProps) {
    const {
      filter,
      searchString,
      market,
      stageList,
      opptyTypesList,
      closePeriodList,
    } = this.props;
    if (!isEqual(market, prevProps.market)) {
      reload('fresh-stories');
      this.loadCompetitor();
    }
    if (!isEqual(omit(filter, 'oppty'), omit(prevProps.filter, 'oppty'))) {
      this.setState({ ids: [] });
      this.props.removeAllOpptys();
      reload('fresh-stories');
    }
    if (!isEqual(searchString, prevProps.searchString)) {
      reload('fresh-stories');
    }
    if (!isEqual(prevProps.cardAnalysisArray, this.props.cardAnalysisArray)) {
      reload('fresh-stories');
    }
    // if (
    //   !isEqual(stageList, prevProps.stageList) ||
    //   !isEqual(opptyTypesList, prevProps.opptyTypesList) ||
    //   !isEqual(closePeriodList, prevProps.closePeriodList)
    // ) {
    //   this.loadCompetitor();
    // }
  }

  componentDidMount() {
    const { changeFilter, filter } = this.props;
    if (!filter.dealMatched) {
      changeFilter({ dealMatched: MatchesOptions[0] });
    }
    if (!filter.dealSurveyStatus) {
      changeFilter({ dealSurveyStatus: SurveysOptions[0] });
    }
    this.loadCompetitor();
  }

  componentWillUnmount() {
    let btn = document.getElementById('filter-btn');
    console.log(btn);
    if (btn) {
      btn.click();
    }
    this.props.changeFilter({ searchString: null });
  }

  getPromise = async () => {
    const { filter, market, searchString } = this.props;
    const { sortCriterion, sortOrder } = this.state;
    this.setState({ stories: null });
    const payload = {};
    if (filter.industry !== null)
      payload.industryList = [filter.industry.value];
    if (filter.segment !== null) payload.marketList = [filter.segment.value];
    if (filter.region !== null) payload.regionList = [filter.region.value];
    if (searchString !== null) payload.searchString = searchString;
    if (market !== null) payload.solutionId = market?.value;
    if (filter.competitor !== null && filter.competitor?.value !== 'All')
      payload.competitorCardId = filter.competitor?.value;
    if (sortCriterion !== null) payload.sortCriterion = sortCriterion;
    if (sortOrder !== null) payload.sortOrder = sortOrder;
    if (filter.opptyStatus != null && filter.opptyStatus?.value !== 'All')
      payload.opptyStatus = filter.opptyStatus.value;
    if (filter.closePeriod !== null && filter.closePeriod?.value !== 'All')
      payload.closePeriod = filter.closePeriod?.value;
    if (filter.dealGameTapeOpptyType !== null)
      payload.crmOpptyType = filter.dealGameTapeOpptyType?.value;
    if (filter.dealMatched !== null && filter.dealMatched?.value !== 'All')
      payload.isMatchPresent = filter.dealMatched.value;
    if (
      filter.dealSurveyStatus != null &&
      filter.dealSurveyStatus.value !== 'All'
    )
      payload.isSurveyPresent = filter.dealSurveyStatus.value;
    if (filter.showLiveOpptys === 'Y')
      payload.isOpenOppty = filter['oppty']?.value;
    const apiArray = [];
    if (filter.closePeriod && filter.opptyStatus) {
      apiArray.push(getOpptyListDetailsForSolution(payload));
    }
    return new Promise((resolve, reject) => {
      Promise.all(apiArray)
        .then((response) => {
          resolve({ data: response });
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  loadData = (response) => {
    const opptyList = response && response[0]?.data ? response[0].data : [];
    this.loadOpptyList(opptyList);
  };

  loadOpptyList = (opptyList) => {
    const { dealMatched, dealSurveyStatus } = this.props;
    const stories =
      opptyList &&
      opptyList.map((story) => ({
        ...story,
        accountName: story.accountName?.trim(),
        likes: 12,
        Owner: 'John doe',
        statusDeal: this.renderStatus(story.isWon, story.isClosed),
        dealClosed: `${story.closeQuarter}-${story.closeYear}`,
        marketValue: this.filterNullMarket(story.market),
      }));

    this.setState({ stories, currentPosts: stories, isLoading: false });
  };

  loadCompetitor = async () => {
    const { marketId } = this.props.filter;
    const response = await getCompetitorCardsList(marketId);
    let competitorData = response
      ? response.data.map((i) => ({ value: i.id, label: i.name }))
      : [];
    competitorData = [{ value: 'All', label: 'All' }, ...competitorData];
    this.setState({ competitorData });
  };

  handleDealSummaryNav = (story) => {
    const { tabData } = this.props;
    if (story.storyId) {
      this.props.history.push(
        `/dealgametape/storyId/${story.storyId}/opptyId/${story.opptyId}`,
        {
          tabIndex: tabData.tabId,
        }
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

  // getCurrentPosts = (inputStories = []) => {
  //   const storiesToFilter =
  //     inputStories.length > 0 ? inputStories : this.state.stories;
  //   this.setState({ currentPosts: storiesToFilter, isLoading: false });
  // };

  optionGenerator = (array, value = 'id', label = 'name') => {
    if (array && array.length > 0) {
      const newArray = array.map((card) => ({
        label: card[label],
        value: card[value],
      }));
      return [{ value: 'All', label: 'All' }, ...newArray];
    }
  };

  handleChange = (model, selected) => {
    const { changeFilter } = this.props;
    const payload = { [model]: selected };
    changeFilter(payload);
  };

  handleCheck = (surveyArray) => {
    const { saveSelectedOpptys } = this.props;

    saveSelectedOpptys(surveyArray);
  };

  sendSurvey = async () => {
    this.handleSurveyLinkSubmmit();
  };

  sendSurveyAfterConfirmation = async () => {
    const { surveyArray, removeAllOpptys } = this.props;
    const formatedSurveyArray = surveyArray.map((i) => ({
      opptyId: Number(i.split('-')[0]),
      storyId: Number(i.split('-')[1]),
    }));
    const response = await sendSurveyLinksForMultipleOpptys({
      storyIdOpptyIdBeanList: formatedSurveyArray,
    });
    if (response) {
      this.setState(
        {
          isSurveySent: true,
          totalSurveysent: surveyArray.length,
        },
        () => {
          removeAllOpptys();
          this.setState({ ids: [] });
        }
      );
    }
  };

  handleSurveyLinkSubmmit = () => {
    const header = (
      <div className="d-flex justify-content-between">
        <h5 className="modal-title"> Send Survey</h5>
      </div>
    );
    const body = (
      <SendLink
        sendSurveyAfterConfirmation={this.sendSurveyAfterConfirmation}
      />
    );
    showCustomModal(header, body, 'story-modal');
  };

  handleSortSelect = (selected) => {
    if (selected.label === 'All') {
      this.setState(
        {
          sortCriterion: null,
          sortOrder: null,
        },
        () => reload('fresh-stories')
      );
    } else {
      this.setState(
        {
          sortCriterion: selected.value.sortCriterion,
          sortOrder: selected.value.sortOrder,
        },
        () => reload('fresh-stories')
      );
    }
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

  handlePageSizeChange = (params) => {
    this.setState({ pageSize: params });
  };

  filterCardsByMatchStatus = (selected = {}) => {
    const { changeFilter } = this.props;
    changeFilter({ dealMatched: selected });
  };

  filterCardsBySurveyStatus = (selected = {}) => {
    const { changeFilter } = this.props;
    changeFilter({ dealSurveyStatus: selected });
  };

  renderHeader = () => {
    const { competitorData, totalSurveysent, isSurveySent } = this.state;
    const {
      surveyArray,
      filter,
      dealSurveyStatus,
      dealMatched,
      closePeriodList,
      stageList,
      opptyTypesList,
    } = this.props;
    return (
      <div className={`${DEFAULT_CLASSNAME}-header`}>
        <div className="filter">
          <div className="sort">
            Stage :
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={filter.opptyStatus}
              options={stageList}
              onChange={(value) => this.handleChange('opptyStatus', value)}
            />
          </div>
          <div className="sort ml-1">
            Close Period :
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={filter.closePeriod}
              options={closePeriodList}
              onChange={(value) => this.handleChange('closeDate', value)}
            />
          </div>
          <div className="sort ml-1">
            Oppty Type :
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={filter.dealGameTapeOpptyType}
              options={opptyTypesList}
              onChange={(value) => this.handleChange('opptyType', value)}
            />
          </div>
          <span className="green ml-1">
            {isSurveySent ? `Surveys sent for ${totalSurveysent} deals` : ''}
          </span>
          <div className="sort">
            Matches:
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={MatchesOptions[0]}
              options={MatchesOptions}
              value={filter.dealMatched}
              onChange={this.filterCardsByMatchStatus}
            />
          </div>
          <div className="sort">
            Surveys:
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={SurveysOptions[0]}
              options={SurveysOptions}
              value={filter.dealSurveyStatus}
              onChange={this.filterCardsBySurveyStatus}
            />
          </div>
          <button
            className={`button ml-2  ${
              this.state.ids.length > 0 ? 'Active' : 'disabled'
            }`}
            onClick={this.sendSurvey}
          >
            Send Survey
          </button>
        </div>
        <div className="competitor">
          <span className="mr-2 ml-2">Competitors:</span>
          {competitorData && competitorData.length > 0 && (
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={filter.competitor ? filter.competitor : competitorData[0]}
              onChange={(value) => this.handleChange('dealCompetitor', value)}
              options={competitorData}
            />
          )}
        </div>
      </div>
    );
  };

  handleCellEdit = async ({ id, value, industryId, field, accountId }) => {
    console.log({ id, value, industryId, field, accountId });
    const [opptyId, storyId] = id.split('-').map((j) => Number(j));
    if (field === 'industryName') {
      try {
        await addAccountIndustryToOverrideList(accountId, industryId);
      } catch (error) {
        console.error(error);
      }
    } else {
      let isDomainValid = true;
      value.split(',').forEach((dom) => {
        // check domain name validity
        if (!isValidDomain(dom)) {
          isDomainValid = false;
          showAlert(`One or more domain names entered is not valid`, 'error');
        }
      });
      if (isDomainValid) {
        const { stories } = this.state;
        const story = stories.find((oppty) => oppty.opptyId === opptyId);
        if (!story.domainNames !== value && value !== '') {
          const payload = { accountId: story.accountId, domainNames: value };
          try {
            await updateDomain(payload);
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
  };

  renderContent = () => {
    const { isLoading, currentPosts, Columns, pageSize } = this.state;
    const { surveyArray } = this.props;
    const rows = currentPosts.map((post) => ({
      ...post,
      id: `${post.opptyId}-${post.storyId}`,
      domainNames: post.domainNames,
    }));

    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        {this.renderHeader()}
        <div className={`${DEFAULT_CLASSNAME}-table`}>
          <DataGrid
            rows={rows.map((l) => ({
              ...l,
              test: `${l.opptyId}-${l.storyId}`,
            }))}
            columns={Columns}
            onCellEditCommit={this.handleCellEdit}
            className={'fresh-stories-grid'}
            // checkboxSelection
            pageSize={pageSize}
            onPageSizeChange={this.handlePageSizeChange}
            pagination
            onPageChange={(p) => {
              this.setState({ currentPage: p });
            }}
            isLoading={isLoading}
            rowsPerPageOptions={[10, 20, 50]}
            onSelectionModelChange={this.handleCheck}
            disableColumnMenu
            selectionModel={surveyArray}
            disableSelectionOnClick
          />
        </div>
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
        <div className="d-flex justify-content-between">
          <Skeleton variant="rect" width={'100%'} height={32} />
        </div>
        <div className={`${DEFAULT_CLASSNAME}-table mt-4`}>{rows}</div>
      </div>
    );
  };

  render() {
    return (
      <Async
        identifier="fresh-stories"
        promise={this.getPromise}
        content={this.renderContent}
        handlePromiseResponse={this.loadData}
        loader={this.renderShimmer}
        error={<div></div>}
      />
    );
  }
}

FreshStories.propTypes = {
  cardAnalysisArray: PropTypes.array,
  filter: PropTypes.object,
};

function mapStateToProps(state) {
  const {
    industry,
    segment,
    market,
    region,
    searchString,
    opptyStatus,
    dealCompetitor,
    closeDate,
    dealMatched,
    dealSurveyStatus,
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
      opptyStatus,
      competitor: dealCompetitor,
      closePeriod: closeDate,
      dealMatched,
      dealSurveyStatus,
      dealGameTapeOpptyType: opptyType,
      oppty,
      showLiveOpptys,
    },
    searchString,
    market,
    surveyArray: state.marketAnalysisReducer.selectedSurveyOpptys,
    industryList: FilterIndustryModel.list().map((item) => item.props),
    stageList: FilterStageModel.list().map((item) => item.props),
    opptyTypesList: FilterOpptyTypeModel.list().map((item) => item.props),
    closePeriodList: FilterClosePeriodModel.list().map((item) => item.props),
    tabData: state.marketAnalysisReducer.tabData,
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
  connect(mapStateToProps, mapDispatchToProps)(FreshStories)
);