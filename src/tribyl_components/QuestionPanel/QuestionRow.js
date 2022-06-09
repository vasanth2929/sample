import React, { useState } from 'react';
import { connect } from 'react-redux';
import Checkbox from '../../components/Checkbox/Checkbox';
import Match from '../../components/Match/Match';
import {
  tagCardToStory,
  unverifyDealCardForStory,
  upsertStoryCardNotesForPBCard,
} from '../../util/promises/dealcards_promise';
import { getLoggedInUser } from '../../util/utils';
import { showCustomModal } from '../../components/CustomModal/CustomModal';
import { AddFeedBackForm } from '../../tribyl_components/Differentiation/AddFeedBackForm';
import './QuestionRow.style.scss';
import { withRouter } from 'react-router';

const DEFAULT_CLASSNAME = 'question-row';

const QuestionRow = ({
  data,
  storyId,
  opptyId,
  reload,
  surveyStatus,
  uiType,
  history,
}) => {
  const [Note, setNote] = useState(data.insightFromUser || '');
  const [isEditable, setisEditable] = useState(false);

  const handleVerification = async (status, id) => {
    const user = getLoggedInUser();
    if (status) {
      await tagCardToStory(id, storyId, user.userId);
    } else {
      await unverifyDealCardForStory(id, user.userId, storyId);
    }
  };

  const handleNotes = (id) => {
    setisEditable(true);
  };

  const handleNotesChange = (e) => {
    const note = e.target.value;
    setNote(note);
  };

  const handleSubmit = async (id) => {
    const user = getLoggedInUser();

    try {
      const encodedNote = encodeURIComponent(Note);
      await upsertStoryCardNotesForPBCard(
        encodedNote,
        id,
        storyId,
        user.userId
      );
      reload();
    } catch (err) {
      console.log(err);
    }
    setisEditable(false);
  };

  const getLoader = () => <div>Loading...</div>;

  const showDetailModal = (value) => {
    showCustomModal(
      <div className="d-flex justify-content-between">
        <h5 className="modal-title"> Description </h5>
      </div>,
      <AddFeedBackForm value={value} readOnly />,
      'story-modal',
      () => {},
      false,
      getLoader()
    );
  };

  const redirect = () => {
    const redirectUrl = `/conversation-analysis/${storyId}/${data.id}`;
    history.push(redirectUrl);
    // return () => {
    //   window.open(redirectUrl, '_self');
    // };
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}-container`}>
        <div className={`${DEFAULT_CLASSNAME}-container-question`}>
          <Checkbox
            id={data.id}
            isChecked={data.cardMetrics.verifiedByUser}
            oncheck={handleVerification}
            className={`${DEFAULT_CLASSNAME}-question-checkbox`}
            readOnly={uiType === 'ds' ? false : surveyStatus}
          />
          <div className={`${DEFAULT_CLASSNAME}-question-text mx-1`}>
            <span
              role="button"
              className="card_title"
              onClick={() => showDetailModal(data.cardDescription)}
            >
              {data.title}
            </span>
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}-container-action`}>
          <div className={`${DEFAULT_CLASSNAME}-container-action-votes`}>
            <span className="material-icons">bar_chart</span>
            <span>{data.cardMetrics.verifyCount} Votes</span>
          </div>
          <div className={`${DEFAULT_CLASSNAME}-container-action-matches`}>
            <Match
              count={data.cardMetrics.matchCount}
              isDisabled
              onClick={() => redirect(data.id)}
            />
          </div>
          <div>
            {isEditable ? (
              <button
                className={`${DEFAULT_CLASSNAME}-container-action-button`}
                onClick={() => setisEditable(false)}
              >
                Close
              </button>
            ) : (
              <button
                className={`${DEFAULT_CLASSNAME}-container-action-button ${
                  data.insightFromUser ? 'view_insights' : 'add_insight'
                }`}
                onClick={() => handleNotes(data.id)}
                disabled={uiType === 'ds' ? false : surveyStatus}
              >
                {data.insightFromUser ? 'View Insights' : 'Add Insights'}
              </button>
            )}
          </div>
        </div>
      </div>
      {isEditable && (
        <div className={`${DEFAULT_CLASSNAME}-insight`}>
          <textarea
            value={Note}
            onChange={handleNotesChange}
            className={`${DEFAULT_CLASSNAME}-insight-textarea`}
            rows="3"
            autoFocus
          />
          <div className={`${DEFAULT_CLASSNAME}-insight-action`}>
            <button
              onClick={() => handleSubmit(data.id)}
              className={`${DEFAULT_CLASSNAME}-insight-action-button`}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { surveyStatus: state.SurveyData.surveyStatus };
};

export default withRouter(connect(mapStateToProps)(QuestionRow));
