import { SET_CARD_COUNTS, RESET_CARD_COUNTS } from '../constants/general';

const initialState = {
    opptyCardCounts: {
        ALL: {
            playbookCount: 0,
            insightCount: 0,
            callPlanCount: 0
        },
        OBJECTIONS: {
            playbookCount: 0,
            insightCount: 0,
            callPlanCount: 0
        },
        COMPETITION: {
            playbookCount: 0,
            insightCount: 0,
            callPlanCount: 0
        },
        ACTIVITIES: {
            playbookCount: 0,
            insightCount: 0,
            callPlanCount: 0
        },
        "BUYING COMMITTEE": {
            playbookCount: 0,
            insightCount: 0,
            callPlanCount: 0
        },
        SOLUTION: {
            playbookCount: 0,
            insightCount: 0,
            callPlanCount: 0
        },
        CONTENT: {
            playbookCount: 0,
            insightCount: 0,
            callPlanCount: 0
        },
        DISCOVERY: {
            playbookCount: 0,
            insightCount: 0,
            callPlanCount: 0
        },
        PARTNERS: {
            playbookCount: 0,
            insightCount: 0,
            callPlanCount: 0
        }
    }
};

function opptyCardCountsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CARD_COUNTS:
            return Object.assign({}, state, {
                opptyCardCounts: action.opptyCardCounts
            });
        case RESET_CARD_COUNTS:
            return Object.assign({}, state, {
                opptyCardCounts: {
                    ALL: {
                        playbookCount: 0,
                        insightCount: 0,
                        callPlanCount: 0
                    },
                    OBJECTIONS: {
                        playbookCount: 0,
                        insightCount: 0,
                        callPlanCount: 0
                    },
                    COMPETITION: {
                        playbookCount: 0,
                        insightCount: 0,
                        callPlanCount: 0
                    },
                    ACTIVITIES: {
                        playbookCount: 0,
                        insightCount: 0,
                        callPlanCount: 0
                    },
                    "BUYING COMMITTEE": {
                        playbookCount: 0,
                        insightCount: 0,
                        callPlanCount: 0
                    },
                    SOLUTION: {
                        playbookCount: 0,
                        insightCount: 0,
                        callPlanCount: 0
                    },
                    CONTENT: {
                        playbookCount: 0,
                        insightCount: 0,
                        callPlanCount: 0
                    },
                    DISCOVERY: {
                        playbookCount: 0,
                        insightCount: 0,
                        callPlanCount: 0
                    },
                    PARTNERS: {
                        playbookCount: 0,
                        insightCount: 0,
                        callPlanCount: 0
                    }
                }
            });
        default:
          return state;
    }
}

export default opptyCardCountsReducer;
