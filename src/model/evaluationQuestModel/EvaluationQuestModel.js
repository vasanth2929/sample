/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class RatingQuestionsModel extends BaseModel {
    static resource = 'rating_questions';
    constructor(properties) {
        super(properties);
    }
}

