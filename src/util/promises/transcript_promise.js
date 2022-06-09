/* eslint-disable no-restricted-syntax */
import { get, put, post } from '../service';
import { getHashValue } from './../utils';

export function addNotesToConversation(payload) {
    return post('story/transcript/notes', payload);
}

export function addAnnotation(payload) {
    return post('annotation/transcript/add', payload);
}

export function updateContextAndProtip(cardId, payload) {
    return put(`aiservice/acceptCard/${cardId}`, payload);
}

export function getTranscript(transcriptId) {
    return get(`conversation/transcript/get/${transcriptId}`);
}

export function getConversationTranscriptByOpptyPlan(opptyPlanId) {
    return get(`conversation/transcript/get/byOpptyPlan?opptyPlanId=${opptyPlanId}`);
}

export function getTranscriptsStatus(storyId, convId) {
    return post(`story/get/transcript/status/${storyId}${convId ? '?convId=' + convId : ''}`);
}

export function getTranscriptsForStory(storyId) {
    return get(`story/transcripts/${storyId}`);
}

export function getMatchedCardsForConversation(convId, showAllType, topicId) {
    return get(`transcript/matchedcards?conv_id=${convId}&show_all=${showAllType}&topic_id=${topicId}`);
    // if (showAll) {
    //     return get(`transcript/matchedcards?conv_id=${convId}&show_all=true&topic_id=${topicId}`);
    // } else { // eslint-disable-line
    //     return get(`transcript/matchedcards?conv_id=${convId}&topic_id=${topicId}`);
    // }
}

export function getAllCardsForConversationForOppty(convId, topicId) {
    if (topicId) {
        return get(`transcript/matchedcards/opptyp?conv_id=${convId}&topic_id=${topicId}&show_all=true`);
    }
    return get(`transcript/matchedcards/opptyp?conv_id=${convId}&show_all=true`);
}

export function getCardsForTranscript(convId, topicId, type) {
    return get(`transcript/matchedcards/opptyp?conv_id=${convId}${topicId ? `&topic_id=${topicId}` : ''}&show_all=${type}`);
}

export function getMatchedCardsForConversationForOppty(convId, topicId) {
    if (topicId) {
        return get(`transcript/matchedcards/opptyp?conv_id=${convId}&topic_id=${topicId}&show_all=false`);
    }
    return get(`transcript/matchedcards/opptyp?conv_id=${convId}&show_all=false`);
}

export function getRecordingAndSubmitForTranscription(storyId, file, type, subType) {
    const formData = new FormData();
    formData.append('file', file);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return post(`story/submit/recording/${storyId}?subType=${subType}&type=${type}`, formData, config);
}

export function getRecordingAndSubmitForTranscriptionForOpptyP(opptyPlanId, file, type, subType) {
    const formData = new FormData();
    formData.append('file', file);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return post(`opptyplan/submit/recording/${opptyPlanId}?subType=${subType}&type=${type}`, formData, config);
}

export function addConversation(payload) {
    return post('add/conversationToStory/forCallAndGong', payload);
}

export function createConvMeetingMetadata(payload) {
    return post('create/conv/meetingMetadata', payload);
}

export function updateReviewStatus(query) {
  return get('updateShareStatus/' + query);
}

export function getConversationsForStoryForTypeAndSubtype(storyId, subtype, type) {
    return get(`story/transcripts/fortypeandsubtype?storyid=${storyId}&subtype=${subtype}&type=${type}`);
}

export function getAllConvAndEmailMetadataForTypeAndSubtype(storyId, type, subType) {
    return get(`getAll/ConvAndEmailMetadata/${storyId}/${type}/${subType}`);
}

export function getEmailConvForStoryForUser(storyId, userId) {
    return get(`get/emailConv/forStoryForUser/${storyId}/${userId}`);
}

export function getEmailConvForStoryForContact(storyId, contactId) {
    return get(`get/emailConv/forStoryForContact/${storyId}/${getHashValue(contactId)}`);
}

export function getAllConvAndEmailMetadataForOpptyP(opptyPlanId, type, subType) {
    return get(`getAll/ConvAndEmailMetadata/forOpptyPlan/${opptyPlanId}/${type}/${subType}`);
}
