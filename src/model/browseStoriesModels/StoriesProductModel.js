/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class StoriesProductModel extends BaseModel {
    static resource = 'stories_product';

    constructor(properties) {
        super(properties);
    }
}
