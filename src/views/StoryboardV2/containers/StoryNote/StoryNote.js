import React, { PureComponent } from 'react';
import ReactQuill from 'react-quill';
import debounce from 'lodash.debounce';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStorySideNote } from '../../../../action/storyNoteActions';
import notesDoc from '../../../../assets/iconsV2/notes-doc-icon.png';
import { upsertStoryNotes } from '../../../../util/promises/storyboard_promise';
import { showAlert } from './../../../../components/MessageModal/MessageModal';
import './styles/StoryNote.style.scss';
import { getLoggedInUser } from '../../../../util/utils';

class StoryNoteImpl extends PureComponent {
    state = {
        storyNote: this.props.storyNote.storyNote.notes,
        isDirty: false
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.storyNote.storyNote.notes !== nextProps.storyNote.storyNote.notes) {
            this.setState({ storyNote: nextProps.storyNote.storyNote.notes });
        }
    }

    handleNoteChange = (storyNote, delta, source) => {
        if (source === 'user') {
            this.setState({ 
                storyNote
            }, () => {
                if (this.props.storyNote.storyNote.notes !== this.state.storyNote) {
                    const { storyId } = this.props;
                    const payload = {
                        storyId,
                        notes: storyNote
                    };
                    this.autoSaveNote(payload);
                }
            });
        }
    };

    handleSaveNotes = () => {
        const { storyId } = this.props;
        const { storyNote } = this.state;
        const payload = {
            storyId,
            notes: storyNote
        };
        upsertStoryNotes(payload).then((response) => {
            this.props.setStorySideNote(response.data.storyNoteId, response.data);
        }).catch(() => {
            showAlert('Something went wrong. Please try again later');
        });
    }

    autoSaveNote = debounce((payload) => {
        this.setState({ isDirty: true }, () => {
            upsertStoryNotes(payload).then((response) => {
                this.setState({ isDirty: false });
                this.props.setStorySideNote(response.data.storyNoteId, response.data);
            }).catch(() => {
                showAlert('Something went wrong. Please try again later');
            });
        });
    }, 2000)

    render() {
        const { storyNote, isDirty } = this.state;
        let noteAuthor;
        let noteTime;
        if (this.props.storyNote.storyNote) {
            const { author, lastUpdateTime } = this.props.storyNote.storyNote;
            const { firstName, lastName } = getLoggedInUser();
            noteAuthor = author ? author.name : `${firstName} ${lastName}`;
            noteTime = lastUpdateTime ? new Date(lastUpdateTime).toLocaleDateString() : '';
        }
        const modules = {
            toolbar: [
              ['bold', 'italic', 'underline']
            ],
            clipboard: { matchVisual: false }
        };
        const formats = [
            'bold', 'italic', 'underline'
        ];
        return (
            <section className="story-note-section">
                <div className="story-notes-header d-flex align-items-center">
                    <img src={notesDoc} />
                    <div>
                        <p>Story Notes</p>
                        <p className="note-metadata">
                            <span className="author-details">Author: {noteAuthor || ''}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
                            <span className="timestamp-details">Last updated: {noteTime || ''}</span>
                        </p>
                    </div>
                </div>
                <div className="story-notes-editor">
                    <Tabs selectedIndex={0}>
                        <TabList>
                            <Tab>Interview Guide</Tab>
                        </TabList>

                        <TabPanel>
                            <ReactQuill 
                                theme="bubble"
                                onChange={this.handleNoteChange}
                                value={storyNote}
                                modules={modules}
                                formats={formats}
                                readOnly={isDirty}
                                placeholder="Start typing notes..." />
                        </TabPanel>
                    </Tabs>
                </div>
                <div className="story-note-footer-actions d-flex justify-content-between">
                    <button disabled className="btn cancel-btn" onClick={() => this.props.closeStorySideNote()}>Cancel</button>
                    <button className="btn save-btn" onClick={this.handleSaveNotes}>Save</button>
                </div>
            </section>
        );
    }
}

function mapStateToProps(state) {
    return {
        storyNote: state.storyNote,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setStorySideNote
    }, dispatch);
}

export const StoryNote = connect(mapStateToProps, mapDispatchToProps)(StoryNoteImpl);
