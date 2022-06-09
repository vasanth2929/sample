/* eslint-disable no-useless-constructor */
import { BaseModel } from '../BaseModel';

export class CallTranscriptsModel extends BaseModel {
    static resource = 'call_transcripts';
    constructor(properties) {
        super(properties);
    }
}

export class EmailTranscriptsModel extends BaseModel {
    static resource = 'email_transcripts';
    constructor(properties) {
        super(properties);
    }
}

export class DocTranscriptsModel extends BaseModel {
    static resource = 'doc_transcripts';
    constructor(properties) {
        super(properties);
    }
}

export class InternalTranscriptsModel extends BaseModel {
    static resource = 'internal_transcripts';
    constructor(properties) {
        super(properties);
    }
}

export class CallTranscriptsModelForOpptyP extends BaseModel {
    static resource = 'call_transcripts_opptyp';
    constructor(properties) {
        super(properties);
    }
}

export class EmailTranscriptsModelForOpptyP extends BaseModel {
    static resource = 'email_transcripts_opptyp';
    constructor(properties) {
        super(properties);
    }
}

export class DocTranscriptsModelForOpptyP extends BaseModel {
    static resource = 'doc_transcripts_opptyp';
    constructor(properties) {
        super(properties);
    }
}

export class InternalTranscriptsModelForOpptyP extends BaseModel {
    static resource = 'internal_transcripts_opptyp';
    constructor(properties) {
        super(properties);
    }
}
