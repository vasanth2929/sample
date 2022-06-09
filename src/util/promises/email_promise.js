/* eslint-disable no-restricted-syntax */
import { post, get } from '../service';

export function checkUserGmailAuth(payload) {
    return post('gmail/auth', payload);
}

export function sendUserGmailToken(payload) {
    return post('gmail/token', payload);
}

export function getUserSalesforceUrl() {
    return get('salesforce/authorizationurl');
}

export function checkUserSalesforceAuth() {
    return post('salesforce/token');
}

export function getUserSlackeUrl() {
    return get('slack/authorizeUrl');
}

export function setSlackAuthorizationToken() {
    return post(`slack/auth`);    
}