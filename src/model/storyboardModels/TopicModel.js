/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class TopicModel extends BaseModel {
    static resource = 'topics';
    constructor(properties) {
        super(properties);
    }
}
