/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class PlaybooksListModel extends BaseModel {
    static resource = 'playbook_list_personas';
    constructor(properties) {
        super(properties);
    }
}
