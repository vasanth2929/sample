/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class DealCardsModel extends BaseModel {
    static resource = 'deal_cards';
    constructor(properties) {
        super(properties);
    }
}

export class DealCardsKeyMomentsModel extends BaseModel {
    static resource = 'deal_cards_key_moments';
    constructor(properties) {
        super(properties);
    }
}

export class DealCardsPersonaEngagementsModel extends BaseModel {
    static resource = 'deal_cards_persona_engagements';
    constructor(properties) {
        super(properties);
    }
}

export class DealCardsDiscussionsModel extends BaseModel {
    static resource = 'deal_cards_discussions';
    constructor(properties) {
        super(properties);
    }
}
