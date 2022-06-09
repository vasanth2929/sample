/* eslint-disable no-restricted-syntax */
import { get, post } from '../service';

export function getStoryForCard(cardId, filterParams) {
  if (filterParams) {
    return get(`getStory/cardId/${cardId}?${filterParams}`);
  }
  return get(`getStory/cardId/${cardId}`);
}
export function getPlaybookCardDetails(cardId) {
  return get(`playbookcard/card/${cardId}`);
}

export function getSurveyQuestionsAndCardsWithVerifyAndMatchCounts(
  opptyId,
  questionId
) {
  return get(
    `getCardsWithVerifyAndMatchCountsForQuestion?opptyId=${opptyId}&questionId=${questionId}`
  );
}

export function upsertRatingForCardToCardRelForOppty(
  opptyId,
  rootCardId,
  relatedCardId,
  rating
) {
  return post(
    `upsertRatingForCardToCardRelForOppty?opptyId=${opptyId}&rating=${rating}&relatedCardId=${relatedCardId}&rootCardId=${rootCardId}`
  );
}

export function upsertNotesForCardToCardRelForOppty(
  notesText,
  opptyId,
  relatedCardId,
  rootCardId
) {
  return post(
    `upsertNotesForCardToCardRelForOppty?notesText=${notesText}&opptyId=${opptyId}&relatedCardId=${relatedCardId}&rootCardId=${rootCardId}`
  );
}
