import filter from 'lodash.filter';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../../../constants/general';
import TribylSelect from '../../../../../tribyl_components/TribylSelect/TribylSelect';
import {
  FilterStageModel,
  FilterOpptyTypeModel,
  FilterClosePeriodModel,
} from '../../../../../model/GlobalFilterModels/GlobalFilterModels';
import { ShortNumber } from '../../../../../util/utils';
import {
  sortOptionsSWOT,
  testCardsOptions,
  verifySort,
} from '../../../util/Util';
import './Header.style.scss';
import { Box } from '@material-ui/core';
import { ToggleButton } from '../../../../../basecomponents/ToggleButton/ToggleButton';

const DEFAULT_CLASSNAME = 'swot-header';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matricsData: [],
      closePeriodOptions: [],
    };
  }

  optionGenerator = (array, type, value = 'id', label = 'name') => {
    if (array && array.length > 0) {
      return array.map((card) => ({
        label: (
          <span className="goal-select-item-wrapper">
            <span className="goal-select-item-name">{type}:</span>
            <span className="goal-select-item-label">{card[label]}</span>
          </span>
        ),
        value: card[value],
      }));
    }
  };

  loadMetricsBox = (metrics) => {
    return (
      <div className="comp-metrics">
        <React.Fragment>
          <div>
            <p className="small-text">AMOUNT</p>
            <p className="sub-heading bold">
              {metrics && metrics.totalAmount
                ? ShortNumber(metrics.totalAmount)
                : 0}
            </p>
          </div>
          <div>
            <p className="small-text">OPPTY</p>
            <p className="sub-heading bold">
              {metrics && metrics.opptyCount ? metrics.opptyCount : 0}
            </p>
          </div>
          <div>
            <p className="small-text">DEAL SIZE</p>
            <p className="sub-heading bold">
              {metrics && metrics.avgDealSize
                ? ShortNumber(metrics.avgDealSize)
                : 0}
            </p>
          </div>
          <div>
            <p className="small-text">SALES CYCLE</p>
            <p className="sub-heading bold">
              {metrics && metrics.salesCycle ? metrics.salesCycle : ''} days
            </p>
          </div>
        </React.Fragment>
      </div>
    );
  };

  onFilterSelect = (type) => {
    return (value) => {
      const { onFilterSelect } = this.props;
      if (onFilterSelect) onFilterSelect(type, value);
    };
  };

  handleChange = (model, selected) => {
    const { changeFilter } = this.props;
    if (selected === 'All') {
      changeFilter({ [model]: null });
    } else {
      const payload = { [model]: selected };
      if (selected.sortBy) {
        payload.sortBy = selected.sortBy;
      }
      changeFilter(payload);
    }
  };

  renderfilter = (compData, compFilter, metricData, sort) => {
    const {
      filter: {
        opptyStatus,
        ClosePeriod,
        compCompetitor,
        isVerifiedCards,
        bjiOpptyType,
      },
      changeFilter,
      stageList,
      opptyTypesList,
      closePeriodList,
      isDataLoading,
    } = this.props;
    const competitorOptions = compData.map((i) => ({
      value: i.id,
      label: i.name,
      floatingLabel: 'COMPETITOR',
    }));
    const sortOptionValue =
      sort && sort.value
        ? sortOptionsSWOT.find((option) => option.value === sort.value)
        : '';
    return (
      <div className="filter-wrapper">
        <div className="metrics">
          <div className="filter">
            <TribylSelect
              options={stageList}
              value={opptyStatus}
              onChange={(option) => this.handleChange('opptyStatus', option)}
              isDisabled={isDataLoading}
            />
          </div>
          <div className="filter">
            <TribylSelect
              options={closePeriodList}
              value={ClosePeriod}
              onChange={(value) => this.handleChange('closeDate', value)}
              isDisabled={isDataLoading}
            />
          </div>
          <div className="filter">
            <TribylSelect
              options={opptyTypesList}
              value={bjiOpptyType}
              onChange={(value) => this.handleChange('opptyType', value)}
              isDisabled={isDataLoading}
            />
          </div>
          <div className="filter mr-3">
            <TribylSelect
              options={competitorOptions}
              value={compCompetitor}
              onChange={this.onFilterSelect('competitor')}
              isDisabled={isDataLoading}
            />
          </div>
          <div className="filter mr-3">
            <TribylSelect
              options={testCardsOptions}
              value={this.props.filter.isTestCard}
              onChange={(v) => this.props.changeFilter({ isTestCardBJI: v })}
              isDisabled={isDataLoading}
            />
          </div>
        </div>
        <div className="account-filter">
          <div className="filter mr-3">
            <TribylSelect
              options={sortOptionsSWOT}
              value={sortOptionValue}
              onChange={(value) => this.handleChange('compSort', value)}
              isDisabled={isDataLoading}
            />
          </div>
          <div className="filter">
            <TribylSelect
              options={verifySort}
              value={isVerifiedCards}
              onChange={(value) => changeFilter({ verifiedCard: value })}
              isDisabled={isDataLoading}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { compData, compFilter, metrics, filter } = this.props;
    return (
      <div className={DEFAULT_CLASSNAME}>
        {this.renderfilter(compData, compFilter, metrics, filter.sort)}
      </div>
    );
  }
}

Header.propTypes = {
  compData: PropTypes.array,
  compFilter: PropTypes.object,
  metrics: PropTypes.object,
};

function mapStateToProps(state) {
  const {
    market,
    industry,
    segment,
    region,
    opptyStatus,
    closeDate,
    compCompetitor,
    compSort,
    verifiedCard,
    opptyType,
    isDataLoading,
    isTestCardBJI,
  } = state.marketPerformanceFilters;
  return {
    filter: {
      market,
      industry,
      segment,
      region,
      opptyStatus: opptyStatus,
      ClosePeriod: closeDate,
      compCompetitor: compCompetitor,
      sort: compSort,
      isVerifiedCards: verifiedCard,
      bjiOpptyType: opptyType,
      isTestCard: isTestCardBJI,
    },
    stageList: FilterStageModel.list().map((item) => item.props),
    opptyTypesList: FilterOpptyTypeModel.list().map((item) => item.props),
    closePeriodList: FilterClosePeriodModel.list().map((item) => item.props),
    isDataLoading,
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
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
