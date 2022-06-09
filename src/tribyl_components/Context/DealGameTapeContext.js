import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import { listAllMarkets } from '../../util/promises/playbooks_promise';
import {
  getCompetitorWithTypeForOppty,
  getMarketForStory,
  getSurveyQuestionsAndCardsByCategory,
  linkStoryToMarket,
} from '../../util/promises/survey_promise';
import { Loader } from '../../_tribyl/components/_base/Loader/Loader';
import SurveyTextArea from '../FieldGenerator/SurveyTextArea';
import './Context.style.scss';
import { filterContextQuestion } from './contextDataHelper';

const DEFAULT_CLASSNAME = 'context';

class DealGameTapeContext extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contextQuestion: [],
      isLoading: true,
      answerArray: [],
      markets: [],
      disableNext: true,
      selectedMarket: null,
      selectedValues: [],
    };
  }

  componentDidMount() {
    this.loadData();
    this.loadValues();
  }

  loadValues = async () => {
    const { opptyId, type } = this.props;
    const reponse = await getCompetitorWithTypeForOppty(opptyId);
    const cards = reponse.data ? reponse.data : [];
    this.setState({ selectedValues: cards });
  };

  loadMarketData = async () => {
    const { storyId } = this.props;
    const { markets } = this.state;
    const response = await getMarketForStory(storyId);
    const market = response.data.playbookSalesName;
    const selectedMarket = markets.find((i) => i.name === market) || {};
    this.handledisableNext();
    this.setState({
      selectedMarket: { id: selectedMarket.id, label: selectedMarket.name },
    });
  };

  loadData = async () => {
    const { opptyId } = this.props;
    const response = await getSurveyQuestionsAndCardsByCategory(
      'Context',
      opptyId
    );
    const response2 = await listAllMarkets();
    let contextQuestion = response.data
      ? filterContextQuestion(response.data)
      : [];

    const markets =
      response2 && response2.data && response2.data.length > 0
        ? response2.data.filter((i) => i.name.toLowerCase() !== 'none')
        : [];
    this.setState({ contextQuestion, isLoading: false, markets }, () => {
      this.loadMarketData();
    });
  };

  handledisableNext = () => {
    this.setState({ disableNext: false });
  };

  OptionMarket = (markets) => {
    return markets ? markets.map((i) => ({ value: i.id, label: i.name })) : [];
  };

  OptionsGenerator = (data) => {
    return data ? data.map((i) => ({ value: i.id, label: i.title })) : [];
  };

  handleMarketChange = async (value, { action }) => {
    const { storyId } = this.props;

    switch (action) {
      case 'select-option':
        this.handledisableNext();
        const marketId = value.value;
        const repsonse = await linkStoryToMarket(marketId, storyId);
        this.setState({ selectedMarket: marketId }, () => {
          this.loadData();
        });

        break;
    }
  };

  renderMarketSelect = () => {
    const { selectedMarket, markets } = this.state;
    return (
      <Select
        className="card-select"
        classNamePrefix="multi-select"
        isClearable={false}
        onChange={this.handleMarketChange}
        options={this.OptionMarket(markets)}
        value={selectedMarket}
        isDisabled
      />
    );
  };

  filterCards = (type, data) => {
    switch (type) {
      case 'finalist':
        return data.filter((i) => i.competitorType === 'finalist');
      case 'winner':
        return data.filter((i) => i.competitorType === 'winner');
      case 'incumbent':
        return data.filter((i) => i.competitorType === 'incumbent');
      default:
        break;
    }
  };

  renderWinnerOrIncumbant = (winnerOptions, type) => {
    const { selectedValues } = this.state;
    const { stage } = this.props;
    const cards = selectedValues ? this.filterCards(type, selectedValues) : [];
    const value =
      stage?.toLowerCase().includes('won') && type === 'winner'
        ? { value: 'Us', label: 'Us' }
        : this.OptionsGenerator(cards);

    return (
      <Select
        className="card-select"
        classNamePrefix="multi-select"
        isClearable={false}
        options={this.OptionsGenerator(winnerOptions)}
        value={value}
        isDisabled
      />
    );
  };

  renderFinalist = (finalistOptions, type) => {
    const { selectedValues } = this.state;
    const cards = selectedValues ? this.filterCards(type, selectedValues) : [];
    const value = this.OptionsGenerator(cards);
    return (
      <Select
        className="card-select"
        classNamePrefix="multi-select"
        isClearable={false}
        options={this.OptionsGenerator(finalistOptions)}
        value={value}
        isDisabled
        isMulti
      />
    );
  };

  renderField = (type, data) => {
    const { storyId, opptyId } = this.props;
    switch (type) {
      case 'market':
        return this.renderMarketSelect();
      case 'multichoice':
        if (data.subType === 'winner' || data.subType === 'incumbent') {
          return this.renderWinnerOrIncumbant(
            data.relatedCardList,
            data.subType
          );
        }
        return this.renderFinalist(data.relatedCardList, data.subType);
      default:
        return (
          <SurveyTextArea
            uiType={'dgt'}
            opptyId={opptyId}
            id={data.questionId}
            question={data}
            storyId={storyId}
            onChange={this.handleTextChange}
            placeholder="Start typing"
            rows="5"
          />
        );
    }
  };

  render() {
    const { contextQuestion, isLoading, disableNext } = this.state;
    const { onComplete, uiType, surveyStatus } = this.props;
    return (
      <div className={DEFAULT_CLASSNAME}>
        <p className="page-title">Context</p>

        {!isLoading ? (
          contextQuestion.map((question, questionIdx) => {
            const questionLabel =
              question.type === 'market'
                ? `* ${question.questionText}`
                : question.questionText;

            return (
              <div className={`${DEFAULT_CLASSNAME}-fields`} key={questionIdx}>
                <p className={`${DEFAULT_CLASSNAME}-question`}>
                  {questionLabel}
                </p>
                {this.renderField(question.type, question)}
              </div>
            );
          })
        ) : (
          <Loader />
        )}
        <div className={`${DEFAULT_CLASSNAME}-footer`}>
          <button
            disabled={disableNext}
            className={`save ${disableNext ? 'disabled' : ''}`}
            onClick={() => onComplete()}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { surveyStatus: state.SurveyData.surveyStatus };
};

export default withRouter(connect(mapStateToProps)(DealGameTapeContext));
