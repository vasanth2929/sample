/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class StoryboardPlaybookModel extends BaseModel {
    static resource = 'storyboard_playbook';
    constructor(properties) {
        super(properties);
    }
}
