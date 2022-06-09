/* eslint-disable no-restricted-syntax */
import { get } from '../service';

export function getStories(query) {
  return get(`getStories/criteria?${query}`);
}

export function listAllRegion(alias) {
  return get(`list/region/${alias}`);
}

export function listAllMarket(alias) {
  return get(`list/market/${alias}`);
}

export function listAllIndustry(alias) {
  return get(`list/industry/${alias}`);
}

export function listAllProduct() {
  return get('list/products/');
}

export function listAllIndustryForFilter(
  buyer,
  fiscalQr,
  fiscalYear,
  myFilterEnabled,
  storyStatus,
  userId
) {
  return get(
    `listAll/industry/forFilter?buyer=${buyer}&fiscalQr=${fiscalQr}&fiscalYear=${fiscalYear}&myFilterEnabled=${myFilterEnabled}&storyStatus=${storyStatus}&userId=${userId}`
  );
}

export function listAllMarketForFilter(
  buyer,
  fiscalQr,
  fiscalYear,
  myFilterEnabled,
  storyStatus,
  userId
) {
  return get(
    `listAll/markets/forFilter?buyer=${buyer}&fiscalQr=${fiscalQr}&fiscalYear=${fiscalYear}&myFilterEnabled=${myFilterEnabled}&storyStatus=${storyStatus}&userId=${userId}`
  );
}

export function listAllRegionForFilter(
  buyer,
  fiscalQr,
  fiscalYear,
  myFilterEnabled,
  storyStatus,
  userId
) {
  return get(
    `listAll/regions/forFilter?buyer=${buyer}&fiscalQr=${fiscalQr}&fiscalYear=${fiscalYear}&myFilterEnabled=${myFilterEnabled}&storyStatus=${storyStatus}&userId=${userId}`
  );
}
export function getAllMarkets() {
  return get(`listAllMarket`);
}
