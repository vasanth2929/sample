/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class StoriesListModel extends BaseModel {
    static resource = 'stories_list';
    constructor(properties) {
        super(properties);
    }
}
