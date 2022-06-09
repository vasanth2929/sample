/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class WinLossResultModel extends BaseModel {
    static resource = 'win_loss_results';
    constructor(properties) {
        super(properties);
    }
}
