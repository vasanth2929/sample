import { ADD_ANALYZE_CARDS, REMOVE_ANALYZE_CARDS, RESET_CARDS, SWITCH_TABS, SELECT_NOTE_CARD, SELECTED_SURVEY_OPPTYS, SWITCH_SUB_TABS } from '../constants/general';

const initialState = {
    AnalyzeCards: [],
    tabData: {
        tabId: null,
        tabPayload: null,
       
    },
    selectedSubTab: null,
    selectedNoteCard: null,
    selectedSurveyOpptys: []
};

function marketAnalysisReducer(state = initialState, action) {
    let analyzeCardsArray = [];
    switch (action.type) {
        // Add specific elements
        case ADD_ANALYZE_CARDS: {
            return { ...state, AnalyzeCards: action.payload }
        }
        // Remove specific element
        case REMOVE_ANALYZE_CARDS: {
            analyzeCardsArray = state.AnalyzeCards;
            const filteredCards = analyzeCardsArray.filter(item => item.id !== action.payload.id);
            return { ...state, AnalyzeCards: filteredCards }
        }
        case RESET_CARDS:
            return { ...state, AnalyzeCards: [] }
        case SWITCH_TABS:
            return { ...state, tabData: action.payload }
        case SWITCH_SUB_TABS:
                return { ...state, selectedSubTab: action.payload }
        case SELECT_NOTE_CARD:
            return { ...state, selectedNoteCard: action.payload }
        case SELECTED_SURVEY_OPPTYS:
            return { ...state, selectedSurveyOpptys: action.payload }
        default:
            return state;
    }
}

export default marketAnalysisReducer;
