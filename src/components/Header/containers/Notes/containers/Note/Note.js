import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import Scrollbar from 'perfect-scrollbar-react';
import notesDoc from '../../../../../../assets/iconsV2/notes-doc-icon.png';
import avatar from '../../../../../../assets/images/avatar.png';
import './styles/Note.style.scss';
import { FloaterButton } from '../../../../../../basecomponents/FloaterButton/FloaterButton';
import { UpdateNote } from '../UpdateNote/UpdateNote';
import {
  likeOrUnlikeNote,
  getOpptyPlanNotesComments,
  createOpptyPlanNotesComments,
} from '../../../../../../util/promises/opptyplan_promise';
import { showAlert } from './../../../../../MessageModal/MessageModal';
import { CommentPanel } from '../CommentPanel/CommentPanel';
import { getLoggedInUser } from './../../../../../../util/utils';
import { showSideNote } from './../../../../../../action/sideNoteActions';
// import { showNoteUpdate } from './../../../../../../action/sideNoteActions';

export class NoteImpl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      note: props.note,
      updateNoteMode: false,
      userAndContactUnion: [],
      commentsLoading: true,
      comments: [],
      commentInput: '',
    };
  }

  componentWillMount() {
    this.makeUnifiedMentionsList();
  }

  componentDidMount() {
    this.getOpptyPlanNotesComments(this.state.note.id);
    this.insertFormattedNote();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.note !== this.props.note) {
      this.setState({ note: nextProps.note });
    }
  }

  async getOpptyPlanNotesComments(noteId) {
    const response = await getOpptyPlanNotesComments(noteId);
    if (response.data && response.data.length > 0) {
      this.setState({ commentsLoading: false, comments: response.data });
    } else {
      this.setState({ commentsLoading: false, comments: [] });
    }
  }

  getDateLabel = (date) => {
    const today = new Date();
    const noteDate = new Date(date);
    let diff = (today.getTime() - noteDate.getTime()) / 1000;
    diff /= 60 * 60 * 24;
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
    }
    return new Date(date).toLocaleDateString();
  };

  getLikeData = (likedBy, likes, noteId) => {
    const loggedInUserId = getLoggedInUser().userId;
    if (likedBy.filter((item) => item.id === loggedInUserId).length > 0) {
      return (
        <p
          className="like-unlike-label liked"
          title={
            likedBy.length > 1
              ? `You and ${likedBy.length - 1} other likes this`
              : 'You like this'
          }
        >
          Likes({likes})&nbsp;
          <i
            className="material-icons liker-unliker"
            role="button"
            onClick={() =>
              this.likeOrUnlikeNote(noteId, loggedInUserId, 'unlike')
            }
          >
            thumb_up
          </i>
        </p>
      );
    }
    return (
      <p
        className="like-unlike-label"
        title={
          likedBy.length > 0
            ? likedBy.length > 1
              ? `${likedBy[0].name} and ${likedBy.length - 1} other likes this`
              : `${likedBy[0].name} likes this`
            : ''
        }
      >
        {' '}
        {/* eslint-disable-line */}
        Likes({likes})&nbsp;
        <i
          className="material-icons liker-unliker"
          role="button"
          onClick={() => this.likeOrUnlikeNote(noteId, loggedInUserId, 'like')}
        >
          thumb_up
        </i>
      </p>
    );
  };

  insertFormattedNote = () => {
    let formattedNote =
      this.state.note.notes &&
      this.state.note.notes.replace(
        /@\[/gi,
        '<span style="color:#0066CC;background:#E3F2FD;border-radius: 5px;padding: 2px 4px;">'
      );
    formattedNote =
      formattedNote &&
      formattedNote.replace(/\]\([0-9]+ (contact|user)\)/gi, '</span>');
    return formattedNote || '';
  };

  likeOrUnlikeNote = (noteId, userId, likeOrUnlike) => {
    likeOrUnlikeNote(noteId, userId, likeOrUnlike, 'oppty_plan_notes')
      .then((res) => {
        this.setState({ note: res.data });
      })
      .catch(() =>
        showAlert('Something went wrong. Please try again later,', 'error')
      );
  };

  makeUnifiedMentionsList = () => {
    let userAndContactUnion = [];
    userAndContactUnion = userAndContactUnion.concat(
      this.props.users.map((user) => {
        return {
          display: user.username,
          id: `${user.userId.toString()} user`,
          email: user.email,
          role: user.role,
          pictureFile: user.pictureFile,
          type: 'user',
        };
      })
    );
    userAndContactUnion = userAndContactUnion.concat(
      this.props.contacts.map((contact) => {
        return {
          display: contact.name,
          id: `${contact.contactId.toString()} contact`,
          email: contact.email,
          role: contact.job_title,
          pictureFile: contact.picture,
          type: 'contact',
        };
      })
    );
    userAndContactUnion.shift();
    this.setState({ userAndContactUnion });
  };

  handleNoteReload = (note) => {
    this.setState({ updateNoteMode: false, note });
  };

  handleAddComment = () => {
    this.setState({ commentsLoading: true, commentInput: '' });
    const commentText = this.state.commentInput;
    const opptyPlanNotesId = this.state.note.id;
    const userId = getLoggedInUser().userId;
    const payload = { commentText, opptyPlanNotesId, userId };
    createOpptyPlanNotesComments(payload)
      .then(() => {
        this.getOpptyPlanNotesComments(this.state.note.id);
      })
      .catch(() => {
        showAlert('Something went wrong.', 'error');
        this.setState({ commentsLoading: false });
      });
  };

  // updateSideNote = (note, users, contacts) => {
  //     this.props.handleUpdateNoteClick();
  //     this.props.showNoteUpdate(note, users, contacts);
  // }

  showSideNote = (noteId, note, users, contacts) => {
    this.props.handleUpdateNoteClick();
    this.props.showSideNote(noteId, note, users, contacts);
  };

  renderComments = () => {
    const commentsLoading = this.state.commentsLoading;
    const comments = this.state.comments;
    if (commentsLoading) {
      return (
        <p className="text-center no-comments-found">
          Fetching comments. Please wait...
        </p>
      );
    }
    return comments.length === 0 ? (
      <p className="text-center no-comments-found">No comments yet</p>
    ) : (
      comments.map((item, key) => (
        <div className="comment-container" key={key}>
          <CommentPanel comment={item} />
        </div>
      ))
    );
  };

  render() {
    const { handleGoBack } = this.props;
    const {
      notesTitle,
      id,
      notes,
      userName,
      effStartTime,
      noteType,
      userBeans,
      contactBeans,
      likedBy,
      likes,
    } = this.state.note;
    const { updateNoteMode, userAndContactUnion, commentInput } = this.state;
    const userBean = userBeans || [];
    const contactBean = contactBeans || [];
    const mentions = [...userBean, ...contactBean];
    return (
      <section className="note-section">
        {!updateNoteMode && (
          <section className="header-bar d-flex">
            <i className="material-icons" onClick={handleGoBack} role="button">
              arrow_back
            </i>
            <p>Back to all notes</p>
          </section>
        )}
        {updateNoteMode ? (
          <UpdateNote
            note={notes && `${notes}`}
            notesTitle={notesTitle}
            opptyPNoteId={id}
            noteType={noteType}
            mentions={userAndContactUnion}
            cancelUpdateNote={() => this.setState({ updateNoteMode: false })}
            handleNoteReload={this.handleNoteReload}
          />
        ) : (
          <React.Fragment>
            <section className="note-bar notes-panel">
              <div className="row">
                <div className="col-8">
                  <div className="text-left d-flex">
                    <img className="notes-logo" src={notesDoc} />
                    <div className="notes-info">
                      <p className="note-name">{notesTitle || ''}</p>
                      <p className="author-name">Author: {userName}</p>
                      <p className="note-date">
                        Last updated: {this.getDateLabel(effStartTime)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  {noteType &&
                  (noteType === 'private' || noteType === 'internal') ? (
                    <div
                      className="d-flex align-items-center justify-content-end profiles"
                      style={{ height: '100%' }}
                    >
                      <i
                        className="material-icons internal-note-marker"
                        title="Private"
                      >
                        lock
                      </i>
                    </div>
                  ) : (
                    <React.Fragment>
                      <div
                        className="d-flex align-items-center justify-content-end profiles"
                        style={{ height: '100%' }}
                      >
                        {mentions.length < 5
                          ? mentions.map((item, key) => (
                              <img
                                height="24"
                                width="24"
                                src={avatar}
                                title={item.name}
                                key={key}
                              />
                            ))
                          : mentions
                              .slice(0, 5)
                              .map((item, key) => (
                                <img
                                  height="24"
                                  width="24"
                                  src={avatar}
                                  title={item.name}
                                  key={key}
                                />
                              ))}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-end user-bean">
                    <p className="user-bean-list">
                      {mentions
                        .map((item) => item.name)
                        .join()
                        .replace(/,/g, ', ')}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <Scrollbar>
              <section className="note-textarea">
                {notes && ReactHtmlParser(`${this.insertFormattedNote(notes)}`)}
              </section>
            </Scrollbar>
            <section className="note-comment-section">
              <p className="section-title">Comments</p>
              <div className="d-flex comment-input">
                <input
                  className="form-control comment-input-control"
                  value={commentInput}
                  onChange={(e) =>
                    this.setState({ commentInput: e.target.value })
                  }
                  placeholder="Leave a comment"
                />
                <button
                  className="add-comment-btn"
                  onClick={this.handleAddComment}
                  disabled={commentInput.length === 0}
                >
                  Add
                </button>
              </div>
              <Scrollbar>
                <div className="comments-list">{this.renderComments()}</div>
              </Scrollbar>
            </section>
            <section className="note-activity-action">
              <div className="row">
                <div className="col-4">
                  {/* <button className="create-activity-btn">Create Activity</button> */}
                  {this.getLikeData(likedBy || [], likes || 0, id)}
                </div>
                <div className="col-4 text-center">
                  {/* {this.getLikeData(likedBy || [], likes || 0, id)} */}
                </div>
                <div className="col-4 text-right">
                  <FloaterButton
                    type="edit"
                    onClick={() =>
                      this.showSideNote(this.state.note.id, this.state.note)
                    }
                  />
                </div>
              </div>
            </section>
          </React.Fragment>
        )}
      </section>
    );
  }
}

function mapStateToProps(state) {
  return { sideNote: state.sideNote };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ showSideNote }, dispatch);
}

export const Note = connect(mapStateToProps, mapDispatchToProps)(NoteImpl);
