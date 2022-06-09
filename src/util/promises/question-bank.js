import { get, post } from "../service";

export function getDiscoveryQuesGroupList(playbokkId) {
  return get(`getDiscoveryQuesGroupList/${playbokkId}`);
}

export function getAllDiscoveryQuesDetails(playbokkId) {
  return get(`getAllDiscoveryQuesDetails/${playbokkId}`);
}

export function getDiscoveryQuesDetailsForGroup(groupId) {
  return get(`getDiscoveryQuesDetailsForGroup/${groupId}`);
}

export function questionBankDetail(payload) {
  return post(`upsert/discoveryQuesDetails`, payload);
}
