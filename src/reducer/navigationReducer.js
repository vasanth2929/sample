import { DISABLE_ALL, ENABLE_ALL } from '../constants/general';

const initialState = { allEnabled: false, filterType: 'default' };

/** Used to handle the loading states of the different Async component instances. */
function navigationReducer(state = initialState, action) {
    switch (action.type) {
        case 'filterType': 
            return Object.assign({}, state, { filterType: action.filterType });
        case ENABLE_ALL:
            return Object.assign({}, state, { allEnabled: true });
        case DISABLE_ALL:
            return Object.assign({}, state, { allEnabled: false });
        default:
          return state;
    }
}

export default navigationReducer;
