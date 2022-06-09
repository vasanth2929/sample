/* eslint-disable no-restricted-syntax */
import { get } from '../service';
import { MainMenu } from '../../model/MainMenu';

export function getUserSession() {
    return get('userSession');
}

export function getMainMenu() {
    return get('mainMenu')
        .then(response =>
            response.data.map(item =>
                new MainMenu({ ...item, id: item.title }).$save()));
}
