/* eslint-disable no-restricted-syntax */
import { get } from "../service";

export function getUsageMetricsDailyForManagerForTimeRange({ startTime, endTime, managerUserId }) {
	return get(
		`getUsageMetricsDailyForManagerForTimeRange?startTime=${startTime}&endTime=${endTime}&managerUserId=${managerUserId}`
	);
}

export function getUsageMetricsDailyForUserForTimeRange({ startTime, endTime, userId }) {
	return get(`getUsageMetricsDailyForUserForTimeRange?startTime=${startTime}&endTime=${endTime}&userId=${userId}`);
}

export function getAllManagers() {
	return get(`user/getAllManagers`);
}

export function getUsageTotalsPerUserForManager({ startTime, endTime, managerUserId }) {
	return get(
		`getUsageTotalsPerUserForManager?startTime=${startTime}&endTime=${endTime}&managerUserId=${managerUserId}`
	);
}