/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class BuyerListModel extends BaseModel {
    static resource = 'browse_story_list';

    constructor(properties) {
        super(properties);
    }
}
