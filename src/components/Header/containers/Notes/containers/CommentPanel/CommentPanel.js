import React, { PureComponent } from 'react';
import avatar from '../../../../../../assets/images/avatar.png';
import './styles/CommentPanel.style.scss';
import { getLoggedInUser, SanitizeUrl } from '../../../../../../util/utils';
import { likeOrUnlikeNoteComment } from '../../../../../../util/promises/opptyplan_promise';
import { showAlert } from '../../../../../MessageModal/MessageModal';

export class CommentPanel extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { comment: props.comment };
    }

    getProfilePicture = (userBean) => {
        let profileImage;
        try {
            profileImage = (userBean.pictureFile === '' || userBean.pictureFile === null) ? `${avatar}` : `tribyl/api/photo?location=${SanitizeUrl(userBean.pictureFile)}`;
        } catch (error) {
            profileImage = `${avatar}`;
        }
        return profileImage;
    }

    getLikeData = (likedBy, likes, commentId) => {
        const loggedInUserId = getLoggedInUser().userId;
        if (likedBy.filter(item => item.id === loggedInUserId).length > 0) {
            return (
                <p className="like-unlike-label liked" title={likedBy.length > 1 ? `You and ${likedBy.length - 1} other likes this` : 'You like this'}>
                    Likes({likes})&nbsp;
                    <i className="material-icons liker-unliker" role="button" onClick={() => this.likeOrUnlikeNoteComment(commentId, loggedInUserId, 'unlike')}>thumb_up</i>
                </p>
            );
        }
        return (
            <p className="like-unlike-label" title={likedBy.length > 0 ? (likedBy.length > 1 ? `${likedBy[0].name} and ${likedBy.length - 1} other likes this` : `${likedBy[0].name} likes this`) : ('')}> {/* eslint-disable-line */}
                Likes({likes})&nbsp;
                <i className="material-icons liker-unliker" role="button" onClick={() => this.likeOrUnlikeNoteComment(commentId, loggedInUserId, 'like')}>thumb_up</i>
            </p>
        );
    }

    likeOrUnlikeNoteComment = (commentId, userId, likeOrUnlike) => {
        likeOrUnlikeNoteComment(commentId, userId, likeOrUnlike).then((res) => {
            this.setState({ comment: res.data });
        }).catch(() => showAlert('Something went wrong. Please try again later,', 'error'));
    }

    timeSince = (commentTime) => {
        const now = new Date();
        const timeStamp = new Date(commentTime);
        const secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
        if (secondsPast < 60) {
          return 'Just now';
        }
        if (secondsPast < 3600) {
            const secondsAgo = Math.round(Number(secondsPast / 60));
            return (secondsAgo === 1 ? `${secondsAgo} minute ago` : `${secondsAgo} minutes ago`);
        }
        if (secondsPast <= 86400) {
            const hoursAgo = Math.round(Number(secondsPast / 3600));
            return (hoursAgo === 1 ? `${hoursAgo} hour ago` : `${hoursAgo} hours ago`);
        }
        if (secondsPast > 86400) {
            const day = timeStamp.getDate();
            const month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
            const year = timeStamp.getFullYear() === now.getFullYear() ? "" : " " + timeStamp.getFullYear();
            return day + " " + month + year;
        }
        return '';
    }

    render() {
        const {
            commentText,
            insertTime,
            userBean,
            id,
            likedBy,
            likes
        } = this.state.comment;
        return (
            <section className="comment-panel-section">
                <div className="d-flex">
                    <img src={this.getProfilePicture(userBean)} width="36" height="36" title={userBean.name} onError={(e) => { e.target.onerror = null; e.target.src = `${avatar}`; }} />
                    <div>
                        <p className="user-name">{userBean.name}</p>
                        <p className="comment-time">{this.timeSince(insertTime)}</p>
                    </div>
                </div>   
                <p className="comment-text">{commentText}</p>
                {this.getLikeData(likedBy || [], likes || 0, id)}
            </section>
        );
    }
}
