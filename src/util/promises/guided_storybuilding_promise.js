/* eslint-disable no-restricted-syntax */
import { get, post, put } from '../service';

export function getPlaybookCards(storyId, topicId) {
    return get(`listCardsForPlaybook/storyId/${storyId}?topicIdList=${topicId}`);
}

export function getOrCreateStoryEvent(storyId) {
    return post(`guidedStory/${storyId}/storyId`);
}

export function getAllEventTemplateData() {
    return get('guidedStory/getAll/eventData');
}

export function getAllEventData(eventId) {
    return get(`guidedStory/getAll/eventData/${eventId}`);
}

export function updateEventTemplate(payload) {
    return put('guidedStory/update/eventTmplt', payload);
}

export function getEventLogForEvent(eventId, eventTemplateId) {
    return get(`guidedStory/get/eventLog/${eventId}/${eventTemplateId}`);
}

export function upsertEventLog(payload) {
    return put('guidedStory/upsert/eventLog', payload);
}

export function updateEventTemplateTip(payload) {
    return put('guidedStory/update/eventTmpltTip', payload);
}
