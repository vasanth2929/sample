import { isEqual } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { bindActionCreators } from 'redux';
import { reload, unsetReload } from '../../../../../action/loadingActions';
import StoryStats from '../../../../../components/StoryStats/StoryStats';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../../../constants/general';
import { formatOptionLabel } from '../../../../CustomerAnalytics/util/Util';
import './Header.style.scss';
import {
  FilterClosePeriodModel,
  FilterOpptyTypeModel,
  FilterStageModel,
} from '../../../../../model/GlobalFilterModels/GlobalFilterModels';

const DEFAULT_CLASSNAME = 'survey-data-processed-header';

class HeaderImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opptystatus: [],
    };
  }

  handleChange = (model, selected) => {
    const { changeFilter } = this.props;
    changeFilter({ [model]: null });
    const payload = { [model]: selected };
    if (selected.sortBy) {
      payload.sortBy = selected.sortBy;
    }
    changeFilter(payload);
  };

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.storyIdList, this.props.storyIdList)) {
      reload('story-stats');
    }
  }

  renderFilters = () => {
    const {
      filter: { opptystatus, closePeriod, crmOpptyType },
      opptyStatusOptions,
      storyIdList,
      closePeriodOptions,
      opptyTypesOptions,
    } = this.props;

    return (
      <div className={`${DEFAULT_CLASSNAME}-filter`}>
        <div className="d-flex">
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              formatOptionLabel={formatOptionLabel}
              value={opptystatus}
              onChange={(option) => this.handleChange('opptyStatus', option)}
              options={opptyStatusOptions}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              formatOptionLabel={formatOptionLabel}
              value={closePeriod}
              onChange={(option) => this.handleChange('closeDate', option)}
              options={closePeriodOptions}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              formatOptionLabel={formatOptionLabel}
              value={crmOpptyType}
              onChange={(option) => this.handleChange('opptyType', option)}
              options={opptyTypesOptions}
            />
          </div>
        </div>

        <StoryStats storyIdList={storyIdList} showDeals />
      </div>
    );
  };

  render() {
    return this.renderFilters();
  }
}

function mapStateToProps(state) {
  const { closeDate, opptyStatus, opptyType } = state.marketPerformanceFilters;
  return {
    filter: {
      opptystatus: opptyStatus,
      closePeriod: closeDate,
      crmOpptyType: opptyType,
    },
    opptyTypesOptions: FilterOpptyTypeModel.list().map((item) => item.props),
    closePeriodOptions: FilterClosePeriodModel.list().map((item) => item.props),
    opptyStatusOptions: FilterStageModel.list().map((item) => item.props),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderImpl);
