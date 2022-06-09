/* eslint-disable no-restricted-syntax */
/* eslint no-console:off */
import { get } from "../service";

export function getAllStats() {
  return get(`stats/getAllBusStats`);
}
export function getStoryBookStats() {
  return get(`stats/getBusStatForAllUsersStoryViewByRole`);
}
export function getPlaybookGraphStats() {
  return get(`stats/getBusStatForAllUsersPlaybookViewByRole`);
}
export function getGraphTimeStats() {
  return get(`stats/getBusStatForAllUsersWithDateRange`);
}
export function searchStrings() {
  return get(`stats/getBusStatForSearchStrings`);
}
export function dateRange() {
  return get(`stats/getBusStatForAllUsersWithDateRangeAndRole`);
}
export function getViewStats() {
  return get(`stats/getBusStatForAllUsersWithDateRangeAndRole`);
}
export function getStorySearchStrings() {
  return get(`stats/getBusStatForSearchStrings`);
}
