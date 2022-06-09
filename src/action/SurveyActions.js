import { dispatch } from '../util/utils';
import { SURVEY_COMPLETED_STATUS } from '../constants/general';

export function setSurveyStatus(payload) {
    return dispatch({
        type: SURVEY_COMPLETED_STATUS,
        payload
    });
}