/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';
import { isEmpty } from '../../util/utils';

export class OpptyPlanCardModel extends BaseModel {
    static resource = 'oppty_plan_card_model';
    constructor(properties) {
        super(properties);
    }

    static updateCardContact(cardId, contact) {
        const cardInstance = this.last();
        if (isEmpty(cardInstance)) {
            return;
        }
        const newCard = {
            ...cardInstance.props,
            contactId: contact.id,
            contactName: contact.name,
            jobTitleName: contact.jobTitleName,
            contactEmail: contact.email
        };
        new OpptyPlanCardModel(newCard).$save();
    }

    static updateCardDetails(data) {
        const cardInstance = this.last();
        if (isEmpty(cardInstance)) {
            return;
        }
        const newCard = {
            ...cardInstance.props,
            ...data
        };
        new OpptyPlanCardModel(newCard).$save();
    }
}
