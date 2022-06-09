import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../constants/general';
import { dispatch } from '../../../util/utils';
import {
  stageOptions,
  formatOptionLabel,
  formatGroupLabel,
  closePeriodOptions,
  messagingOptions,
} from '../../CustomerAnalytics/util/Util';
import './CustomerNeed.style.scss';
import {
  getCardsAndStorySummaryForTopic,
  getStageDropdownLabels,
} from '../../../util/promises/customer_analysis';
import CustomerNeedTable from './component/CustomerNeedTable';

const DEFAULT_CLASSNAME = 'executive-customer-needs';
class CustomerNeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      needStory: [],
      opptyStatusList: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { filter } = this.props;
    if (!isEqual(filter, prevProps.filter)) {
      this.loadData();
    }
  }

  componentDidMount() {
    const { filter, changeFilter } = this.props;
    if (filter.topicName === null) {
      changeFilter({ executiveNeedTopicName: messagingOptions[0] });
    }
    this.loadopptyStatus();
    this.loadData();
  }

  loadData = async () => {
    this.setState({ isLoading: true });
    const {
      industry,
      segment,
      region,
      market,
      opptyStatus,
      closePeriod,
      topicName,
    } = this.props.filter;
    const payload = {};
    if (industry !== null) payload.industryList = [industry.value];
    if (segment !== null) payload.marketList = [segment.value];
    if (region !== null) payload.regionList = [region.value];
    if (market !== null) payload.solutionId = market.value;
    if (opptyStatus != null) payload.opptyStatus = opptyStatus.value;
    if (closePeriod !== null) payload.closePeriod = closePeriod.value;
    if (topicName !== null) payload.topicName = topicName.value;
    if (topicName && opptyStatus) {
      const response = await getCardsAndStorySummaryForTopic(payload);
      const needStory = response && response.data;
      this.setState({ needStory, isLoading: false });
    }
  };

  loadopptyStatus = async () => {
    const { changeFilter, filter } = this.props;
    const response = await getStageDropdownLabels();
    const opptyStatusList = response
      ? response.data.map((i) => ({
          ...i,
          value: i.picklistValue,
          label: i.picklistLabel,
          floatingLabel: 'STAGE',
        }))
      : [];
    const selectedOppty = response.data
      .find((status) => status.defaultFlag)
      .map((i) => ({
        value: i.picklistValue,
        label: i.picklistLabel,
        floatingLabel: 'STAGE',
      }));
    this.setState({ opptyStatusList }, () => {
      if (filter.opptyStatus === null) {
        changeFilter({ executiveNeedOpptyStatus: selectedOppty });
      }
    });
  };

  handleChange = (model, selected) => {
    const { changeFilter } = this.props;
    if (selected.value === 'All') {
      changeFilter({ [model]: null });
    } else {
      const payload = { [model]: selected };

      if (selected.sortBy) {
        payload.sortBy = selected.sortBy;
      }

      changeFilter(payload);
    }
  };

  renderFilter = () => {
    const {
      filter: { opptyStatus, closePeriod, topicName },
    } = this.props;
    const { opptyStatusList } = this.state;
    const topicNameOptionValue = messagingOptions.find(
      (option) => option.value === topicName
    );
    return (
      <React.Fragment>
        <div className="filter">
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              value={opptyStatus}
              formatOptionLabel={formatOptionLabel}
              onChange={(option) =>
                this.handleChange('executiveNeedOpptyStatus', option)
              }
              options={opptyStatusList}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              value={closePeriod ? closePeriod : closePeriodOptions[1]}
              formatOptionLabel={formatOptionLabel}
              formatGroupLabel={formatGroupLabel}
              onChange={(option) =>
                this.handleChange('executiveNeedClosedDate', option)
              }
              options={closePeriodOptions}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              defaultValue={messagingOptions[0]}
              value={topicNameOptionValue}
              formatOptionLabel={formatOptionLabel}
              formatGroupLabel={formatGroupLabel}
              onChange={(option) =>
                this.handleChange('executiveNeedTopicName', option)
              }
              options={messagingOptions}
            />
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { needStory, isLoading } = this.state;
    return (
      <div className={DEFAULT_CLASSNAME}>
        <div className="header">{this.renderFilter()}</div>
        <div className="body">
          <CustomerNeedTable needStory={needStory} isLoading={isLoading} />
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
    executiveNeedClosedDate,
    executiveNeedOpptyStatus,
    executiveNeedTopicName,
    verifiedCard,
    buyingSort,
  } = state.marketPerformanceFilters;
  return {
    filter: {
      market,
      industry,
      segment,
      region,
      opptyStatus: executiveNeedOpptyStatus,
      closePeriod: executiveNeedClosedDate,
      topicName: executiveNeedTopicName,
      isVerifiedCards: verifiedCard,
      sort: buyingSort,
    },
    cardAnalysisArray: state.marketAnalysisReducer,
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerNeed);
