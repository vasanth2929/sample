/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class BrowseStoryModel extends BaseModel {
    static resource = 'browse_story';

    constructor(properties) {
        super(properties);
    }
}
