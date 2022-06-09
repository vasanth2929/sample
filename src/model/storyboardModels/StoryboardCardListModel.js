/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';
import { isEmpty } from '../../util/utils';

export class StoryboardCardListModel extends BaseModel {
    static resource = 'storyboard_card_list_model';
    constructor(properties) {
        super(properties);
    }

    static updateCardContact(cardId, contact) {
        const cardInstance = this.last();
        if (isEmpty(cardInstance)) {
            return;
        }
        const cards = cardInstance.props;
        const newCards = {};
        Object.keys(cards).forEach((key) => {
            newCards[key] = [];
            if (Array.isArray(cards[key])) {
                cards[key].forEach((card) => {
                    if (cardId !== card.id) {
                        newCards[key].push({ ...card });
                        return;
                    }
    
                    const newCard = {
                        ...card,
                        contactId: contact.id,
                        contactName: contact.name,
                        jobTitleName: contact.jobTitleName,
                        contactEmail: contact.email
                    };
                    newCards[key].push(newCard);
                });
            }
        });
        new StoryboardCardListModel(newCards).$save();
    }

    static updateCardData(cardId, data) {
        const cardInstance = this.last();
        if (isEmpty(cardInstance)) {
            return;
        }
        const cards = cardInstance.props;
        const newCards = {};
        Object.keys(cards).forEach((key) => {
            newCards[key] = [];
            cards[key].forEach((card) => {
                if (cardId !== card.id) {
                    newCards[key].push({ ...card });
                    return;
                }

                const newCard = {
                    ...card,
                    ...data
                };
                newCards[key].push(newCard);
            });
        });
        new StoryboardCardListModel(newCards).$save();
    }
}
