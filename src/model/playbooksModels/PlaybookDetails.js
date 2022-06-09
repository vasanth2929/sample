/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class PlaybookDetailsModel extends BaseModel {
    static resource = 'playbook_details_personas';
    constructor(properties) {
        super(properties);
    }
}
