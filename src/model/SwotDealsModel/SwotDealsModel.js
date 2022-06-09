/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class SwotDealsModel extends BaseModel {
  static resource = 'swot-deals';
  constructor(properties) {
    super(properties);
  }
}
