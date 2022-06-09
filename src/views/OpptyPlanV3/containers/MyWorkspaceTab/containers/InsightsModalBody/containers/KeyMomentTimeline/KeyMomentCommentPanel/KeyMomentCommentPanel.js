import React, { PureComponent } from 'react';
// import { Mention, MentionsInput } from 'react-mentions';
// import { getAllUsers } from '../../../../../../../../../util/promises/usercontrol_promise';
// import { getContactDetailsForOpptyPlan } from '../../../../../../../../../util/promises/opptyplan_promise';
import avatar from '../../../../../../../../../assets/images/avatar.png';
import { getAllCommentsWithCountForKM, createCardKeyMomentsComment, likeOrUnlikeKeyMomentComment, updateCardKeyMomentsComment } from '../../../../../../../../../util/promises/ai-promise';
import { getLoggedInUser, SanitizeUrl } from '../../../../../../../../../util/utils';
import { showAlert } from '../../../../../../../../../components/MessageModal/MessageModal';

export class KeyMomentCommentPanel extends PureComponent {
    state = {
        loadingComments: true,
        keyMomentComments: [],
        commentText: '',
        users: [],
        contacts: [],
        userAndContactUnion: []
    }

    componentDidMount() {
        this.getAllCommentsWithCountForKM(this.props.keyMomentId);
        // this.getUsersAndContacts();
    }

    async getAllCommentsWithCountForKM(keyMomentId) {
        const response = await getAllCommentsWithCountForKM(keyMomentId);
        if (response.data && response.data.kmCommentDetails.length > 0) {
            const keyMomentData = response.data.kmCommentDetails.filter(keymoment => keymoment.type !== 'coaching');
            this.setState({ loadingComments: false, keyMomentComments: response.data.kmCommentDetails }, () => this.props.setCommentCount(keyMomentData.length));
        } else {
            this.setState({ loadingComments: false });
        }
    }

    // getUsersAndContacts = () => {
    //     const getUsers = this.getUsers();
    //     const getContacts = this.getContactDetailsForOpptyPlan(this.props.opptyPlanId);
    //     Promise.all([getUsers, getContacts]).then(() => this.makeUnifiedMentionsList());
    // }

    // async getUsers() {
    //     const response = await getAllUsers();
    //     const users = response.data.map((item) => {
    //         const a = Object.assign({}, item);
    //         a.subType = 'user';
    //         return a;
    //     });
    //     this.setState({ users });
    // }

    // async getContactDetailsForOpptyPlan(opptyPlanId) {
    //     const response = await getContactDetailsForOpptyPlan(opptyPlanId);
    //     const contacts = response.data.contactDetailsForOpptyList.map((item) => {
    //         const a = Object.assign({}, item);
    //         a.subType = 'contact';
    //         return a;
    //     });
    //     this.setState({ contacts });
    // }

    // makeUnifiedMentionsList = () => {
    //     let userAndContactUnion = [];
    //     userAndContactUnion = userAndContactUnion.concat(this.state.users.map((user) => {
    //         return {
    //             display: user.username,
    //             id: `${user.userId.toString()} user`,
    //             email: user.email,
    //             role: user.role,
    //             pictureFile: user.pictureFile,
    //             type: 'user'
    //         };
    //     }));
    //     userAndContactUnion = userAndContactUnion.concat(this.state.contacts.map((contact) => {
    //         return {
    //             display: contact.name,
    //             id: `${contact.contactId.toString()} contact`,
    //             email: contact.email,
    //             role: contact.job_title,
    //             pictureFile: contact.picture,
    //             type: 'contact'
    //         };
    //     }));
    //     this.setState({ userAndContactUnion });
    // }

    handleCommentInput = (elem) => {
        this.setState({ commentText: elem.target.value });
    }

    handleKeyPress = (elem) => {
        if (elem.keyCode === 13) {
            this.handleAddComment();
        }
    }

    handleAddComment = () => {
        const keyMomentId = this.props.keyMomentId;
        const comment = this.state.commentText;
        const status = 'public';
        createCardKeyMomentsComment(keyMomentId, comment, status).then(() => {
            this.getAllCommentsWithCountForKM(this.props.keyMomentId);
            this.setState({ commentText: '' });
        }).catch(() => {
            showAlert('Something went wrong. Please try later', 'error');
            this.setState({ commentText: '' });
        });
    }

    // renderMentions = (id, display) => {
    //     return `@${display}`;
    // }

    // renderSuggestion = (entry) => {
    //     const unfocusedStyle = {
    //         padding: '5px 15px',
    //         borderBottom: 'rgba(0,0,0,0.15) solid 1px',
    //         backgroundColor: '#FFF'
    //     };
    //     const nameStyle = {
    //         fontWeight: 'bold',
    //         color: '#2C393F',
    //         fontFamily: 'Roboto-Bold'
    //     };
    //     const roleStyle = {
    //         fontSize: '12px',
    //         color: '#5F6C72'
    //     };
    //     const imageStyle = {
    //         marginRight: "0.5em",
    //         marginTop: "0.20em",
    //         borderRadius: "50%"
    //     };
    //     return (
    //         <div style={unfocusedStyle} className="d-flex justify-content-start">
    //             <div>
    //                 <img
    //                     style={imageStyle}
    //                     src={entry.pictureFile ? `tribyl/api/photo?location=${entry.pictureFile}` : avatar}
    //                     onError={(e) => { e.target.onerror = null; e.target.src = `${avatar}`; }}
    //                     title={`${entry.display}`}
    //                     onClick={this.showUserMenu}
    //                     width="35"
    //                     height="35" />
    //             </div>
    //             <div>
    //                 <div style={nameStyle}>{`${entry.display}`}</div>
    //                 <div style={roleStyle}>
    //                     {entry.type === 'contact' && <i className="material-icons" style={{ color: '#3B90E3' }}>fiber_manual_record</i>}
    //                     {`${entry.role ? entry.role : ''}`}
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    likeOrUnlikeKeyMomentComment = (likeOrUnlike, keyMomentCommentId) => {
        const userId = getLoggedInUser().userId;
        likeOrUnlikeKeyMomentComment(likeOrUnlike, keyMomentCommentId, userId).then(() => {
            this.getAllCommentsWithCountForKM(this.props.keyMomentId);
        }).catch(() => {
            showAlert('Something went wrong. Please try later', 'error');
        });
    }

    changeCommentShareStatus = (status, keyMomentCommentId) => {
        updateCardKeyMomentsComment(keyMomentCommentId, null, status).then(() => {
            this.getAllCommentsWithCountForKM(this.props.keyMomentId);
        }).catch(() => {
            showAlert('Something went wrong. Please try later', 'error');
        });
    }

    renderLikeUnlikeDetails = (likedBy, likes, keyMomentId) => {
        const likedBys = likedBy || [];
        const loggedInUserId = getLoggedInUser().userId;
        if (likedBys.filter(item => item.id === loggedInUserId).length > 0) {
            return (
                <p className="like-action liked" title={likedBys.length > 1 ? `You and ${likedBys.length - 1} other likes this` : 'You like this'}>
                    Likes ({likes || 0})&nbsp;
                    <i className="material-icons liker-unliker" role="button" onClick={() => this.likeOrUnlikeKeyMomentComment('unlike', keyMomentId)}>thumb_up</i>
                </p>
            );
        }
        return (
            <p className="like-action" title={likedBys.length > 0 ? (likedBys.length > 1 ? `${likedBys[0].name} and ${likedBys.length - 1} other likes this` : `${likedBys[0].name} likes this`) : ('')}> {/* eslint-disable-line */}
                Likes ({likes || 0})&nbsp;
                <i className="material-icons liker-unliker" role="button" onClick={() => this.likeOrUnlikeKeyMomentComment('like', keyMomentId)}>thumb_up</i>
            </p>
        );
    }

    renderCommentShareDetails = (status, keyMomentId) => {
        // const loggedInUserId = getLoggedInUser().userId;
        if (status === 'public') {
            return (
                <p className="share-action" title="Public">
                    Share&nbsp;
                    <i className="material-icons green" role="button" onClick={() => this.changeCommentShareStatus('private', keyMomentId)}>people</i>
                </p>
            );
        }
        return (
            <p className="share-action" title="Private">
                Share&nbsp;
                <i className="material-icons orange" role="button" onClick={() => this.changeCommentShareStatus('public', keyMomentId)}>person</i>
            </p>
        );
    }

    render() {
        const {
            commentText,
            // userAndContactUnion,
            keyMomentComments,
            loadingComments
        } = this.state;
        return (
            <section className="key-moment-comment-panel">
                <div className="d-flex">
                    <div style={{ flex: '1' }}>
                        {/* <MentionsInput
                            singleLine
                            value={commentText}
                            placeholder="Your comment..."
                            className="comment-input-field"
                            onChange={this.handleCommentInput}
                            displayTransform={this.renderMentions}>
                            <Mention
                                trigger="@"
                                appendSpaceOnAdd
                                renderSuggestion={this.renderSuggestion}
                                data={userAndContactUnion} />
                        </MentionsInput> */}
                        <input 
                            type="text" 
                            value={commentText} 
                            className="comment-input-field" 
                            placeholder="Your comment..."
                            onChange={e => this.handleCommentInput(e)}
                            onKeyUp={e => this.handleKeyPress(e)} />
                    </div>
                    <button className="add-comment-btn btn" onClick={this.handleAddComment} disabled={commentText.length === 0}>Add</button>
                </div>
                <section className="key-moments-comments-list">
                    {loadingComments ? ( // eslint-disable-line
                        <p className="key-moment-comment-patch text-center font-size-bold no-comments-found-text">Fetching comments...</p>
                    ) : (
                        keyMomentComments.length > 0 ? (
                            keyMomentComments.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)).filter(keymoment => keymoment.type !== 'coaching').map((item, key) => {
                                return (
                                <div className="key-moment-comment-patch" key={key}>
                                    <div className="d-flex align-items-center">
                                        <img className="profile-img" src={item.author.pictureFile ? `tribyl/api/photo?location=${SanitizeUrl(item.author.pictureFile)}` : avatar} onError={(e) => { e.target.onerror = null; e.target.src = `${avatar}`; }} />
                                        <div>
                                            <p className="font-weight-bold">{`${item.author.firstName || item.author.name || ''} ${item.author.lastName || ''}`}</p>
                                            <p className="comment-date-label">{new Date(item.dateCreated).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p className="comment-text">{item.commentText}</p>
                                    <div className="comment-actions d-flex justify-content-between align-items-center">
                                        {this.renderLikeUnlikeDetails(item.likedBy, item.likes, item.kmCommentId)}
                                        {this.renderCommentShareDetails(item.status, item.kmCommentId)}
                                    </div>
                                </div>
                            );
                        })
                        ) : (
                            <p className="key-moment-comment-patch text-center font-size-bold no-comments-found-text">No comments yet</p>
                        )
                    )}
                </section>
            </section>
        );
    }
}
