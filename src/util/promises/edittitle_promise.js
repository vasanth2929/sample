/* eslint-disable no-restricted-syntax */
import { get, post } from '../service';

export function updateStoryTitle(payload) {
    return post('updateStory', payload);
}

export function updateStoryTitleNew(payload) {
    return post('update/story/new', payload);
}

export function getStoryTitle(storyId) {
    return get(`getStoryTitle/storyId/${storyId}`);
}

export function getStoryParamsForStory(storyId) {
    return get(`get/storyParam/forStoryId/${storyId}`);
}

export function upsertStoryParamBean(payload) {
    return post('upsert/storyParam/forStory', payload);
}
