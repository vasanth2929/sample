/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class SingleAccountModel extends BaseModel {
    static resource = 'account_detail';

    constructor(properties) {
        super(properties);
    }
}
