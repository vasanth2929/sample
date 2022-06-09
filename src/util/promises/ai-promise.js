/* eslint-disable no-restricted-syntax */
import { get, post } from '../service';

export function getEmailForStory(storyId) {
    return get(`aiservice/get/email/${storyId}`);
}

export function getEmailBody(emailId) {
    return get(`aiservice/get/emailBody/${emailId}`);
}

export function getKeywordMatchesForConv(convId, topicId) {
    return post(`get/keywordMatches/forConv?convId=${convId}&topicId=${topicId}`);
}

export function getCardConversationMatchDetailsForCard(cardId, convId) {
    return get(`get/card/conv/matchDetail/${cardId}/${convId}`);
}

export function getKeyMomentsForCardForConversation(cardId, convId) {
    return get(`get/card/keyMoments/${cardId}/${convId}`);
}

export function getAllCommentsWithCountForKM(keyMomentId) {
    return get(`getAll/comments/withCount/forKM/${keyMomentId}`);
}

export function likeOrUnlikeKeyMomentComment(likeOrUnlike, keyMomentCommentId, userId) {
    return post(`likeOrUnlike/keyMomentComment/${keyMomentCommentId}/${userId}?likeOrUnlike=${likeOrUnlike}`);
}

export function updateCardKeyMomentsComment(keyMomentCommentId, commentText, status) {
    if (commentText) {
        return post(`update/keyMoment/comment?cardKeyMomentCommentId=${keyMomentCommentId}&commentText=${commentText}&status=${status}`);
    }
    return post(`update/keyMoment/comment?cardKeyMomentCommentId=${keyMomentCommentId}&status=${status}`);
}

export function createCardKeyMomentsComment(keyMomentId, comment, status, type) {
    return post(`create/keyMoment/comment?cardKeyMomentsId=${keyMomentId}&commentText=${comment}&status=${status}${type ? `&type=${type}` : ''}`);
}

export function createCardKeyMoments(cardId, payload) {
    return post(`create/card/keyMoments/${cardId}/cardId`, payload);
}

export function removeKeyMomentText(keyMomentTextId) {
    return get(`remove/keyMoment/${keyMomentTextId}`);
}

export function getConversationForConvId(convId) {
    return get(`get/conversation/${convId}`);
}
