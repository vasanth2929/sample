import { dispatch } from '../util/utils';
import { SHOW_SIDE_NOTE, HIDE_SIDE_NOTE, VIEW_SIDE_NOTE, SET_SIDE_NOTE, CLOSE_SIDE_NOTE, RESET_SIDE_NOTE } from '../constants/general';

export function showSideNote(noteId, note, research) {
    return dispatch({
        type: SHOW_SIDE_NOTE,
        noteId,
        note,
        research
    });
}

export function hideSideNote(noteId, note, research) {
    return dispatch({
        type: HIDE_SIDE_NOTE,
        noteId,
        note,
        research
    });
}

export function viewSideNote(noteId, note, research) {
    return dispatch({
        type: VIEW_SIDE_NOTE,
        noteId,
        note,
        research
    });
}

export function setSideNote(noteId, note, research) {
    return dispatch({
        type: SET_SIDE_NOTE,
        noteId,
        note,
        research
    });
}

export function closeSideNote() {
    return dispatch({ type: CLOSE_SIDE_NOTE });
}

export function resetSideNote() {
    return dispatch({ type: RESET_SIDE_NOTE });
}
