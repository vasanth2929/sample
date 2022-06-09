/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class TearsheetModel extends BaseModel {
    static resource = 'tearsheet_personas';
    constructor(properties) {
        super(properties);
    }
}
