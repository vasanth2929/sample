/* eslint-disable no-restricted-syntax */
import { get, post } from '../service';

export function listValidStoriesForTimeForStatus(buyer, fiscalQr, fiscalYear, myFilterEnabled, storyStatus, userId, industries, products, markets, regions) {
    const industriesPath = industries.length > 0 ? industries.map(item => `&industryIds=${item}`).join().replace(/,/g, '') : '';
    const productsPath = products.length > 0 ? products.map(item => `&prodIds=${item}`).join().replace(/,/g, '') : '';
    const marketsPath = markets.length > 0 ? markets.map(item => `&marketIds=${item}`).join().replace(/,/g, '') : '';
    const regionsPath = regions.length > 0 ? regions.map(item => `&regionIds=${item}`).join().replace(/,/g, '') : '';
    const path = `listValidStories/forTime/forStatus?buyer=${buyer}&fiscalQr=${fiscalQr}&fiscalYear=${fiscalYear}&myFilterEnabled=${myFilterEnabled}&storyStatus=${storyStatus}&userId=${userId}`;
    return get(`${path + industriesPath + productsPath + marketsPath + regionsPath}`);
}

export function createStoryFromCrm(payload) {
    return post('create/story/new', payload);
}

export function getStoriesForCard(cardId) {
    return get(`getStory/ForCard/${cardId}`);
}

export function storiesLastUpdatedDate() {
  return get(`storiesLastUpdatedDate`);
}