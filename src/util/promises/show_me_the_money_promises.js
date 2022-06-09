import { get, post } from '../service';

export function getGrowNewLogsSummary(query) {
  return get(`insight/getGrowNewLogsSummary?${query}`);
}

export function getOpptyListDetailsForSolution(query) {
  return get(`insight/getOpptyListDetailsForSolution?${query}`);
}

export function getClosePeriodDropdownValues() {
  return get(`insight/getClosePeriodDropdownValues`);
}