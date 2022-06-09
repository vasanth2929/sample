import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUsersForStoryWithSurveyLinks } from '../../util/promises/storyboard_promise';
import { getSurveyQuestionsAndCardsByCategory } from '../../util/promises/survey_promise';
import { Loader } from '../../_tribyl/components/_base/Loader/Loader';
import SurveyMultiSelect from '../FieldGenerator/SurveyMultiSelect/SurveyMultiSelect';
import SurveyTextArea from '../FieldGenerator/SurveyTextArea';
import './WrapUp.style.scss';

const DEFAULT_CLASSNAME = 'wrapup';

class DealGameTapeWrapup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wrapup: [],
      isLoading: true,
      emailStories: [],
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadData();
  }

  loadData = async () => {
    const { opptyId, storyId } = this.props;

    const repsonse = await getSurveyQuestionsAndCardsByCategory(
      'wrapup',
      opptyId
    );
    const repsonse2 = await getUsersForStoryWithSurveyLinks(storyId);
    const emailStories = repsonse2.data ? repsonse2.data : [];
    const wrapup = repsonse.data ? repsonse.data : [];
    this.setState({ wrapup, isLoading: false, emailStories });
  };

  onReload = () => {
    this.loadData();
  };

  renderField = (type, data) => {
    const {
      storyId,
      opptyId,
      uiType,
      markets,
      handledisableNext,
      targetMarket,
      stage,
      subUiType,
    } = this.props;
    switch (type) {
      case 'market':
        return (
          <div>
            <SurveyMultiSelect
              onChange={this.handleMerketSelection}
              options={this.OptionMarket(markets)}
              placeholder="Select market(s)"
              opptyId={opptyId}
              type={data.subType}
              storyId={storyId}
              isSingleSelectMarket
              handledisableNext={handledisableNext}
              uiType={uiType}
              stage={stage}
            />
          </div>
        );
      case 'multichoice':
        if (data.subType === 'winner' || data.subType === 'incumbent') {
          return (
            <SurveyMultiSelect
              onChange={this.handleSelect}
              options={this.OptionsGenerator(data.relatedCardList)}
              placeholder="Select multiple"
              opptyId={opptyId}
              type={data.subType}
              storyId={storyId}
              targetMarket={targetMarket}
              isSingleSelect
              uiType={uiType}
              stage={stage}
            />
          );
        } else {
          const filterUs = data.relatedCardList.filter((i) => i.title !== 'Us');
          return (
            <SurveyMultiSelect
              targetMarket={targetMarket}
              onChange={this.handleChange}
              options={this.OptionsGenerator(filterUs)}
              placeholder="Select multiple"
              opptyId={opptyId}
              type={data.subType}
              storyId={storyId}
              limit={3}
              uiType={uiType}
              stage={stage}
            />
          );
        }
      default:
        return (
          <SurveyTextArea
            subUiType={subUiType}
            uiType={uiType}
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
    const { wrapup, isLoading } = this.state;
    const { goPrevious } = this.props;

    return (
      <div className={DEFAULT_CLASSNAME}>
        <p className="page-title">Wrap-up</p>
        <p className="sub-title"></p>
        {!isLoading ? (
          wrapup.map((question, questionIdx) => {
            return (
              question.type !== 'invitelinks' && (
                <div
                  className={`${DEFAULT_CLASSNAME}-fields`}
                  key={questionIdx}
                >
                  <p className={`${DEFAULT_CLASSNAME}-question`}>
                    {question.questionText}
                  </p>
                  {this.renderField(question.type, question)}
                </div>
              )
            );
          })
        ) : (
          <Loader />
        )}
        <div className={`${DEFAULT_CLASSNAME}-footer`}>
          <button className="previous" onClick={() => goPrevious()}>
            Previous
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { surveyStatus: state.SurveyData.surveyStatus };
};

DealGameTapeWrapup.propTypes = {
  uiType: PropTypes.string,
  goPrevious: PropTypes.func,
  storyId: PropTypes.number,
  opptyId: PropTypes.number,
  viewType: PropTypes.string,
  onComplete: PropTypes.func,
  surveyStatus: PropTypes.bool,
};
export default connect(mapStateToProps)(DealGameTapeWrapup);
