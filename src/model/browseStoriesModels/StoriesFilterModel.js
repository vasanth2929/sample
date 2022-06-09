/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class StoriesFilterModel extends BaseModel {
    static resource = 'stories_filter';

    constructor(properties) {
        super(properties);
    }
}
