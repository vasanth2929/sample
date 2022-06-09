/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class PlaybooksSourceModel extends BaseModel {
    static resource = 'playbook_source';
    constructor(properties) {
        super(properties);
    }
}
