/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class PlaybooksTargetModel extends BaseModel {
    static resource = 'playbook_target';
    constructor(properties) {
        super(properties);
    }
}
