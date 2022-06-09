/* eslint-disable no-restricted-syntax */
import { get, post } from '../service';


export function getPrelimCardsForStory(storyId) {
    return get(`prelimCard/get/${storyId}`);
}

export function generatePrelimCardForStory(storyId) {
    return post(`prelimCard/generate/${storyId}`);
}

export function updatePrelimCard(payload) {
    return post('prelimCard/update', payload);
}

export function createPrelimCard(payload) {
    return post('prelimCard/create', payload);
}

export function doneTranscriptForStory(storyId) {
    return post(`prelimCard/complete/transcript/${storyId}`);
}

export function revertUpdatedCard(cardId) {
    return post(`prelimCard/revert/${cardId}`);
}

