import { HIDE_TOOLTIP, SHOW_TOOLTIP } from '../constants/general';

const initialState = {
    active: false,
    message: '',
    jsEvent: null
};

/** Used to handle the loading states of the different Async component instances. */
function tooltipReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_TOOLTIP:
            return Object.assign({}, state, {
                active: true,
                message: action.message,
                jsEvent: action.jsEvent
            });
        case HIDE_TOOLTIP:
            return Object.assign({}, state, {
                active: false,
                message: ''
            });
        default:
          return state;
    }
}

export default tooltipReducer;
