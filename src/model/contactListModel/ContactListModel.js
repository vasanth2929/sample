/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class ContactListModel extends BaseModel {
    static resource = 'contact_list';
    constructor(properties) {
        super(properties);
    }
}
