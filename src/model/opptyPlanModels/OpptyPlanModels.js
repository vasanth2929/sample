/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class AccountTeamListModel extends BaseModel {
    static resource = 'oppty_plan_contact_list';
    constructor(properties) {
        super(properties);
    }
}

export class ContactSummaryModel extends BaseModel {
    static resource = 'oppty_plan_contact_summary';
    constructor(properties) {
        super(properties);
    }
}

export class ContactListModel extends BaseModel {
    static resource = 'oppty_plan_contact_list';
    constructor(properties) {
        super(properties);
    }
}

export class ContactListChartModel extends BaseModel {
    static resource = 'oppty_plan_contact_list_chart';
    constructor(properties) {
        super(properties);
    }
}

export class OptyPlanModel extends BaseModel {
    static resource = 'oppty_plan';
    constructor(properties) {
        super(properties);
    }

    static updateCardDetail(data) {
        const optyPlanInstance = this.last();
        if (!optyPlanInstance) return;
        const optyPlan = JSON.parse(JSON.stringify(optyPlanInstance.props));
        optyPlan.opptyPlanRec.topics.forEach((topic) => {
            const cardIndex = topic.cardDetails.findIndex(i => i.cardId === data.cardId);
            if (cardIndex !== -1) {
                topic.cardDetails[cardIndex] = data;
            }
        });
        new OptyPlanModel(optyPlan).$save();
    }
}

export class OptyPersonaModel extends BaseModel {
    static resource = 'oppty_plan_personas';
    constructor(properties) {
        super(properties);
    }

    static updateCardDetail(id, data) {
        const instance = this.get(id);
        if (!instance) return;
        new OptyPersonaModel({ ...instance.props, ...data }).$save();
    }
}

