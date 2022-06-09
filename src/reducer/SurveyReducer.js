import { SURVEY_ACTIVE_INDEX, SURVEY_COMPLETED_CATEGORY, SURVEY_COMPLETED_STATUS } from '../constants/general';

const initialState = {
    activeCategory: null,
    CompletedCategory: null,
    surveyStatus: false
};

function SurveyReducer(state = initialState, action) {
    switch (action.type) {
        case SURVEY_ACTIVE_INDEX: {
            return { ...state, activeCategory: action.payload };
        }
        case SURVEY_COMPLETED_CATEGORY: {
            return { ...state, CompletedCategory: action.payload };
        }
        case SURVEY_COMPLETED_STATUS: {
            return { ...state, surveyStatus: action.payload };
        }
        default:
            return state;
    }
}

export default SurveyReducer;
