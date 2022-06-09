import React, { PureComponent } from 'react';
// import { EditorState, convertToRaw } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { MentionsInput, Mention } from 'react-mentions';
import notesDoc from '../../../../../../assets/iconsV2/notes-doc-icon.png';
import avatar from '../../../../../../assets/images/avatar.png';
import { getLoggedInUser, SanitizeUrl } from './../../../../../../util/utils';
import './styles/CreateNote.style.scss';

import { createNoteForPlan } from '../../../../../../util/promises/opptyplan_promise';
import { showAlert } from './../../../../../MessageModal/MessageModal';

export class CreateNote extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            noteTitle: '',
            noteType: 'private',
            // editorState: EditorState.createEmpty(),
            note: '',
            userAndContactUnion: []
        };
    }

    componentWillMount() {
        this.makeUnifiedMentionsList();
    }

    onEditorStateChange = (editorState) => {
        this.setState({ editorState, });
    };

    makeUnifiedMentionsList = () => {
        let userAndContactUnion = [];
        userAndContactUnion = userAndContactUnion.concat(this.props.users.map((user) => {
            return {
                display: user.username, 
                id: `${user.userId.toString()} user`,
                email: user.email,
                role: user.role,
                pictureFile: user.pictureFile,
                type: 'user'

                // text: `${user.username} (user)`, 
                // value: user.username, 
                // url: `${user.userId.toString()} user`,
                // email: user.email,
                // type: 'user'
            };
        }));
        userAndContactUnion = userAndContactUnion.concat(this.props.contacts.map((contact) => {
            return {
                display: contact.name, 
                id: `${contact.contactId.toString()} contact`,
                email: contact.email,
                role: contact.job_title,
                pictureFile: contact.picture,
                type: 'contact'

                // text: `${contact.name} (contact)`, 
                // value: `${contact.name}`, 
                // url: `${contact.contactId.toString()} contact`,
                // email: contact.email,
                // type: 'contact'
            };
        }));
        userAndContactUnion.shift();
        this.setState({ userAndContactUnion });
    }

    handleNoteTypeSelection = () => {
        if (this.state.noteType === 'private') {
            this.setState({ noteType: 'public' });
        } else {
            this.setState({ noteType: 'private' });
        }
    }

    saveCreateNote = () => {
        const tagMatches = this.state.note.match(/\((.*?)\)/g); 
        const tags = tagMatches ? tagMatches.map(b => b.replace(/\(|(.*?)\)/g, "$1")) : [];
        const mentions = tags.map(item => item).map((item) => {
            return { id: Number(item.split(' ')[0]), type: item.split(' ')[1] };
        });
        const payload = {
            notes: this.state.note,
            notesTitle: this.state.noteTitle,
            opptyPlanId: Number(this.props.opptyPlanId),
            type: this.state.noteType,
            usersId: getLoggedInUser().userId,
            mentions
        };
        // console.log(payload);


        // const entityMap = convertToRaw(this.state.editorState.getCurrentContent()).entityMap;
        // const tags = [];

        // Object.values(entityMap).forEach((entity) => {
        //     if (entity.type === 'MENTION') {
        //         tags.push(entity.data);
        //     }
        // });
        // const mentions = tags.map(item => item.url).map((item) => {
        //     return {
        //         id: Number(item.split(' ')[0]), type: item.split(' ')[1]
        //     };
        // });


        // const payload = {
        //     notes: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
        //     notesTitle: this.state.noteTitle,
        //     opptyPlanId: Number(this.props.opptyPlanId),
        //     type: this.state.noteType,
        //     usersId: getLoggedInUser().userId,
        //     mentions
        // };
        createNoteForPlan(payload).then(() => {
            this.props.handleNotesReload();
        }).catch(() => {
            showAlert('Something went wrong. Please try again later.', 'error', () => this.props.handleNotesReload());
        });
    }

    handleNoteAdd = (elem) => {
        this.setState({ note: elem.target.value });
    }

    renderMentions = (id, display) => {
        return `@${display}`;
    }

    renderSuggestion = (entry) => {
        const unfocusedStyle = {
            padding: '5px 15px',
            borderBottom: 'rgba(0,0,0,0.15) solid 1px',
            backgroundColor: '#FFF'
        };
        const nameStyle = {
            fontWeight: 'bold',
            color: '#2C393F',
            fontFamily: 'Roboto-Bold'
        };
        const roleStyle = {
            fontSize: '12px',
            color: '#5F6C72'
        };
        const imageStyle = {
            marginRight: "0.5em",
            marginTop: "0.20em",
            borderRadius: "50%"
        };
        return (
            <div style={unfocusedStyle} className="d-flex justify-content-start">
                <div>
                    <img 
                        style={imageStyle}
                        src={entry.pictureFile ? `tribyl/api/photo?location=${SanitizeUrl(entry.pictureFile)}` : avatar} 
                        onError={(e) => { e.target.onerror = null; e.target.src = `${avatar}`; }}
                        title={`${entry.display}`}
                        onClick={this.showUserMenu}
                        width="35"
                        height="35" />
                </div>
                <div>
                    <div style={nameStyle}>{`${entry.display}`}</div>
                    <div style={roleStyle}>
                        {entry.type === 'contact' && <i className="material-icons" style={{ color: '#3B90E3' }}>fiber_manual_record</i>}
                        {`${entry.role ? entry.role : ''}`}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {
            noteTitle,
            noteType,
            // editorState,
            userAndContactUnion,
            note
        } = this.state;
        const { cancelCreateNote } = this.props;
        return (
            <section className="create-note-section">
                <div className="create-header">
                    <div className="row">
                        <div className="col-8">
                            <div className="text-left d-flex create-note-section-header-title-section">
                                <img className="notes-logo" src={notesDoc} />
                                <div className="notes-info">
                                    <input type="text" placeholder="Note title" className="form-control create-note-section-title-input" value={noteTitle} onChange={e => this.setState({ noteTitle: e.target.value })} />
                                    <p className="author-name">Author: {getLoggedInUser().username}</p>
                                    <p className="note-date">Last updated: {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="d-flex justify-content-end align-items-center note-type-controls">
                                <i className="material-icons" onClick={this.handleNoteTypeSelection} role="button" title={noteType === 'private' ? 'Private' : 'Public'}>{noteType === 'private' ? 'lock' : 'public'}</i>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="create-note-body">
                    {/* <Editor
                        toolbar={{ 
                            options: ['inline', 'list', 'emoji', 'history'],
                            inline: {
                                inDropdown: false,
                                className: undefined,
                                component: undefined,
                                dropdownClassName: undefined,
                                options: ['bold', 'italic', 'underline']
                            },
                            list: {
                                inDropdown: false,
                                className: undefined,
                                component: undefined,
                                dropdownClassName: undefined,
                                options: ['unordered', 'ordered', 'indent', 'outdent']
                            }
                        }}
                        editorState={editorState}
                        wrapperClassName="note-wrapper"
                        editorClassName="note-editor"
                        onEditorStateChange={this.onEditorStateChange}
                        mention={{
                            separator: ' ',
                            trigger: '@',
                            suggestions: [...userAndContactUnion],
                        }} /> */}
                        {/* <section className="row formatter-bar">
                            <div className="col-4">
                                <span className="formatter-option" title="Undo"><i className="material-icons">undo</i></span>
                                <span className="formatter-option" title="redo"><i className="material-icons">redo</i></span>
                            </div>
                            <div className="col-8 text-right">
                                <span className="formatter-option ml-auto" title="Add emoji"><i className="material-icons">insert_emoticon</i></span>
                                <span className="formatter-option ml-auto" title="Bold"><i className="material-icons">format_bold</i></span>
                                <span className="formatter-option ml-auto" title="Italic"><i className="material-icons">format_italic</i></span>
                                <span className="formatter-option ml-auto" title="Underline"><i className="material-icons">format_underline</i></span>
                                <span className="formatter-option ml-auto" title="Ordered list"><i className="material-icons">format_list_numbered</i></span>
                                <span className="formatter-option ml-auto" title="Unordered list"><i className="material-icons">format_list_bulleted</i></span>
                                <span className="formatter-option ml-auto" title="Increase indent"><i className="material-icons">format_indent_increase</i></span>
                                <span className="formatter-option ml-auto" title="Decrease indent"><i className="material-icons">format_indent_decrease</i></span>
                            </div>
                        </section> */}
                        <MentionsInput 
                            singleLine={false}
                            value={note} 
                            placeholder="Start typing your note..."
                            className="note-input-field"
                            onChange={this.handleNoteAdd}
                            displayTransform={this.renderMentions}>
                            <Mention
                                trigger="@"
                                appendSpaceOnAdd
                                renderSuggestion={this.renderSuggestion}
                                data={userAndContactUnion} />
                        </MentionsInput>
                </section>
                <section className="create-note-footer d-flex justify-content-end align-items-center">
                    <button className="btn cancel-btn" onClick={cancelCreateNote}>Cancel</button>
                    <button className="btn save-btn" onClick={this.saveCreateNote}>Save</button>
                </section>
            </section>
        );
    }
}
