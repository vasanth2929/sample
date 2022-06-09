import React from 'react';

export const MetricsOptions = [
  {
    label: 'Amount ($)',
    value: 'Historical Deal Size',
    floatingLabel: 'METRICS',
  },
  {
    label: 'Sales Cycle  (days)',
    value: 'Historical Sales Cycle',
    floatingLabel: 'METRICS',
  },
  {
    label: 'Win Rate (%)',
    value: 'Historical Win Rate',
    floatingLabel: 'METRICS',
  },
  {
    label: 'TTM Win Rate (%)',
    value: 'TTM Win Rate',
    floatingLabel: 'METRICS',
  },
];

export const stageOptions = [
  { value: 'Closed-won', label: 'Closed-won', floatingLabel: 'STAGE' },
  { value: 'Closed-lost', label: 'Closed-lost', floatingLabel: 'STAGE' },
  { value: 'No-Decision', label: 'No-Decision', floatingLabel: 'STAGE' },
];

export const closePeriodOptions = [
  {
    label: 'Last Month',
    value: 'LAST_MONTH',
    floatingLabel: 'CLOSED PERIOD',
  },
  {
    label: 'Last Quarter',
    value: 'LAST_QUARTER',
    floatingLabel: 'CLOSED PERIOD',
  },
  {
    label: 'Last Year',
    value: 'LAST_YEAR',
    floatingLabel: 'CLOSED PERIOD',
  },
  {
    label: '',
    options: [
      {
        label: 'This Month',
        value: 'THIS_MONTH',
        floatingLabel: 'CLOSED PERIOD',
      },
      {
        label: 'This Quarter',
        value: 'THIS_QUARTER',
        floatingLabel: 'CLOSED PERIOD',
      },
      {
        label: 'This Year',
        value: 'THIS_YEAR',
        floatingLabel: 'CLOSED PERIOD',
      },
    ],
  },
];

export const sortOptionsSWOT = [
  {
    label: 'Amount',
    value: 'sort_by_amount',
    floatingLabel: 'SORT',
    sortBy: 'desc',
  },
  {
    label: 'Newest',
    value: 'sort_by_create_date',
    floatingLabel: 'SORT',
    sortBy: 'desc',
  },
];

export const sortOptions = [
  {
    label: 'Amount',
    value: 'sort_by_amount',
    floatingLabel: 'SORT',
    sortBy: 'desc',
  },
  {
    label: '# of deals',
    value: 'sort_by_deals',
    floatingLabel: 'SORT',
    sortBy: 'desc',
  },
  {
    label: 'Sales Cycle (days)',
    value: 'sort_by_sales_cycle',
    floatingLabel: 'SORT',
    sortBy: 'asc',
  },
  {
    label: 'Newest',
    value: 'sort_by_create_date',
    floatingLabel: 'SORT',
    sortBy: 'desc',
  },
];

export const leaderBoardsortOptions = [
  {
    label: 'Amount',
    value: 'sort_by_amount',
    floatingLabel: 'SORT',
    sortBy: 'desc',
  },
  {
    label: '# of deals',
    value: 'sort_by_deals',
    floatingLabel: 'SORT',
    sortBy: 'desc',
  },
  {
    label: 'Sales Cycle (days)',
    value: 'sort_by_sales_cycle',
    floatingLabel: 'SORT',
    sortBy: 'asc',
  },
  {
    label: 'Newest',
    value: 'sort_by_create_date',
    floatingLabel: 'SORT',
    sortBy: 'desc',
  },
];

export const formatOptionLabel = ({ value, label, floatingLabel }) => (
  <span className="goal-select-item-wrapper">
    <span className="goal-select-item-name">{floatingLabel}</span>
    <span className="goal-select-item-label">{label}</span>
  </span>
);

export const formatGroupLabel = () => (
  <div style={{ borderBottom: '1px solid #d8dee0' }} />
);

export const messagingOptions = [
  {
    label: 'Use Cases',
    value: 'Use Cases',
    floatingLabel: 'Messaging',
  },
  {
    label: 'Pain Points',
    value: 'Pain Points',
    floatingLabel: 'Messaging',
  },
  {
    label: 'KPI',
    value: 'KPI',
    floatingLabel: 'Messaging',
  },
  {
    label: 'Product',
    value: 'product',
    floatingLabel: 'Messaging',
  },
  {
    label: 'Positioning',
    value: 'positioning',
    floatingLabel: 'Messaging',
  },
  {
    label: 'Pricing',
    value: 'pricing',
    floatingLabel: 'Messaging',
  },
  {
    label: 'Success',
    value: 'success',
    floatingLabel: 'Messaging',
  },
];

export const verifySort = [
  { label: 'All', value: 'All', floatingLabel: 'CONFIDENCE LEVEL' },
  {
    label: 'Most Relevant',
    value: 'Most Relevant',
    floatingLabel: 'CONFIDENCE LEVEL',
  },
  { label: 'Relevant', value: 'Relevant', floatingLabel: 'CONFIDENCE LEVEL' },
  { label: 'Verified', value: 'Verified', floatingLabel: 'CONFIDENCE LEVEL' },
];

export const GoalOptions = [
  {
    label: 'Use Cases',
    value: 'Use Cases',
    floatingLabel: 'MESSAGE TYPE',
  },
  {
    label: 'Pain Points',
    value: 'Pain Points',
    floatingLabel: 'MESSAGE TYPE',
  },
  {
    label: 'KPI',
    value: 'KPI',
    floatingLabel: 'MESSAGE TYPE',
  },
  {
    label: 'Triggers',
    value: 'compelling_event',
    floatingLabel: 'MESSAGE TYPE',
  },
  {
    label: 'Product',
    value: 'product',
    floatingLabel: 'MESSAGE TYPE',
  },
  {
    label: 'Positioning',
    value: 'positioning',
    floatingLabel: 'MESSAGE TYPE',
  },
  {
    label: 'Pricing',
    value: 'pricing',
    floatingLabel: 'MESSAGE TYPE',
  },
  {
    label: 'Success',
    value: 'success',
    floatingLabel: 'MESSAGE TYPE',
  },
];

export const MatchesOptions = [
  {
    value: 'All',
    label: 'All',
  },
  {
    value: true,
    label: 'Yes',
  },
  {
    value: false,
    label: 'No',
  },
];

export const SurveysOptions = [
  {
    value: 'All',
    label: 'All',
  },
  {
    value: true,
    label: 'Yes',
  },
  {
    value: false,
    label: 'No',
  },
];

export const dealSort = [
  { value: 'Close date', label: 'Close date' },
  { value: 'Score', label: 'Score' },
  { value: 'Amount', label: 'Amount' },
  { value: 'Votes', label: 'Votes' },
];

export const testCardsOptions = [
  {
    label: 'Approved',
    value: 'N',
    floatingLabel: 'MESSAGE STATUS',
  },
  {
    label: 'My test',
    value: 'MY_CARDS',
    floatingLabel: 'MESSAGE STATUS',
  },
  {
    label: 'All test',
    value: 'Y',
    floatingLabel: 'MESSAGE STATUS',
  },
];