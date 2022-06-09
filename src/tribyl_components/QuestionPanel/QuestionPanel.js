import { Tooltip } from '@material-ui/core';
import HelpOutline from '@material-ui/icons/HelpOutline';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createPBCardForQuestionForSubtypeForSolution } from '../../util/promises/playbooks_promise';
import { topicToolTips } from '../../util/utils';
import { Loader } from '../../_tribyl/components/_base/Loader/Loader';
import QuestionContainer from './QuestionContainer';
import './QuestionPanel.style.scss';

const DEFAULT_CLASSNAME = 'question-panel';

const QuestionPanel = ({
  location,
  type,
  data,
  onComplete,
  opptyId,
  storyId,
  goPrevious,
  surveyStatus,
  uiType,
  isLoading,
  reload,
  activeIndex,
  setActiveQuestion,
  toolTipIndex,
}) => {
  const [question, setQuestion] = useState([]);
  const [index, setindex] = useState(activeIndex);
  const [cardTitle, setcardTitle] = useState('');
  const [isEditable, setisEditable] = useState(false);
  const pathname = location.pathname;

  useEffect(() => {
    setcardTitle('');
    setisEditable(false);
    setQuestion(data);
    return () => setindex(0);
  }, [type, pathname, isLoading, data]);

  // eslint-disable-next-line no-shadow
  const handleNavigation = (index) => {
    if (index >= 0 && index <= question.marketStudyQuestionList.length - 1) {
      setindex(index);
      setActiveQuestion(index);
      setisEditable(false);
    } else if (index === question.marketStudyQuestionList.length) {
      onComplete();
      setisEditable(false);
    } else if (index < 0) {
      goPrevious();
      setisEditable(false);
    }
  };

  const handleCardChange = (e) => {
    const title = e.target.value;
    setcardTitle(title);
  };

  const handleSave = (questionId, cardSubType) => {
    if (cardTitle.trim().length > 0) {
      const payload = {
        description: '',
        questionId,
        title: cardTitle,
        playbookId: 9,
        cardSubType: cardSubType,
        storyId,
        isTestCard: 'Y',
      };
      createPBCardForQuestionForSubtypeForSolution(payload).then((response) => {
        reload();
      });
    }
  };

  const renderQuestion = (data, index) => {
    return (
      <React.Fragment>
        <div className={`${DEFAULT_CLASSNAME}-card-header`}>
          <p className="muted d-flex justify-content-between">
            QUESTIONS {index + 1}/{question.marketStudyQuestionList.length}
            <Tooltip title={topicToolTips[toolTipIndex + index].tip}>
              <HelpOutline />
            </Tooltip>
          </p>
          <p className="d-flex align-items-center">
            <span className="question-text">{data.questionText} </span>
          </p>

          <div className="new-card-container">
            {isEditable ? (
              <React.Fragment>
                <div className="new-card-input editable">
                  <input
                    onChange={handleCardChange}
                    maxLength="33"
                    value={cardTitle}
                    placeholder="Add a new answer or select from below."
                  />
                  <div className="counter">{`${cardTitle.length}/33`}</div>
                </div>
                <div
                  role="button"
                  className="new-card-container-save"
                  onClick={() =>
                    handleSave(
                      data.questionId,
                      topicToolTips[toolTipIndex + index].topic
                    )
                  }
                >
                  <span className="material-icons">done</span>
                </div>
                <div
                  role="button"
                  className="new-card-container-cancel"
                  onClick={() => setisEditable(false)}
                >
                  <span className="material-icons">close</span>
                </div>
              </React.Fragment>
            ) : (
              <div className="new-card-input">
                <input
                  onFocus={() => setisEditable(true)}
                  placeholder="Add a new answer or select from below"
                  disabled={uiType === 'ds' ? false : surveyStatus}
                />
              </div>
            )}
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}-card-body`}>
          {/* {!isLoading && loadCardsAndRender(data.questionId)} */}
          <QuestionContainer
            storyId={storyId}
            opptyId={opptyId}
            questionId={data.questionId}
            uiType={uiType}
          />
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <p className={`${DEFAULT_CLASSNAME}-title`}>{type}</p>
      <p className={`${DEFAULT_CLASSNAME}-sub-title`}>
        What were the customer’s requirements and evaluation criteria?
      </p>
      <div className={`${DEFAULT_CLASSNAME}-card`}>
        {!isLoading && question && Object.keys(question).length > 0 ? (
          <React.Fragment>
            {question &&
              renderQuestion(question.marketStudyQuestionList[index], index)}
            <div className={`${DEFAULT_CLASSNAME}-card-footer`}>
              <button
                className="previous"
                onClick={() => handleNavigation(index - 1)}
              >
                Previous
              </button>
              <button
                className="save"
                onClick={() => handleNavigation(index + 1)}
              >
                {surveyStatus ? 'Proceed' : 'Save and proceed'}
              </button>
            </div>
          </React.Fragment>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { surveyStatus: state.SurveyData.surveyStatus };
};

export default connect(mapStateToProps)(QuestionPanel);
