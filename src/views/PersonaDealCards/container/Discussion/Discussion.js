import React from 'react';
import liked from '../../../../assets/images/ic_liked.png';
import like from '../../../../assets/images/ic_like.png';

export class Discussion extends React.PureComponent {
    constructor(props) {
        super(props);
        this.userData = localStorage.getItem('user');
        if (this.userData) {
            this.userData = JSON.parse(this.userData);
        } else {
            this.userData = {
                username: 'system',
                role: 'system role',
                userId: 1
            }; 
        }
        this.commentBody = React.createRef();
    }

    componentDidMount() {
        this.insertFormattedNote();
    }

    componentDidUpdate(prevProps) {
        if (this.props.discussion && (prevProps.discussion !== this.props.discussion)) { 
            this.insertFormattedNote();
        }
    } 

    getLikers = (likedBys) => {
        const likedBysSorted = likedBys && likedBys.sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt));
        const likeCount = likedBysSorted && likedBysSorted.length;
        if (likeCount === 1) {
            return `${likedBysSorted[0].firstName} likes this`;
        } else if (likeCount > 1) {
            return `${likedBysSorted[0].firstName} & ${likeCount - 1} ${likeCount === 2 ? 'other' : 'others'} like this`;
        } else { // eslint-disable-line
            return "0 likes";
        }
    }

    getLikeLabel = (likedBys) => {
        const likedBysSorted = likedBys && likedBys.sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt));
        const likeCount = likedBysSorted && likedBysSorted.length;
        if (likeCount === 1) {
            return <span className="likers" title={`${likedBysSorted[0].firstName} likes this`}>{likeCount}</span>;
        } else if (likeCount > 1) {
            return <span className="likers" title={`${likedBysSorted[0].firstName} & ${likeCount - 1} ${likeCount === 2 ? 'other' : 'others'} like this`}>{likeCount}</span>;
        } else { // eslint-disable-line
            return <span className="likers" title="0 likes">0</span>;
        }
    }

    insertFormattedNote() {
        let formattedNote = this.props.discussion.replace(/@\[/gi, '<span style="color:blue">@');
        formattedNote = formattedNote.replace(/\]\([0-9]+ (contact|user)\)/gi, '</span>');
        this.commentBody.current.innerHTML = formattedNote;
    }

    render() {
        const { 
            commentId,
            author, 
            handleDateFormat, 
            discussion, 
            likedBy,
            handleLikeOrUnlike
        } = this.props;
        const iLiked = likedBy && likedBy.find(item => item.id === this.userData.userId);
        return (
            <div className="comment-section">
                <div className="comment-context clearfix">
                    <p className="name float-left">{author}</p>
                    <p className="date float-right">{handleDateFormat}</p>
                </div>
                <p ref={this.commentBody} className="comment">{discussion}</p>
                {/* ...<span className="see-more-label">see more</span> */}
                {iLiked ? (
                    <img
                        onClick={() => handleLikeOrUnlike('unlike', commentId, this.userData.userId)}
                        className="thumb-btn unlike-btn"
                        title={this.getLikers(likedBy)}
                        src={liked} />
                ) : (<img
                        onClick={() => handleLikeOrUnlike('like', commentId, this.userData.userId)}
                        className="thumb-btn like-btn"
                        title={this.getLikers(likedBy)}
                        src={like} />)}
                {this.getLikeLabel(likedBy)}
            </div>
        );
    }
}
