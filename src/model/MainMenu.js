/* eslint-disable no-useless-constructor */
import { BaseModel } from './BaseModel';

export class MainMenu extends BaseModel {
    static resource = 'main_menu_personas';
    constructor(properties) {
        super(properties);
    }
}
