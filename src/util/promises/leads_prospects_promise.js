import { get, post } from '../service';
import { getLoggedInUser, getHashValue } from '../utils';

export function getAccountById(accountId) {
    return get(`get/prospects/account/${accountId}`);
}
export function getOpptyPConversionMetricsForUser() {
    const { userId } = getLoggedInUser();
    return get(`getOpptyPConversionMetricsForUser?endTime=2020-08-17%2010%3A00%3A00&startTime=01-01-2019%2010%3A00%3A00&userId=${userId}`);
}
export function getProspectsWithSummaryDataForUser(filter, userId, opptyPlanWithConv) {
    return get(`getProspects/withSummaryData/${userId}/${filter}/${opptyPlanWithConv}`);
}
export function getOpptyPForProspect(accountId) {
    return get(`getOpptyPlan/forProspect/${getHashValue(accountId)}`);
}
export function getProspectAndOpenOpptyP(userId) {
    return get(`getProspect/andOpptyPlan/${userId}`);
}
export function getTeamMembersForUser(userId) {
    return get(`getTeamMembers/forUser/${userId || getLoggedInUser().userId}`);
}
export function listAllAccountForBDR(accountName) {
    return get(`listAll/account/forBDR/${getLoggedInUser().userId || 19}${accountName ? `/?account_name=${accountName}` : ''}`);
}
export function populateAllOutreachProspects() {
    return post(`outreach/populateprospects?buyerName=Human%20Resources`);
}
export function populateOutreachSequence() {
    return post(`outreach/populatesequence?buyerName=Human%20Resources`);
}

export function getNotificationsForUser(userId) {
    return get(`notification/foruser?userId=${userId}`);
} 

export function integrateSequencesAndProspects() {
    return post(`outreach/integrate/sequencesndprospects?buyerName=Human%20Resources`);
}
