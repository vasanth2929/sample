/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class PlaybookCardListModel extends BaseModel {
    static resource = 'playbook_card_story_list';
    constructor(properties) {
        super(properties);
    }
}
