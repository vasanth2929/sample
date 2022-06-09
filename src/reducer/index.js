import { combineReducers } from 'redux';
import { reducer as oidc } from 'redux-oidc';

import loadingReducer from './loadingReducer';
import modelReducer from './modelReducer';
import modalReducer from './modalReducer';
import sideNoteReducer from './sideNoteReducer';
import storyNoteReducer from './storyNoteReducer';
import opptyCardCountsReducer from './opptyCardCountsReducer';
import { FormReducer } from './formReducer';
import tooltipReducer from './tooltipReducer';
import navigationReducer from './navigationReducer';
import commonDataReducer from './commonDataReducer';
import playbookSelectionReducer from './playbookSelectionReducer';
import cardAlertReducer from './cardAlertReducer';
import marketAnalysisReducer from './marketAnalysisReducer';
import SurveyReducer from './SurveyReducer';
import marketPerformanceFiltersReducer from './marketPerformanceFiltersReducer';
import dealGameTapeReducer from './dealGameTapeReducer';
import configReducer from './configReducer';

const appReducer = combineReducers({
  loading: loadingReducer,
  models: modelReducer,
  form: FormReducer,
  modal: modalReducer,
  tooltip: tooltipReducer,
  sideNote: sideNoteReducer,
  storyNote: storyNoteReducer,
  navigation: navigationReducer,
  opptyCardCounts: opptyCardCountsReducer,
  commonData: commonDataReducer,
  playbook: playbookSelectionReducer,
  cardAlerts: cardAlertReducer,
  marketAnalysisReducer,
  SurveyData: SurveyReducer,
  marketPerformanceFilters: marketPerformanceFiltersReducer,
  dealGameTape: dealGameTapeReducer,
  oidc,
  config: configReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
