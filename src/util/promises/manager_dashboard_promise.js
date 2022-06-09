import { get, post } from '../service';

export function getEffectiveDateRanges() {
    return get('get/effectiveDateRanges');
}

export function getUsageMetricsSummaryForManagerForTimeRange({ startTime, endTime, managerUserId }) {
    return get(`getUsageMetricsSummaryForManagerForTimeRange?startTime=${startTime}&endTime=${endTime}&managerUserId=${managerUserId}`);
}

export function getUsageMetricsSummaryForUserForTimeRange({ startTime, endTime, userId }) {
    return get(`getUsageMetricsSummaryForUserForTimeRange?startTime=${startTime}&endTime=${endTime}&userId=${userId}`);
}

export function getUsageMetricsWeekwiseForManagerForTimeRange({ startTime, endTime, managerUserId }, label) {
    if (label === "Last 30 days") {
        return get(`getUsageMetricsDailyForManagerForTimeRange?startTime=${startTime}&endTime=${endTime}&managerUserId=${managerUserId}`);
    } 
        return get(`getUsageMetricsWeekwiseForManagerForTimeRange?startTime=${startTime}&endTime=${endTime}&managerUserId=${managerUserId}`);
}

export function getUsageMetricsWeekwiseForUserForTimeRange({ startTime, endTime, userId }, label) {
    if (label === "Last 30 days") {
        return get(`getUsageMetricsDailyForUserForTimeRange?startTime=${startTime}&endTime=${endTime}&userId=${userId}`);
    } 
        return get(`getUsageMetricsWeekwiseForUserForTimeRange?startTime=${startTime}&endTime=${endTime}&userId=${userId}`);
}

export function getCompetencyAssessmentRatingsWeekWiseForMgr(payload) {
    return post('get/competencyAssessmentRatings/weekWise/forMgr', payload);
}

export function getCompetencyAssessmentRatingsMonthwiseForMgr(payload) {
    return post('get/competencyAssessmentRatings/monthWise/forMgr', payload);
}

export function getCompetencyAssessmentRatingsForMgr(payload) {
    return post('get/competencyAssessmentRatings/forMgr', payload);
}

export function getCompetencyAssessmentRatingsWeekWiseForUser(payload) {
    return post('get/competencyAssessmentRatings/weekWise/forUser', payload);
}

export function getCompetencyAssessmentRatingsMonthWiseForUser(payload) {
    return post('get/competencyAssessmentRatings/monthWise/forUser', payload);
}

export function getCompetencyAssessmentRatingsForUser(payload) {
    return post('get/competencyAssessmentRatings/forUser', payload);
}

export function getCompetencyAssessmentCommentsForUser(payload) {
    return post('get/competencyAssessmentComments/forUser', payload);
}

export function geBaselineCompetencyFinalAssessment(userId) {
    return get(`get/baselineCompetency/finalAssessment?managerUserId=${userId}`);
}

export function getCompetencyAssessmentAverageRatingForUser(payload) {
    return post("get/competencyAssessment/averageRating/forUser", payload);
}

export function getRoleCoreCompetencyFinalAssessment(payload) {
    return post("get/roleCoreCompetency/finalAssessment", payload);
}

export function upsertRoleCoreCompetencyFinalAssessment(payload) {
    return post('upsert/roleCoreCompetency/finalAssessment', payload);
}
