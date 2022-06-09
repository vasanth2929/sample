import { dispatch } from '../util/utils';

/** Used by components to update their state to the store . */
export function updateState(identifier, ...action) {
    dispatch({
        type: `${identifier}`,
        meta: { action }
    });
}
