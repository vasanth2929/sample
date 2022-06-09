/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class MyStoriesModel extends BaseModel {
    static resource = 'my_stories_personas';
    constructor(properties) {
        super(properties);
    }
}

export class StoryListModel extends BaseModel {
    static resource = 'story_list';
    constructor(properties) {
        super(properties);
    }
}
