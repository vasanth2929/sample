/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class TopicKeywordModels extends BaseModel {
    static resource = 'keywords';
    constructor(properties) {
        super(properties);
    }
}

export class PlaybookKeywordModels extends BaseModel {
    static resource = 'playbook_keywords';
    constructor(properties) {
        super(properties);
    }
}
