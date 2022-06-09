import { dispatch } from '../util/utils';
import { LOAD_CONFIG_PROPSET } from '../constants/general';

export function loadConfigPropset(config) {
  dispatch({
    type: LOAD_CONFIG_PROPSET,
    config,
  });
}
