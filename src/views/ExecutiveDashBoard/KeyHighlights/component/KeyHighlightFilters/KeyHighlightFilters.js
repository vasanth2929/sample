import { Skeleton } from '@material-ui/lab';
import isEqual from 'lodash.isequal';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { bindActionCreators } from 'redux';
import { Async } from '../../../../../basecomponents/async/async';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../../../constants/general';
import {
  FilterClosePeriodModel,
  FilterOpptyTypeModel,
  FilterStageModel,
} from '../../../../../model/GlobalFilterModels/GlobalFilterModels';
import { dispatch } from '../../../../../util/utils';
import {
  formatGroupLabel,
  formatOptionLabel,
} from '../../../../CustomerAnalytics/util/Util';

class KeyHighlightFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opptyStatusList: [],
      closePeriodOptions: [],
    };
  }

  getPromise = async () => {
    return new Promise((resolve, reject) => {
      Promise.all([
        // getOpptyTypeDropdownValues(),
        // getStageDropdownLabels(),
        // getClosePeriodDropdownValues(),
      ])
        .then((response) => {
          const opptyTypes = response[0] ? response[0].data : [];
          const opptyStatus = response[1] ? response[1].data : [];
          const closePeriodOptions = response[2] ? response[2].data : [];
          resolve({ data: [opptyTypes, opptyStatus, closePeriodOptions] });
        })
        .catch((e) => reject(e));
    });
  };

  componentDidMount() {}

  handleChange = (model, selected) => {
    const { changeFilter } = this.props;
    const payload = { [model]: selected };

    if (selected.sortBy) {
      payload.sortBy = selected.sortBy;
    }
    changeFilter(payload);
  };

  renderContent = () => {
    const {
      filter: { opptyStatus, closePeriod, opptyType },
      closePeriodList,
      stageList,
      opptyTypesList,
    } = this.props;

    return (
      <React.Fragment>
        <div className="filter">
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              value={opptyStatus}
              formatOptionLabel={formatOptionLabel}
              onChange={(option) => this.handleChange('opptyStatus', option)}
              options={stageList}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              value={closePeriod}
              formatOptionLabel={formatOptionLabel}
              formatGroupLabel={formatGroupLabel}
              onChange={(option) => this.handleChange('closeDate', option)}
              options={closePeriodList}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              value={opptyType}
              formatOptionLabel={formatOptionLabel}
              formatGroupLabel={formatGroupLabel}
              onChange={(option) => this.handleChange('opptyType', option)}
              options={opptyTypesList}
            />
          </div>
        </div>
      </React.Fragment>
    );
  };

  renderShimmer = () => (
    <div
      className="my-3 d-flex justify-content-between"
      style={{ width: '250px' }}
    >
      <Skeleton variant="rect" width={120} height={50} />
      <Skeleton variant="rect" width={120} height={50} />
    </div>
  );

  render() {
    return (
      <Async
        identifier="key-highlights-filters"
        promise={this.getPromise}
        content={this.renderContent}
        loader={this.renderShimmer}
        error={(e) => {
          console.log(e);
          return <div>Error</div>;
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  const { opptyStatus, closeDate, opptyType } = state.marketPerformanceFilters;
  return {
    filter: {
      opptyStatus,
      closePeriod: closeDate,
      opptyType,
    },
    stageList: FilterStageModel.list().map((item) => item.props),
    opptyTypesList: FilterOpptyTypeModel.list().map((item) => item.props),
    closePeriodList: FilterClosePeriodModel.list().map((item) => item.props),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyHighlightFilters);
