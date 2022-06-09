import { USER_ROLE_NAMES } from "../../../_constants/role.constants";

export const PLAYBOOK_FILTER_NAMES = {
    ALL: 'All',
    DRAFT: 'Draft',
    PENDING: 'Pending',
    LIVE: 'Live',
    ARCHIVED: 'Archived'
};

export const PLAYBOOK_FILTER_DB_NAMES = {
    [PLAYBOOK_FILTER_NAMES.LIVE]: 'final',
    [PLAYBOOK_FILTER_NAMES.DRAFT]: 'draft',
    [PLAYBOOK_FILTER_NAMES.PENDING]: 'pending',
    [PLAYBOOK_FILTER_NAMES.ARCHIVED]: 'archived',
    [PLAYBOOK_FILTER_NAMES.ALL]: 'all'
};

export const PLAYBOOK_FILTER_OPTIONS_MAP = {
    LIVE: { 
        id: PLAYBOOK_FILTER_NAMES.LIVE, 
        name: PLAYBOOK_FILTER_NAMES.LIVE, 
        dbName: PLAYBOOK_FILTER_DB_NAMES[PLAYBOOK_FILTER_NAMES.LIVE],
        allowedRoles: []
    },
    DRAFT: { 
        id: PLAYBOOK_FILTER_NAMES.DRAFT, 
        name: PLAYBOOK_FILTER_NAMES.DRAFT, 
        dbName: PLAYBOOK_FILTER_DB_NAMES[PLAYBOOK_FILTER_NAMES.DRAFT],
        allowedRoles: [USER_ROLE_NAMES.ADMIN]
    },
    PENDING: { 
        id: PLAYBOOK_FILTER_NAMES.PENDING, 
        name: PLAYBOOK_FILTER_NAMES.PENDING, 
        dbName: PLAYBOOK_FILTER_DB_NAMES[PLAYBOOK_FILTER_NAMES.PENDING],
        allowedRoles: [USER_ROLE_NAMES.ADMIN]
    },
    ARCHIVED: { 
        id: PLAYBOOK_FILTER_NAMES.ARCHIVED, 
        name: PLAYBOOK_FILTER_NAMES.ARCHIVED, 
        dbName: PLAYBOOK_FILTER_DB_NAMES[PLAYBOOK_FILTER_NAMES.ARCHIVED],
        allowedRoles: [USER_ROLE_NAMES.ADMIN]
    },
    ALL: { 
        id: PLAYBOOK_FILTER_NAMES.ALL, 
        name: PLAYBOOK_FILTER_NAMES.ALL, 
        dbName: PLAYBOOK_FILTER_DB_NAMES[PLAYBOOK_FILTER_NAMES.ALL],
        allowedRoles: [USER_ROLE_NAMES.ADMIN]
    }
};

export const PLAYBOOK_FILTER_OPTIONS = [
    PLAYBOOK_FILTER_OPTIONS_MAP.LIVE,
    PLAYBOOK_FILTER_OPTIONS_MAP.DRAFT,
    PLAYBOOK_FILTER_OPTIONS_MAP.PENDING,
    PLAYBOOK_FILTER_OPTIONS_MAP.ARCHIVED,
    PLAYBOOK_FILTER_OPTIONS_MAP.ALL
];

export const mapStatusToFilter = (status) => {
    switch (status) {
        case PLAYBOOK_FILTER_DB_NAMES.All: return PLAYBOOK_FILTER_NAMES.ALL;
        case PLAYBOOK_FILTER_DB_NAMES.Draft: return PLAYBOOK_FILTER_NAMES.DRAFT;
        case PLAYBOOK_FILTER_DB_NAMES.Pending: return PLAYBOOK_FILTER_NAMES.PENDING;
        case PLAYBOOK_FILTER_DB_NAMES.Live: return PLAYBOOK_FILTER_NAMES.LIVE;
        case PLAYBOOK_FILTER_DB_NAMES.Archived: return PLAYBOOK_FILTER_NAMES.ARCHIVED;
        default: return null;
    }
};

export const mapFilterToStatus = (filter) => {
    switch (filter) {
        case PLAYBOOK_FILTER_NAMES.ALL: return PLAYBOOK_FILTER_DB_NAMES.All;
        case PLAYBOOK_FILTER_NAMES.DRAFT: return PLAYBOOK_FILTER_DB_NAMES.Draft;
        case PLAYBOOK_FILTER_NAMES.PENDING: return PLAYBOOK_FILTER_DB_NAMES.Pending;
        case PLAYBOOK_FILTER_NAMES.LIVE: return PLAYBOOK_FILTER_DB_NAMES.Live;
        case PLAYBOOK_FILTER_NAMES.ARCHIVED: return PLAYBOOK_FILTER_DB_NAMES.Archived;
        default: return null;
    }
};
