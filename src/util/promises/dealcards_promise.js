/* eslint-disable no-restricted-syntax */
import { get, post } from '../service';
import { getLoggedInUser, getHashValue } from '../utils';

export function getDealCards(storyId, topicId) {
  return get(`deal/cards/userid/1/story/${storyId}/topic/${topicId}`);
}

export function getDealCard(cardId, userId) {
  return get(`deal/userid/${userId || getLoggedInUser().userId}/card/${cardId}`);
}

export function getPersonaCardDetail(cardId) {
  return get(`cardDetail/cardId/${cardId}`);
}

export function updatePersonaContact(payload) {
  return post('updateContact/persona', payload);
}

export function getAllInactiveCardsForStory(storyId) {
  return get(`getAll/inactiveCard/forStory/${storyId}`);
}

export function getContactsForAccount(accountId) {
  return get(`getContacts/accId/${getHashValue(accountId)}`);
}

export function getContactsForAccountForStory(accountId, storyId) {
  return get(`getContacts/forAccId/${getHashValue(accountId)}/forStory/${storyId}`);
}

export function updatePersonaCard(payload) {
  return post('updatePersonaCard', payload);
}

export function tagCardToStory(cardId, storyId, userId) {
  return post(`tagCard/toStory?cardId=${cardId}&storyId=${storyId}&userId=${userId || getLoggedInUser().userId}`);
}

export function unverifyDealCardForStory(cardId, userId, storyId) {
  return post(`unVerify/card?cardId=${cardId}&storyId=${storyId}&userId=${userId || getLoggedInUser().userId}`);
}

export function inactivateStoryCard(cardId, storyId) {
  return post(`deactivate/card/cardId/${cardId}?storyId=${storyId}`);
}

export function createContactForAccount(payload) {
  return post('createContact', payload);
}

export function getConfiguredAlias(status) {
  return get(`getConfiguredAliases/${status}`);
}

export function updatePersonaCardAlias(payload) {
  return post('updatePersonaCardAlias', payload);
}

export function getAliasForEBDealCard(payload) {
  return post('getAliasForEconomicBuyerDealCard', payload);
}

export function updateDealCard(cardId, payload, userId) {
  try {
    return post(`deal/userid/${userId || getLoggedInUser().userId}/card/update/${cardId}`, payload);
  } catch (e) {
    return null;
  }
}

export function updateDealCardContext(payload) {
  return post('append/context/protip/forCard', payload);
}

export function getDummyKeyMomentsForCard(storyId) {
  return get(`aiservice/get/keyMoments/${storyId}`);
}

export function getDealCardMetadata(cardId) {
  return get(`deal/metadata/dealcard/${cardId}`);
}

export function getKeyMomentsForCard(cardId) {
  return get(`get/keyMoments/${cardId}`);
}

// export function getAllKeyMomentsForCardNew(cardId) {
//     return get(`getAll/card/keyMoments/${cardId}/cardId`);
// }

export function upsertContextForPlaybookCard(payload) {
  return post('upsert/context/forPlaybookCard/forStory', payload);
}

export function getAllKeyMomentsForCardNew(cardId, id, type) {
  return get(`getAll/card/keyMoments/${cardId}/cardId/${id}?type=${type || 'all'}&userId=${getLoggedInUser().userId || 19}`);
}

export function getPersonaEngagementDetails(cardId) {
  return get(`get/personaEng/details/${cardId}`);
}

export function getCardDiscussionDetails(cardId) {
  return get(`card/get/discussion/${cardId}`);
}

export function createCardDiscussion(payload) {
  return post('card/create/discussion', payload);
}

export function likeOrUnlikeDiscussion(type, commentId, userId) {
  return post(`likeOrUnlike/discussion/${commentId}/${userId}?likeOrUnlike=${type}`);
}

export function changeRoleForContact(cardId, role) {
  return post(`changeRole/Contact?cardId=${cardId}&newRoleName=${role}`);
}

export function likeOrUnlikeKeyMoments(actionType, keyMomentId, userId) {
  return post(`likeOrUnlike/keyMoments/${keyMomentId}/${userId}?likeOrUnlike=${actionType}`);
}

export function updateCardKeyMoments(payload) {
  return post('update/cardKeyMoment', payload);
}

export function removeKeyMomentForCard(keyMomentId) {
  return get(`remove/keyMoment/${keyMomentId}`);
}

export function removeKeyMomentText(keyMomentTextId) {
  return get(`remove/keyMoment/text/${keyMomentTextId}`);
}

export function getAllProtipsForCard(cardId) {
  return get(`get/storyProtips/forCard/${cardId}`);
}

export function getKeyMomentsForCardForOpptyPOrStoryforsubtype(cardId, subtype, opptyPlanId, storyId) {
  if (subtype) {
    if (opptyPlanId) {
      return get(`get/cardKeyMoment/opptyPOrStory/forSubtype?cardId=${cardId}&subtype=${subtype}&opptyPId=${opptyPlanId}&userId=${getLoggedInUser().userId || 19}`);
    } else if (storyId) {
      return get(`get/cardKeyMoment/opptyPOrStory/forSubtype?cardId=${cardId}&subtype=${subtype}&storyId=${storyId}&userId=${getLoggedInUser().userId || 19}`);
    }
  } else {
        if (opptyPlanId) { // eslint-disable-line
      return get(`get/cardKeyMoment/opptyPOrStory/forSubtype?cardId=${cardId}&opptyPId=${opptyPlanId}&userId=${getLoggedInUser().userId || 19}`);
    } else if (storyId) {
      return get(`get/cardKeyMoment/opptyPOrStory/forSubtype?cardId=${cardId}&storyId=${storyId}&userId=${getLoggedInUser().userId || 19}`);
    }
  }
  // if (!subtype) {
  //     return get(`get/cardKeyMoment/opptyPOrStory/forSubtype?cardId=${cardId}&opptyPId=${opptyPlanId}&userId=${getLoggedInUser().userId || 19}`);
  // }
  // if (opptyPlanId) {
  //     return get(`get/cardKeyMoment/opptyPOrStory/forSubtype?cardId=${cardId}&subtype=${subtype}&opptyPId=${opptyPlanId}&userId=${getLoggedInUser().userId || 19}`);
  // }
  // if (storyId) {
  //     return get(`get/cardKeyMoment/opptyPOrStory/forSubtype?cardId=${cardId}&subtype=${subtype}&storyId=${storyId}&userId=${getLoggedInUser().userId || 19}`);
  // }
}


export function getKeyMomentsForCardForOpptyPOrStoryforsubtypes(cardId, subtypes = ['machine_generated', 'context'], opptyPlanId, storyId) {
  const subtypesParam = subtypes.reduce((str, item) => {
    const subtype = `&subtypes=${item}`;
    return str + subtype;
  }, '');
  if (opptyPlanId) {
    return get(`get/cardKeyMoment/opptyPOrStory/forSubtypes?cardId=${cardId}${subtypesParam}&opptyPId=${opptyPlanId}&userId=${getLoggedInUser().userId || 19}`);
  } else if (storyId) {
    return get(`get/cardKeyMoment/opptyPOrStory/forSubtypes?cardId=${cardId}${subtypesParam}&storyId=${storyId}&userId=${getLoggedInUser().userId || 19}`);
  }
}

export function getAllKeyMomentsForCard(cardId) {
  return get(`getAll/keyMoments/forCard/${cardId}`);
}

export function createOpptyPlanCardNote(payload) {
  return post('opptyplan/createOpptyPlanCardNotes', payload);
}

export function upsertStoryCardNotesForPBCard(notes, pbCardId, storyId, userId) {
  return post(`upsertStoryCardNotesForPBCard?notes=${notes}&pbCardId=${pbCardId}&storyId=${storyId}&userId=${userId}`)
};
