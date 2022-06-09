/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class StoryCountsModel extends BaseModel {
    static resource = 'story_counts_results';
    constructor(properties) {
        super(properties);
    }
}
