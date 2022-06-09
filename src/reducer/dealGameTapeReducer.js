import { 
    DEAL_GAME_TAPE_ACTIVE_INDEX, 
    DEAL_GAME_TAPE_RESET_ACTIVE_INDEX, 
    DEAL_GAME_TAPE_COMPLETED_CATEGORY, 
    DEAL_GAME_TAPE_RESET_COMPLETED_CATEGORY 
} from '../constants/general';

const initialState = {
    activeCategory: null,
    CompletedCategory: null,
};

function dealGameTapeReducer(state = initialState, action) {
    switch (action.type) {
        case DEAL_GAME_TAPE_ACTIVE_INDEX: {
            return { ...state, activeCategory: action.payload };
        }
        case DEAL_GAME_TAPE_RESET_ACTIVE_INDEX: {
            return { ...state, activeCategory: null };
        }
        case DEAL_GAME_TAPE_COMPLETED_CATEGORY: {
            return { ...state, CompletedCategory: action.payload };
        }
        case DEAL_GAME_TAPE_RESET_COMPLETED_CATEGORY: {
            return { ...state, CompletedCategory: null };
        }
        default:
            return state;
    }
}

export default dealGameTapeReducer;
