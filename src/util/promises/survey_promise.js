/* eslint-disable no-restricted-syntax */ /* eslint no-console:off */
import { get, post, deleteRecord, upload } from "../service";

export function getSurveyQuestionsAndCardsByCategory(CategoryName, opptyId) {
    return get(`getSurveyQuestionsAndCardsByCategory?categoryName=${CategoryName}&opptyId=${opptyId}`);
}

export function getLatestStoryNotesForMarketStudyQuestionAndOppty(questionID, opptyId) {
    return get(`getLatestStoryNotesForMarketStudyQuestionAndOppty?marketStudyQuestionId=${questionID}&opptyId=${opptyId}`);
}

export function createStoryNotesForMarketStudyQuestionAndOppty(questionID, notesText, opptyId = "", usersId = "") {
    return post(`createStoryNotesForMarketStudyQuestionAndOppty?marketStudyQuestionId=${questionID}&notesText=${notesText}&opptyId=${opptyId}&usersId=${usersId}`);
}

export function getCompetitorWithTypeForOppty(opptyId) {
    return get(`getCompetitorWithTypeForOppty?opptyId=${opptyId}`);
}

export function verifyCompetitorWithTypeForOppty(opptyId, cardid, typeString) {
    return post(`verifyCompetitorWithTypeForOppty?opptyId=${opptyId}&cardId=${cardid}&typeString=${typeString}`);
}

export function getSurveyStatusForStoryForUser(storyId, userId) {
    return get(`getSurveyStatusForStoryForUser?storyId=${storyId}&userId=${userId}`);
}

export function getMarketForStory(storyId) {
    return post(`getMarketForStory?storyId=${storyId}`);
}

export function upsertSurveyStatusForStoryForUser(categoryId, completeFlag, storyId, userId) {
    return post(`upsertSurveyStatusForStoryForUser?categoryId=${categoryId}&completeFlag=${completeFlag}&storyId=${storyId}&userId=${userId}`);
}

export function linkStoryToMarket(marketId, storyId) {
    return post(`linkStoryToMarket?playbookSalesPlayId=${marketId}&storyId=${storyId}`);
}

export function surveyLinkSend(storyId, surveyLink, userId) {
    return post(`surveyLinkSend?storyId=${storyId}&surveyLink=${surveyLink}&userId=${userId}`);
}

export function UserSignUpSurvey(payload) {
    return post('survey/users/signup', payload);
}

export function upsertUser(payload) {
    return post('upsertUser', payload);
}

export function addUsersToOpptyTeam(opptyId, userLoginNames) {
    return post(`addUsersToOpptyTeam?opportunityId=${opptyId}&userLoginNames=${userLoginNames}`);
}

export function getStoryNotesForAllUsersForMarketStudyQuestionAndOppty(questionId, opptyId) {
    return get(`getStoryNotesForAllUsersForMarketStudyQuestionAndOppty?marketStudyQuestionId=${questionId}&opptyId=${opptyId}`);
}
