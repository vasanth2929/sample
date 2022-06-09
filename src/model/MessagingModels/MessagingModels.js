import { BaseModel } from '../BaseModel';

export class PlaybookSourceModel extends BaseModel {
    static resource = 'playbook_details_personas';
    constructor(properties) {
        super(properties);
    }
}

export class PlaybookPainPointsModel extends BaseModel {
    static resource = 'pain_points_cards';
    constructor(properties) {
        super(properties);
    }
}

export class PlaybookUseCasesModel extends BaseModel {
    static resource = 'use_cases_cards';
    constructor(properties) {
        super(properties);
    }
}
export class PlaybookJustificationModel extends BaseModel {
    static resource = 'justification_cards';
    constructor(properties) {
        super(properties);
    }
}

export class PlaybookDecisionCriteriaModel extends BaseModel {
    static resource = 'decision_criteria_cards';
    constructor(properties) {
        super(properties);
    }
}

export class PlaybookCompetitionModel extends BaseModel {
    static resource = 'competition_cards';
    constructor(properties) {
        super(properties);
    }
}


