import {
  LOAD_CONFIG_PROPSET,
  CLEAR_CONFIG_PROPSET,
} from '../constants/general';

const applicationConfig = { propset: [] };

function configReducer(state = applicationConfig, action) {
  switch (action.type) {
    case LOAD_CONFIG_PROPSET:
      return { propset: action.config };
    case CLEAR_CONFIG_PROPSET:
      return {};
    default:
      return state;
  }
}

export default configReducer;
