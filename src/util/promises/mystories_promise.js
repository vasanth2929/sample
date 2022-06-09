/* eslint-disable no-restricted-syntax */
import { get, post } from '../service';
import { getHashValue } from './../utils';

export function getStoryResultCount(userId) {
    return get(`userid/${userId}`);
}

// export function getDatesForFiscalRange(userId, fromYear, fromQuarter, toYear, toQuarter) {
//     return get(`config/getDatesForFiscalRange/userid/${userId}/${fromQuarter}/${fromYear}/${toQuarter}/${toYear}`);
// }

export function getCurrentQtr() {
    return get('config/currentQtr');
}

export function getMinFiscalYearQtr() {
    return get('story/getMin');
}

export function getMaxFiscalYearQtr() {
    return get('story/getMax');
}

export function getStoriesforDate(userId, buyer, fromQuarter, fromYear, toQuarter, toYear) {
    return get(`getStories/user/${userId}/buyer/${buyer}?range=${fromQuarter}&range=${fromYear}&range=${toQuarter}&range=${toYear}`);
}

export function getMyStories(userId, fromDate, toDate) {
    return get(`getStories/user/${userId}/dateRange/${fromDate}/-/${toDate}`);
}

export function getAccountsList() {
    return get('listAllAccounts');
}

export function getAccount(accountId) {
    return get(`get/account/${getHashValue(accountId)}`);
}

export function addStory(payload) {
    return post('createStory', payload);
}

export function updateAccount(payload) {
    return post('update/account', payload);
}
