import { BaseModel } from '../BaseModel';

//list of markets 
export class FilterMarketModel extends BaseModel {
    static resource = 'filter-market';
    constructor(properties) {
        super(properties);
    }
}
//list of region 
export class FilterRegionModel extends BaseModel {
    static resource = 'filter-region';
    constructor(properties) {
        super(properties);
    }
}
//list of industry 

export class FilterIndustryModel extends BaseModel {
    static resource = 'filter-industry';
    constructor(properties) {
        super(properties);
    }
}
//list of segment 

export class FilterSegmentModel extends BaseModel {
    static resource = 'filter-segment';
    constructor(properties) {
        super(properties);
    }
}

export class FilterOpptyTypeModel extends BaseModel {
    static resource = 'filter-oppty-type-';
    constructor(properties) {
        super(properties);
    }
}

export class FilterClosePeriodModel extends BaseModel {
    static resource = 'filter-close-period-';
    constructor(properties) {
        super(properties);
    }
}

export class FilterStageModel extends BaseModel {
    static resource = 'filter-stage-';
    constructor(properties) {
        super(properties);
    }
}