import { HIDE_MODAL, SHOW_MODAL } from '../constants/general';

const initialState = { showModal: true };

/** Used to handle the loading states of the different Async component instances. */
function modalReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_MODAL:
            return Object.assign({}, state, { showModal: true });
        case HIDE_MODAL:
            return Object.assign({}, state, { showModal: false });
        default:
          return state;
    }
}

export default modalReducer;
