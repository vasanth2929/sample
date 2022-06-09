/* eslint-disable object-curly-newline */
import HashIds from 'hashids';
import pickby from 'lodash.pickby';
import moment from 'moment';
import { category } from '../constants/general';
import store from './store';

// this import is used to get timezone removing this will produce error wherever the timezone is used
import tz from 'moment-timezone';

export function isEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

export function dispatch(action) {
  if (action.type) {
    return store.dispatch(action);
  }

  return store.dispatch(action);
}

export function getQuery(querySet) {
  const query = [];
  Object.keys(querySet).forEach((key) => {
    const selectedChoices = pickby(querySet[key]);
    if (Object.keys(selectedChoices).length > 0) {
      query.push(`${key}=${Object.keys(selectedChoices).join(',')}`);
    }
  });
  return query.join('&');
}

export const generateRandomKey = () => Math.floor(Math.random() * 1000000);

export const getAccountStatus = (status) => {
  switch (status) {
    case 'Pre-opportunity':
      return `In-pursuit`;
    case 'Converted':
      return `Converted`;
    case 'Rejected':
      return `Rejected`;
    case 'Disqualified':
      return `Disqualified`;
    case 'Ignore':
      return `Ignore`;
    // case 'Restart': return `Restart`;
    default:
      return `In-pursuit`;
  }
};
export const getAccountType = (type) => {
  switch (type) {
    case 'New Business':
      return `New Business`;
    case 'Expansion':
      return `Expansion`;
    default:
      return `New Business`;
  }
};

export function getCategoryColor(cat) {
  let klass = '';
  switch (cat.toString().toLowerCase()) {
    case category.WHY_US:
      klass = 'purple';
      break;
    case category.WHY_CHANGE:
      klass = 'green';
      break;
    case category.WHO_DECIDES:
      klass = 'blue';
      break;
    default:
      break;
  }
  return klass;
}

export function getInitials(name) {
  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials;
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getFiscalYears() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i > currentYear - 4; i -= 1) {
    years.push(i);
  }
  const fiscalYears = years.map((item) => ({
    label: 'FY' + `${item}`.substring(2, item.length),
    value: `${item}`,
  }));
  return fiscalYears;
}

export function getFiscalYearsStoriesList() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i > currentYear - 4; i -= 1) {
    years.push(i);
  }
  const fiscalYears = years.map((item) => ({
    label: 'FY' + `${item}`.substring(2, item.length),
    value: `${item}`,
  }));
  fiscalYears.unshift({ label: 'All', value: 'All' });
  return fiscalYears;
}
export function getFiscalQuarters() {
  return [
    { label: 'Q1', value: 'Q1' },
    { label: 'Q2', value: 'Q2' },
    { label: 'Q3', value: 'Q3' },
    { label: 'Q4', value: 'Q4' },
  ];
}

export function containsPermission(permission) {
  const AUTH = process.env.AUTH;
  if (AUTH !== null && typeof AUTH !== 'undefined' && AUTH !== 'undefined') {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const found = user.authorities.indexOf(permission) >= 0;
      return found;
    }
    window.open('#', '_self');
    return false;
  }
  return true;
}

export const getDevUserId = () => {
  const userId = process.env.USER_ID;
  return userId;
};

export function getLoggedInUser() {
  let userData = localStorage.getItem('user');
  if (userData) {
    return JSON.parse(userData);
  } else {
    return false;
  }
}

export function getPromiseOrData(obj, promise) {
  return obj && Object.keys(obj).length > 0
    ? new Promise((r) => r({ data: obj }))
    : promise;
}

export function getShortName(str) {
  const arr = str.toLowerCase().split(' ');
  arr[arr.length - 1] = arr[arr.length - 1][0] + '.';
  return arr
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function removeByAttr(arr, attr, value) {
  let i = arr.length;
  while (i--) {
    //eslint-disable-line
    if (
      arr[i] &&
      arr[i].hasOwnProperty(attr) && //eslint-disable-line
      arguments.length > 2 &&
      arr[i][attr] === value
    ) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

export function getProducTypes() {
  return [
    { value: 'internal', label: 'Internal' },
    { value: 'isv', label: 'ISV' },
    { value: 'si', label: 'SI' },
    { value: 'var', label: 'VAR' },
    { value: 'oem', label: 'OEM' },
  ];
}

export function getSalesStages() {
  return [
    { value: 'prospecting', label: 'Prospecting' },
    { value: 'evaluation', label: 'Evaluation' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'discovery', label: 'Discovery' },
    { value: 'solution', label: 'Solution' },
  ];
}

export function getCoreCompetencies(getAll) {
  if (getAll) {
    return [
      { label: 'All', slug: 'all', displayPos: 0, value: 'all' },
      { label: 'Overall', slug: 'overall', displayPos: 1, value: 'overall' },
      {
        label: 'Opening the call',
        slug: 'opening-the-call',
        displayPos: 2,
        value: 'opening-the-call',
      },
      {
        label: 'Why anything? Why now?',
        slug: 'why-anything-why-now',
        displayPos: 3,
        value: 'why-anything-why-now',
      },
      {
        label: 'Why us?',
        slug: 'why-us',
        displayPos: 4,
        value: 'why-us',
      },
      {
        label: 'Objection Handling',
        slug: 'objection-handling',
        displayPos: 5,
        value: 'objection-handling',
      },
      {
        label: 'Proofpoint delivery',
        slug: 'proofpoint-delivery',
        displayPos: 6,
        value: 'proofpoint-delivery',
      },
    ];
  }
  return [
    { label: 'Overall', slug: 'overall', displayPos: 0, value: 'overall' },
    {
      label: 'Opening the call',
      slug: 'opening-the-call',
      displayPos: 1,
      value: 'opening-the-call',
    },
    {
      label: 'Why anything? Why now?',
      slug: 'why-anything-why-now',
      displayPos: 2,
      value: 'why-anything-why-now',
    },
    {
      label: 'Why us?',
      slug: 'why-us',
      displayPos: 3,
      value: 'why-us',
    },
    {
      label: 'Objection Handling',
      slug: 'objection-handling',
      displayPos: 4,
      value: 'objection-handling',
    },
    {
      label: 'Proofpoint delivery',
      slug: 'proofpoint-delivery',
      displayPos: 5,
      value: 'proofpoint-delivery',
    },
  ];
}

export function opportunityPlannerHeadings() {
  return [
    {
      label: 'PROSPECTING',
      value: '$100,000',
    },
    {
      label: 'DISCOVERY',
      value: '$200,000',
    },
    {
      label: 'SOLUTION',
      value: '$300,000',
    },
    {
      label: 'EVALUATION',
      value: '$100,000',
    },
    {
      label: 'NEGOTIATION',
      value: '$100,000',
    },
  ];
}

export function addCommas(str) {
  const string = (str || '').toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  return string;
}

export const reasonsForDisqualificationOptions = [
  {
    id: 'Wrong Timing',
    reason: 'Wrong Timing',
  },
  {
    id: "Don't have Need/Urgency",
    reason: "Don't have Need/Urgency",
  },
  {
    id: 'Lack Strong Champion',
    reason: 'Lack Strong Champion',
  },
  {
    id: "Can't access Decision Maker",
    reason: "Can't access Decision Maker",
  },
  {
    id: 'Not a good technical fit',
    reason: 'Not a good technical fit',
  },
  {
    id: 'Existing Opportunity',
    reason: 'Existing Opportunity',
  },
  {
    id: 'Too small for us',
    reason: 'Too small for us',
  },
  {
    id: 'Other',
    reason: 'Other',
  },
];

export const reasonsForRejectionOptions = [
  {
    id: 'Incomplete Qualification',
    reason: 'Incomplete Qualification',
  },
  {
    id: 'Wrong Timing',
    reason: 'Wrong Timing',
  },
  {
    id: "Don't have Need/Urgency",
    reason: "Don't have Need/Urgency",
  },
  {
    id: 'Lack Strong Champion',
    reason: 'Lack Strong Champion',
  },
  {
    id: "Can't access Decision Maker",
    reason: "Can't access Decision Maker",
  },
  {
    id: 'Not a good technical fit',
    reason: 'Not a good technical fit',
  },
  {
    id: 'Existing Opportunity',
    reason: 'Existing Opportunity',
  },
  {
    id: 'Too small for us',
    reason: 'Too small for us',
  },
  {
    id: 'Other',
    reason: 'Other',
  },
];

export function typeOptions() {
  return [
    {
      id: 'New Business',
      name: 'New Business',
    },
    {
      id: 'Expansion',
      name: 'Expansion',
    },
  ];
}

export function sentimentOptions() {
  return [
    {
      id: 'Positive',
      name: 'Positive',
      label: 'Positive',
    },
    {
      id: 'Negative',
      name: 'Negative',
      label: 'Negative',
    },
    {
      id: 'Neutral',
      name: 'Neutral',
      label: 'Neutral',
    },
    {
      id: 'Unknown',
      name: 'Unknown',
      label: 'Unknown',
    },
  ];
}

export function getHashValue(data) {
  const salt = '!tribyl!123';
  const hash = new HashIds(salt);
  return hash.encode(data);
}
export function getImpactChartArray() {
  return {
    Researched: [
      { key: 'totalForAccount', label: 'Accounts' },
      { key: 'totalForSalesPlay', label: 'Personas' },
      { key: 'totalForPersona', label: 'Solutions' },
    ],
    Qualified: [
      { key: 'totalQualifiedMeetingCreated', label: 'Meetings' },
      { key: 'totalQualifiedOpptyCreated', label: 'Opptys' },
    ],
    Accepted: [
      { key: 'totalAcceptedMeetingCreated', label: 'Meetings' },
      { key: 'totalAcceptedOpptyCreated', label: 'Opptys' },
    ],
    Rejected: [
      { key: 'totalRejectedMeetingCreated', label: 'Meetings' },
      { key: 'totalRejectedOpptyCreated', label: 'Opptys' },
    ],
  };
}

export const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat({
    notation: 'compact',
    compactDisplay: 'short',
    style: 'currency',
    currency: 'USD',
  });
  return `$${formatter.format(Math.floor(Number(amount) * 10) / 10)}`;
};

// convert 1000 -> 1K 10000 -> 10K etc
export const ShortNumber = (number, digits) => {
  const precision = 10 ** digits;
  if(!number){
    return 0;
  }
  if (typeof number === 'number') {
    const num = Math.round(number);
    if (num > 999 && num < 1000000) {
      const newNum = number / 1000;
      return digits
        ? Math.round(newNum * precision) / precision + 'K'
        : Math.round(newNum) + 'K';
    } else if (num >= 1000000) {
      const newNum = number / 1000000;
      return digits
        ? Math.round(newNum * precision) / precision + 'M'
        : Math.round(newNum) + 'M';
    } else if (num < 900) {
      return num;
    }
  }
};

export const avatarText = (input, seperator = ' ') => {
  if (input) {
    // remove all the special characters
    const cleanString = input.replace(/[^a-zA-Z ]/g, '');
    const array = cleanString.split(seperator).splice(0, 2);
    return array.reduce((output, word) => (output += word.charAt(0)), '');
  }
  return '';
};

export const getLocalStorageData = (name) => {
  const data = localStorage.getItem(name);
  if (data) {
    return JSON.parse(data);
  }
  return null;
};

export function saveToLocalStorage(name, data) {
  try {
    const serializedStore = JSON.stringify(data);
    window.localStorage.setItem(name, serializedStore);
  } catch (e) {
    console.log(e);
  }
}

export const getSessionStorageData = () => {
  try {
    const serializedStore = sessionStorage.getItem('state');
    if (serializedStore === null) {
      return undefined;
    }
    return JSON.parse(serializedStore);
  } catch (error) {
    return undefined;
  }
};

export function saveToSessionStorage(state) {
  try {
    const serializedStore = JSON.stringify(state);
    sessionStorage.setItem('state', serializedStore);
  } catch (e) {
    // Ignore write errors
  }
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz ';

export const getColorCodeFromName = (name) => {
  const cleanString = name.replace(/[^a-zA-Z ]/g, '');
  return (alphabet.indexOf(cleanString.toLowerCase().slice(1, 2)) % 4) + 1;
};

// format date -> default Feb 18, 2021
export const formatDate = (date, format = 'll') => {
  return date ? moment.tz(date, moment.tz.guess()).format(format) : '';
};

export const SanitizeUrl = (url) => {
  const UrlSanitizerRegex = new RegExp('(%[0-9][A-F0-9].*)', 'gi');
  const sanitized = url.replace(UrlSanitizerRegex, '');

  return sanitized;
};

export const keywordTooltip = {
  'keyword scores': 'Aggregate keyword score for this Deal, across all features listed to the right.',
  elasticScore:
    'Normalized Elastic score of the keyword, across all conversations of this Deal, relative to other keywords from the same Topic.',
  frequencyScore:
    "How many times did the keyword get mentioned in this Deal's conversations, normalized across other keywords from the same Topic.",
  persistenceScore:
    'How frequently has the keyword come up in this Deal? Modified TF-IDF score across all conversations in the Deal, normalized across other keywords from the same Topic.',
  qualityScore:
    'Likelihood that when a keyword matches in deals, its Card also gets verified by Reps.',
  originalityScore:
    "How commonplace is the keyword in general? The more common, the lesser its Originality score. Modified IDF score across all conversations and deals.",
  sourceScore: 'If human authored, 1, if machine generated, 0.5',
  accuracyScore:
    `If the keyword is also present in the Card's title, then 1 otherwise 0.5.`,
  relevanceScore:
    'Likelihood that the keyword is unambiguous and uniquely represents the Message -- longer the keyword length, higher the relevance. Caveat - all words in the keyword must match.',
};

export const isValidDomain = (domainName) => {
  const correctDomainRegex = new RegExp(
    /^[a-z0-9][a-z0-9-]+(\.[a-z0-9]+)+$/,
    'gi'
  ); //google.com
  let isValidDomain = true;
  // check domain name validity
  if (domainName.search(correctDomainRegex) === -1) {
    return (isValidDomain = false);
  }
  return isValidDomain;
};

export const topicToolTips = [
  {
    topic: 'KPI',
    tip: 'The metrics that your customers care about, in their own language.  Note that KPIs are granular metrics that, in turn, produce higher-level outcomes of lower cost, higher revenue, saved time, higher quality, lower risk, more satisfaction, better reputation, or more compliance.  KPIs represent what goes into the business case and what drives allocation of budget to your proposal versus other projects.  KPIs are often quantifiable, but they can also be intangible.  They can be important for one persona, whole teams, or the company overall.',
  },
  {
    topic: 'Use Cases',
    tip: "The ‘jobs to be done’ with your product.  What will your customers do every day with your product, in order to achieve their KPIs above?  Use cases aren't product features; rather, they’re your customers’ views of where or how they will use your product, in specific business processes or system functions.  Use cases are discrete as compared to broader initiatives (e.g., Digital Transformation is an initiative, not a use case).",
  },
  {
    topic: 'Pain Points',
    tip: 'What is preventing customers from accomplishing the above Use Cases successfully?  Where are they struggling?  What are the frustrations, obstacles, inefficiencies getting in the way?  Pain Points must be tangible and readily observable, measurable, describable, or identifiable.  The negative consequence of not addressing a Pain Point is often (but not always) quantifiable, and tied to KPIs directly or indirectly.  One or more Pain Points are typically associated with a Use Case. ',
  },
  {
    topic: 'compelling_event',
    tip: 'aka compelling events, address the question, “Why now?”.  Triggers drive urgency for the purchase of a solution, and may be the names of larger initiatives, forces, or trends at the department, company, or industry level. ',
  },
  {
    topic: 'product',
    tip: "Represent specific functional and technical capabilities of the product, as desired by your target buyer and persona.  These can be existing product features, as well as capabilities your buyers want, but you don't yet support, or support partially.  Product value props address specific Pain points.",
  },
  {
    topic: 'positioning',
    tip: 'Represent the intangibles – what customers want or value in a partner beyond the merits of the Product, e.g., how can the partner reduce risk, create long-term value, trigger positive emotions, or ensure personal success.  Positioning can include your key differentiators, as well as de-positioning statements that competitors are using against you (but written affirmatively, framed as buying criteria/needs.)',
  },
  {
    topic: 'pricing',
    tip: "Represent specific offers, and offer features, that enable the buyer to justify a purchase decision and realize the value from their investment over time.  They represent the economic risk/reward equation of the solution – how to reduce purchasing risk, drive usage, and align monetization to ROI? Pricing/packaging criteria can include what your buyers may value, but you don't yet support, or only partially.",
  },
  {
    topic: 'success',
    tip: "Represent services or capabilities to help make your customers successful post-sale — how to drive adoption and ensure customers realize the value they sought when they purchased your solution.  You can also include capabilities your customers want, but you don't yet provide, or only partially.",
  },
];
