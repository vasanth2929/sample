/* eslint-disable no-restricted-syntax */
import { get, post } from '../service';
import { getHashValue } from './../utils';

export function getTearsheetForStory(storyId) {
  return get(`getTearsheet/storyId/${storyId}`);
}

export function getAccountDetails(storyId) {
  return get(`getAccountDetails/storyId/${storyId}`);
}

export function getCustomerProfile(accountId) {
  return get(`getCustomerProfile/${getHashValue(accountId)}/accId`);
}

export function getTearsheetCards(tearsheetId, selectedTitle) {
  return get(`getCards/tearSheetId/${tearsheetId}/hegName/${selectedTitle}`);
}

export function getTearsheetTopics(storyId) {
  return get(`topics/storyId/${storyId}`);
}

export function getTearsheetTopicCards(storyId, topicId) {
  return get(`cards/storyId/${storyId}/topicId/${topicId}`);
}

export function getTearsheetCardDetails(userId, cardId) {
  return get(`deal/userid/${userId}/card/${cardId}`);
}

export function updateTearsheet(payload) {
  return post('updateTearsheet', payload);
}

export function uploadCaseStudy(payload) {
  return post('uploadfileForStory', payload);
}

export function createTearsheetForStory(payload) {
  return post('createTearsheet', payload);
}

export function downloadPdfFile(storyId) {
  return get(`getTearsheet/pdf/${storyId}`, {
    responseType: 'arraybuffer',
    headers: { 'Content-Type': 'application/octet-stream' },
  });
}

export function getTopicsForStoryFromStoryList(storyId, queryParam) {
  return get(`listCards/storyId/${storyId}?${queryParam}`);
}

export function editCustomerProfile(accountId, payload) {
  return post(`editCustomerProfile/${getHashValue(accountId)}/accId`, payload);
}
