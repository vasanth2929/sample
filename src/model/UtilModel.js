/* eslint-disable no-useless-constructor */
import { BaseModel } from './BaseModel';

export class UtilModel extends BaseModel {
    static resource = 'util_personas';
    constructor(properties) {
        super(properties);
    }

    static updateData(data) {
        const instance = this.last();
        let props = {};
        if (instance) {
            props = instance.props;
        }
        new UtilModel({ ...props, ...data }).$save();
    }

    static getValue(key) {
        const instance = this.last();
        if (!instance) {
            return null;
        }
        return instance.props[key];
    }
}
