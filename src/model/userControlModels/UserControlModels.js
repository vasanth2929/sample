/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class UserControlModels extends BaseModel {
    static resource = 'users';
    constructor(properties) {
        super(properties);
    }
}

export class UserTypeModels extends BaseModel {
    static resource = 'user_types';
    constructor(properties) {
        super(properties);
    }
}

export class FunctionalTeamModels extends BaseModel {
    static resource = 'functional_teams';
    constructor(properties) {
        super(properties);
    }
}

export class UserRoleModels extends BaseModel {
    static resource = 'user_roles';
    constructor(properties) {
        super(properties);
    }
}

export class LicenseTypeModels extends BaseModel {
    static resource = 'license_types';
    constructor(properties) {
        super(properties);
    }
}

export class AccountOwnersModel extends BaseModel {
    static resource = 'account_owners';
    constructor(properties) {
        super(properties);
    }
}

export class AccountsListModel extends BaseModel {
    static resource = 'accounts_list';
    constructor(properties) {
        super(properties);
    }
}
