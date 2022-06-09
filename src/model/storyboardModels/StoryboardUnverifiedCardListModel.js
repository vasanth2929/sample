/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';
import { isEmpty } from '../../util/utils';

export class StoryboardUnverifiedCardListModel extends BaseModel {
    static resource = 'storyboard_unverified_card_list_model';
    constructor(properties) {
        super(properties);
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
        new StoryboardUnverifiedCardListModel(newCards).$save();
    }
}
