import { SELECT_PLAYBOOK, RESET_PLAYBOOK, LOAD_PLAYBOOKS } from '../constants/general';

const initialState = {
    playbooks: [],
    selectedPlaybooks: []
};

function modalReducer(state = initialState, action) {
    switch (action.type) {
        case SELECT_PLAYBOOK:
            return Object.assign({}, state, { playbook: action.playbook });
        case LOAD_PLAYBOOKS:
            return { ...state, playbooks: action.payload };
        case RESET_PLAYBOOK:
            return Object.assign({}, state, { playbook: {} });
        default:
            return state;
    }
}

export default modalReducer;
