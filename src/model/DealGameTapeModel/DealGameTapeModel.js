import { BaseModel } from '../BaseModel';

export class CustomerNeedsModel extends BaseModel {
  static resource = 'customer-needs';
  constructor(properties) {
    super(properties);
  }
}

export class DecisionCriteriaModel extends BaseModel {
  static resource = 'decision-criteria';
  constructor(properties) {
    super(properties);
  }
}
