import { dispatch } from '../util/utils';
import {
  LOADING,
  SET_ERROR,
  SET_LOADING,
  SET_SUCCESS,
  RELOAD,
  UNSET_RELOAD,
  CLEAR_IDENTIFIER_FROM_STATE,
} from '../constants/general';

export function executePromiseAction(promise, identifier) {
  return dispatch({
    type: `${identifier}/${LOADING}`,
    payload: { promise },
    meta: { identifier },
  });
}

/** Used to set the loading state of a particular component to loading. */
export function setLoading(identifier) {
  dispatch({
    type: `${identifier}/${SET_LOADING}`,
    meta: { identifier },
  });
}

/** Used to set the loading state of a particular component to error. */
export function setError(identifier) {
  dispatch({
    type: `${identifier}/${SET_ERROR}`,
    meta: { identifier },
  });
}

/** Used to set the loading state of a particular component to success. */
export function setSuccess(identifier) {
  dispatch({
    type: `${identifier}/${SET_SUCCESS}`,
    meta: { identifier },
  });
}

export function reload(identifier) {
  dispatch({
    type: `${identifier}/${RELOAD}`,
    identifier,
  });
}

export function unsetReload(identifier) {
  dispatch({
    type: `${identifier}/${UNSET_RELOAD}`,
    identifier,
  });
}

export function clearComponent(identifier) {
  dispatch({
    type: `${identifier}/${CLEAR_IDENTIFIER_FROM_STATE}`,
    meta: { identifier },
  });
}
