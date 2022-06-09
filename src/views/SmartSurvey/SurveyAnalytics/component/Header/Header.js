import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Select from 'react-select';
import {
  formatOptionLabel,
  formatGroupLabel,
} from '../../../../CustomerAnalytics/util/Util';
import MetricsBox from '../../component/MetricsBox/MetricsBox';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../../../constants/general';
import './Header.style.scss';
import { getSurveyStats } from '../../../../../util/promises/smart-survey';
import { reload, setLoading } from '../../../../../action/loadingActions';
import { Skeleton } from '@material-ui/lab';
import { Async } from '../../../../../basecomponents/async/async';
import { isEqual } from 'lodash';

const DEFAULT_CLASSNAME = 'smart-survey-header';

class HeaderImpl extends PureComponent {
  constructor(props) {
    super(props);
    setLoading('survey-analytics-header');
    this.state = {
      surveyStats: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.stories, this.props.stories)) {
      reload('survey-analytics-header');
    }
  }

  getPromise = async () => {
    const { stories, selectedTile } = this.props;
    const { surveyStats } = this.state;
    const storyArray = stories.map((story) => story.storyId);
    return new Promise((resolve, reject) => {
      if (selectedTile === 'Total' && storyArray.length) {
        getSurveyStats(storyArray)
          .then((surveyStatsResponse) => {
            const surveyStats = surveyStatsResponse
              ? { totalDeals: stories.length, ...surveyStatsResponse.data }
              : {};
            resolve({ data: surveyStats });
          })
          .catch(() => reject());
      } else {
        resolve({ data: surveyStats });
      }
    });
  };

  loadData = (surveyStats) => {
    this.setState({ surveyStats });
  };

  handleChange = (model, selected) => {
    const { changeFilter } = this.props;
    changeFilter({ [model]: null });
    const payload = { [model]: selected };
    if (selected.sortBy) {
      payload.sortBy = selected.sortBy;
    }
    changeFilter(payload);
  };

  renderShimmer = () => (
    <React.Fragment>
      <div
        className="my-3 d-flex justify-content-between"
        style={{ width: '500px' }}
      >
        <Skeleton variant="rect" width={130} height={60} />
        <Skeleton variant="rect" width={130} height={60} />
        <Skeleton variant="rect" width={130} height={60} />
      </div>
      <div
        className="mx-1 d-flex justify-content-between"
        style={{ width: '600px' }}
      >
        {/* <Skeleton variant="rect" width={110} height={70} />
        <Skeleton variant="rect" width={110} height={70} /> */}
        <Skeleton variant="rect" width={110} height={70} />
        <Skeleton variant="rect" width={110} height={70} />
        <Skeleton variant="rect" width={110} height={70} />
        <Skeleton variant="rect" width={110} height={70} />
      </div>
    </React.Fragment>
  );

  renderContent = () => {
    const {
      filter: { opptystatus, closePeriod, crmOpptyType },
      handleSelectedTile,
      selectedTile,
      opptyStatusList,
      opptyTypeList,
      closePeriodOptions,
    } = this.props;
    const { surveyStats } = this.state;
    return (
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}-filter`}>
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              formatOptionLabel={formatOptionLabel}
              value={opptystatus}
              onChange={(option) => this.handleChange('opptyStatus', option)}
              options={opptyStatusList}
            />
          </div>
          <div className="goal-dropdown-wrapper">
            <Select
              className="goal-dropdown"
              classNamePrefix="goal-dropdown"
              formatOptionLabel={formatOptionLabel}
              formatGroupLabel={formatGroupLabel}
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
              formatGroupLabel={formatGroupLabel}
              value={crmOpptyType}
              onChange={(option) => this.handleChange('opptyType', option)}
              options={opptyTypeList}
            />
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}-metrics`}>
          <MetricsBox
            type="Total"
            deals={(surveyStats && surveyStats.totalDeals) || 0}
            text="Deals"
            handleSelectedTile={handleSelectedTile}
            selectedTile={selectedTile}
          />
          <MetricsBox
            type="Not Sent"
            deals={(surveyStats && surveyStats.dealsNotSent) || 0}
            text="Deals"
            handleSelectedTile={handleSelectedTile}
            selectedTile={selectedTile}
          />
          {/* <MetricsBox
            type="Sent"
            deals={(surveyStats && surveyStats.dealsSent) || 0}
            text="Deals"
            handleSelectedTile={handleSelectedTile}
            selectedTile={selectedTile}
          /> */}
          <MetricsBox
            type="Completed"
            deals={(surveyStats && surveyStats.dealsCompleted) || 0}
            text="Deals"
            handleSelectedTile={handleSelectedTile}
            selectedTile={selectedTile}
          />
          <MetricsBox
            type="In Progress"
            deals={(surveyStats && surveyStats.dealsInProgress) || 0}
            text="Deals"
            handleSelectedTile={handleSelectedTile}
            selectedTile={selectedTile}
          />
          {/* <MetricsBox
            type="Not Started"
            deals={(surveyStats && surveyStats.dealsNotStarted) || 0}
            text="Deals"
            handleSelectedTile={handleSelectedTile}
            selectedTile={selectedTile}
          /> */}
        </div>
      </div>
    );
  };

  render() {
    return (
      <Async
        identifier="survey-analytics-header"
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
  const { closeDate, opptyStatus, opptyType } = state.marketPerformanceFilters;
  return {
    filter: {
      opptystatus: opptyStatus,
      closePeriod: closeDate,
      crmOpptyType: opptyType,
    },
    cardAnalysisArray: state.marketAnalysisReducer,
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
