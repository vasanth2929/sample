import { Switch } from '@material-ui/core';
import React, { Component } from 'react';
import KeywordChart from './KeywordChart/KeywordChart';
import TimelineChart from './TimelineChart/TimelineChart';
import './Trends.style.scss';
import Select from 'react-select';
import { connect } from 'react-redux';
import { StoryListModel } from '../../../../../../model/myStoriesModels/MyStoriesModel';
import {
  getConversationAnalysisForStory,
  getKeywordStats,
} from '../../../../../../util/promises/match_tag_promise';

const DEFAULT_CLASSNAME = 'timline';

const visualizationOptions = [
  { value: 'Conversations', label: 'Conversations' },
  { value: 'Deals', label: 'Deals' },
];

const yAxisOptions = [
  { value: 'Closed amount', label: 'Amount' },
  { value: 'Count of Opptys', label: 'Count' },
];

class Trends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isKeyword: true,
      visualizeAs: visualizationOptions[0],
      yaxisAs: yAxisOptions[0],
      ConvChartData: [],
      isLoadingConvData: true,
      keywordChartData: [],
      isLoadingKeywordData: true,
    };
  }

  componentDidMount() {
    this.loadKeywordData()
  }

  loadConversationData = async () => {
    const repsonse = await getConversationAnalysisForStory({
      storyIdList: this.props.card.storyBeanList.map((i) => i.id),
    });
    try {
      const ConvChartData = repsonse ? repsonse.data : [];
      this.setState({ ConvChartData, isLoadingConvData: false });
    } catch (e) {
      console.log(e);
      this.setState({ isLoadingConvData: false });
    }
  };

  loadKeywordData = async () => {
    const repsonse = await getKeywordStats({
      storyIdList: this.props.card.storyBeanList.map((i) => i.id),
      cardId: this.props.card.id,
    });
    try {
      const keywordChartData = repsonse ? repsonse.data : [];
      this.setState({ keywordChartData, isLoadingKeywordData: false });
    } catch (e) {
      console.log(e);
      this.setState({ isLoadingKeywordData: false });
    }
  };

  handleChartToggle = (event) => {
    this.setState({ isKeyword: event.target.checked }, () => {
      this.loadConversationData();
    });
  };

  handleVisualization = (value) => {
    this.setState({ visualizeAs: value }, () => {
      this.loadData(value.value);
    });
  };

  handleYAxisAs = (value) => {
    this.setState({ yaxisAs: value });
  };

  renderCardFilters = () => {
    const { visualizeAs, yaxisAs } = this.state;
    return (
      <div className={`${DEFAULT_CLASSNAME}-header-filters`}>
        Visualize
        <Select
          className="basic-single"
          classNamePrefix="select"
          options={visualizationOptions}
          value={visualizeAs}
          onChange={this.handleVisualization}
        />
        Y-axis:
        <Select
          isDisabled={visualizeAs.value !== 'Deals'}
          className="basic-single"
          classNamePrefix="select"
          value={yaxisAs}
          options={yAxisOptions}
          onChange={this.handleYAxisAs}
        />
      </div>
    );
  };

  render() {
    const {
      isKeyword,
      yaxisAs,
      visualizeAs,
      ConvChartData,
      keywordChartData,
      isLoadingConvData,
    } = this.state;
    return (
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}-header`}>
          {/* {!isKeyword ? this.renderCardFilters() : <div />} */}
          <div className={`${DEFAULT_CLASSNAME}-header-switch-button`}>
            Timeline
            <Switch
              checked={isKeyword}
              color="primary"
              onChange={this.handleChartToggle}
            />
            Keywords
          </div>
        </div>
        {!isKeyword ? (
          <TimelineChart
            card={this.props.card}
            yAxisAs={yaxisAs.value}
            visualizeAs={visualizeAs.value}
            data={ConvChartData}
            isLoadingConvData={isLoadingConvData}
          />
        ) : keywordChartData.length > 0 ? (
          <KeywordChart data={keywordChartData} card={this.props.card} />
        ) : (
          <span>Loading data</span>
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    storylist: StoryListModel.list().map((i) => i.props),
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Trends);
