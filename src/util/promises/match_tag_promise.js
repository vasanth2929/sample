import { get, post, deleteRecord } from '../service';

export function getAllTags() {
  return get('cardmatchtags/all');
}

export function getAllTagsForCardId(cardId) {
  return get(`cardmatchtags/forcard/${cardId}`);
}

export function getCardMatchTagsMetaDataCount() {
  return get('cardmatchtags/tagscount');
}

export function updateCardMatchTags(payload) {
  return post('cardmatchtags/updateCardMatchTags', payload);
}

export function deleteCardMatchTags(tagId) {
  return deleteRecord(`cardmatchtags/deleteCardMatchTags?id=${tagId}`);
}

export function createCardMatchTags(payload) {
  return post('cardmatchtags/add', payload);
}

export function searchTags(playbookId, query) {
  return get(
    `cardmatchtags/cardforplaybookforsearchtext?playbookId=${playbookId}&searchText=${query}`
  );
}

export function getKeywordStats(data) {
  return post(`getKeywordAnalysisForStory`, data);
}

export function getConversationAnalysisForStory(data) {
  return post(`getConversationAnalysisForStory`, data);
}
