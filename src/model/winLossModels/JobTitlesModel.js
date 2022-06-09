/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class JobTitlesModel extends BaseModel {
    static resource = 'job_titles';
    constructor(properties) {
        super(properties);
    }
}
