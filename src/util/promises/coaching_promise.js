import { get, upload, post } from '../service';
import { getLoggedInUser } from '../utils';

export function getRoleCoreCompetencyForRole(roleId) {
    return get(`getRoleCoreCompetency/forRole/${roleId || getLoggedInUser().roleId || 6}`);
}

export function getCoreCompetencyResourceForUserForOpptyP(opptyId, userId) {
    return get(`getCoreCompetencyResource/forUser/${userId || getLoggedInUser().userId}/forOpptyP/${opptyId}`);
}

export function uploadCompetencyVideo(opptyPlanId, file, filename) {
    const formData = new FormData();
    formData.append('file', file, filename);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return upload(`files/competency/uploadAndSave?opptyPlanId=${opptyPlanId}`, formData, config);
}

export function handleCompetencyVideoFileRemove(file) {
    return post(`file/competency/remove?file=${file}`);
}

export function saveCoreCompetencyResourceForUserForOppty(payload) {
    return post('save/coreCompetencyResource/forUser/forOppty', payload);
}

export function removeCoreCompetencyResourceForUserForOpptyP(roleCoreCompetencyOpptyPlanAssessmentId) {
    return post(`remove/CoreCompetencyResource/forUser/forOpptyP?roleCoreCompetencyOpptyPlanAssessmentId=${roleCoreCompetencyOpptyPlanAssessmentId}`);
}

export function getSavedOrAutoPopulatedAssessmentCommentsForCompetencyForOpptyP(userId, opptyId, coreCompetencyId, type) {
    return get(`get/savedOrAutoPopulate/forUser/forOpptyP?opptyPlanId=${opptyId}&roleCoreCompetencyId=${coreCompetencyId}&type=${type}&userId=${userId}`);
}

export function getRoleCompetencyConvProtipOrCommentsFlagForOpptyP(opptyPlanId) {
    return get(`get/protipOrCommentsFlag/forOpptyP/${opptyPlanId}`);
}

export function upsertAssessmentForCompetencyForOpptyPForType(payload) {
    return post(`upsert/assessmentForCompetency/forOpptyP/forType`, payload);
}

export function upsertOverallRatingForOpptyP(opptyPlanId, rating, type) {
    return post(`upsert/overAllRating/forOpptyP?opptyPlanId=${opptyPlanId}&ratingValue=${rating}&subtype=${type}`);
}

export function getOverallRatingForOpptyP(opptyPlanId) {
    return get(`get/overAllRating/forOpptyP/${opptyPlanId}`);
}

//export function getKeyMomentsForConversationForOppty(convId, opptyPlanId, coreCompetencyId) {
//    return get(`get/savedOrAutoPopulateAllKM/forOpptyP/forConv?convId=${convId}&opptyPlanId=${opptyPlanId}&roleCoreCompetencyId=${coreCompetencyId}`);
//}
export function getKeyMomentsForConversationForOppty(convId, opptyPlanId, coreCompetencyId) {
    return get(`get/savedOrAutoPopulateAllKM/forOpptyP?opptyPlanId=${opptyPlanId}&roleCoreCompetencyId=${coreCompetencyId}`);
}
export function upsertOpptyPlanAssessmentStatus(payload) {
    return post("upsert/opptyPlanAssessmentStatus", payload);
}


export function getCoachingStatsAndSummary (opptyPlanId, type) {
    return get(`getCoachingStatsAndSummary?opptyPlanId=${opptyPlanId}&type=${type}`);
}