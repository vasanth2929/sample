/* eslint-disable no-restricted-syntax */
import { get, post, upload } from '../service';
import { getHashValue } from './../utils';

export function getAllUsers() {
  return get('user/getAllUsers');
}

export function getAllUsersSummary() {
  console.log('user/getAllUsers/summary');
  return get('user/getAllUsers/summary');
}

export function getUserDetails(userId) {
  return get(`user/get/details/${userId}`);
}

export function getAllUserTypes() {
  return get('enumType/get/User.Type');
}

export function getAllFunctionalTeams() {
  return get('enumType/get/Functional_Team');
}

export function getAllRoles() {
  return get('role/getAllRoles');
}

export function getAllLicenseTypes() {
  return get('licenseTypes/getAll');
}

export function updateUser(payload) {
  return post('user/update', payload);
}

export function signup(payload) {
  return post('users/signup', payload);
}

export function getOppTeamUsers() {
  return get('user/oppTeamUsers');
}

export function listOppTeamUsersForAccount(storyId) {
  return get(`user/oppTeamUsers/forStory/${storyId}`);
}

export function handlePhotoUploadAndSave(Id, file, filename) {
  const formData = new FormData();
  formData.append('file', file, filename);
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  return upload(
    `files/user/photo/uploadAndSave?flashAttributes=%7B%7D&userId=${Id}`,
    formData,
    config
  );
}

export function handleAccountPhotoUploadAndSave(Id, file, filename) {
  const formData = new FormData();
  formData.append('file', file, filename);
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  return upload(
    `files/account/icon/uploadAndSave?flashAttributes=%7B%7D&accountId=${getHashValue(
      Id
    )}`,
    formData,
    config
  );
}

export function handleUserPhotoCreateAndSave(file, filename) {
  const formData = new FormData();
  formData.append('file', file, filename);
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  return upload('files/user/photo/upload', formData, config);
}

export function logout() {
  return post('user/logout');
}
