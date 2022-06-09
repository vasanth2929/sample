import { get, post } from '../service';

export function getAllPropset() {
    return get('getAll/config/propset');
}

export function deleteConfigPropset(propsetId) {
    return post(`delete/config/propset/${propsetId}`);
}

export function getConfigPropset(propsetId) {
    return get(`get/config/propset/${propsetId}`);
}

export function createConfigPropset(payload) {
    return post('create/config/propset', payload);
}

export function updateConfigPropset(payload) {
    return post('update/config/propset', payload);
}

export function createConfigProperty(payload) {
    return post('create/config/property', payload);
}

export function deleteConfigProperty(propertyId) {
    return post(`delete/config/property/${propertyId}`);
}

export function updateConfigProperty(payload) {
    return post('update/config/property', payload);
}

export function createConfigPropsetPropval(payload) {
    return post('create/config/propsetPropval', payload);
}

export function updateConfigPropsetPropval(payload) {
    return post('update/config/propsetPropval', payload);
}

export function getPBSequenceMapping() {
    return get('get/PBSequenceMapping');
}

export function relatePBAndOutreachSequence(playbookId, sequenceName) {
    return post(`relate/PBAndOutreachSequence?playbookId=${playbookId}&sequenceName=${sequenceName}`);
}
