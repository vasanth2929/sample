/* eslint-disable no-underscore-dangle */
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import logger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { loadUser } from 'redux-oidc';
import { getSessionStorageData, saveToSessionStorage } from './utils';
import reducers from '../reducer/index';
import userManager from './userManager';

// added for redux developer tool
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunk, promise];

if (process.env.NODE_ENV === 'development') {
  // middleware.push(logger);
}

const persistedState = getSessionStorageData();
const store = createStore(
  reducers,
  persistedState,
  composeEnhancers(applyMiddleware(...middleware))
);
loadUser(store, userManager);

store.subscribe(() => {
  saveToSessionStorage({
    marketPerformanceFilters: store.getState().marketPerformanceFilters,
  });
});

export default store;
