/* eslint-disable no-useless-constructor */
import { BaseModel } from "../BaseModel";

export class DashboardModel extends BaseModel {
    static resource = "dashboard";
    constructor(properties) {
      super(properties);
    }

    static getAllByBarTypes(type) {
      const instances = this.list();
      return instances.filter((instance) => {
        if (type === instance.props.barType) { return instance; }
        return null;
      });
    }
}

export class PlaybookCardViewCountsModel extends BaseModel {
    static resource = 'playbook_card_view_counts';
    constructor(properties) {
        super(properties);
    }
}

export class StoryViewCountsModel extends BaseModel {
    static resource = 'story_view_counts';
    constructor(properties) {
        super(properties);
    }
}

export class ViewCountsModel extends BaseModel {
    static resource = 'view_counts';
    constructor(properties) {
        super(properties);
    }
}

export class StorySearchStringModel extends BaseModel {
    static resource = 'story_search_string';
    constructor(properties) {
        super(properties);
    }
}
