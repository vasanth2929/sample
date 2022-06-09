import React, { PureComponent } from 'react';
import { getLoggedInUser, getDevUserId } from './../../../../../../util/utils';
// import { Post } from '../../_lib/Post/Post';
// import './CardNote.scss';
import { KeyMoment } from '../../_lib/KeyMoment/KeyMoment';
import {
  likeOrUnlikeKeyMoments,
  updateCardKeyMoments,
} from '../../../../../../util/promises/dealcards_promise';
import { showAlert } from '../../../../../../components/ComponentModal/ComponentModal';
import { showCustomModal } from '../../../../../../components/CustomModal/CustomModal';
import { TranscriptBox } from '../../containers/InsightsModalBody/containers/KeyMomentTimeline/TranscriptBox/TranscriptBox';
import { removeKeyMomentText } from '../../../../../../util/promises/ai_promise';

export class CardKeyMoment extends PureComponent {
  constructor(props) {
    super(props);
    const { comments, cardKeyMoment } = this.props;
    const userId = getLoggedInUser().userId || 19;
    this.state = {
      editMode: false,
      seeMore: false,
      optionsOpen: false,
      sharingStatus: cardKeyMoment.sharingStatus,
      keyMomentCommentsCount: comments && comments.length ? comments.length : 0,
      likes: cardKeyMoment.likes || 0,
      isLikedByUser: !!(
        cardKeyMoment.likedBy &&
        cardKeyMoment.likedBy.find((item) => item.id === userId)
      ),
    };
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

  likeCardKeyMoment = () => {
    const { keyMomentId, handleUpdate } = this.props;
    const loggedInUserId = getLoggedInUser().userId || 19;
    this.setState(
      (prevState) => ({
        isLikedByUser: true,
        likes: prevState.likes + 1,
      }),
      () => {
        likeOrUnlikeKeyMoments('like', keyMomentId, loggedInUserId)
          .then(() => {
            return handleUpdate && handleUpdate();
          })
          .catch(() => {
            showAlert('Something went wrong. Please try later.', 'error');
          });
      }
    );
  };

  unlikeCardKeyMoment = () => {
    const { keyMomentId, handleUpdate } = this.props;
    const loggedInUserId = getLoggedInUser().userId || 19;
    this.setState(
      (prevState) => ({
        isLikedByUser: false,
        likes: prevState.likes - 1 < 0 ? prevState.likes : prevState.likes - 1,
      }),
      () => {
        likeOrUnlikeKeyMoments('unlike', keyMomentId, loggedInUserId)
          .then(() => {
            return handleUpdate && handleUpdate();
          })
          .catch(() => {
            showAlert('Something went wrong. Please try later.', 'error');
          });
      }
    );
  };

  deleteKeyMoment = () => {
    const { keyMomentId, handleUpdate } = this.props;
    this.setState({ optionsOpen: false });
    removeKeyMomentText(keyMomentId)
      .then(() => {
        return handleUpdate && handleUpdate();
      })
      .catch(() =>
        showAlert('Something went wrong. Please try again later,', 'error')
      );
    return handleUpdate && handleUpdate(keyMomentId);
  };

  updateShareStatus = () => {
    const { keyMomentId, handleUpdate } = this.props;
    const { sharingStatus } = this.state;
    const payload = {
      cardKeyMomentId: keyMomentId,
      shareStatus: sharingStatus === 'team' ? 'public' : 'team',
    };
    this.setState(
      (prevState) => ({
        sharingStatus: prevState.sharingStatus === 'team' ? 'public' : 'team',
      }),
      () => {
        updateCardKeyMoments(payload)
          .then(() => {
            return handleUpdate && handleUpdate();
          })
          .catch(() => {
            showAlert('Something went wrong. Please try later.', 'error');
          });
      }
    );
  };

  moveToInsights = () => {
    const { keyMomentId, type, handleUpdate } = this.props;
    this.setState({ optionsOpen: false });
    const payload = {
      cardKeyMomentId: keyMomentId,
      subType: 'context',
      shareStatus: type === 'context' ? 'team' : 'public',
    };
    updateCardKeyMoments(payload)
      .then(() => {
        return handleUpdate && handleUpdate();
      })
      .catch(() => {
        showAlert('Something went wrong', 'error');
      });
  };

  moveToProtips = () => {
    const { keyMomentId, type, handleUpdate } = this.props;
    this.setState({ optionsOpen: false });
    const payload = {
      cardKeyMomentId: keyMomentId,
      subType: 'protip',
      shareStatus: type === 'context' ? 'team' : 'public',
    };
    updateCardKeyMoments(payload)
      .then(() => {
        return handleUpdate && handleUpdate();
      })
      .catch(() => {
        showAlert('Something went wrong', 'error');
      });
  };

  viewTranscript = () => {
    const { keyMomentId, cardId, type, opptyPlanId, handleUpdate, convType } =
      this.props;
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
        cardId={cardId}
        userId={getLoggedInUser().userId || getDevUserId()}
        subType={type}
        opptyPlanId={opptyPlanId}
      />,
      'transcript-window-modal',
      () => {
        return handleUpdate && handleUpdate();
      }
    );
  };

  render() {
    const {
      editMode,
      seeMore,
      showComments,
      optionsOpen,
      likes,
      isLikedByUser,
      sharingStatus,
      keyMomentCommentsCount,
    } = this.state;
    const {
      keyMomentId,
      type, // subtype
      convType,
      keyMomentTitle,
      keyMomentsText,
      comments,
      coachingComments,
      createdBy,
      convCreationDate,
      charCount,
      opptyPlanId,
      handleUpdate,
    } = this.props;
    return (
      <KeyMoment
        id={keyMomentId}
        type={type}
        convType={convType}
        text={keyMomentsText}
        title={keyMomentTitle}
        likes={likes}
        tips={coachingComments}
        isLikedByUser={isLikedByUser}
        username={createdBy}
        timestamp={convCreationDate}
        editMode={editMode}
        seeMore={seeMore}
        optionsOpen={optionsOpen}
        commentsCount={keyMomentCommentsCount}
        comments={comments}
        sharingStatus={sharingStatus}
        showComments={showComments}
        opptyPlanId={opptyPlanId}
        minCharCount={charCount}
        likeKeyMoment={this.likeCardKeyMoment}
        unlikeKeyMoment={this.unlikeCardKeyMoment}
        deleteKeyMoment={this.deleteKeyMoment}
        updateShareStatus={this.updateShareStatus}
        moveToInsights={this.moveToInsights}
        moveToProtips={this.moveToProtips}
        viewTranscript={this.viewTranscript}
        handleUpdate={handleUpdate}
        handleAddComment={this.setCommentCount}
        toggleSeeMore={() =>
          this.setState((state) => ({ seeMore: !state.seeMore }))
        }
        toggleOptions={() =>
          this.setState((state) => ({ optionsOpen: !state.optionsOpen }))
        }
        toggleComments={() =>
          this.setState((prevState) => ({
            showComments: !prevState.showComments,
          }))
        }
      />
    );
  }
}
