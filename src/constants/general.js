export const LOADING = 'LOADING';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING = 'SET_LOADING';
export const SET_SUCCESS = 'SET_SUCCESS';
export const RELOAD = 'RELOAD';
export const UNSET_RELOAD = 'UNSET_RELOAD';
export const ERROR_STATE = { isLoading: false, hasError: true };
export const PENDING_STATE = { isLoading: true, hasError: false };
export const SUCCESS_STATE = { isLoading: false, hasError: false };
export const SET_LOADING_STATE = 'SET_LOADING_STATE';
export const CLEAR_IDENTIFIER_FROM_STATE = 'CLEAR_IDENTIFIER_FROM_STATE';
export const DELETE_ALL_INSTANCES = 'DELETE_ALL_INSTANCES';
export const DELETE_INSTANCE = 'DELETE_INSTANCE';
export const SAVE_ALL_INSTANCES = 'SAVE_ALL_INSTANCES';
export const SAVE_INSTANCE = 'SAVE_INSTANCE';
export const SAVE_LAST = 'SAVE_LAST';
export const INVALID_INSTANCE_CANNOT_SAVE = 'INVALID_INSTANCE_CANNOT_SAVE';
export const ENABLE_ALL = 'ENABLE_ALL';
export const DISABLE_ALL = 'DISABLE_ALL';
export const HIDE_TOOLTIP = 'HIDE_TOOLTIP';
export const SHOW_TOOLTIP = 'SHOW_TOOLTIP';
export const HIDE_MODAL = 'HIDE_MODAL';
export const SHOW_MODAL = 'SHOW_MODAL';
export const SHOW_NOTE_UPDATE = 'SHOW_NOTE_UPDATE';
export const HIDE_NOTE_UPDATE = 'HIDE_NOTE_UPDATE';
export const SHOW_NOTE_CREATE = 'SHOW_NOTE_CREATE';
export const HIDE_NOTE_CREATE = 'HIDE_NOTE_CREATE';
export const SHOW_SIDE_NOTE = 'SHOW_SIDE_NOTE';
export const HIDE_SIDE_NOTE = 'HIDE_SIDE_NOTE';
export const CLOSE_SIDE_NOTE = 'CLOSE_SIDE_NOTE';
export const RESET_SIDE_NOTE = 'RESET_SIDE_NOTE';
export const SET_SIDE_NOTE = 'SET_SIDE_NOTE';
export const VIEW_SIDE_NOTE = 'VIEW_SIDE_NOTE';
export const SWITCH_SUB_TABS = 'SWITCH_SUB_TABS';

export const SHOW_STORY_SIDE_NOTE = 'SHOW_STORY_SIDE_NOTE';
export const HIDE_STORY_SIDE_NOTE = 'HIDE_STORY_SIDE_NOTE';
export const CLOSE_STORY_SIDE_NOTE = 'CLOSE_STORY_SIDE_NOTE';
export const RESET_STORY_SIDE_NOTE = 'RESET_STORY_SIDE_NOTE';
export const SET_STORY_SIDE_NOTE = 'SET_STORY_SIDE_NOTE';

export const SET_CARD_COUNTS = 'SET_CARD_COUNTS';
export const RESET_CARD_COUNTS = 'RESET_CARD_COUNTS';

export const SET_OPPTY_PLAN_VERIFIED_CARDS = 'SET_OPPTY_PLAN_VERIFIED_CARDS';
export const RESET_OPPTY_PLAN_VERIFIED_CARDS =
  'RESET_OPPTY_PLAN_VERIFIED_CARDS';

export const SELECT_PLAYBOOK = 'SELECT_PLAYBOOK';
export const RESET_PLAYBOOK = 'RESET_PLAYBOOK';
export const LOAD_PLAYBOOKS = 'LOAD_PLAYBOOKS';

export const UPDATE_CARD_ALERTS = 'UPDATE_CARD_ALERTS';
export const CLEAR_CARD_ALERTS = 'CLEAR_CARD_ALERTS';

export const ADD_ANALYZE_CARDS = 'ADD_ANALYZE_CARDS';
export const REMOVE_ANALYZE_CARDS = 'REMOVE_ANALYZE_CARDS';
export const RESET_CARDS = 'RESET_CARDS';
export const SWITCH_TABS = 'SWITCH_TABS';
export const SELECT_NOTE_CARD = 'SELECT_NOTE_CARD';
export const SURVEY_ACTIVE_INDEX = 'SURVEY_ACTIVE_INDEX';
export const SURVEY_COMPLETED_CATEGORY = 'SURVEY_COMPLETED_CATEGORY';
export const SURVEY_COMPLETED_STATUS = 'SURVEY_COMPLETED_STATUS';
export const SELECTED_SURVEY_OPPTYS = 'SELECTED_SURVEY_OPPTYS';

export const UPDATE_MARKET_PERFORMANCE_FILTERS =
  'UPDATE_MARKET_PERFORMANCE_FILTERS';
export const RESET_MARKET_PERFORMANCE_FILTERS =
  'RESET_MARKET_PERFORMANCE_FILTERS';

export const DEAL_GAME_TAPE_ACTIVE_INDEX = 'DEAL_GAME_TAPE_ACTIVE_INDEX';
export const DEAL_GAME_TAPE_RESET_ACTIVE_INDEX =
  'DEAL_GAME_TAPE_RESET_ACTIVE_INDEX';
export const DEAL_GAME_TAPE_COMPLETED_CATEGORY =
  'DEAL_GAME_TAPE_COMPLETED_CATEGORY';
export const DEAL_GAME_TAPE_RESET_COMPLETED_CATEGORY =
  'DEAL_GAME_TAPE_RESET_COMPLETED_CATEGORY';

export const LOAD_CONFIG_PROPSET = 'LOAD_CONFIG_PROPSET';
export const CLEAR_CONFIG_PROPSET = 'CLEAR_CONFIG_PROPSET';

// header icon click actions
export const Icons = {
  WIDGET: 'widget',
  GUIDED_STORYBUILDING: 'guided_storybuilding',
  DELETE: 'delete',
  DELETE_DISABLED: 'delete role-disabled',
  PLAY: 'play',
  RECORD: 'record',
  RECORD_DISABLED: 'record role-disabled',
  STORYBOARD: 'storyboard',
  CREATE_NEW: 'create_new',
  CREATE_NEW_DISABLED: 'create_new role-disabled',
  SHARE: 'share',
  BOOKMARK: 'bookmark',
  FILTER: 'filter',
  DOCUMENT: 'document',
  NOTIFICATION: 'notification',
  HELP: 'help',
  PODCAST: 'podcast',
  SAVE: 'save',
  TRANSCRIPT: 'transcipt',
  CALL_TRANSCRIPT: 'call_transcript',
  EMAIL_TRANSCRIPT: 'email_transcript',
  NOTES: 'notes',
};

// category based class names
export const category = {
  WHY_US: 'why us',
  WHY_CHANGE: 'why change',
  WHO_DECIDES: 'who decides',
};

// form field types

export const FieldTypes = {
  MULTIPLE: 'multiple',
  CHECKBOX: 'checkbox',
  TEXT_AREA: 'textarea',
  TEXT_FIELD: 'textfield',
  FILE: 'file',
  DROPDOWN: 'dropdown',
  RADIO_GROUP: 'radiogroup',
  URL: 'url',
};

export const MONTHS = [
  {
    fullName: 'January',
    shortName: 'Jan',
  },
  {
    fullName: 'February',
    shortName: 'Feb',
  },
  {
    fullName: 'March',
    shortName: 'Mar',
  },
  {
    fullName: 'April',
    shortName: 'Apr',
  },
  {
    fullName: 'May',
    shortName: 'May',
  },
  {
    fullName: 'June',
    shortName: 'Jun',
  },
  {
    fullName: 'July',
    shortName: 'Jul',
  },
  {
    fullName: 'August',
    shortName: 'Aug',
  },
  {
    fullName: 'September',
    shortName: 'Sep',
  },
  {
    fullName: 'October',
    shortName: 'Oct',
  },
  {
    fullName: 'November',
    shortName: 'Nov',
  },
  {
    fullName: 'December',
    shortName: 'Dec',
  },
];

export const DAYS = [
  {
    fullName: 'Sunday',
    shortName: 'Sun',
  },
  {
    fullName: 'Monday',
    shortName: 'Mon',
  },
  {
    fullName: 'Tuesday',
    shortName: 'Tue',
  },
  {
    fullName: 'Wednesday',
    shortName: 'Wed',
  },
  {
    fullName: 'Thursday',
    shortName: 'Thu',
  },
  {
    fullName: 'Friday',
    shortName: 'Fri',
  },
  {
    fullName: 'Saturday',
    shortName: 'Sat',
  },
];
