/* eslint-disable no-restricted-syntax */
import { get } from '../service';

export function getWinLossResult(urlParams) {
    return get(`winLoss/getCards?${urlParams}`);
}

