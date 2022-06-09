/* eslint-disable no-restricted-syntax */
import { get, post } from '../service';
import querystring from 'querystring';

export function getAllTopics() {
  return get('topics/all');
}

export function getMatchedCardsForStory(storyId, topicId) {
  return get(`story/matchedcards?story_id=${storyId}&topic_id=${topicId}`);
}

export function addConversation(payload) {
  return post('conversation/add', payload);
}

export function getConvWithTextAndMatchWordsForCardForStoryOrOpptyP(payload) {
  return get(
    `getConvWithTextAndMatchWordsForCardForStoryOrOpptyP?${querystring.stringify(
      payload
    )}`
  );
}

export function getHeuristicScoreDetailsForCardAndStory(payload) {
  return get(
    `getHeuristicScoreDetailsForCardAndStory?${querystring.stringify(payload)}`
  );
}

export function handleConversationFileUploadAndSave(conversationId, file) {
  const formData = new FormData();
  formData.append('file', file);
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  return post(
    `files/conversation/uploadAndSave?conversationId=${conversationId}`,
    formData,
    config
  );
}

export function createTopicParamForTopicBySubtype(payload) {
  return post('create/topicParam/forTopic/bySubtype', payload);
}

export function updateTopicParamForTopicBySubtype(payload) {
  return post('update/topicParam/forTopic/bySubtype', payload);
}

export function getTopicParamForTopicByName(topicId, name) {
  return post(`get/topicParam/forTopic/byName/${topicId}/${name}`);
}

export function deleteTopicParam(paramId) {
  return post(`delete/topicParam?topicParamId=${paramId}`);
}

export function getMatchedStoriesForCard(cardId) {
  return get(`getMatchedStoriesForCard/${cardId}`);
}

export function getConvMetadataForStoryOrOpptyP(storyId) {
  return get(`getConvMetadataForStoryOrOpptyP?storyId=${storyId}`);
}

export function getEmailStatsForOpptyTeamyP(storyId) {
  return get(`getEmailStatsForOpptyTeam?storyId=${storyId}`);
}

export function getGongCallMetadataForStory(storyId) {
  return get(`getGongCallMetadataForStory?storyId=${storyId}`);
}

export function getTranscriptWithFragmentsForConvAndCard(
  cardId,
  convId,
  filterByKeywordId
) {
  let path = `getTranscriptWithFragmentsForConvAndCard?cardId=${cardId}&convId=${convId}`;
  if (filterByKeywordId) path += `&filterByKeywordId=${filterByKeywordId}`;
  console.log(path)
  return get(path);
}
