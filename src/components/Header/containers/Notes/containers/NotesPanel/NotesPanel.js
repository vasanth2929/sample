import React, { PureComponent } from 'react';
import notesDoc from '../../../../../../assets/iconsV2/notes-doc-icon.png';
import avatar from '../../../../../../assets/images/avatar.png';
import './styles/NotesPanel.style.scss';
import { deleteOpptyPlanNote } from '../../../../../../util/promises/opptyplan_promise';
import { showAlert } from '../../../../../MessageModal/MessageModal';

export class NotesPanel extends PureComponent {
    getDateLabel = (date) => {
        const today = new Date();
        const noteDate = new Date(date);
        let diff = (today.getTime() - noteDate.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        const difference = Math.abs(Math.round(diff));
        if (difference === 0) {
            return 'today';
        } else if (difference === 1) {
            return 'yesterday';
        } else if (difference > 1 && difference <= 30) {
            return `${difference} days ago`;
        } else if (difference > 30 && difference <= 60) {
            return 'last month';
        } else if (difference > 60 && difference <= 90) {
            return '2 months ago';
        } return new Date(date).toLocaleDateString();
    }

    handleNoteDelete = (elem, noteId) => {
        elem.stopPropagation();
        deleteOpptyPlanNote(noteId).then(() => {
            this.props.handleNoteDeletion();
        }).catch(() => {
            showAlert('Something went wrong!', 'error');
        });
    }

    render() {
        const {
            noteId,
            notesTitle,
            author,
            date,
            handleNoteSelection,
            noteType,
            userBeans,
            contactBeans
        } = this.props;
        const mentions = [...userBeans, ...contactBeans];
        return (
            <section className="notes-panel" onClick={handleNoteSelection}>
                <div className="row">
                    <div className="col-8">
                        <div className="text-left d-flex">
                            <img className="notes-logo" width="40" height="60" src={notesDoc} />
                            <div className="notes-info">
                                <p className="note-name">{notesTitle}</p>
                                <p className="author-name">Author: {author}</p>
                                <p className="note-date">
                                    Last updated: {this.getDateLabel(date)}&nbsp;&nbsp;
                                    <span className="remove-note-label" onClick={e => this.handleNoteDelete(e, noteId)} role="button">(Remove)</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        {noteType && (noteType === 'private' || noteType === 'internal') ? (
                            <div className="d-flex align-items-center justify-content-end profiles" style={{ height: '100%' }}>
                                <i className="material-icons internal-note-marker" title="Private">lock</i>
                            </div>
                        ) : (
                            <React.Fragment>
                                <div className="d-flex align-items-center justify-content-end profiles" style={{ height: '100%' }}>
                                    {mentions.length < 5 ? (mentions.map((item, key) => (
                                        <img height="24" width="24" src={avatar} title={item.name} key={key} />
                                    ))) : (
                                        mentions.slice(0, 5).map((item, key) => (
                                            <img height="24" width="24" src={avatar} title={item.name} key={key} />
                                        ))
                                    )}
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-end user-bean">
                            <p className="user-bean-list">{mentions.map(item => item.name).join().replace(/,/g, ', ')}</p>
                            {/* {mentions.map((item, key) => (
                                <span className="user-bean-list" key={key}>{item.name}</span>
                            ))} */}
                        </div>
                    </div>
                </div>
                {/* <i className="material-icons delete-note-btn" role="button" onClick={e => this.handleNoteDelete(e, noteId)}>delete</i> */}
            </section>
        );
    }
}
