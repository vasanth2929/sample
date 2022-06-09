import React from 'react';
import PropTypes from 'prop-types';
import './SurveyCompleted.style.scss';
import { hideModal } from '../../../action/modalActions';

function SurveyCompleted({ storyId, opptyId }) {
  const handleSubmit = () => {
    // window.open(`/dealgametape/storyId/${storyId}/opptyId/${opptyId}`, '_self');
    window.open(`/splash-screen`, '_self');
    hideModal();
  };
  return (
    <div className="survey_completed">
      <p>Thank you for submitting the survey</p>
      <button onClick={handleSubmit}>Go to Main Menu</button>
    </div>
  );
}

SurveyCompleted.propTypes = {
  storyId: PropTypes.number,
  opptyId: PropTypes.number,
};

export default SurveyCompleted;
