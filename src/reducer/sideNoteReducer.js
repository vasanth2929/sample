import { SHOW_SIDE_NOTE, HIDE_SIDE_NOTE, VIEW_SIDE_NOTE, SET_SIDE_NOTE, CLOSE_SIDE_NOTE, RESET_SIDE_NOTE } from '../constants/general';

const initialState = {
    viewMode: true,
    showSideNoteView: true,
    noteId: -1,
    note: {
        id: -1
    },
    research: null
};

function modalReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_SIDE_NOTE:
            return Object.assign({}, state, {
                viewMode: true,
                showSideNoteView: true,
                noteId: action.noteId,
                note: action.note,
                research: action.research
            });
        case HIDE_SIDE_NOTE:
            return Object.assign({}, state, {
                viewMode: true,
                showSideNoteView: false,
                noteId: action.noteId,
                note: action.note,
                research: action.research
            });
        case VIEW_SIDE_NOTE:
            return Object.assign({}, state, {
                viewMode: true,
                showSideNoteView: null,
                noteId: action.noteId,
                note: action.note,
                research: action.research
            });
        case SET_SIDE_NOTE:
            return Object.assign({}, state, {
                noteId: action.noteId,
                note: action.note,
                research: action.research
            });
        case CLOSE_SIDE_NOTE:
            return Object.assign({}, state, {
                viewMode: false,
                showSideNoteView: null,
                noteId: -1,
                note: null,
                research: null
            });
        case RESET_SIDE_NOTE:
            return Object.assign({}, state, {
                viewMode: true,
                showSideNoteView: true,
                noteId: -1,
                note: {
                    id: -1
                },
                research: null
            });
        default:
          return state;
    }
}

export default modalReducer;
