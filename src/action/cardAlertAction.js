import { UPDATE_CARD_ALERTS, CLEAR_CARD_ALERTS } from '../constants/general';

export function updateCardAlerts(cardName) {
    return {
        type: UPDATE_CARD_ALERTS,
        cardName
    };
}

export function clearCardAlerts() {
    return { type: CLEAR_CARD_ALERTS };
}
