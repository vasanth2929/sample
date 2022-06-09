import { Tooltip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { isEqual, pick } from 'lodash';
import sortBy from 'lodash.sortby';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { bindActionCreators } from 'redux';
import { Async } from '../../../basecomponents/async/async';
import SearchInput from '../../../components/SearchInput/SearchInput';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../constants/general';
import {
  FilterClosePeriodModel,
  FilterIndustryModel,
  FilterMarketModel,
  FilterOpptyTypeModel,
  FilterRegionModel,
  FilterSegmentModel,
  FilterStageModel,
} from '../../../model/GlobalFilterModels/GlobalFilterModels';
import {
  getAllMarkets,
  listAllIndustry,
  listAllMarket as listAllSegments,
  listAllRegion,
} from '../../../util/promises/browsestories_promise';
import {
  getClosePeriodDropdownValues,
  getOpptyTypeDropdownValues,
  getStageDropdownLabels,
} from '../../../util/promises/customer_analysis';
import { includeLiveOpptysFlag } from '../../../util/promises/playbooks_promise';
import { storiesLastUpdatedDate } from '../../../util/promises/stories_promise';
import { getLocalStorageData, saveToLocalStorage } from '../../../util/utils';
import {
  leaderBoardsortOptions,
  MatchesOptions,
  sortOptions,
  sortOptionsSWOT,
  SurveysOptions,
  verifySort,
} from '../util/Util';
import './Filter.style.scss';
import { opptyOptions } from './util';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isButtonDisabled: true,
      localFilter: {
        market: props.filter.market ? props.filter.market : null,
        region: props.filter.region ? props.filter.region : null,
        segment: props.filter.segment ? props.filter.segment : null,
        industry: props.filter.industry ? props.filter.industry : null,
        closeDate: props.filter.closeDate ? props.filter.closeDate : null,
        opptyType: props.filter.opptyType ? props.filter.opptyType : null,
        opptyStatus: props.filter.opptyStatus ? props.filter.opptyStatus : null,
        oppty: props.filter.oppty ? props.filter.oppty : null,
      },
    };
  }

  sortAlphabetically = (data) => {
    return sortBy(data, (a) => a.name);
  };

  optionGenerator = (data, key, value) => {
    const newArray = this.sortAlphabetically(data);
    return newArray.map((i) => ({ value: i[key], label: i[value] }));
  };

  componentDidUpdate(prev) {
    if (!isEqual(this.props.filter.oppty, prev.filter.oppty)) {
      this.props.changeFilter({ wait: true });
      const status =
        this.props.filter?.oppty?.value === 'Y' &&
        this.props.filter?.showLiveOpptys === 'Y';
      Promise.all([
        getStageDropdownLabels(status),
        getOpptyTypeDropdownValues(status),
        getClosePeriodDropdownValues(status),
      ]).then(async ([stage, opptyType, closePeriod]) => {
        const stageData = stage.data;
        const opptyTypeData = opptyType.data;
        const closePeriodData = closePeriod.data;

        FilterStageModel.deleteAll();
        FilterOpptyTypeModel.deleteAll();
        FilterClosePeriodModel.deleteAll();
        stageData.map((i) => {
          new FilterStageModel({
            id: i.picklistValue,
            ...i,
            value: i.picklistValue,
            label: i.picklistLabel,
            floatingLabel: 'STAGE',
          }).$save();
        });

        opptyTypeData.map((i) => {
          new FilterOpptyTypeModel({
            id: i.picklistValue,
            ...i,
            value: i.picklistValue,
            label: i.picklistLabel,
            floatingLabel: 'OPPTY TYPE',
          }).$save();
        });

        closePeriodData.map((i) => {
          new FilterClosePeriodModel({
            id: i.picklistValue,
            ...i,
            value: i.picklistValue,
            label: i.picklistLabel,
            floatingLabel: 'CLOSE PERIOD',
          }).$save();
        });
        let activeStage = stageData.find((t) => t.defaultFlag);
        let activeOppty = opptyTypeData.find((t) => t.defaultFlag);
        let activeClosePeriod = closePeriodData.find((t) => t.defaultFlag);
        if (!activeStage) {
          activeStage = stageData[0];
        }
        if (!activeOppty) {
          activeOppty = opptyTypeData[0];
        }
        if (!activeClosePeriod) {
          activeClosePeriod = closePeriodData[0];
        }
        this.props.changeFilter({
          opptyStatus: {
            value: activeStage?.picklistValue,
            label: activeStage?.picklistLabel,
            floatingLabel: 'STAGE',
          },
          closeDate: {
            value: activeClosePeriod?.picklistValue,
            label: activeClosePeriod?.picklistLabel,
            floatingLabel: 'CLOSE PERIOD',
          },
          opptyType: {
            value: activeOppty?.picklistValue,
            label: activeOppty?.picklistLabel,
            floatingLabel: 'OPPTY TYPE',
          },
          wait: false,
        });
      });
    }
  }

  getPromise = () => {
    const playbookName = 'information technology';
    const {
      marketList,
      regionList,
      segmentList,
      industryList,
      closePeriodList,
      opptyTypesList,
      stageList,
      filter,
      changeFilter,
    } = this.props;
    return new Promise((resolve, reject) => {
      if (
        marketList.length === 0 ||
        regionList.length === 0 ||
        segmentList.length === 0 ||
        industryList.length === 0 ||
        closePeriodList.length === 0 ||
        opptyTypesList.length === 0 ||
        stageList.length === 0
      ) {
        this.props.changeFilter({ wait: true });
        Promise.all([
          listAllRegion(playbookName),
          getAllMarkets(),
          listAllSegments(playbookName),
          listAllIndustry(playbookName),
          getClosePeriodDropdownValues(filter?.oppty?.value === 'Y'),
          getOpptyTypeDropdownValues(filter?.oppty?.value === 'Y'),
          getStageDropdownLabels(filter?.oppty?.value === 'Y'),
        ])
          .then((response) => {
            localStorage.setItem('bji_called', new Date().toISOString());
            const region =
              response[0] && response[0].data ? response[0].data : [];
            const markets =
              response[1] && response[1].data ? response[1].data : [];
            const segments =
              response[2] && response[2].data ? response[2].data : [];
            const industry =
              response[3] && response[3].data ? response[3].data : [];
            if (sessionStorage.getItem('set') !== 'true') {
              sessionStorage.setItem('set', 'true');
              if (markets?.find((t) => t.defaultFlag))
                this.setDefaultFilter(markets, 'market', 'id', 'name');
              if (industry?.find((t) => t.defaultFlag))
                this.setDefaultFilter(
                  industry,
                  'industry',
                  'qualifierId',
                  'value'
                );
              if (region?.find((t) => t.defaultFlag))
                this.setDefaultFilter(region, 'region', 'id', 'name');
              if (segments?.find((t) => t.defaultFlag))
                this.setDefaultFilter(
                  segments,
                  'segment',
                  'qualifierId',
                  'value'
                );
            }
            const closePeriod =
              response[4] && response[4].data ? response[4].data : [];
            if (!this.props.filter.closeDate)
              this.findAndSetDefaultFilter(
                closePeriod,
                'closeDate',
                'CLOSE PERIOD'
              );
            const opptyTypes =
              response[5] && response[5].data ? response[5].data : [];
            if (!this.props.filter.opptyType)
              this.findAndSetDefaultFilter(
                opptyTypes,
                'opptyType',
                'OPPTY TYPE'
              );
            const stage =
              response[6] && response[6].data ? response[6].data : [];
            if (!this.props.filter.opptyStatus)
              this.findAndSetDefaultFilter(stage, 'opptyStatus', 'STAGE');
            const {
              localFilter: { closeDate, opptyStatus, opptyType },
            } = this.state;
            changeFilter({
              closeDate,
              opptyType,
              opptyStatus,
              verifiedCard: verifySort[1],
              performanceSortCriteria: leaderBoardsortOptions[0],
              buyingSort: sortOptions[0],
              compSort: sortOptionsSWOT[0],
              dealMatched: MatchesOptions[0],
              dealSurveyStatus: SurveysOptions[0],
              wait: false,
            });

            resolve({
              data: [
                region,
                markets,
                segments,
                industry,
                closePeriod,
                opptyTypes,
                stage,
              ],
            });
          })
          .catch(() => reject());
      } else
        resolve({
          data: [
            marketList,
            regionList,
            segmentList,
            industryList,
            closePeriodList,
            opptyTypesList,
            stageList,
          ],
        });
    });
  };

  loadData = async ([
    region,
    markets,
    segments,
    industry,
    closePeriod,
    opptyTypes,
    stage,
  ]) => {
    this.setState({ isLoading: false });
    const {
      regionList,
      marketList,
      segmentList,
      industryList,
      closePeriodList,
      opptyTypesList,
      stageList,
    } = this.props;

    region &&
      regionList.length === 0 &&
      region.map((i) => new FilterRegionModel({ id: i.id, ...i }).$save());
    markets &&
      marketList.length === 0 &&
      markets.map((i) => new FilterMarketModel({ id: i.id, ...i }).$save());
    segments &&
      segmentList.length === 0 &&
      segments.map((i) =>
        new FilterSegmentModel({ id: i.qualifierId, ...i }).$save()
      );
    industry &&
      industryList.length === 0 &&
      industry
        .filter((k) => k.qualifierId !== 21)
        .map((i) =>
          new FilterIndustryModel({ id: i.qualifierId, ...i }).$save()
        );
    //sub filters
    closePeriod &&
      closePeriodList.length === 0 &&
      closePeriod.map((i) =>
        new FilterClosePeriodModel({
          id: i.picklistValue,
          ...i,
          value: i.picklistValue,
          label: i.picklistLabel,
          floatingLabel: 'CLOSE PERIOD',
        }).$save()
      );
    opptyTypes &&
      opptyTypesList.length === 0 &&
      opptyTypes.map((i) =>
        new FilterOpptyTypeModel({
          id: i.picklistValue,
          ...i,
          value: i.picklistValue,
          label: i.picklistLabel,
          floatingLabel: 'OPPTY TYPE',
        }).$save()
      );
    stage &&
      stageList.length === 0 &&
      stage.map((i) =>
        new FilterStageModel({
          id: i.picklistValue,
          ...i,
          value: i.picklistValue,
          label: i.picklistLabel,
          floatingLabel: 'STAGE',
        }).$save()
      );
  };

  componentDidMount() {
    // if (!this.props.date)
    storiesLastUpdatedDate().then((t) => {
      this.props.changeFilter({ date: t?.data });
    });
    /*
      Live oppty dropdown hide/show toggle logic
    */
    // if (sessionStorage.getItem('called') !== 'true')
    //   includeLiveOpptysFlag().then((t) => {
    //     this.props.changeFilter({ showLiveOpptys: t.data });
    //     sessionStorage.setItem('called', 'true');
    //   });
  }

  findAndSetDefaultFilter = (list, filterProperty, floatingLabel) => {
    const listWithOptions =
      list &&
      list.map((i) => ({
        ...i,
        value: i.picklistValue,
        label: i.picklistLabel,
        floatingLabel,
      }));

    this.setState({
      localFilter: {
        ...this.state.localFilter,
        [filterProperty]: listWithOptions.find((status) => status.defaultFlag),
      },
    });
  };

  setDefaultFilter = (data, filterName, id, value) => {
    const { localFilter } = this.state;
    let defaultMarket;
    const { changeFilter } = this.props;
    if (!localFilter[filterName]) {
      defaultMarket = data.find((i) => i.defaultFlag);
      this.handleChange(filterName, {
        value: defaultMarket[id],
        label: defaultMarket[value],
      });
      const { localFilter } = this.state;
      changeFilter(localFilter);
      this.setState({ isButtonDisabled: true });
    }
    if (filterName === 'market') {
      defaultMarket = data.find((i) => i.defaultFlag);
      if (defaultMarket)
        changeFilter({
          defaultMarket: {
            value: defaultMarket[id],
            label: defaultMarket[value],
          },
        });
    }
  };

  handleChange = (model, selected) => {
    console.log(model, selected);
    let { localFilter } = this.state;
    if (selected.value === 'All') {
      localFilter[model] = null;
      this.setState({ localFilter }, () => {
        this.checkFilterDifference();
        if (model === 'market') {
          this.props.changeFilter({ localChangedMarket: localFilter[model] });
        }
      });
    } else {
      localFilter[model] = selected;
      this.setState({ localFilter }, () => {
        this.checkFilterDifference();
        if (model === 'market') {
          this.props.changeFilter({ localChangedMarket: selected });
        }
      });
    }
  };

  checkFilterDifference = () => {
    const { filter } = this.props;
    const { localFilter } = this.state;
    const propNames = ['market', 'region', 'segment', 'industry', 'oppty'];
    if (!isEqual(pick(filter, propNames), pick(localFilter, propNames))) {
      this.setState({ isButtonDisabled: false });
    } else {
      this.setState({ isButtonDisabled: true });
    }
  };

  submitFilter = () => {
    const {
      localFilter: { region, segment, industry, oppty },
    } = this.state;
    const { changeFilter } = this.props;
    changeFilter({
      market: this.props.localChangedMarket,
      region,
      segment,
      industry,
      oppty,
    });
    saveToLocalStorage('isFiltered', true);
    this.setState({ isButtonDisabled: true });
  };

  handleSearch = (value) => {
    const { changeFilter } = this.props;
    if (value !== '') {
      changeFilter({ searchString: value });
    } else {
      changeFilter({ searchString: null });
    }
  };

  renderFilters = () => {
    const { market, industry, segment, region, oppty } = this.state.localFilter;
    const { isLoading, isButtonDisabled } = this.state;
    const {
      marketList,
      regionList,
      segmentList,
      industryList,
      hide,
      isDataLoading,
    } = this.props;
    const defaultOption = { value: 'All', label: 'All' };
    const isFiltered = getLocalStorageData('isFiltered');
    const marketOpts = [...this.optionGenerator(marketList, 'id', 'name')];
    if (this.props.isDGT) marketOpts.unshift(defaultOption);
    return !isLoading ? (
      <div className={`select-filters`}>
        Market:
        <Select
          isDisabled={isDataLoading}
          className="basic-single-blue mr-4"
          classNamePrefix="select"
          placeholder="All Markets"
          onChange={(value) => this.handleChange('market', value)}
          options={marketOpts}
          value={this.props.localChangedMarket}
        />
        Filters:
        <Select
          isDisabled={isDataLoading}
          className="basic-single"
          classNamePrefix="select"
          placeholder="All Industries"
          onChange={(value) => this.handleChange('industry', value)}
          options={[
            defaultOption,
            ...this.optionGenerator(industryList, 'qualifierId', 'value'),
          ]}
          value={industry}
        />
        <Select
          isDisabled={isDataLoading}
          className="basic-single"
          classNamePrefix="select"
          placeholder="All Segments"
          onChange={(value) => this.handleChange('segment', value)}
          options={[
            defaultOption,
            ...this.optionGenerator(segmentList, 'qualifierId', 'value'),
          ]}
          value={segment}
        />
        <Select
          isDisabled={isDataLoading}
          className="basic-single"
          classNamePrefix="select"
          placeholder="All Regions"
          onChange={(value) => this.handleChange('region', value)}
          options={[
            defaultOption,
            ...this.optionGenerator(regionList, 'id', 'name'),
          ]}
          value={region}
        />
        {this.props.filter.showLiveOpptys === 'Y' && (
          <Select
            isDisabled={isDataLoading}
            className="basic-single"
            classNamePrefix="select"
            placeholder="Opptys"
            onChange={(value) => {
              this.handleChange('oppty', value);
              this.props.changeFilter({ localOppty: value });
            }}
            options={opptyOptions.slice(
              this.props.tabData.tabId === 1 &&
                this.props.selectedSubTab?.toLowerCase()?.includes('swot')
                ? 1
                : 0,
              4
            )}
            value={oppty}
          />
        )}
        <Tooltip
          placement="right"
          title="< Click filter to apply it."
          open={!isButtonDisabled && !isFiltered}
        >
          <button
            className={`button ${isButtonDisabled ? 'disabled' : ''}`}
            onClick={this.submitFilter}
          >
            Filter
          </button>
        </Tooltip>
      </div>
    ) : (
      <i>Loading filters...</i>
    );
  };

  renderContent = () => {
    const { searchString, hide } = this.props;
    return (
      <div className={`market-filter-containter ${hide ? 'hide' : ''} `}>
        {this.renderFilters()}
        <div className="search-filter">
          <SearchInput
            customClass="customer-analytics-filter"
            onSearch={this.handleSearch}
            tabId={this.props.tabId}
            value={searchString}
          />
        </div>
      </div>
    );
  };

  renderShimmer = () => {
    return (
      <div className="d-flex justify-content-between mt-3">
        <div className="d-flex justify-content-between">
          <Skeleton variant="rect" width={800} height={32} />
        </div>
        <Skeleton variant="rect" width={120} height={32} />
      </div>
    );
  };

  render() {
    const { hide } = this.props;
    return (
      <Async
        identifier="global-filter"
        promise={this.getPromise}
        content={this.renderContent}
        handlePromiseResponse={this.loadData}
        loader={!hide && this.renderShimmer}
        error={<div>error</div>}
      />
    );
  }
}

function mapStateToProps(state) {
  const {
    market,
    defaultMarket,
    localChangedMarket,
    industry,
    segment,
    region,
    searchString,
    closeDate,
    opptyType,
    opptyStatus,
    oppty,
    isDataLoading,
    date,
    showLiveOpptys,
  } = state.marketPerformanceFilters;
  return {
    filter: {
      market,
      industry,
      segment,
      region,
      closeDate,
      opptyType,
      opptyStatus,
      oppty,
      showLiveOpptys,
    },
    searchString,
    defaultMarket,
    localChangedMarket,
    tabId: state.marketAnalysisReducer.tabData.tabId,
    marketList: FilterMarketModel.list().map((item) => item.props),
    regionList: FilterRegionModel.list().map((item) => item.props),
    segmentList: FilterSegmentModel.list().map((item) => item.props),
    industryList: FilterIndustryModel.list().map((item) => item.props),
    stageList: FilterStageModel.list().map((item) => item.props),
    opptyTypesList: FilterOpptyTypeModel.list().map((item) => item.props),
    closePeriodList: FilterClosePeriodModel.list().map((item) => item.props),
    isDataLoading,
    tabData: state.marketAnalysisReducer.tabData,
    selectedSubTab: state.marketAnalysisReducer.selectedSubTab,
    date,
  };
}

function mapDispatchToProps(dispatch) {
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
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
      resetSearchStringfilter: () =>
        dispatch({
          type: UPDATE_MARKET_PERFORMANCE_FILTERS,
          payload: { searchString: '' },
        }),
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Filter);
