import { get, post } from '../service';
import { getHashValue } from '../utils';

export function getTribylIndustries() {
  return get(`get/qualifiers/industry`);
}

export function getIndustryForAccountwithAllIndustryList(accountId) {
  return get(`getOverrideFlagAndIndustryListForAccount?accountId=${accountId}`);
}

export function getTribylMarkets() {
  return get(`get/qualifiers/market%20segment`);
}

export function getRegions() {
  return get(`list/region/all`);
}

export function createTribylIndustry(value) {
  return post(`create/qualifiers?type=industry&value=${value}`);
}

export function updateTribylIndustry(id, value) {
  return post(`update/qualifier?qualifierId=${id}&value=${value}`);
}

export function getCRMTribylIndustryMappings() {
  return get(`get/industryDetailValue?industryDetailValueId=all`);
}

export function updateCRMIndustry(payload) {
  return post(`update/industryDetailValue`, payload);
}

export function removeCRMIndustryMapping(industryDetailValueId, qualifierId) {
  return post(
    `unrelate/industryDetailValue/fromQualifier?industryDetailValueId=${industryDetailValueId}&qualifierId=${qualifierId}`
  );
}

export function getAccountAndIndustryDetailsForFilters({
  accountName,
  selectedIndustry = {},
  selectedMarket = {},
  selectedRegion = {},
} = {}) {
  if (selectedIndustry.id)
    return get(
      `get/accountAndIndustryDetail/forFilters?industryId=${selectedIndustry.id}`
    );
  if (selectedMarket.id)
    return get(
      `get/accountAndIndustryDetail/forFilters?marketId=${selectedMarket.id}`
    );
  if (selectedRegion.id)
    return get(
      `get/accountAndIndustryDetail/forFilters?regionId=${selectedRegion.id}`
    );
  if (accountName !== '')
    return get(
      `get/accountAndIndustryDetail/forFilters?accountName=${accountName}`
    );

  return get(`get/accountAndIndustryDetail/forFilters`);
}

export function getIndustryExceptionAccountListBean() {
  return get(`get/industryExceptionAccount?industryExceptionAccountListId=all`);
}

export function getFailedIndustryMappingAccountList() {
  return get(`get/getFailedIndustryMapping/accountList`);
}

export function updateIndustryExceptionAccountList(payload) {
  return post(`update/industryExceptionAccount`, payload);
}

export function relateAccountToIndustry(accountId, industryId) {
  return post(
    `relate/accountToIndustry?accountId=${getHashValue(
      accountId
    )}&industryId=${industryId}`
  );
}

export function getNeedsReviewIndustryAccountList() {
  return get(`get/needsReview/industryAccountList`);
}

export function addAccountIndustryToOverrideList(accountId, industryId) {
  // const payload = { accountId, industryId }
  return post(
    `add/accountIndustry/toOverrideList?accountId=${getHashValue(
      accountId
    )}&industryId=${industryId}`
  );
}

export function addAccountIndustryToOverrideListAndUpdateIndustry(
  accountId,
  industryId
) {
  // const payload = { accountId, industryId }
  return post(
    `add/accountIndustry/toOverrideListAndUpdateIndustry?accountId=${getHashValue(
      accountId
    )}&industryId=${industryId}`
  );
}

export function updateIndustryForAccount(accountId, industryId) {
  // const payload = { accountId, industryId }
  return post(
    `updateIndustryForAccount?accountId=${accountId}&industryId=${industryId}`
  );
}

export function getIndustryMappingCounts() {
  return get('get/count/forDifferent/account');
}
