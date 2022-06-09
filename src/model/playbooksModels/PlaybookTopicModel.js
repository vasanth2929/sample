/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class PlaybookTopicModel extends BaseModel {
    static resource = 'playbook_topic_detail';
    constructor(properties) {
        super(properties);
    }
}
