/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class PlaybookStoriesListModel extends BaseModel {
    static resource = 'playbook_stories_list';
    constructor(properties) {
        super(properties);
    }
}
