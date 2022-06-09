import { fromJS } from 'immutable';
import {
    LOADING, SET_ERROR, SET_LOADING, SET_LOADING_STATE, SET_SUCCESS, RELOAD, UNSET_RELOAD,
    ERROR_STATE, PENDING_STATE, SUCCESS_STATE, CLEAR_IDENTIFIER_FROM_STATE
} from '../constants/general';


/** Used to handle the loading states of the different Async component instances. */
function loadingReducer(state = fromJS({}), {
 type, meta, payload, ...action 
}) {
    const typeTokens = type.split('/');
    switch (typeTokens[1]) {
        case LOADING:
            return state.set(meta.identifier, SUCCESS_STATE);
        case `${LOADING}_PENDING`:
            return state.set(meta.identifier, PENDING_STATE);
        case `${LOADING}_FULFILLED`:
            return state.set(meta.identifier, SUCCESS_STATE);
        case `${LOADING}_REJECTED`:
            return state.set(meta.identifier, ERROR_STATE);
        case SET_LOADING_STATE:
            return state.set(meta.identifier, payload);
        case SET_LOADING:
            return state.set(meta.identifier, PENDING_STATE);
        case SET_ERROR:
            return state.set(meta.identifier, ERROR_STATE);
        case SET_SUCCESS:
            return state.set(meta.identifier, SUCCESS_STATE);
        case RELOAD:
            return state.set(
                '$reload',
                [...state.get('$reload', []), action.identifier]
            );
        case UNSET_RELOAD:
            return state.set(
                '$reload',
                state.get('$reload', []).filter(val => val !== action.identifier)
            );
        case CLEAR_IDENTIFIER_FROM_STATE:
            return state.delete(meta.identifier);
        default: return state;
    }
}

export default loadingReducer;

