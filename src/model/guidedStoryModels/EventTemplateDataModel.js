/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class EventTemplateDataModel extends BaseModel {
    static resource = 'event_template_data';
    constructor(properties) {
        super(properties);
    }
}
