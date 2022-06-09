/* eslint-disable no-restricted-syntax */
import { get, getLoginToken, getSSOFlag } from '../service';
import { MainMenu } from '../../model/MainMenu';

export function getUserSession() {
  return get('userSession');
}

export function getMainMenu() {
  return get('mainMenu').then((response) =>
    response.data.map((item) =>
      new MainMenu({ ...item, id: item.title }).$save()
    )
  );
}

export function getJWTToken(payload) {
  return getLoginToken('login', payload);
}

export function getUserDetails() {
  return get('user?source=web');
}

export function getIsSsoUser(userName) {
  return get(`getIsSsoUser?userName=${userName}`);
}

export function getIsSsoEnable() {
  return getSSOFlag(`getIsSsoEnable`);
}
