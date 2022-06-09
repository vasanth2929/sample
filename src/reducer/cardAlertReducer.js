import { UPDATE_CARD_ALERTS, CLEAR_CARD_ALERTS } from '../constants/general';

const alertedCards = [];

function modalReducer(state = alertedCards, action) {
    switch (action.type) {
        case UPDATE_CARD_ALERTS:
            if (state.indexOf(action.cardName) > -1) {
                return state.filter(element => element !== action.cardName);
            } return [...state, action.cardName];
        case CLEAR_CARD_ALERTS:
            return [];
        default:
          return state;
    }
}

export default modalReducer;
