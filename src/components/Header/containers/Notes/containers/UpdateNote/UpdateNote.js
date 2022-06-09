import React, { PureComponent } from 'react';
import Scrollbar from 'perfect-scrollbar-react';
import { MentionsInput, Mention } from 'react-mentions';
import { updateOpptyPlanNote, getIntroAndDescoveryQuestionsForOpptyPlan } from '../../../../../../util/promises/opptyplan_promise';
import { showAlert } from '../../../../../MessageModal/MessageModal';
import notesDoc from '../../../../../../assets/iconsV2/notes-doc-icon.png';
import avatar from '../../../../../../assets/images/avatar.png';
import './styles/UpdateNote.style.scss';
import { getLoggedInUser, SanitizeUrl } from '../../../../../../util/utils';


export class UpdateNote extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            note: props.note || '',
            notesTitle: props.notesTitle,
            noteType: props.noteType,
            loadingFixedData: true,
            discoveryQuestions: [],
            elevatorPitch: '',
            pitchExpanded: false,
            questionsExpanded: false
        };
    }

    componentDidMount() {
        this.getAllTopics();
    }

    onNoteStateChange = (elem) => {
        this.setState({ note: elem.target.value });
    };

    async getAllTopics() {
        const { opptyPlanId } = this.props;
        const response = await getIntroAndDescoveryQuestionsForOpptyPlan(opptyPlanId);
        if (response.data && response.data.length > 0) {
            this.setState({
                loadingFixedData: false,
                discoveryQuestions: response.data[0].discoveryQuestions,
                elevatorPitch: [response.data[0].pitch]
            });
        } else {
            this.setState({
                loadingFixedData: false,
                discoveryQuestions: [],
                elevatorPitch: ''
            });
        }
    }

    saveUpdateNote = () => {
        const tags = this.state.note.match(/\((.*?)\)/g) && this.state.note.match(/\((.*?)\)/g).map(b => b.replace(/\(|(.*?)\)/g, "$1"));
        const mentions = tags && tags.map(item => item).map((item) => {
            return { id: Number(item.split(' ')[0]), type: item.split(' ')[1] };
        });
        const payload = {
            notes: this.state.note,
            notesTitle: this.state.noteTitle,
            opptyPNoteId: Number(this.props.opptyPNoteId),
            type: this.state.noteType,
            mentions
        };
        updateOpptyPlanNote(payload).then((response) => {
            this.props.handleNoteReload(response.data);
        }).catch(() => {
            showAlert('Something went wrong. Please try again later.', 'error');
        });
    }
    
    handlePitchToggle = () => {
        this.setState({ pitchExpanded: !this.state.pitchExpanded });
    }

    handleElevatorPitchPaste = () => {
        const paste = this.state.elevatorPitch;
        let note;
        if (this.state.note.length > 0) {
            note = this.state.note + '\n' + paste;
        } else {
            note = paste;
        }
        this.setState({ note });
    }

    handleQuestionsToggle = () => {
        this.setState({ questionsExpanded: !this.state.questionsExpanded });
    }

    handleDiscoveryQuestionsPaste = () => {
        const paste = this.state.discoveryQuestions.join().replace(/,/g, '\n');
        let note;
        if (this.state.note.length > 0) {
            note = this.state.note + '\n' + paste;
        } else {
            note = paste;
        }
        this.setState({ note });
    }

    handleNoteTypeSelection = () => {
        if (this.state.noteType === 'private') {
            this.setState({ noteType: 'public' });
        } else {
            this.setState({ noteType: 'private' });
        }
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
            note,
            notesTitle,
            noteType,
            elevatorPitch,
            pitchExpanded,
            discoveryQuestions,
            questionsExpanded
        } = this.state;
        const {
            mentions,
            cancelUpdateNote
        } = this.props;

        return (
            <section className="update-note-section">
                <div className="create-header">
                    <div className="row">
                        <div className="col-8">
                            <div className="text-left d-flex">
                                <img className="notes-logo" src={notesDoc} />
                                <div className="notes-info">
                                    <input type="text" placeholder="Note title" className="form-control" value={notesTitle} onChange={e => this.setState({ notesTitle: e.target.value })} />
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
                    <div className="create-note-area">
                        <Scrollbar>
                            <div className="create-note-container">
                                {elevatorPitch &&
                                    <div className="elavator-pitch-text">
                                        <p className="fixed-title">
                                            <i className={`material-icons ${pitchExpanded ? 'expanded' : ''}`} role="button" onClick={this.handlePitchToggle}>keyboard_arrow_right</i>
                                            Elevator pitch
                                            <span onClick={this.handleElevatorPitchPaste} role="link">Paste in note</span>
                                        </p>
                                        <p className={`fixed-data ${pitchExpanded ? 'pitch-expanded' : ''}`}>
                                            {elevatorPitch}
                                        </p>
                                    </div>
                                }
                                {discoveryQuestions && discoveryQuestions.length > 0 &&
                                    <div className="discovery-question-text">
                                        <p className="fixed-title">
                                            <i className={`material-icons ${questionsExpanded ? 'expanded' : ''}`} role="button" onClick={this.handleQuestionsToggle}>keyboard_arrow_right</i>
                                            Discovery questions
                                        <span onClick={this.handleDiscoveryQuestionsPaste} role="link">Paste in note</span>
                                        </p>
                                        <p className={`fixed-data ${questionsExpanded ? 'questions-expanded' : ''}`}>
                                            <ol>
                                                {discoveryQuestions.map((item, key) => <li key={key}>{item}</li>)}
                                            </ol>
                                        </p>
                                    </div>
                                }
                                <MentionsInput 
                                    singleLine={false}
                                    value={note} 
                                    placeholder="Start typing your note..."
                                    className="note-input-field"
                                    onChange={this.onNoteStateChange}
                                    displayTransform={this.renderMentions}>
                                    <Mention
                                        trigger="@"
                                        appendSpaceOnAdd
                                        renderSuggestion={this.renderSuggestion}
                                        data={mentions} />
                                </MentionsInput>
                            </div>
                        </Scrollbar>
                    </div>
                </section>
                <section className="create-note-footer d-flex justify-content-end align-items-center">
                    <button className="btn cancel-btn" onClick={cancelUpdateNote}>Cancel</button>
                    <button className="btn save-btn" onClick={this.saveUpdateNote} disabled={note.length === 0}>Save</button>
                </section>
            </section>
        );
    }
}
