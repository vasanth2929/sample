import { dispatch } from '../util/utils';
import { SET_CARD_COUNTS, RESET_CARD_COUNTS } from '../constants/general';

export function setOpptyCardCounts(opptyCardCounts) {
    return dispatch({
        type: SET_CARD_COUNTS,
        opptyCardCounts
    });
}

export function resetOpptyCardCounts() {
    return dispatch({
        type: RESET_CARD_COUNTS,
    });
}
