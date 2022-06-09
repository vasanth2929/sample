/* eslint-disable no-restricted-syntax */
import { get, post } from '../service';

export function getKeywordsForObject(objectType) {
    return get(`getAll/keywords/%7Bobject_type%7D?object_type=${objectType}`);
}

export function updateKeywordsForObject(payload) {
    return post('update/keywords/forObject/temp', payload);
}
