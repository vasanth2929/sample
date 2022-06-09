import { dispatch } from '../util/utils';
import { SHOW_STORY_SIDE_NOTE, HIDE_STORY_SIDE_NOTE, SET_STORY_SIDE_NOTE, CLOSE_STORY_SIDE_NOTE, RESET_STORY_SIDE_NOTE } from '../constants/general';

export function showStorySideNote() {
    return dispatch({
        type: SHOW_STORY_SIDE_NOTE
    });
}

export function hideStorySideNote() {
    return dispatch({
        type: HIDE_STORY_SIDE_NOTE
    });
}

export function setStorySideNote(storyNoteId, storyNote) {
    return dispatch({
        type: SET_STORY_SIDE_NOTE,
        storyNoteId,
        storyNote: { ...storyNote, notes: storyNote.notes.replace(/\n/g, "<br />") }
    });
}

export function closeStorySideNote() {
    return dispatch({ type: CLOSE_STORY_SIDE_NOTE });
}

export function resetStorySideNote() {
    return dispatch({ type: RESET_STORY_SIDE_NOTE });
}
