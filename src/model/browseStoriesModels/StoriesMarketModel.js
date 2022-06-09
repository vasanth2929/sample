/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class StoriesMarketModel extends BaseModel {
    static resource = 'stories_market';

    constructor(properties) {
        super(properties);
    }
}
