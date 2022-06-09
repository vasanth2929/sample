import moment from 'moment';

export const marshallCreatedByForNoteOrProtip = (x) => {
    if (x.createdBy && x.createdBy.name) return x.createdBy;
    if (x.lastUpdatedBy && x.lastUpdatedBy.name) return x.lastUpdatedBy;
    if (x.userName) return { name: x.userName };
    return {};
};

export const marshallTimestampForNoteOrProtip = (x) => {
    if (x.keyMomentCreateTimestamp) return new Date(x.keyMomentCreateTimestamp).toLocaleDateString();
    if (x.effStartTime) return new Date(x.effStartTime).toLocaleDateString();
    if (x.protipTimestamp) return new Date(x.protipTimestamp).toLocaleDateString();
    return '';
};

export const marshallSortTimestampForNoteOrProtip = (x) => {
    if (x.keyMomentCreateTimestamp) return moment(x.keyMomentCreateTimestamp).valueOf();
    if (x.effStartTime) return moment(x.effStartTime).valueOf();
    if (x.protipTimestamp) return moment(x.protipTimestamp).valueOf();
    return '';
};

export const marshallTextForNoteOrProtip = (x) => {
    if (x.keyMomentsText) {
        return typeof x.keyMomentsText !== 'string'
            ? x.keyMomentsText.join()
            : x.keyMomentsText;
    }
    if (x.notes) return x.notes;
    if (x.storyTextProtip) return x.storyTextProtip;
    return '';
};

export const isKeyMoment = x => !!x.keyMomentsText;

export const marshallNoteOrProtip = (x) => {
    x.createdBy = marshallCreatedByForNoteOrProtip(x);
    x.timestamp = marshallTimestampForNoteOrProtip(x);
    x.sortTimestamp = marshallSortTimestampForNoteOrProtip(x);
    x.text = marshallTextForNoteOrProtip(x);
    x.isKeyMoment = isKeyMoment(x);
    return x;
};

