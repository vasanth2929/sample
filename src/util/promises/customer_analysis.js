import { get, post } from '../service';

export function getTargetMarketMetrics() {
  return get('getTargetMarketMetrics');
}

export function getTargetMarketRelatedSolutionMetrics(
  targetMarketIdList,
  filterObject = {}
) {
  const query = targetMarketIdList.reduce(
    (queryString, item) =>
      (queryString += `targetMarketIdList=${item.targetMarketId}&`),
    ''
  );
  return post(`getTargetMarketRelatedSolutionMetrics?${query}`, filterObject);
}

export function getMatchedCardsSummaryForSolution(
  selectedSubTopic,
  pinnedCards = [],
  filterObj = [],
) {
  console.log("filter",filterObj)
  const query = pinnedCards.reduce(
    (queryString, item) => (queryString += `&pinnedCardList=${item.id}`),
    ''
  );

  const filter = filterObj.reduce(
    (queryString, item) =>
      (queryString +=
        item.name === 'segment' ||
        item.name === 'industry' ||
        item.name === 'region'
          ? `&${item.name}List=${item.value}`
          : `&${item.name}=${item.value}`),
    ''
  );

  return get(
    `getMatchedCardsSummaryForSolution?subTopicList=${selectedSubTopic}${query}${filter}`
  );
}

export function getMatchedCardsDetailsForSolution(
  solutionId,
  pinnedCards = [],
  opptyResult = 'won'
) {
  const query = pinnedCards.reduce(
    (queryString, item) => (queryString += `pinnedCardList=${item}&`),
    ''
  );
  return get(
    `getMatchedCardsDetailsForSolution?solutionId=${solutionId}&${query}opptyResult=${opptyResult}`
  );
}

export function getOpptyListMetricsForSolution(bodyData) {
  return post(`getOpptyListMetricsForSolution`, bodyData);
}

export function getOpptyListDetailsForSolution(payload) {
  return post(`getOpptyListDetailsForSolution`, payload);
}

export function getAccountsMatchedWithCard(cardId) {
  return get(`getAccountsMatchedWithCard?cardId=${cardId}`);
}

export function getCardNotes(cardId) {
  return get(`getCardNotes?cardId=${cardId}`);
}
export function getRecentCardNotes(cardId) {
  return get(`getRecentCardNotes`);
}

export function getStoryForCard(cardId, filterObj = []) {
  const filter = filterObj.reduce(
    (queryString, item) =>
      (queryString +=
        item.name === 'market' || item.name === 'industry'
          ? `&${item.name}List=${item.value}`
          : `&${item.name}=${item.value}`),
    ''
  );
  return get(`getStory/ForCard/${cardId}?${filter}`);
}

export function getStoryNotesForCard(cardId, filterObj = [], pinnedCards = []) {
  const filter = filterObj.reduce(
    (queryString, item) =>
      (queryString +=
        item.name === 'segment' ||
        item.name === 'industry' ||
        item.name === 'region'
          ? `&${item.name}List=${item.value}`
          : `&${item.name}=${item.value}`),
    ''
  );
  const query = pinnedCards.reduce(
    (queryString, item) => (queryString += `&pinnedCardList=${item.id}`),
    ''
  );
  return get(`getStoryNotesForCard?cardId=${cardId}${filter}${query}`);
}

export function sendSurveyLinksForMultipleOpptys(payload) {
  return post(`sendSurveyLinksForMultipleOpptys`, payload);
}

export function getOpptyListDetailsForSolutionForSurveyStatus(payload) {
  return post(`getOpptyListDetailsForSolutionForSurveyStatus`, payload);
}

export function getCardsAndStorySummaryForTopic(payload) {
  return post(`getCardsAndStorySummaryForTopic`, payload);
}

export function getOpptyListMetricsForExecutiveDashBoard(payload) {
  return post(`getOpptyListMetricsForExecutiveDashBoard`, payload);
}

export function getStageDropdownLabels(isLive = false) {
  return get(
    isLive ? `getStageDropdownLabelsForOpenOppty` : `getStageDropdownLabels`
  );
}

export function getConversationCountForStories(storyIds) {
  return post(`getConversationCountForStories`, { storyIds });
}

export function getAnalyticsForStories(storyIds) {
  return post(`getAnalyticsForStories`, { storyIds });
}

export function getProductAnalyticsData() {
  return get(`productAnalytics/dataLoad`);
}

export function getOpptyTypeDropdownValues(isLive = false) {
  return get(
    isLive
      ? `getOpptyTypeDropdownValuesForOpenOppty`
      : `getOpptyTypeDropdownValues`
  );
}

export function getClosePeriodDropdownValues(isLive = false) {
  return get(
    isLive
      ? `getClosePeriodDropdownValuesForOpenOppty`
      : `getClosePeriodDropdownValues`
  );
}
