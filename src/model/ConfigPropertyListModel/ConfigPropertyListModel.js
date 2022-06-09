/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class ConfigPropertyListModel extends BaseModel {
    static resource = 'config_property_list';

    constructor(properties) {
        super(properties);
    }
}
