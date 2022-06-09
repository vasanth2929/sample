import { dispatch, saveToLocalStorage } from '../util/utils';
import { SELECT_PLAYBOOK, RESET_PLAYBOOK, LOAD_PLAYBOOKS } from '../constants/general';

export function selectPlaybook(playbook) {
    saveToLocalStorage("Selectedplaybook", playbook);
    return dispatch({
        type: SELECT_PLAYBOOK,
        playbook
    });
}

export function resetPlaybook() {
    return dispatch({ type: RESET_PLAYBOOK });
}

export function loadPlaybooks(payload) {
    saveToLocalStorage("playbooks", payload);
    return dispatch({
        type: LOAD_PLAYBOOKS,
        payload
    });
}

