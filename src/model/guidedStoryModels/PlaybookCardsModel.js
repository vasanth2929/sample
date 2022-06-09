/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class PlaybookCardsModel extends BaseModel {
    static resource = 'playbook_cards';
    constructor(properties) {
        super(properties);
    }
}
