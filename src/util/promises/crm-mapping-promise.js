import { get, post } from '../service';

export function getAllTribylObj() {
    return get('crmsync/salesforce/gettribylobjectdetails/all');
}

export function getAllCRMObj() {
    return get('crmsync/salesforce/getcrmobjectdetails/all');
}

export function getTribylObjectDetails(name) {
    return get(`crmsync/salesforce/gettribylobjectdetailsbyname?tribylObjectName=${name}`);
}

export function getCRMObjectDetails(id) {
    return get(`crmsync/salesforce/getcrmobjectdetailsbyid?sfObjectId=${id}`);
}

export function setTribylFieldMetadataToCrmFieldMetadataRel(tribylFieldId, crmFieldId) {
    return post(`crmsync/salesforce/linkcrmtotribylobject/${crmFieldId}/${tribylFieldId}`);
}
