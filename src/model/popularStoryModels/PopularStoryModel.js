/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class PopularStoryModel extends BaseModel {
    static resource = 'popular_story_model';
    constructor(properties) {
        super(properties);
    }
}
