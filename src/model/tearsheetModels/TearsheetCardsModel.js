/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class TearsheetCardsModel extends BaseModel {
    static resource = 'tearsheet_cards';
    constructor(properties) {
        super(properties);
    }
}
