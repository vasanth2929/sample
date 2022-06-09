import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scrollbar from 'perfect-scrollbar-react';
import Select from 'react-select';
import notes from '../../../../assets/iconsV2/notes-icon.png';
import notesDoc from '../../../../assets/iconsV2/notes-doc-icon.png';
import './styles/Notes.style.scss';
import { NotesLoadingPanel } from './containers/NotesLoadingPanel/NotesLoadingPanel';
import { getAllNotesForOpptyP, getContactDetailsForOpptyPlan, searchOpptyPlanNote } from './../../../../util/promises/opptyplan_promise';
import { NotesPanel } from './containers/NotesPanel/NotesPanel';
import { Note } from './containers/Note/Note';
import { getAllUsers } from './../../../../util/promises/usercontrol_promise';
import { CreateNote } from './containers/CreateNote/CreateNote';
import { showSideNote, viewSideNote } from './../../../../action/sideNoteActions';
import { OpptyPlanCardModel } from '../../../../model/opptyPlanModels/OpptyPlanCardModel';

export class NotesImpl extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            authors: [],
            contacts: [],
            collaborators: [],
            selectedAuthor: { name: 'All', userId: -1 },
            selectedCollaborator: { name: 'All', userId: -1 },
            showNotes: false,
            notesLoading: true,
            opptyPlanId: null,
            notesData: [],
            selectedNote: null,
            showNote: false,
            searchKeyword: '',
            createNoteMode: false
        };
        this.notes = [];
    }

    componentDidMount() {
        const outerContainer = document.querySelector('#main-content-section');
        outerContainer.addEventListener('click', this.hideNotesDisplay);
    }

    async getAuthors() {
        const response = await getAllUsers();
        const authors = response.data.map((item) => {
            const a = Object.assign({}, item);
            a.subType = 'user';
            return a;
        });
        this.setState({ authors: [{ name: 'All', userId: -1, subType: 'user' }, ...authors] });
    }

    async getContactDetailsForOpptyPlan(opptyPlanId) {
        const response = await getContactDetailsForOpptyPlan(opptyPlanId);
        const collaborators = response.data.contactDetailsForOpptyList.map((item) => {
            const a = Object.assign({}, item);
            a.subType = 'contact';
            return a;
        });
        this.setState({ contacts: response.data.contactDetailsForOpptyList, collaborators: [...this.state.authors, ...collaborators] });
    }

    async getNotes(opptyPlanId) {
        const response = await getAllNotesForOpptyP(opptyPlanId);
        if (response.data && response.data.length > 0) {
            this.notes = response.data.filter(item => item.type === 'oppty_plan_notes');
            this.setState({ notesLoading: false, notesData: this.notes });
        } else {
            this.setState({ notesLoading: false });
        }
    }

    getUsersContactsNotes = (opptyPlanId) => {
        this.getAuthors().then(() => this.getContactDetailsForOpptyPlan(opptyPlanId)).then(() => this.getNotes(opptyPlanId));
    }

    async searchOpptyPlanNote(opptyPlanId, searchString) {
        this.setState({ notesLoading: true });
        const response = await searchOpptyPlanNote(opptyPlanId, searchString);
        if (response.data && response.data.length > 0) {
            this.notes = response.data;
            this.setState({ notesLoading: false, notesData: this.notes });
        } else {
            this.setState({ notesLoading: false });
        }
    }

    handleNoteSearch = () => {
        const searchString = this.state.searchKeyword;
        const opptyPlanId = this.state.opptyPlanId;
        this.searchOpptyPlanNote(opptyPlanId, searchString);
    }

    handleKeyStrokeSearch = (event) => {
        if (event.which === 13 || event.keyCode === 13) {
            this.handleNoteSearch();
        }
    }

    handleCancelSearch = () => {
        this.setState({ searchKeyword: '', notesLoading: true });
        this.getNotes(this.state.opptyPlanId);
    }

    handleNotesDisplay = () => {
        if (!this.state.showNotes) {
            this.setState({
                notesLoading: true,
                showNotes: true,
                opptyPlanId: this.props.opptyPlanId
            }, () => this.getUsersContactsNotes(this.state.opptyPlanId));
        } else {
            this.setState({
                showNotes: false,
                opptyPlanId: null
            });
        }
    }

    hideNotesDisplay = () => {
        this.setState({
            showNotes: false,
            opptyPlanId: null
        });
    }

    handleNoteSelection = (selectedNote) => {
        // console.log(selectedNote.id, selectedNote, this.state.authors, this.state.contacts);
        OpptyPlanCardModel.deleteAll();
        this.setState({
            // selectedNote,
            // showNote: true
            showNotes: false
        });
        // this.props.handleUpdateNoteClick();
        this.props.viewSideNote(selectedNote.id, selectedNote);
    }

    handleClearNote = () => {
        this.setState({
            selectedNote: null,
            showNote: false,
            notesLoading: true,
            searchKeyword: ''
        }, () => this.getNotes(this.state.opptyPlanId));
    }

    showNote = () => {
        return (
            <Note
                note={this.state.selectedNote}
                users={this.state.authors}
                contacts={this.state.contacts}
                handleGoBack={this.handleClearNote}
                collaborators={this.state.collaborators}
                handleNotesReloadAfterUpdate={this.handleNotesReload}
                handleUpdateNoteClick={this.handleSideUpdateNoteClick} />
        );
    }

    handleSideUpdateNoteClick = () => {
        this.setState({
            selectedNote: null,
            showNotes: false,
            showNote: false,
            notesLoading: true
        });
    }

    filteredNotes = (notesData) => {
        const searchKeyword = this.state.searchKeyword;
        let notesList;
        if (searchKeyword.length > 0) {
            notesList = notesData.filter(note => note.notesTitle.toLowerCase().includes(this.state.searchKeyword));
        } else {
            notesList = notesData;
        }
        return notesList;
    }

    handleAuthorSelection = (selectedAuthor) => {
        if (selectedAuthor.name === 'All') {
            this.setState({ selectedAuthor, notesData: this.notes });
        } else {
            this.setState({ selectedAuthor, notesData: this.notes.filter(note => note.userName.toLocaleLowerCase() === selectedAuthor.name.toLocaleLowerCase()) });
        }
    }

    handleCollaboratorSelection = (selectedCollaborator) => {
        if (selectedCollaborator.name === 'All') {
            this.setState({ selectedCollaborator, notesData: this.notes });
        } else {
            this.setState({ selectedCollaborator, notesData: this.notes.filter(note => note.userBeans && note.userBeans.find(user => user.name.toLocaleLowerCase() === selectedCollaborator.name.toLocaleLowerCase())) });
        }
    }

    handleNotesReload = () => {
        this.setState({
            notesLoading: true,
            createNoteMode: false
        }, () => this.getUsersContactsNotes(this.state.opptyPlanId));
    }

    handleNewNoteSelection = () => {
        OpptyPlanCardModel.deleteAll();
        this.props.showSideNote(-1, '');
        this.setState({ showNotes: false });
    }

    handleNoteDeletion = () => {
        this.setState({ notesLoading: true });
        this.getNotes(this.state.opptyPlanId);
    }

    render() {
        const {
            opptyPlanId,
            authors,
            contacts,
            collaborators,
            selectedAuthor,
            selectedCollaborator,
            showNotes,
            notesLoading,
            notesData,
            showNote,
            searchKeyword,
            createNoteMode,
        } = this.state;
        return (
            <a className="notes-icon-section">
                <img
                    src={notes}
                    className="header-note-icon"
                    title="Notes"
                    onClick={this.handleNotesDisplay} />
                {showNotes && (
                    <div className="notes-box" role="button" onClick={e => e.stopPropagation()}>
                        {!createNoteMode ? (showNote ? ( // eslint-disable-line
                            this.showNote()
                        ) : (
                                <React.Fragment>
                                    <button className="add-note-btn" onClick={() => this.handleNewNoteSelection()}>
                                        <img src={notes} />New note
                                    </button>
                                    <hr />
                                    <section className="notes-filter-section">
                                        <div className="f-flex search-bar">
                                            <input type="text" placeholder="Search" value={searchKeyword} onChange={keyword => this.setState({ searchKeyword: keyword.target.value })} onKeyPress={e => this.handleKeyStrokeSearch(e)} />
                                            <i className="material-icons search-icon" role="button" onClick={this.handleNoteSearch}>search</i>
                                            {searchKeyword.length > 0 && <i className="material-icons clear-search-btn" role="button" onClick={this.handleCancelSearch}>close</i>}
                                        </div>
                                        <div className="d-flex filter-dropdowns">
                                            <div className="section-dd author-dd">
                                                <label>Author</label>
                                                <Select
                                                    clearable={false}
                                                    value={selectedAuthor}
                                                    options={authors}
                                                    labelKey="name"
                                                    valueKey="name"
                                                    onChange={this.handleAuthorSelection} />
                                            </div>
                                            <div className="section-dd collaborators-dd">
                                                <label>Collaborators</label>
                                                <Select
                                                    clearable={false}
                                                    value={selectedCollaborator}
                                                    options={collaborators}
                                                    labelKey="name"
                                                    valueKey="name"
                                                    onChange={this.handleCollaboratorSelection} />
                                            </div>
                                        </div>
                                        <p className="notes-counter">Showing {notesData.length} notes</p>
                                    </section>
                                    {notesLoading ? ( // eslint-disable-line
                                        <section className="notes-list-section">
                                            {[1, 2, 3, 4, 5, 6].map(item => <NotesLoadingPanel item={item} />)}
                                        </section>
                                    ) : (
                                            notesData.length > 0 ? (
                                                <Scrollbar>
                                                    <section className="notes-list-section">
                                                        {notesData.map((item, key) => (
                                                            <NotesPanel
                                                                key={key}
                                                                noteId={item.id}
                                                                notesTitle={item.notesTitle || ''}
                                                                author={item.userName}
                                                                date={item.effStartTime}
                                                                noteType={item.noteType}
                                                                userBeans={item.userBeans || []}
                                                                contactBeans={item.contactBeans || []}
                                                                handleNoteSelection={() => this.handleNoteSelection(item)}
                                                                handleNoteDeletion={this.handleNoteDeletion} />
                                                        ))}
                                                    </section>
                                                </Scrollbar>
                                            ) : (
                                                    <section className="notes-list-section d-flex align-items-center">
                                                        <div className="no-notes-placeholder text-center">
                                                            <img src={notesDoc} />
                                                            <p>There are no notes yet. Click on <b>NEW NOTE</b> to get started</p>
                                                        </div>
                                                    </section>
                                                )
                                        )}
                                </React.Fragment>
                            )) : (
                                <CreateNote
                                    users={authors}
                                    contacts={contacts}
                                    opptyPlanId={opptyPlanId}
                                    cancelCreateNote={() => this.setState({ createNoteMode: false })}
                                    handleNotesReload={this.handleNotesReload} />
                            )
                        }
                    </div>
                )}
            </a>
        );
    }
}

function mapStateToProps(state) {
    return { sideNote: state.sideNote };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ showSideNote, viewSideNote }, dispatch);
}

export const Notes = connect(mapStateToProps, mapDispatchToProps)(NotesImpl);
