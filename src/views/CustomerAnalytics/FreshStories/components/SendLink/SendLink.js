import React from 'react';
import PropTypes from 'prop-types';
import { hideModal } from '../../../../../action/modalActions';
import './SendLink.style.scss';

function SendLink({ sendSurveyAfterConfirmation }) {
    const handleCancel = () => {
        hideModal();
    };

    const handleSubmit = () => {
        sendSurveyAfterConfirmation();
        hideModal();
    }
    return (
        <div className="send_link">
            <p>Are you sure you want to send out the surveys ?</p>
            <div className="form-footer-actions d-flex justify-content-end">
            <button className="btn cancel-btn" onClick={handleCancel}>Cancel</button>
            <button className="btn save-btn" onClick={handleSubmit}>Yes</button>
            </div>
            
        </div>
    );
}

SendLink.prototype = {
    sendSurveyAfterConfirmation: PropTypes.func
};

export default SendLink;
