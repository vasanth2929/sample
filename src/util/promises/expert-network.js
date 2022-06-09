/* eslint-disable no-restricted-syntax */
import { post, get } from '../service';

export function getAllPlaybooks(returnInactiveAlso = false) {
    return get(`playbook/get/all/${returnInactiveAlso}`);
}

export function getMarketStudy(playbookId) {
    return get(`getMarketStudy?playbookId=${playbookId}`);
}

export function getSubMarketsForPlaybook(playbookId) {
    return get(`getSubMarketsForPlaybook?playbookId=${playbookId}`);
}

export function getMarketStudyQuestionCategoryAndSequence() {
    return get(`getMarketStudyQuestionCategoryAndSequence`);
}