/* eslint-disable no-restricted-syntax */
import { get, post } from '../service';
import { getHashValue, getLoggedInUser } from '../utils';

export function assignUserOrContactToOpptyPlanActivity(opptyPlanId, userId) {
    return post(`assign/user/contact/opptyPlanActivity/${opptyPlanId}?userIds=${userId}`);
}

export function calculateCrScores(opptyPlanId) {
    return get(`opptyplan/scores/recalculate/${opptyPlanId}`);
}

export function createContactForOpptyPlan(opptyPlanId, payload) {
    return post(`opptyplan/create/contact/${opptyPlanId}`, payload);
}

export function updateContactForOpptyPlan(opptyPlanId, contactId, payload) {
    return post(`opptyplan/update/contact/${opptyPlanId}/${getHashValue(contactId)}`, payload);
}

export function getNotesForOpptyPlan(opptyPlanId) {
    return get(`mostRecent/opptyPNote/${opptyPlanId}`);
}

export function createNoteForPlan(payload) {
    return post('opptyplan/createOpptyPlanNotes', payload);
}

export function removeOpptyPlanPersona(opptyPCardDetailPersonaId) {
    return post(`remove/opptyP/personaContact?opptyPCardDetailPersonaId=${opptyPCardDetailPersonaId}`);
}

export function updateOpptyPlanNote(introOrStageBasedFlag, payload) {
    return post(`update/opptyPlanNote?${introOrStageBasedFlag ? `introOrStageBasedFlag=${introOrStageBasedFlag}` : ''}`, payload);
}

export function createOpptyPlanCardNotes(payload) {
    return post(`opptyplan/createOpptyPlanCardNotes`, payload);
}

export function createOpptyPlanCardDetail(payload) {
    return post('opptyplan/create/cardDetail', payload);
}

export function createOpptyPlanCardDetailNew(payload) {
    return post('opptyplan/create/cardDetailNew', payload);
}

export function upsertAccountResearch(payload) {
    return post('upsert/account/research', payload);
}

export function getAccountResearch(accountId) {
    return get(`get/account/research/${getHashValue(accountId)}`);
}

export function createOrUpdateOpptyPlanCardDetail(payload) {
    return post('opptyplan/createOrupdate/cardDetail', payload);
}
export function verifyPersonaCardForOpptyP(objId, userId, verifyOrUnverify) {
    return post(`verifyOrUnverify/persona/${objId}/${userId}?verifyOrUnverify=${verifyOrUnverify}`);
}
export function addOrUpdatePersonaForOpptyP(payload) {
    // const query = Object.keys(payload).map(key => `${key}=${payload[key]}`).join('&');
    return post(`opptyplan/addorupdate/personas`, payload);
}
export function addContactForOpptyP(contactId, opptyPlanId, role) {
    // const query = Object.keys(payload).map(key => `${key}=${payload[key]}`).join('&');
    return post(`opptyplan/addcontact?contactId=${contactId}&opptyPlanId=${opptyPlanId}${role ? `&role=${role}` : ''}`);
}
export function createOrUpdateOpptyPlanCardDetailContextProtip(payload) {
    return post('createorupdate/opptyp/cardDetail/context/protip', payload);
}
export function updateContextProtipForPersonaCardForOpptyP(payload) {
    return post('update/contextProtip/personaCardForOpptyP', payload);
}
export function getOpptyPCardDetailContextProtip(optyId, cardId) {
    return get(`get/opptyP/cardDetail/context/protip/${optyId}/${cardId}`);
}
export function getContextProtipForPersonaCardForOpptyP(opptyPCardDetailContactRelId) {
    return get(`get/contextProtip/PersonaCardForOpptyP/${opptyPCardDetailContactRelId}`);
}
export function deleteOpptyPlanCardNote(opptyPlanCardNoteId) {
    return post(`delete/opptyPlan/cardNotes?opptyPlanCardNoteId=${opptyPlanCardNoteId}`);
}
export function updateOpptyPlanCardNote(payload) {
    return post(`update/opptyPlan/cardNote`, payload);
}
export function createActivityCardForOpptyP(opptyPlanId, title, description, internalExternalInd, salesStage, payload) {
    return post(`opptyplan/create/activity/card?cardTitle=${title}&description=${description}&opptyPlanId=${opptyPlanId}&internalExternalInd=${internalExternalInd}&salesStage=${salesStage}`, payload);
}

export function generateOpptyPlanRec(opptyPlanId, topciGroupName, sortBy, userId, searchString, matchLevel, pinnedCardId) {
    return searchString ?
        get(`generate/opptyplan/rec?opptyplanid=${opptyPlanId}&topicgroupname=${topciGroupName}&userid=${userId}&sortby=${sortBy}&searchString=${searchString}&matchLevel=${matchLevel}`)
        :
        get(`generate/opptyplan/rec?opptyplanid=${opptyPlanId}&topicgroupname=${topciGroupName}&userid=${userId}&sortby=${sortBy}${pinnedCardId ? '&pinnedcardid=' + pinnedCardId : ''}`);
}

export function generateOpptyPlanRecNew(payload) {
    return post('generate/opptyplan/rec/fortopicname', payload);
}

export function generateOpptyPlanRecNewV2(payload) {
    return post('generate/dealsummary/carddata/fortopicname', payload);
}

export function generateSkinnyOpptyPlanRecNew(payload) {
    return post('generate/opptyplan/rec/fortopicname/withStaticCRScore', payload);
}

export function getOpportunityAndMeeting(opptyPlanId) {
    return post(`oppty/crm/getopportunityandmeeting?opptyPlanId=${opptyPlanId}`)
}

export function getMatchedCardsForOpptyPlan(payload) {
    return post(`opptyplan/matchedcards`, payload);
}
export function createOpptyPlan(accountId, payload) {
    return post(`opptyPlan/create?accountId=${getHashValue(accountId)}`, payload);
}

export function getAlerts(opptyPlanId) {
    return post(`opptyPlan/getalerts?opptyPlanId=${opptyPlanId}`);
}

export function getOpptyPlanDetails(opptyPlanId) {
    return post(`opptyPlan/get?opptyPlanId=${opptyPlanId}`);
}

export function getOpptyPlanRec(opptyPlanId) {
    return get(`opptyplan/rec/${opptyPlanId}`);
}

export function getOpptyPlanRecWithFilters(payload) {
    return post('generate/opptyplan/rec/withfilters', payload);
}

export function getAllNotesForOpptyP(opptyPlanId) {
    return get(`getAll/notes/cardNotes/${opptyPlanId}`);
}

export function searchOpptyPlanNote(opptyPlanId, searchString) {
    return get(`search/opptyPlanNote/${opptyPlanId}/${searchString}`);
}

export function getNotesForPlan(opptyPlanId) {
    return get(`opptyplan/getOpptyPlanNotes?oppty_plan_id=${opptyPlanId}`);
}

export function getOpptyPlanForStory(storyId, topicGroupName, userId) {
    return get(`generate/opptyplan/rec/forstory?storyid=${storyId}&topicgroupname=${topicGroupName}&userid=${userId}`);
}

export function getOpptyPlanCardNotes(opptyPlanId, cardId, type) {
    return get(`opptyplan/getCardNotes/${opptyPlanId}/${cardId}${type ? `?type=${type}` : ''}`);
}

export function getAllProtipForCard(cardId) {
    return get(`getAll/protip/forCard/${cardId}`);
}

export function getAllOpptyPlanDetails(userId, closeQtr) {
    return get(`opptyplan/summary/user?closeQtr=${closeQtr}&user=1${userId}`);
}

export function getOpptyPlanForSalesTeam(teamId, fromQuarter, fromYear, toQuarter, toYear) {
    return get(`opptyplan/summary/team?range=${fromQuarter}&range=${fromYear}&range=${toQuarter}&range=${toYear}&teamid=${teamId}`);
}

export function getOpptyPlanForSalesTeamV3(teamId, fiscalQr, fiscalYear, userId) {
    return get(`opptyplan/summary/team/new?fiscalQr=${fiscalQr}&fiscalYear=${fiscalYear}&teamid=${teamId}&userId=${userId}`);
}

export function getContactDetailsForOpptyPlan(opptyPlanId) {
    return post(`opptyplan/getContactDetails/${opptyPlanId}`);
}

export function getOpptyContactsForOpptyPlan(opptyPlanId) {
    return post(`opptyPlan/getOpptyContacts/${opptyPlanId}`);
}

export function getCallPlanForUserAndOpptyPlan(opptyPlanId, userId, topciGroupName) {
    return post(`opptyplan/get/callPlan/${opptyPlanId}/${userId}/${topciGroupName}/`);
}

export function getAllActivityDetailsForOpptyPlan(opptyPlanId) {
    return get(`getAll/activity/${opptyPlanId}`);
}

export function getInsightDataForActivityCard(cardId) {
    return get(`get/insightData/activity/${cardId}`);
}

export function getInsightDataForContentCard(cardId) {
    return get(`get/insightData/content/${cardId}`);
}

export function getAllContentForOpptyPlan(opptyPlanId) {
    return get(`getAll/content/${opptyPlanId}`);
}

export function getAssignmentHistoryForActivityAndOpptyP(opptyPlanId, cardId) {
    return get(`get/assignmentHistory/${opptyPlanId}/${cardId}`);
}

export function getPersonaJobTitlesForFilter(payload) {
    return post('opptyplan/get/persona/jobTitles', payload);
}

export function listAllStages() {
    return get('opptyplan/stages/all');
}

export function searchStories(opptyPlanId) {
    return get(`opptyplan/stories/${opptyPlanId}`);
}

export function searchStoriesWithFilters(payload) {
    return post('opptyplan/stories/searchwithfilters', payload);
}

export function searchStoriesWithCardAndFilters(payload) {
    return post('opptyplan/stories/cardwithfilters', payload);
}

export function updateOpptyPlanCardDetail(payload) {
    return post('opptyplan/updateOpptyPlanCardDetail', payload);
}

export function updateOpptyPlanActivity(opptyPlanId, cardId, payload) {
    return post(`update/activity/${opptyPlanId}/${cardId}`, payload);
}

export function getPersonaContactDetails(opptyPlanId) {
    return post(`opptyplan/getContactDetails/${opptyPlanId}`);
}

export function searchAccountOwners(payload) {
    return post('story/account/owners', payload);
}

export function getAllOpptyPNotesCardNotesForUserContact(contactId, opptyPlanId, noteType, userContactInd) {
    return get(`getAll/opptyPlan/notes/cardNotes/user/contact/${opptyPlanId}?type=${noteType}&user_or_contact_id=${getHashValue(contactId)}&user_or_contact_ind=${userContactInd}`);
}

export function updateContactToContactRelForOpptyPlan(parent, child, create) {
    return post(`update/relation/${parent}/${child}/${create}`);
}

export function getViewedStoriesForOpptyP(opptyPlanId) {
    return get(`get/storyViewed/forOpptyP/${opptyPlanId}`);
}

export function findStoryReferencesInConversationsForOpptyP(opptyPlanId) {
    return get(`get/storyReferences/inConv/forOpptyP/${opptyPlanId}`);
}

export function getKeywordListByCompetency(coreCompetencyId) {
    return get(`get/keywordList/byCompetency/${coreCompetencyId}`);
}

export function getManagerForUser(userId) {
    return get(`get/manager/forUser/${userId}`);
}

export function getOpptyPlan(opptyPlanId) {
    return get(`get/opptyPlan/${opptyPlanId}`);
}

export function likeOrUnlikeNote(noteId, userId, likeOrUnlike, noteType) {
    return post(`likeOrUnlike/note/${noteId}/${userId}?likeOrUnlike=${likeOrUnlike}&noteType=${noteType}`);
}
export function getProdLines(opptyPlanId) {
    return get(`opptyPlanBoard/get/prodLine/${opptyPlanId}`);
}

export function updateProdLine(prodId, opptyPlanId, operation) {
    return post(`update/prodLine/opptyPlan/${prodId}/${opptyPlanId}/${operation}`);
}
// export function getCustEnv(accountId, opptyPlanId) {
//     return get(`opptyPlanBoard/get/custEnv/${accountId}/${opptyPlanId}`);
// }
export function getCustEnvForAccount(accountId) {
    return post(`get/custEnv/forAccountId/${getHashValue(accountId)}`);
}
export function createCustEnvForAccount(accountId, category, payload) {
    return post(`create/custEnv/andAddToAccount?accountId=${getHashValue(accountId)}&category=${category}`, payload);
}
export function updateCustEnvForAccount(accountId, custEnvId) {
    return post(`update/custEnv/forAccountId?accountId=${getHashValue(accountId)}&custEnvId=${custEnvId}`);
}
export function getCustEnvForOppty(opptyPid) {
    return post(`opptyPlan/get/custEnv/opptyP/Story?opptyPId=${opptyPid}`);
}
// export function updateCustEnv(envId, opptyPlanId, operation) {
//     return get(`update/custEnv/opptyPlan/${envId}/${opptyPlanId}/${operation}`);
// }
export function updateCustEnv(custEnvId, opptyPid) {
    return post(`update/custEnv/opptyPlan/story/${custEnvId}?opptyPId=${opptyPid}`);
}
// export function createCustEnv(accountId, category, opptyPlanId, payload) {
//     return post(
//         `opptyplan/add/custEnv/rels/${accountId}/${opptyPlanId}/${category}`,
//         payload
//     );
// }
export function createCustEnv(accountId, category, opptyPid, payload) {
    return post(
        `add/custEnv/toopptyP/story/${category}?opptyPId=${opptyPid}`,
        payload
    );
}
export function updateOpptyPlan(opptyPlanId, payload) {
    return post(`opptyPlan/update?opptyPlanId=${opptyPlanId}`, payload);
}

export function getUsersForOpptyPlan(opptyPlanId) {
    return get(`get/users/${opptyPlanId}`);
}

export function getCRMOpportunityForOpptyPlan(opptyPlanId) {
    return get(`get/CRMOpp/${opptyPlanId}`);
}

export function addUserToOpptyPlan(userId, opptyPlanId) {
    return post(`add/user/${userId}/${opptyPlanId}`);
}

export function removeUserFromOpptyPlan(userId, opptyPlanId) {
    return post(`remove/user/${userId}/${opptyPlanId}`);
}

export function addOrRemoveContactFromOpptyPlan(opptyPlanId, contactId, addOrRemove) {
    return post(`addOrRemove/contact/OpptyP/${opptyPlanId}/${getHashValue(contactId)}?add_or_remove_contact=${addOrRemove}`);
}

export function addOpptyToCrm(opptyPlanId) {
    return post(`crmsync/addopptytocrm?opptyplanid=${opptyPlanId}`);
}

export function syncWithCrm(opptyPlanId) {
    return post(`crmsync/syncwithcrm?opptyplanid=${opptyPlanId}`);
}

export function getCrmOpptyForOpptyPlan(opptyPlanId) {
    return get(`getCRMOpptyForOpptyPlan?opptyPlanId=${opptyPlanId}`);
}

export function createOpptyPlanCardForCallPlanOrVerify(payload) {
    return post('opptyplan/create/card', payload);
}

export function deleteOpptyPlanCardForCallPlanOrVerify(payload) {
    return post('opptyplan/delete/card', payload);
}

export function likeOrUnlikeStory(type, storyId, userId) {
    return post(`likeOrUnlike/story/${storyId}/${userId}?likeOrUnlike=${type}`);
}

export function getOpptyForAccounts(accountId) {
    return get(`listAll/oppty/${getHashValue(accountId)}`);
}

export function getPersonaContactRels(opptyPlanId, userId) {
    return get(`get/opptyP/personaContactRels/${opptyPlanId}${userId ? `?userId=${userId}` : ''}`);
}

export function getOrRecommendPersonas(opptyPlanId, userId) {
    return get(`opptyplan/get/recommend/personas?opptyPlanId=${opptyPlanId}&userId=${userId}`);
}

export function getOpptyPlanNotesComments(opptyPlanNoteId) {
    return get(`get/opptyPlanNoteComment/${opptyPlanNoteId}`);
}

export function createOpptyPlanNotesComments(payload) {
    return post('create/opptyPlanNoteComment', payload);
}

export function likeOrUnlikeNoteComment(commentId, userId, likeOrUnlike) {
    return post(`likeOrUnlike/noteComment/${commentId}/${userId}?likeOrUnlike=${likeOrUnlike}`);
}

export function upsertOpptyPlanNotes(introOrStageBasedFlag, payload) {
    return post(`opptyplan/upsertOpptyPlanNotes?${introOrStageBasedFlag ? `introOrStageBasedFlag=${introOrStageBasedFlag}` : ''}`, payload);
}

export function deleteOpptyPlanNote(opptyPlanNoteId) {
    return post(`delete/opptyPlanNotes?opptyPlanNoteId=${opptyPlanNoteId}`);
}

export function getIntroAndDiscoveryQuestionsForOpptyPlan(opptyPlanId) {
    return get(`get/opptyP/topics/${opptyPlanId}`);
}

export function getAllDiscoveryQuesDetails(playbookId) {
    return get(`getAllDiscoveryQuesDetails/${playbookId}`);
}

export function getAllTopics() {
    return get('topics/all');
}

export function getStoriesForCardForOpptyP(cardId, opptyPlanId) {
    return get(`getStoryForOpptyP/cardId/${cardId}/${opptyPlanId}`);
}

export function getCountsByTopicGroupforOpptyP(opptyPlanId, userId) {
    return get(`getCount/cardsByTopic/forOpptyPlan?opptyPlanId=${opptyPlanId}&userId=${userId}`);
}

export function getContactsForAccountForOpptyP(accId, opptyPlanId, searchString) {
    return get(`get/contacts/forAccountForOpptyP?accId=${getHashValue(accId)}&opptyPlanId=${opptyPlanId}${searchString ? `&searchString=${searchString}` : ''}`);
}

export function refreshContactsForAccountForOpptyP(accountId) {
    return post(`contact/upsertcrmcontact?accountId=${accountId}`);
}

export function getDealSummaryHost() {
    return get('opptyplan/dealsummaryurl/');
}

export function getRatingQuestionByStage(salesStageId) {
    return get(`get/ratingQuestions/byStage/${salesStageId}`);
}

export function deleteRatingQuestion(salesStageParamId) {
    return post(`delete/ratingQuestion/bySalesStageParamId?salesStageParamId=${salesStageParamId}`);
}

export function upsertRatingQuestionByStage(payload) {
    return post('upsert/ratingQuestion/byStage', payload);
}

export function updateSalesStageParams(payload, userId) {
    return post(`update/salesStageParams?userId=${userId}`, payload);
}

export function getCreateUpdateOpptySalesStageRating(payload) {
    return post('getcreate/update/OpptySalesStageRating', payload);
}

export function getOpptyPlansForAccount(accountId) {
    return get(`get/opptyPlans/forAccount/${getHashValue(accountId)}`);
}

export function relateStoryOrOpptyPToSalesPlay(payLoad) {
    return post('relate/storyOrOpptyP/toSalesPlay', payLoad);
}

export function relateCRMOpptyToOpptyPlan(crmOpptyId, opptyPlanId) {
    return post(`relateCRMOpptyToOpptyPlan?crmOpptyId=${crmOpptyId}&opptyPlanId=${opptyPlanId}`);
}

export function unrelateSalesPlayFromStoryOrOpptyPlan(payload) {
    return post('unrelate/storyOrOpptyP/fromSalesPlay', payload);
}

export function getSalesPlayForOpptyPOrStory(storyId, opptyPId) {
    if (storyId) {
        return get(`get/salesPlays/forOpptyPlan/orStory?storyId=${storyId}`);
    }
    return get(`get/salesPlays/forOpptyPlan/orStory?opptyPId=${opptyPId}`);
}

export function getSalesPlayForPlaybook(playbookId) {
    return get(`get/salesPlays/forPlaybook/${playbookId}`);
}

export function getOpptyPlanResearch(opptyPlanId) {
    return get(`get/opptyPlan/research/${opptyPlanId}`);
}

export function createOpptyPlanResearch(opptyPlanId, researchNotes) {
    return post(`create/opptyPlan/research?opptyPlanId=${opptyPlanId}&researchNotes=${researchNotes}`);
}

export function updateOpptyPlanResearch(opptyPlanResearchId, researchNotes) {
    return post(`update/opptyPlan/research?opptyPlanResearchId=${opptyPlanResearchId}&researchNotes=${researchNotes}`);
}

export function upsertOpptyPlanResearch(payload) {
    return post('upsert/opptyPlan/research', payload);
}

export function addReferencedStoryViewCount(opptyPlanId, storyId) {
    return post(`add/referencedStory/viewCount/forOpptyP?opptyPId=${opptyPlanId}&storyId=${storyId}&userId=${getLoggedInUser().userId}`);
}

export function getAcctPBRelAcctResearch(accountId) {
    return get(`get/accountPlaybookRel/acctResearch/${getHashValue(accountId)}`);
}

export function getOpptyPAndSalesPlay(accountId) {
    return get(`get/opptyPlan/andSalesPlay/${getHashValue(accountId)}`);
}

export function updateAcctPBRelAcctResearch(accountId, playbookId, optOut, salesPlayId) {
    if (salesPlayId) {
        return post(`update/accountPlaybookRel/acctResearch?accountId=${getHashValue(accountId)}&optOut=${optOut}&pbSalesPlayId=${salesPlayId}&playbookId=${playbookId}`);
    }
    return post(`update/accountPlaybookRel/acctResearch?accountId=${getHashValue(accountId)}&optOut=${optOut}&playbookId=${playbookId}`);
}

export function getGenericAcctResearchTopics() {
    return get('get/genericAcctResearchTopics');
}

export function removeGenericAcctResearchTopics(generalMetadataParamId) {
    return post(`remove/genericAcctResearchTopics?generalMetadataParamId=${generalMetadataParamId}`);
}

export function upsertGenericAcctResearchTopics(rank, text, generalMetaDataParamId) {
    if (generalMetaDataParamId) {
        return post(`upsert/genericAcctResearchTopics?generalMetaDataParamId=${generalMetaDataParamId}&rank=${rank}&text=${text}`);
    } return post(`upsert/genericAcctResearchTopics?rank=${rank}&text=${text}`);
}

export function upsertOpptyPAndSalesPlay(accountId, salesPlayIds, playbookId) {
    if (salesPlayIds) {
        return post(`upsert/opptyPlan/andSalesPlay?accountId=${getHashValue(accountId)}&${salesPlayIds}&playbookId=${playbookId}`);
    } return post(`upsert/opptyPlan/andSalesPlay?accountId=${getHashValue(accountId)}&playbookId=${playbookId}`);
}

export function createFavouriteStoryForOpptyP(opptyPlanId, storyId) {
    return post(`create/favouriteStory/forOpptyP?opptyPlanId=${opptyPlanId}&storyId=${storyId}`);
}

export function removeFavouriteStoryForOpptyP(opptyPlanId, storyId) {
    return post(`remove/favouriteStory/forOpptyP?opptyPlanId=${opptyPlanId}&storyId=${storyId}`);
}

export function changeAccountResearchAction(accountId) {
    return post(`change/accountResearchAction?accountId=${getHashValue(accountId)}`);
}

export function getAccountDetails(accountId) {
    return get(`getAccountDetails/?accountId=${accountId}`);
}

export function getContactStatusFromCRMForContact(accountId) {
    return get(`contact/getstatus/fromcrm/${accountId}`);
}

export function getPicklistData(fields, sfObjectName) {
    return get(`crmsync/salesforce/getcrmobjectdetailsbyname/selectedfields?${fields}&sfObjectName=${sfObjectName}`);
}

export function createHandoffTask(data) {
    return post(`handoffTask/create`, data);
}

export function createMeetingTaskinCRMForContactForOpptyP(opptyPlanId, contactId, data) {
    return post(`task/createincrm/opptyplan/${opptyPlanId}/contact/${contactId}`, data);
}

export function upsertHandoffTaskListForOpptyPForContac(opptyPlanId, data) {
    return post(`upsertHandoffTaskListForOpptyPForContact?opptyPlanId=${opptyPlanId}`, data);
}

export function createOpptyInCRMForOpptyP(opptyPlanId, contactId, data) {
    return post(`createcrmoppty/${opptyPlanId}/contact/${contactId}`, data);
}

export function updateOpptyInCRMForOpptyP(data, crmOpptyId) {
    return post(`crm/oppty/updateincrm?crmOpptyId=${crmOpptyId}`, data)
}

export function getHandoffTaskListForOpptyP(opptyPlanId) {
    return get(`getHandoffTaskListForOpptyPlan?opptyPlanId=${opptyPlanId}`);
}

export function getOpptyListForAccount(accountId) {
    return get(`getOpptyListForAccount?accountId=${accountId}`);
}

export function getLatestOpptysFromCRMForAccountAndUpdate(accountId) {
    return post(`oppty/crm/account/get?accountId=${accountId}`);
}

export function getMeetingTaskFromCRMForContactAndUpdate(crmContactId, opptyPlanId) {
    return post(`task/crm/forcontactandoppty?crmContactId=${crmContactId}&opptyPlanId=${opptyPlanId}`);
}

// export function relateCRMMeetingToOpptyPlan(crmTaskId, opptyPlanId) {
//     return post(`relateCRMMeetingToOpptyPlan?crmTaskId=${crmTaskId}&opptyPlanId=${opptyPlanId}`);
// }

export function relateMeetingTaskListToOpptyPlan(contactId, handoffTaskIdList, opptyPlanId) {
    return post(`relateMeetingTaskListToOpptyPlan?contactId=${contactId}&handoffTaskIdList=${handoffTaskIdList}&opptyPlanId=${opptyPlanId}`);
}

export function getConversationStatsForStory(storyId, numOfMonthsTimeRange = "") {
    return get(`getConversationStatsForStory?storyId=${storyId}`);
}

export function getConversationStatsForOppty(opptyPlanId, numOfMonthsTimeRange = "") {
    return get(`getConversationStatsForStoryOrOpptyP?opptyPlanId=${opptyPlanId}`);
}

export function getSurveyStatsForStory(storyId) {
    return get(`getSurveyStatsForStory?storyId=${storyId}`);
}
