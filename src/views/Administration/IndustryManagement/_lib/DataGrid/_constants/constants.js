

import React from 'react';
import { BoldHeaderRenderer } from '../_renderers/BoldHeaderRenderer';
import { TextFormatter } from '../_formatters/TextFormatter';
import { SingleSelectFormatter } from '../_formatters/SingleSelectFormatter';

export const ACCOUNT_TRIBYL_INDUSTRY_MAPPINGS_GRID_COLUMNS = [
    {
        key: 'salesforceId',
        name: 'Salesforce ID',
        sortable: true,
        resizable: false,
        headerRenderer: <BoldHeaderRenderer value="Salesforce ID" />,
        formatter: TextFormatter,
        width: 180
    },
    {
        key: 'accountName',
        name: 'Account Name',
        sortable: true,
        resizable: false,
        headerRenderer: <BoldHeaderRenderer value="Account Name" />,
        formatter: TextFormatter,
        // width: 320
    },
    {
        key: 'region',
        name: 'Region',
        sortable: true,
        resizable: false,
        headerRenderer: <BoldHeaderRenderer value="Region" />,
        formatter: TextFormatter,
        width: 140
    },
    {
        key: 'segment',
        name: 'Segment',
        sortable: true,
        resizable: false,
        headerRenderer: <BoldHeaderRenderer value="Segment" />,
        formatter: TextFormatter,
        width: 140
    },
    {
        key: 'crmIndustry',
        name: 'CRM Industry',
        sortable: true,
        resizable: false,
        headerRenderer: <BoldHeaderRenderer value="CRM Industry" />,
        formatter: TextFormatter,
        width: 200
    },
    {
        key: 'tribylIndustry',
        name: 'Tribyl Industry',
        sortable: true,
        resizable: false,
        headerRenderer: <BoldHeaderRenderer value="Tribyl Industry" />,
        formatter: SingleSelectFormatter,
        // editor: SingleSelectFormatter,
        width: 200
    },
    {
        key: 'status',
        name: 'Status',
        sortable: true,
        resizable: false,
        headerRenderer: <BoldHeaderRenderer value="Status" />,
        formatter: TextFormatter,
        width: 150
    },
    {
        key: 'lastUpdated',
        name: 'lastUpdated',
        sortable: true,
        resizable: false,
        headerRenderer: <BoldHeaderRenderer value="lastUpdated" />,
        formatter: TextFormatter,
        width: 200
    }
];

