import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import phone from '../../../../../../../../assets/iconsV2/phone.svg';
import { showAlert } from '../../../../../../../../components/MessageModal/MessageModal';
import { showCustomModal } from '../../../../../../../../components/CustomModal/CustomModal';
import { updateCardKeyMoments } from '../../../../../../../../util/promises/dealcards_promise';
import { getLoggedInUser } from './../../../../../../../../util/utils';
import { KeyMomentCommentPanel } from './KeyMomentCommentPanel/KeyMomentCommentPanel';
import './styles/KeyMomentTimeline.style.scss';
import { TranscriptBox } from './TranscriptBox/TranscriptBox';

export class KeyMomentTimeline extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      showContextMenu: false,
      selectedString: '',
      showComments: false,
      keyMomentCommentsCount:
        props.keyMomentComments && props.keyMomentComments.length
          ? props.keyMomentComments.length
          : 0,
      showFullText: false,
      seeMoreLabel: 'See more',
      optionsOpen: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.keyMomentComments !== nextProps.keyMomentComments) {
      this.setState({
        keyMomentCommentsCount:
          nextProps.keyMomentComments && nextProps.keyMomentComments.length
            ? nextProps.keyMomentComments.length
            : 0,
      });
    }
  }

  componentDidMount() {
    document.body.addEventListener('click', this.outsideClickEventListener);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.outsideClickEventListener);
  }

  outsideClickEventListener = (e) => {
    const { keyMomentId } = this.props;
    const className = e.target.className;
    if (!className.includes(keyMomentId.toString())) {
      this.setState({ optionsOpen: false });
    }
  };

  setCommentCount = (keyMomentCommentsCount) => {
    this.setState({ keyMomentCommentsCount });
  };

  getTypeIcon = (type) => {
    switch (type) {
      case 'call':
        return <img className="call" src={phone} />;
      case 'interview':
        return 'record_voice_over';
      case 'email':
        return 'email';
      default:
        return 'description';
    }
  };

  handleSeeMoreClick = () => {
    const {
      userId,
      keyMomentId,
      cardId,
      conversationId,
      subType,
      convType,
      opptyPlanId,
      storyId,
      modalType,
    } = this.props;
    showCustomModal(
      <h3 className="font-weight-bold">
        View{' '}
        {convType === 'call'
          ? 'Transcript'
          : convType === 'email'
          ? 'Email'
          : 'Document'}
      </h3>,
      <TranscriptBox
        keyMomentId={keyMomentId}
        conversationId={conversationId}
        cardId={cardId}
        userId={userId}
        subType={subType}
        modalType={modalType}
        opptyPlanId={opptyPlanId}
        storyId={storyId}
      />,
      'transcript-window-modal'
    );
  };

  handleCommentsView = () => {
    this.setState({ showComments: !this.state.showComments });
  };

  handleSeeMore = () => {
    const { showFullText } = this.state;
    this.setState({
      showFullText: !showFullText,
      seeMoreLabel: showFullText ? 'See more' : 'See less',
    });
  };

  renderLikeUnlikeDetails = (likedBy, likes, keyMomentId, type) => {
    const loggedInUserId = getLoggedInUser().userId;

    if (likedBy.filter((item) => item.id === loggedInUserId).length > 0) {
      return (
        <p
          className="like-action liked"
          title={
            likedBy.length > 1
              ? `You and ${likedBy.length - 1} other likes this`
              : 'You like this'
          }
        >
          Likes ({likes})&nbsp;
          {
            <i
              className="material-icons liker-unliker"
              role="button"
              onClick={() =>
                this.props.likeOrUnlikeKeyMoments(
                  'unlike',
                  keyMomentId,
                  loggedInUserId,
                  type
                )
              }
            >
              thumb_up
            </i>
          }
        </p>
      );
    }
    return (
      <p
        className="like-action"
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
        Likes ({likes})&nbsp;
        {
          <i
            className="material-icons liker-unliker"
            role="button"
            onClick={() =>
              this.props.likeOrUnlikeKeyMoments(
                'like',
                keyMomentId,
                loggedInUserId,
                type
              )
            }
          >
            thumb_up
          </i>
        }
      </p>
    );
  };

  handleKmSubtypeChange = (subType, cardKeyMomentId) => {
    this.setState({ optionsOpen: false });
    const payload = {
      cardKeyMomentId,
      subType,
      shareStatus: subType === 'context' ? 'team' : 'public',
    };
    updateCardKeyMoments(payload)
      .then(() => {
        this.props.handleKmSubtypeChange();
      })
      .catch(() => {
        showAlert('Something went wrong', 'error');
      });
  };

  render() {
    const { showComments, showFullText, seeMoreLabel, optionsOpen } =
      this.state;
    const {
      keyMomentId,
      type,
      convType,
      keyMomentTitle,
      keyMomentsText,
      createdBy,
      convCreationDate,
      likedBy,
      likes,
      sharingStatus,
      viewType,
      // isSideBar,
      isStories,
      // keyMomentComments,
      conversationId,
      cardId,
      parentViewName,
      coachingKeyMoments,
      isEditNotesEnabled,
      subType,
    } = this.props;
    const style = !showFullText
      ? { height: type === 'context' || type === 'protip' ? '90px' : '45px' }
      : {};
    const characterCounts = {
      SIDEBAR: type === 'protip' || type === 'context' ? 230 : 110,
      MODAL: type === 'protip' || type === 'context' ? 510 : 240,
    };
    return (
      <section className="key-moment-timeline-card-opty">
        <div className="item">
          <div className="key-moment-header d-flex justify-content-between align-items-center">
            <div className="keymoment-header-wrapper">
              <div className="image">
                {<i className="material-icons">{this.getTypeIcon(convType)}</i>}
                <p className="stage-number">{createdBy}</p>
                <p className="date">{convCreationDate}</p>
              </div>
              {isEditNotesEnabled && (type === 'protip' || type === 'context') && (
                <div className="header-actions" role="button">
                  <div className="option">
                    <span
                      role="button"
                      onClick={() => this.props.saveNoteSection(keyMomentId)}
                    >
                      Save
                    </span>
                  </div>
                  <div
                    className="option"
                    role="button"
                    onClick={(state) =>
                      this.setState({
                        isEditNotesEnabled: !state.isEditNotesEnabled,
                      })
                    }
                  >
                    <span role="button">Cancel</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="details">
            <div className={!isEditNotesEnabled && 'detail-box'}>
              <div className="data-section">
                {type !== 'protip' && type !== 'context' && (
                  <p className="key-moment-card-title">
                    <div>{keyMomentTitle}</div>
                    {!isStories &&
                      type !== 'protip' &&
                      type !== 'context' &&
                      type !== 'deal' && (
                        <div
                          className="see-more-button"
                          role="button"
                          onClick={() =>
                            this.handleSeeMoreClick(
                              keyMomentId,
                              conversationId,
                              cardId
                            )
                          }
                        >
                          <i className="material-icons">open_in_new</i>
                        </div>
                      )}
                  </p>
                )}
                {!isEditNotesEnabled ? (
                  <div
                    className="key-moment-card-content-section"
                    style={style}
                  >
                    {showFullText
                      ? keyMomentsText
                      : `${
                          keyMomentsText
                            ? keyMomentsText.slice(0, characterCounts[viewType])
                            : ''
                        }`}
                    {keyMomentsText.length > characterCounts[viewType] && (
                      <button className="see-more" onClick={this.handleSeeMore}>
                        ...{seeMoreLabel}
                      </button>
                    )}
                  </div>
                ) : (
                  <textarea
                    rows="4"
                    id="context-input"
                    className="form-control"
                    value={this.props.editNoteText}
                    onChange={(e) => this.props.editNoteInput(e.target.value)}
                  />
                )}
                {(coachingKeyMoments || '').length > 0 &&
                  coachingKeyMoments.map((item) => (
                    <div className="coaching-key-moments">
                      {item.commentText}
                    </div>
                  ))}
              </div>
              {type === 'protip' || type === 'context' ? (
                <div className="footer-section">
                  <div className="keymoment-actions row align-items-center">
                    <div className="col-7 left-actions">
                      <div style={{ marginLeft: '5px' }}>
                        {!isEditNotesEnabled &&
                          this.renderLikeUnlikeDetails(
                            likedBy,
                            likes,
                            keyMomentId,
                            type
                          )}
                      </div>
                    </div>
                    <div className="col-5 right-actions">
                      {!isEditNotesEnabled && (
                        <div
                          className={`keymoment-options keymoment-options-wrapper ${keyMomentId} ${
                            optionsOpen ? 'active' : ''
                          }`}
                        >
                          <div
                            className={`keymoment-options keymoment-options-button ${keyMomentId}`}
                            role="button"
                            onClick={() =>
                              this.setState({ optionsOpen: !optionsOpen })
                            }
                          >
                            {!optionsOpen && (
                              <i
                                className={`keymoment-options material-icons ${keyMomentId}`}
                                role="presentation"
                                onClick={() =>
                                  this.setState({ optionsOpen: !optionsOpen })
                                }
                              >
                                more_vert
                              </i>
                            )}
                            {optionsOpen && (
                              <React.Fragment>
                                <i
                                  className={`keymoment-options active material-icons ${keyMomentId}`}
                                  role="presentation"
                                  onClick={() =>
                                    this.setState({ optionsOpen: !optionsOpen })
                                  }
                                >
                                  more_vert
                                </i>
                                <i
                                  className={`keymoment-options active-background material-icons ${keyMomentId}`}
                                  role="presentation"
                                  onClick={() =>
                                    this.setState({ optionsOpen: !optionsOpen })
                                  }
                                >
                                  more_vert
                                </i>
                              </React.Fragment>
                            )}
                          </div>
                          {optionsOpen && (
                            <div
                              className={`keymoment-options-menu ${keyMomentId}`}
                            >
                              <ul
                                className={`"keymoment-options ${keyMomentId}`}
                              >
                                {isEditNotesEnabled && (
                                  <li
                                    className={`"keymoment-options item ${keyMomentId}`}
                                    onClick={() =>
                                      this.props.editNotesSection(
                                        keyMomentId,
                                        keyMomentsText
                                      )
                                    }
                                  >
                                    Edit
                                  </li>
                                )}
                                <li
                                  className={`"keymoment-options item ${keyMomentId}`}
                                  onClick={() =>
                                    this.props.handleCardNoteDelete(
                                      keyMomentId
                                    ) &&
                                    this.setState((state) => ({
                                      optionsOpen: !state.optionsOpen,
                                    }))
                                  }
                                >
                                  Delete
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="footer-section">
                  <div className="keymoment-actions row align-items-center">
                    <div className="col-7 left-actions">
                      {subType !== 'machine_generated' ? (
                        <React.Fragment>
                          {!isStories &&
                            parentViewName !== 'protip' &&
                            parentViewName !== 'context' && (
                              <div style={{ paddingRight: '0' }}>
                                <p
                                  className="comments"
                                  onClick={this.handleCommentsView}
                                >
                                  Comments ({this.state.keyMomentCommentsCount}
                                  )&nbsp;
                                  <i className="material-icons">message</i>
                                  {!showComments && (
                                    <i className="material-icons">
                                      expand_more
                                    </i>
                                  )}
                                  {showComments && (
                                    <i className="material-icons">
                                      expand_less
                                    </i>
                                  )}
                                </p>
                              </div>
                            )}
                          <div>
                            {this.renderLikeUnlikeDetails(
                              likedBy,
                              likes,
                              keyMomentId
                            )}
                          </div>
                        </React.Fragment>
                      ) : (
                        <div className="mkm header-actions">
                          <span
                            className="option"
                            role="button"
                            onClick={() =>
                              this.handleKmSubtypeChange('context', keyMomentId)
                            }
                          >
                            Add to Insights
                          </span>
                          <span
                            className="option"
                            role="button"
                            onClick={() =>
                              this.handleKmSubtypeChange('protip', keyMomentId)
                            }
                          >
                            Add to Protips
                          </span>
                        </div>
                      )}
                    </div>
                    {!isStories &&
                      parentViewName !== 'protip' &&
                      parentViewName !== 'context' &&
                      viewType !== 'SIDEBAR' && (
                        <div className="col-5 right-actions">
                          <div>
                            {subType === 'machine_generated' && (
                              <p
                                className="hide-action"
                                onClick={() =>
                                  this.props.handleRemoveKeyMoment(keyMomentId)
                                }
                              >
                                Remove&nbsp;
                                <i className="material-icons">delete</i>
                              </p>
                            )}
                          </div>
                          {viewType !== 'SIDEBAR' &&
                            subType !== 'machine_generated' && (
                              <div
                                className={`keymoment-options keymoment-options-wrapper ${keyMomentId} ${
                                  optionsOpen ? 'active' : ''
                                }`}
                              >
                                <div
                                  className={`keymoment-options keymoment-options-button ${keyMomentId}`}
                                  role="button"
                                  onClick={() =>
                                    this.setState({ optionsOpen: !optionsOpen })
                                  }
                                >
                                  {!optionsOpen && (
                                    <i
                                      className={`keymoment-options material-icons ${keyMomentId}`}
                                      role="presentation"
                                      onClick={() =>
                                        this.setState({
                                          optionsOpen: !optionsOpen,
                                        })
                                      }
                                    >
                                      more_vert
                                    </i>
                                  )}
                                  {optionsOpen && (
                                    <React.Fragment>
                                      <i
                                        className={`keymoment-options active material-icons ${keyMomentId}`}
                                        role="presentation"
                                        onClick={() =>
                                          this.setState({
                                            optionsOpen: !optionsOpen,
                                          })
                                        }
                                      >
                                        more_vert
                                      </i>
                                      <i
                                        className={`keymoment-options active-background material-icons ${keyMomentId}`}
                                        role="presentation"
                                        onClick={() =>
                                          this.setState({
                                            optionsOpen: !optionsOpen,
                                          })
                                        }
                                      >
                                        more_vert
                                      </i>
                                    </React.Fragment>
                                  )}
                                </div>
                                {optionsOpen && (
                                  <div
                                    className={`keymoment-options-menu ${keyMomentId}`}
                                  >
                                    <ul
                                      className={`"keymoment-options ${keyMomentId}`}
                                    >
                                      {(type === 'context' ||
                                        type === 'protip') && (
                                        <li
                                          className={`"keymoment-options item ${keyMomentId}`}
                                          onClick={() =>
                                            this.handleKmSubtypeChange(
                                              'context',
                                              keyMomentId
                                            )
                                          }
                                        >
                                          Edit
                                        </li>
                                      )}
                                      {(type === 'context' ||
                                        type === 'protip') && (
                                        <li
                                          className={`"keymoment-options item ${keyMomentId}`}
                                          onClick={() =>
                                            this.handleKmSubtypeChange(
                                              'context',
                                              keyMomentId
                                            )
                                          }
                                        >
                                          Delete
                                        </li>
                                      )}
                                      {subType !== 'context' && (
                                        <li
                                          className={`"keymoment-options item ${keyMomentId}`}
                                          onClick={() =>
                                            this.handleKmSubtypeChange(
                                              'context',
                                              keyMomentId
                                            )
                                          }
                                        >
                                          Change to Insight
                                        </li>
                                      )}
                                      {subType !== 'protip' && (
                                        <li
                                          className={`"keymoment-options item ${keyMomentId}`}
                                          onClick={() =>
                                            this.handleKmSubtypeChange(
                                              'protip',
                                              keyMomentId
                                            )
                                          }
                                        >
                                          Change to Protip
                                        </li>
                                      )}
                                      {subType !== 'machine_generated' && (
                                        <li
                                          className={`"keymoment-options item ${keyMomentId}`}
                                          onClick={() =>
                                            this.props.changeKeyMomentShareStatus(
                                              keyMomentId,
                                              sharingStatus
                                            ) &&
                                            this.setState({
                                              optionsOpen: false,
                                            })
                                          }
                                        >
                                          <span className={`${keyMomentId}`}>
                                            Share Status
                                          </span>
                                          <i
                                            role="presentation"
                                            title={
                                              sharingStatus === 'team'
                                                ? 'Team'
                                                : 'Public'
                                            }
                                            className={`keymoment-options material-icons ${keyMomentId} ${
                                              sharingStatus === 'team'
                                                ? 'orange'
                                                : 'green'
                                            }`}
                                          >
                                            {sharingStatus === 'team'
                                              ? 'group'
                                              : 'group_add'}
                                          </i>
                                        </li>
                                      )}
                                      <li
                                        className={`"keymoment-options item ${keyMomentId}`}
                                        onClick={() =>
                                          this.setState(
                                            {
                                              optionsOpen: false,
                                              showComments: false,
                                            },
                                            () =>
                                              this.props.handleRemoveKeyMoment(
                                                keyMomentId
                                              )
                                          )
                                        }
                                      >
                                        <span
                                          className={`"keymoment-options-label item-label ${keyMomentId}`}
                                        >
                                          Remove
                                        </span>
                                        <i
                                          className={`keymoment-options material-icons ${keyMomentId}`}
                                          role="presentation"
                                        >
                                          delete
                                        </i>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                      )}
                  </div>
                </div>
              )}
              {showComments && (
                <div
                  className={`key-moment-comments-panel ${
                    showComments ? 'expanded' : 'collapsed'
                  }`}
                >
                  <KeyMomentCommentPanel
                    opptyPlanId={this.props.opptyPlanId}
                    keyMomentId={keyMomentId}
                    setCommentCount={this.setCommentCount}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

KeyMomentTimeline.propTypes = {
  type: PropTypes.string,
  stage: PropTypes.number,
  date: PropTypes.string,
  keyMoment: PropTypes.string,
  likes: PropTypes.number,
  iliked: PropTypes.bool,
  comments: PropTypes.number,
  handleKeyMomentHide: PropTypes.func,
  handleKeyMomentSeeMore: PropTypes.func,
  handleKmSubtypeChange: PropTypes.func,
};

KeyMomentTimeline.defaultProps = {
  type: 'mail',
  stage: 1,
  date: 'Jan 01, 2019',
  keyMoment: 'Sample text for key moments',
  likes: 0,
  iliked: false,
  comments: 0,
  handleKeyMomentHide: () => {},
  handleKmSubtypeChange: () => {},
};
