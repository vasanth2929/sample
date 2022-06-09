/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unneeded-ternary */
import moment from 'moment';
import { get, post, put, upload } from '../service';
import { getLoggedInUser } from '../utils';

export function advSearch(payload) {
  return post('advSearch', payload);
}

export function getPlaybooks(isInactive) {
  return get(`playbook/get/all/${isInactive ? isInactive : false}`);
}

export function getPlaybookDetails(id) {
  return get(`playbook/collection/${id}`);
}

export function getPlaybookCriteria(id) {
  return get(`getStoryGenCriteria/ForPB/${id}`);
}

export function upsertPlaybookCriteria(payload) {
  return post(`upsert/StoryGenCrit/ForPB`, payload);
}

export function getPBSalesPersonaMasterById(id) {
  return get(`get/pbSalesPersonaMasterById/${id}`);
}

export function upsertSalesPersonaMaster(payload) {
  return post(`upsert/salespersonamaster`, payload);
}

export function getDefaultPlaybook() {
  return get('playbook/default');
}

export function getAllPBSalesPersonaMaster(id) {
  return get(`getAll/pbSalesPersonaMaster/${id}`);
}

export function getPlaybookCards(playbookId, topicNames, searchString) {
  return get(
    `get/card/forPlaybook/${playbookId}?topicNames=${topicNames}${
      searchString ? `&searchString=${searchString}` : ''
    }`
  );
}

export function searchPlaybookCards(payload) {
  return post('advSearch', payload);
}

export function searchStoriesForOpptyPlanOrPlaybook(playbookId, accountId) {
  return get(
    `stories/foraccountorplaybook?playbookId=${playbookId}${
      accountId ? `&accountId=${accountId}` : ''
    }`
  );
}

export function getPlaybookAndNetNewCollection(
  selectedSubTopic,
  searchLevel,
  searchString,
  storyId,
  userId,
  confidenceFilter
) {
  return searchString
    ? get(
        `playbook/collectionwithnetnew?search_level=${searchLevel}&search_string=${searchString}&story_id=${storyId}&user_id=${
          userId || getLoggedInUser().userId
        }&confidenceFilter=${confidenceFilter}&subTopicList=${selectedSubTopic}`
      )
    : get(
        `playbook/collectionwithnetnew?story_id=${storyId}&user_id=${
          userId || getLoggedInUser().userId
        }&confidenceFilter=${confidenceFilter}&subTopicList=${selectedSubTopic}`
      );
}
export function getMatchedCardsForStories(
  searchLevel,
  searchString,
  storyId,
  userId
) {
  return get(
    `get/matchedCards/forStories?story_id=${storyId}&user_id=${
      userId || getLoggedInUser().userId
    }`
  );
}
export function addPlaybook(payload) {
  return post('playbook/add', payload);
}
export function updatePlaybook(id, payload) {
  return post(`playbook/update/${id}`, payload);
}

export function getCards(playbookId, topicId) {
  return get(`playbook/collection/${playbookId}/topic/${topicId}`);
}
export function getCardsForAllStatus(playbookId, topicId) {
  return get(`playbook/collection/all/${playbookId}/topic/${topicId}`);
}
export function getCardDetail(cardId) {
  return get(`playbookcard/get/${cardId}`);
}

export function getStoriesForCard(cardId) {
  return get(`playbookcard/card/withstory/${cardId}`);
}

export function getStoriesForCardByPlaybook(
  cardId,
  playbookName,
  targetAccount
) {
  return get(
    `getStory/cardId/${cardId}?ecoBuyer=${playbookName}${
      targetAccount ? `&targetAccount=${targetAccount.id}` : ''
    }`
  );
}

export function getAllSalesPersonaMasterValues(playbookId) {
  return get(`personaAndPlay/get/all/${playbookId}`);
}

export function getAllSalesPersonaMasterValuesForBuyerName(buyerName) {
  return get(`personaAndPlay/get/all/bybuyername?playbook_name=${buyerName}`);
}

export function getSalesPersonaMasterForCard(id) {
  return get(`salespersonamaster/get/personas/forcard/all?card_id=${id}`);
}

export function getContactFromId(id) {
  return get(`contact/get/${id}`);
}

export function addSalesPersonaMasteValuesToCard(cardId, selectedPersona) {
  return post(
    `salespersonamaster/addtocard/${cardId}?salespersonanames=${selectedPersona}`
  );
}

export function addCard(payload) {
  return post('playbookcard/add', payload);
}

export function updateCard(id, payload) {
  return post(`playbookcard/update/${id}`, payload);
}

export function deleteCard(id) {
  return post(`playbookcard/delete/${id}`);
}

export function archiveCard(id) {
  return post(`playbookCard/setArchive/${id}`);
}

export function acceptCard(id) {
  return post(`playbookcard/accept/${id}`);
}

export function rejectCard(id) {
  return put(`playbookcard/reject/${id}`);
}

export function publishPlaybook(id) {
  return put(`publishPlaybook/playbookId/${id}`);
}

export function getFormMetadataForAPlaybook(playbookId, topicId, type) {
  return get(
    `topics/metadata/playbook/${playbookId}/topic/${topicId}/type/${type}`
  );
}

export function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  return upload('files/upload', formData, config);
}

export function uploadAndSaveFile(file, id) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('cardId', id);
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  return upload('files/uploadAndSave', formData, config);
}

export function removeFile(payload) {
  return post('file/remove', payload);
}

export function uploadUrl(url, id) {
  const formData = new FormData();
  formData.append('url', url);
  formData.append('cardId', id);
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  return upload('files/uploadAndSave', formData, config);
}

export function downloadFile(fileName, location) {
  return get(`files/${fileName}`, {
    responseType: 'arraybuffer',
    params: { location: `${location}` },
    headers: { 'Content-Type': 'application/octet-stream' },
  });
}

export function getStoryForAccountForPlaybook(playbookId, accountId) {
  return get(`getStory/ForAccount/ForPlaybook/${accountId}/${playbookId}`);
}

export function getStoryAndAccountForAccountForPlaybook(playbookId, accountId) {
  return get(`getStoryAndCP/ForAccount/ForPlaybook/${accountId}/${playbookId}`);
}

export function getStoryCount() {
  return get('getStoryCount');
}

export function getStoryCountForAlias(alias) {
  return get(`getStoryCountForAlias/${alias}`);
}

export function getAllStories(flag) {
  return get(`getAllStories/allOrDraft/${flag}`);
}
export function getAllStoriesForAlias(flag, alias) {
  return get(`getAllStories/allOrDraft/${flag}/alias/${alias}`);
}
export function updateStory(payload) {
  return post('updateStory', payload);
}

export function getAlias(status) {
  return get(`getConfiguredAliases/${status}`);
}

export function mergePlaybookCards(sourceCardId, targetCardId, payload) {
  return post(`playbookCard/merge/${sourceCardId}/${targetCardId}`, payload);
}

export function getValidOperations(cardId) {
  return get(`playbookCard/getValidOperations/${cardId}`);
}

export function clonePlaybook(playbookId, payload) {
  return post(`playbook/clone/${playbookId}`, payload);
}

export function addElevator(payload) {
  return post(`create/topicParam`, payload);
}

export function getSalesPlayForPlaybook(playbookId) {
  return get(`get/salesPlays/forPlaybook/${playbookId}`);
}

export function updateSalesPlayForPlaybook(payload) {
  return post('update/salesPlay/forPlaybook', payload);
}

export function createSalesPlayForPlaybook(payload) {
  return post('create/salesPlay/forPlaybook', payload);
}

export function createTopicParam(payload) {
  return post('create/topicParam', payload);
}

export function deleteTopicParam(payload) {
  return post('delete/topicParam', payload);
}

export function updateTopicParam(payload) {
  return post('update/topicParam', payload);
}

export function getPlayBookSalesPlays() {
  return get('playbooksalesplays/get/all');
}

export function upsertPlayBookSalesPlays(payload) {
  return post('upsert/playbooksalesplays', payload);
}

export function getPBCardUsingText(cardText) {
  return get(`getPBCardUsingText?cardTitleText=${cardText}`);
}

export function addPlaybookCard(payload) {
  return post('playbookcard/add', payload);
}

export function addNetnewWithPBCardRel(CardId, storyId) {
  return post(
    `deal/add/netnewWithPBCardRel?pbCardId=${CardId}&storyId=${storyId}`
  );
}

export function archiveCardMessage(id) {
  return post(`getplaybookcard/archive?cardId=${id}`);
}

export function createPBCardForQuestionForSubtypeForSolution(payload) {
  return post('createPBCardForQuestionForSubtypeForSolution', payload);
}

export function listAllMarkets() {
  return get('listAllMarket');
}

export function getPBCardsForMarketForPlaybook(marketId, searchString = '') {
  if (searchString !== '') {
    return get(
      `getPBCardsForMarketForPlaybook?playbookSalesPlayId=${marketId}&searchString=${searchString}`
    );
  } else {
    return get(
      `getPBCardsForMarketForPlaybook?playbookSalesPlayId=${marketId}`
    );
  }
}

export function exportPlaybookCardsForMarket(marketId, marketName) {
  let m = marketName;
  if (marketName.includes('&')) m = encodeURIComponent(marketName);
  m = m.replace(':', '');
  let userLocalDateString = moment(new Date()).format('YYYY-MM-DD');
  return get(
    `exportPlaybookCardsForMarket?playbookSalesPlayId=${marketId}&userLocalDateString=${userLocalDateString}&marketName=${m}`,
    { responseType: 'blob' }
  );
}

export function upsertTargetMarketWithRelations(marketName) {
  return post(`upsertTargetMarketWithRelations?targetMarketName=${marketName}`);
}

export function createNewMarket(payload) {
  return post('create/salesPlay/forPlaybook', payload);
}

export function getOpptyListForCompetitor(cardId, filterObj) {
  const filter = filterObj.reduce(
    (queryString, item) =>
      (queryString +=
        item.name === 'segment' ||
        item.name === 'industry' ||
        item.name === 'region'
          ? `&${item.name}List=${item.value}`
          : `&${item.name}=${item.value}`),
    ''
  );
  return post(`getOpptyListForCompetitor?cardId=${cardId}${filter}`);
}

export function getCompetitorSwotCards(cardId, filterObj) {
  const filter = filterObj.reduce(
    (queryString, item) =>
      (queryString +=
        item.name === 'segment' ||
        item.name === 'industry' ||
        item.name === 'region'
          ? `&${item.name}List=${item.value}`
          : `&${item.name}=${item.value}`),
    ''
  );

  return get(`getCompetitorSwotCards?cardId=${cardId}${filter}`);
}

export function getCompetitorCardsList(marketId) {
  return get(
    `getCompetitorCardsList${marketId ? `?marketId=${marketId}` : ''}`
  );
}

export function getInsightsForVPAndCompCard(cardId, compCardId, filterObj) {
  const filter = filterObj.reduce(
    (queryString, item) =>
      (queryString +=
        item.name === 'segment' ||
        item.name === 'industry' ||
        item.name === 'region'
          ? `&${item.name}List=${item.value}`
          : `&${item.name}=${item.value}`),
    ''
  );

  return post(
    `getInsightsForVPAndCompCard?rootCardId=${cardId}&compCardId=${compCardId}${filter}`
  );
}

export function getDealsForVPAndCompCard(cardId, compCardId, filterObj) {
  const filter = filterObj.reduce(
    (queryString, item) =>
      (queryString +=
        item.name === 'segment' ||
        item.name === 'industry' ||
        item.name === 'region'
          ? `&${item.name}List=${item.value}`
          : `&${item.name}=${item.value}`),
    ''
  );

  return post(
    `getDealsForVPAndCompCard?rootCardId=${cardId}&compCardId=${compCardId}${filter}`
  );
}

export function updateMarketName(marketId, marketName) {
  return post(`updateMarketName?marketId=${marketId}&marketName=${marketName}`);
}

export function updateDomain({ accountId, domainNames }) {
  return post(`update/accountDomain`, { accountId, domainNames });
}

export function loadCardToOpptyMatchedRel() {
  return post(`loadCardToOpptyMatchedRel`);
}

export function includeLiveOpptysFlag() {
  return get(`includeLiveOpptysFlag`);
}