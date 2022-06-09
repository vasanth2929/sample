/* eslint-disable no-restricted-syntax */ /* eslint no-console:off */
import { get, post, deleteRecord, upload } from "../service";
import { getHashValue } from "./../utils";

export function getResetStory(storyId) {
  return post(`story/resetStory/${storyId}`);
}
export function getTopicsForStory(storyId) {
  return get(`topics/storyId/${storyId}`);
}

export function getAllCardsForStory(storyId, userId) {
  if (userId) {
    return get(`getAll/cards/forStory/${storyId}?userId${userId}`);
  }
  return get(`getAll/cards/forStory/${storyId}`);
}

export function getNetNewCardsForStory(storyId, userId) {
  if (userId) {
    return get(`get/netNewCards/forStory/${storyId}?userId${userId}`);
  }
  return get(`get/netNewCards/forStory/${storyId}`);
}

export function getStoryAndCP(accountId, playbookId) {
  return get(`getStoryAndCP/ForAccount/ForPlaybook/${accountId}/${playbookId}`);
}

export function getplaybookDetailsForStory(storyId) {
  return get(`playbook/collection/storyId/${storyId}`);
}

export function getplaybookDetailsForStoryCloned(storyId, userId) {
  return get(`playbook/collection/new/storyId/${storyId}/userId/${userId}`);
}

export function getDefaultPlaybook() {
  return get("playbook/default");
}

export function getCardMetadata(playbookCardId) {
  return get(`deal/metadata/playbookcard/${playbookCardId}`);
}

export function getNewDealCardMetadata(topicId, cardType) {
  return get(`topics/metadata/${topicId}/type/${cardType}`);
}

export function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  return post("files/upload", formData, config);
}

export function addCard(payload) {
  return post("deal/add/withpb/card", payload);
}

export function addNewDealCard(payload) {
  return post("deal/add/netnew/card", payload);
}

export function submitStory(payload) {
  return post("deal/story/submit", payload);
}

export function deleteStory(payload) {
  return post("story/deleteStories", payload);
}

export function addNewPersonaDealCard(payload) {
  return post("createPersonaCard", payload);
}

export function updateContactDetailsForPersona(payload) {
  return post("updateContact/persona", payload);
}

export function removeContactFromCard(cardId, userId) {
  return get(`removeContact/fromStoryPersonaCard/${cardId}/${userId}`);
}

export function deleteDealCard(cardId) {
  try {
    return post(`deal/userid/1/card/delete/${cardId}`);
  } catch (e) {
    return null;
  }
}

export function getAllTopics() {
  return get("storyBoard/getAll/topics");
}

export function getAllTopicsWithoutCards() {
  return get("storyBoard/getAll/topics/withoutCardDetail");
}

export function uploadVideo(storyId, file, filename) {
  const formData = new FormData();
  formData.append("file", file, filename);
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  return upload(
    `files/story/uploadAndSave?storyId=${storyId}`,
    formData,
    config
  );
}

export function getProdLines(storyId) {
  return get(`storyBoard/get/prodLine/${storyId}`);
}

export function updateProdLine(prodId, storyId, operation) {
  return post(`update/prodLine/story/${prodId}/${storyId}/${operation}`);
}

export function getCustEnv(accountId, storyId) {
  return get(`storyBoard/get/custEnv/${getHashValue(accountId)}/${storyId}`);
}
export function getCustEnvForStory(storyId) {
  return post(`opptyPlan/get/custEnv/opptyP/Story?story_id=${storyId}`);
}
// export function updateCustEnv(envId, storyId, operation) {
//   return post(`update/custEnv/story/${envId}/${storyId}/${operation}`);
// }
export function updateCustEnv(custEnvId, storyId) {
  return post(`update/custEnv/opptyPlan/story/${custEnvId}?storyId=${storyId}`);
}
export function createCustEnv(accountId, category, storyId, payload) {
  return post(
    `add/custEnv/toopptyP/story/${category}?storyId=${storyId}`,
    payload
  );
}

export function getAccountTeam(accountId) {
  return get(`storyBoard/get/team/${getHashValue(accountId)}`);
}

export function getStoryForTeam(storyId) {
  return get(`storyBoard/get/team/forStory/${storyId}`);
}

export function addUserToAccountTeam(role, storyId, userId) {
  return post(`storyBoard/add/userToAccountTeam?role=${role}&storyId=${storyId}&userId=${userId}`);
}

export function removeUserFromAccountTeam(role, storyId, userId) {
  return deleteRecord(`storyBoard/remove/userFromAccountTeam?role=${role}&storyId=${storyId}&userId=${userId}`);
}

export function deleteVideo(cardIds, filename) {
  const send = {
    cardId: cardIds,
    file: filename
  };
  console.log(send, "data we are sending");
  return post("file/story/remove", send);
}

export function listAllOpptyForAccount(accountId) {
  return get(`listAll/oppty/${getHashValue(accountId)}`);
}

export function checkUserInAccountTeam(storyId, userId) {
  return get(`story/checkUser/InAcct/team/${userId}/?storyId=${storyId}`);
}

export function linkOpportunityListForStory(storyId, opportunities) {
  return post(`story/linkOpps/${storyId}?${opportunities}`);
}

export function getAllTranscriptsWithMetadataForTypeAndSubtype(
  storyId,
  type,
  subType
) {
  return get(`getAll/transcriptsWithMetadata/${storyId}/${type}/${subType}`);
}

export function getEmailsForStory(storyId) {
  return get(`get/emailConv/forStory/${storyId}`);
}

export function updateCardTitle(cardId, storyId, title, userId) {
  return post(`update/card/title/cardId/${cardId}?storyId=${storyId}&title=${title}&userId=${userId}`);
}

export function getStoryNotes(storyId) {
  return get(`get/notes/forStory/${storyId}`);
}

export function upsertStoryNotes(payload) {
  return post("upsert/notes/forStory", payload);
}

export function getAllProtipForCard(cardId) {
  return get(`getAll/protip/forCard/${cardId}`);
}

export function createStoryCardNote(payload) {
  return post("create/cardNotes/forStory", payload);
}

export function likeOrUnlikeKeyMoments(actionType, keyMomentId, userId) {
  return post(`likeOrUnlike/keyMoments/${keyMomentId}/${userId}?likeOrUnlike=${actionType}`);
}

export function updateCardKeyMoments(payload) {
  return post("update/cardKeyMoment", payload);
}

export function getStoryCardNotes(storyId, cardId, type) {
  return get(`get/cardNotes/forStory/${storyId}/forCard/${cardId}?type=${type}`);
}

export function updateStoryCardNotes(payload) {
  return post(`update/cardNotes/forStory`, payload);
}
export function getAllKeyMomentsForStoryCard(cardId, storyId, type, userId) {
  return get(`get/cardKeyMoment/opptyPOrStory/forSubtype?cardId=${cardId}&subtype=${type}&storyId=${storyId}&userId=${userId}`);
}

export function getUsersForStoryWithSurveyLinks(storyId) {
  return get(`getUsersForStoryWithSurveyLinks?storyId=${storyId}`);
} 