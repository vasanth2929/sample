/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class AvgDealProfilesModel extends BaseModel {
    static resource = 'avg-deal-profiles_count';
    constructor(properties) {
        super(properties);
    }
}
