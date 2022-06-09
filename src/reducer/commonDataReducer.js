import { SET_OPPTY_PLAN_VERIFIED_CARDS, RESET_OPPTY_PLAN_VERIFIED_CARDS } from '../constants/general';

const initialState = {
    opptyPlanVerifiedCards: []
};

function commonDataReducer(state = initialState, action) {
    switch (action.type) {
        case SET_OPPTY_PLAN_VERIFIED_CARDS:
            return Object.assign({}, state, {
                opptyPlanVerifiedCards: action.opptyPlanVerifiedCards
            });
        case RESET_OPPTY_PLAN_VERIFIED_CARDS:
            return Object.assign({}, state, {
                opptyPlanVerifiedCards: []
            });
        default:
          return state;
    }
}

export default commonDataReducer;
