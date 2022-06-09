import React, { Component } from 'react';
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
import { SwitchButton } from '../../../views/CustomerAnalytics/BuyingJourneyInsights/components/SwitchButton/SwitchButton';
import './Competition.style.scss';
import CompetitionTable from './components/CompetitionTable';

const DEFAULT_CLASSNAME = 'executive-competition';

const mockData = [
  {
    Industry: 'Oracle',
    rowWidth: '100',
    WinRate: 30,
    Strengths: [
      {
        text: 'Hyperconverged data center',
        rating: 4.5,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.2,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.0,
      },
    ],
    Weakness: [
      {
        text: 'Hyperconverged data center',
        rating: 4.5,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.2,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.0,
      },
    ],
  },
  {
    Industry: 'HP',
    rowWidth: '75',
    WinRate: 30,
    Strengths: [
      {
        text: 'Hyperconverged data center',
        rating: 4.5,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.2,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.0,
      },
    ],
    Weakness: [
      {
        text: 'Hyperconverged data center',
        rating: 4.5,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.2,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.0,
      },
    ],
  },
  {
    Industry: 'Technology',
    rowWidth: '50',
    WinRate: 30,
    Strengths: [
      {
        text: 'Hyperconverged data center',
        rating: 4.5,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.2,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.0,
      },
    ],
    Weakness: [
      {
        text: 'Hyperconverged data center',
        rating: 4.5,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.2,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.0,
      },
    ],
  },
  {
    Industry: 'Snow Flake',
    rowWidth: '25',
    WinRate: 30,
    Strengths: [
      {
        text: 'Hyperconverged data center',
        rating: 4.5,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.2,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.0,
      },
    ],
    Weakness: [
      {
        text: 'Hyperconverged data center',
        rating: 4.5,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.2,
      },
      {
        text: 'Hyperconverged data center',
        rating: 4.0,
      },
    ],
  },
];

class Competition extends Component {
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
      filter: { opptystatus, closePeriod },
    } = this.props;
    const stageOptionValue = stageOptions.find(
      (option) => option.value === opptystatus
    );
    const closePeriodOptionValue = closePeriodOptions
      .reduce((memo, item) => {
        if (item.label) {
          memo.push(item);
        } else {
          memo.push(...item.options);
        }
        return memo;
      }, [])
      .find((option) => option.value === closePeriod);
    return (
      <React.Fragment>
        <div className="filter">
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              defaultValue={stageOptions[0]}
              value={stageOptionValue}
              formatOptionLabel={formatOptionLabel}
              onChange={(option) =>
                this.handleChange('buyingOpptystatus', option.value)
              }
              options={stageOptions}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              defaultValue={closePeriodOptions[1]}
              value={closePeriodOptionValue}
              formatOptionLabel={formatOptionLabel}
              formatGroupLabel={formatGroupLabel}
              onChange={(option) =>
                this.handleChange('closeDate', option.value)
              }
              options={closePeriodOptions}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              defaultValue={messagingOptions[0]}
              formatOptionLabel={formatOptionLabel}
              formatGroupLabel={formatGroupLabel}
              onChange={() => {}}
              options={messagingOptions}
            />
          </div>
        </div>
        <div className="switch-btn">
          <SwitchButton
            labels={['Internal', 'External']}
            className="competition"
            defaultSelection="Internal"
            onClick={this.handleClick}
          />
        </div>
      </React.Fragment>
    );
  };
  handleClick = (label) => {
    console.log(label);
  };

  render() {
    return (
      <div className={DEFAULT_CLASSNAME}>
        <div className="header">{this.renderFilter()}</div>
        <div className="body">
          <CompetitionTable mockData={mockData} />
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
    closeDate,
    opptyStatus,
    verifiedCard,
    buyingSort,
  } = state.marketPerformanceFilters;
  return {
    filter: {
      market,
      industry,
      segment,
      region,
      opptystatus: opptyStatus,
      closePeriod: closeDate,
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

export default connect(mapStateToProps, mapDispatchToProps)(Competition);
