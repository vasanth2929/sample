/* eslint-disable no-restricted-syntax */
import { get, put } from '../service';

export function getEmailForStory(storyId) {
    return get(`aiservice/get/email/${storyId}`);
}

export function getEmailsForSubject(subjectId) {
    return get(`aiservice/get/emailHeader/${subjectId}`);
}

export function getAllTranscriptsWithMetadataForTypeAndSubtype(storyId) {
    return get(`getAll/transcriptsWithMetadata/${storyId}/call/gong/`);
}

export function getEmailBody(emailId) {
    return get(`aiservice/get/temp/emailBody/${emailId}`);
}

export function acceptCard(cardId, payload) {
    return put(`aiservice/acceptCard/${cardId}`, payload);
}

export function undoAcceptCard(cardId) {
    return put(`aiservice/undoAcceptCard/${cardId}`);
}

export function getConvDetailsForKeyMoments(keyMomentId) {
    return get(`get/convDetails/keyMoment/${keyMomentId}`);
}

export function removeKeyMomentText(keyMomentTextId) {
    return get(`remove/keyMoment/${keyMomentTextId}`);
}
