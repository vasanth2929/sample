import { SHOW_STORY_SIDE_NOTE, HIDE_STORY_SIDE_NOTE, SET_STORY_SIDE_NOTE, CLOSE_STORY_SIDE_NOTE, RESET_STORY_SIDE_NOTE } from '../constants/general';

const initialState = {
    storyNoteMode: 'hide',
    storyNoteId: -1,
    storyNote: {
        storyNoteId: -1
    }
};

function modalReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_STORY_SIDE_NOTE:
            return Object.assign({}, state, {
                storyNoteMode: 'show',
            });
        case HIDE_STORY_SIDE_NOTE:
            return Object.assign({}, state, {
                storyNoteMode: 'hide',
            });
        case SET_STORY_SIDE_NOTE:
            return Object.assign({}, state, {
                storyNoteId: action.storyNoteId,
                storyNote: action.storyNote
            });
        case CLOSE_STORY_SIDE_NOTE:
            return Object.assign({}, state, {
                storyNoteMode: 'close',
                storyNoteId: -1,
                storyNote: {
                    storyNoteId: -1
                }
            });
        case RESET_STORY_SIDE_NOTE:
            return Object.assign({}, state, {
                storyNoteMode: 'hide',
                storyNoteId: -1,
                storyNote: {
                    storyNoteId: -1
                }
            });
        default:
          return state;
    }
}

export default modalReducer;
