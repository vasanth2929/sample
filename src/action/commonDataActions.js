import { dispatch } from '../util/utils';
import { SET_OPPTY_PLAN_VERIFIED_CARDS, RESET_OPPTY_PLAN_VERIFIED_CARDS } from '../constants/general';

export function setOpptyPlanVerifiedCards(opptyPlanVerifiedCards) {
    return dispatch({
        type: SET_OPPTY_PLAN_VERIFIED_CARDS,
        opptyPlanVerifiedCards
    });
}

export function resetOpptyPlanVerifiedCards() {
    return dispatch({
        type: RESET_OPPTY_PLAN_VERIFIED_CARDS,
    });
}
