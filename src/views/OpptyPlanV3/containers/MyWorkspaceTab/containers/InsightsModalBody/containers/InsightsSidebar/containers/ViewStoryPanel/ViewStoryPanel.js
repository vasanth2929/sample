import FileSaver from 'file-saver';
import React, { PureComponent } from 'react';
import { showAlert as showComponentModal } from '../../../../../../../../../../components/ComponentModal/ComponentModal';
import { showAlert } from '../../../../../../../../../../components/MessageModal/MessageModal';
import { showCustomModal } from '../../../../../../../../../../components/CustomModal/CustomModal';
import {
  getKeyMomentsForCardForOpptyPOrStoryforsubtype,
  likeOrUnlikeKeyMoments,
} from '../../../../../../../../../../util/promises/dealcards_promise';
import { downloadPdfFile } from '../../../../../../../../../../util/promises/tearsheet_promise';
import { KeyMomentsList } from '../../../../../../../../../DealSummary/containers/KeyMomentsList/KeyMomentsList';
import { TearsheetModalTab } from '../../../../../../../StoriesTab/containers/TearSheetModal/TearSheet';
import { KeyMomentTimeline } from '../../../KeyMomentTimeline/KeyMomentTimeline';
import { PitchPlayer } from '../../../PitchPlayer/PitchPlayer';
import './styles/ViewStoryPanel.style.scss';
import { addReferencedStoryViewCount } from '../../../../../../../../../../util/promises/opptyplan_promise';
import { SanitizeUrl } from '../../../../../../../../../../util/utils';

export class ViewStoryPanel extends PureComponent {
  state = {
    keyMomentsDetails: [],
    selectedKeyMomentIndex: 0,
    loadingKeyMoments: true,
  };
  componentDidMount() {
    this.getKeyMomentsForCardForOpptyPOrStoryforsubtype();
  }
  async getKeyMomentsForCardForOpptyPOrStoryforsubtype() {
    const {
      cardId,
      story: { id },
    } = this.props;
    const subtype = 'context';
    const response = await getKeyMomentsForCardForOpptyPOrStoryforsubtype(
      cardId,
      subtype,
      false,
      id
    );
    if (response.data && response.data.keyMomentsDetails) {
      this.setState({
        loadingKeyMoments: false,
        keyMomentsDetails: response.data.keyMomentsDetails,
      });
    } else {
      this.setState({ loadingKeyMoments: false });
    }
  }
  getShareStatus = (shareStatus) => {
    switch (shareStatus) {
      default:
        return (
          <p className="story-share-status">
            <i className="material-icons">public</i>&nbsp;Public
          </p>
        );
      case 'share-internal':
        return (
          <p className="story-share-status">
            <i className="material-icons">person</i>&nbsp;Internal
          </p>
        );
      case 'share-external-restricted':
        return (
          <p className="story-share-status">
            <i className="material-icons">people</i>&nbsp;Limited
          </p>
        );
    }
  };

  getPitchVideo = (videoFile) => {
    if (videoFile) {
      return (
        <p
          className="story-pitch-video"
          onClick={() => this.showPitchVideo(videoFile)}
        >
          <i className="material-icons blue">play_circle_filled</i>&nbsp;Video
        </p>
      );
    }
    return (
      <p className="story-pitch-video-disabled">
        <i className="material-icons grey">play_circle_filled</i>&nbsp;Video
      </p>
    );
  };

  getCheckMark = (story) => {
    switch (story.cardTopicName) {
      default:
        return <div />;
      case 'Economic Drivers':
        if (story.compellingEvent === 'Y') {
          return (
            <div className="ce-dc-container">
              <i className="material-icons">check_box</i>Compelling event
            </div>
          );
        }
        return (
          <div className="ce-dc-container">
            <i className="material-icons">check_box_outline_blank</i>Compelling
            event
          </div>
        );
      case 'Pain Points':
      case 'Value Proposition':
      case 'Objections':
        if (story.decisionCriterion === 'Y') {
          return (
            <div className="ce-dc-container">
              <i className="material-icons">check_box</i>Decision criteria
            </div>
          );
        }
        return (
          <div className="ce-dc-container">
            <i className="material-icons">check_box_outline_blank</i>Decision
            criteria
          </div>
        );
    }
  };

  showPitchVideo = (videoFile) => {
    const pitchPlayerModal = (
      <PitchPlayer
        onLoadStart={(event) => (event.target.style.display = 'none')} // eslint-disable-line
        onCanPlay={(event) => (event.target.style.display = 'inline')} // eslint-disable-line
        pitchVideo={'tribyl/api/video?location=' + videoFile}
        onHide={() => {}}
      />
    );
    showComponentModal(
      'Elevator Pitch',
      pitchPlayerModal,
      'pitch-player-modal',
      () => {
        this.showDetailModal(false);
      }
    );
  };

  async downloadPdfFile(storyId, accountName, closeYear) {
    // const storyId = value;
    // const strFileName = 'tearsheet_' + storyId + '.pdf';
    const buyingCenter =
      document.getElementsByClassName('sub-view-name')[0].innerText;
    const strFileName = `${accountName}_${buyingCenter}_FY${closeYear}.pdf`
      .split(' ')
      .join('_');
    const download = await downloadPdfFile(storyId);
    const blob = new Blob([download.data], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blob, strFileName);
  }

  handleViewTearSheet = (story) => {
    const { opptyPlanId } = this.props;
    addReferencedStoryViewCount(opptyPlanId, story.id);
    showCustomModal(
      <div className="stories-tearsheet-header">
        <div className="stories-header">Case Study</div>
        <div
          className="primary"
          role="button"
          onClick={() =>
            this.downloadPdfFile(story.id, story.accountName, story.closeYear)
          }
        >
          <i className="material-icons">get_app</i>
          <div>Download</div>
        </div>
      </div>,
      <TearsheetModalTab storyId={story.id} accountId={story.accountId} />,
      'custom-tearsheet-modal'
    );
    // return (
    //     showCustomTearsheetModal(
    //         <div className="stories-tearsheet-header">
    //             <div className="stories-header">Case Study</div>
    //             <div className="primary" role="button" onClick={() => this.downloadPdfFile(story.id, story.accountName, story.closeYear)}>
    //                 <i className="material-icons">get_app</i>
    //                 <div>Download</div>
    //             </div>
    //         </div>,
    //         <TearsheetModalTab storyId={story.id} accountId={story.accountId} />,
    //         '',
    //         '',
    //         '',
    //         '',
    //         '1060px'
    //     )
    // );
  };

  likeOrUnlikeKeyMoments = (actionType, keyMomentId, loggedInUserId) => {
    likeOrUnlikeKeyMoments(actionType, keyMomentId, loggedInUserId)
      .then(() => {
        this.getKeyMomentsForCardForOpptyPOrStoryforsubtype();
      })
      .catch(() => {
        showAlert('Something went wrong. Please try later.', 'error');
      });
  };
  renderCardKeyMoments() {
    const { cardId, story } = this.props;
    return (
      <KeyMomentsList cardId={cardId} storyId={story.id} subType="context" />
    );
  }

  renderKeyMomentsList = () => {
    const { keyMomentsDetails, selectedKeyMomentIndex } = this.state;
    const { viewType } = this.props;
    const keyMomentDetail = keyMomentsDetails[selectedKeyMomentIndex];
    if (!keyMomentDetail) {
      return <div />;
    }
    return (
      <div className="key-moment-tiles-section">
        <div className="key-moment-tile-container">
          <KeyMomentTimeline
            keyMomentId={keyMomentDetail.cardKeyMomentsSummary.cardKeyMomentsId}
            type={keyMomentDetail.keyMomentType || 'call'}
            createdBy={keyMomentDetail.createdBy.name}
            convCreationDate={new Date(
              keyMomentDetail.convCreateDate
            ).toLocaleDateString()}
            keyMomentTitle={keyMomentDetail.convTitle || ''}
            keyMomentsText={keyMomentDetail.keyMomentsText.join()}
            likes={keyMomentDetail.likes || 0}
            likedBy={keyMomentDetail.likedBy || []}
            likeOrUnlikeKeyMoments={this.likeOrUnlikeKeyMoments}
            sharingStatus={keyMomentDetail.sharingStatus}
            isSideBar={this.props.isSideBar}
            isStories
            changeKeyMomentShareStatus={this.changeKeyMomentShareStatus}
            viewType={viewType}
            isDisable
            keyMomentComments={keyMomentDetail.cardKeyMomentsCommentBeans || []}
            opptyPlanId={this.props.opptyPlanId || ''}
          />
        </div>
        {keyMomentsDetails[selectedKeyMomentIndex + 1] && (
          <div className="key-moment-tile-container">
            <KeyMomentTimeline
              keyMomentId={
                keyMomentsDetails[selectedKeyMomentIndex + 1]
                  .cardKeyMomentsSummary.cardKeyMomentsId
              }
              type={
                keyMomentsDetails[selectedKeyMomentIndex + 1].keyMomentType ||
                'call'
              }
              createdBy={
                keyMomentsDetails[selectedKeyMomentIndex + 1].createdBy.name
              }
              convCreationDate={new Date(
                keyMomentsDetails[selectedKeyMomentIndex + 1].convCreateDate
              ).toLocaleDateString()}
              keyMomentTitle={
                keyMomentsDetails[selectedKeyMomentIndex + 1].convTitle || ''
              }
              keyMomentsText={keyMomentsDetails[
                selectedKeyMomentIndex + 1
              ].keyMomentsText.join()}
              likes={keyMomentsDetails[selectedKeyMomentIndex + 1].likes || 0}
              likedBy={
                keyMomentsDetails[selectedKeyMomentIndex + 1].likedBy || []
              }
              likeOrUnlikeKeyMoments={this.likeOrUnlikeKeyMoments}
              isStories
              sharingStatus={
                keyMomentsDetails[selectedKeyMomentIndex + 1].sharingStatus
              }
              changeKeyMomentShareStatus={this.changeKeyMomentShareStatus}
              isSideBar={this.props.isSideBar}
              viewType={viewType}
              isDisable
              keyMomentComments={
                keyMomentsDetails[selectedKeyMomentIndex + 1]
                  .cardKeyMomentsCommentBeans || []
              }
              opptyPlanId={this.props.opptyPlanId || ''}
            />
          </div>
        )}
      </div>
    );
  };

  render() {
    const { handleBackButton, story, modalView, opptyPlanId } = this.props;
    return (
      <section
        className="view-story-panel insights-panel"
        style={{ marginTop: modalView ? '15px' : '0px' }}
      >
        <div className="main-action-container">
          <p>
            <i
              className="material-icons"
              onClick={handleBackButton}
              role="button"
            >
              arrow_back
            </i>
            &nbsp;Back to Stories
          </p>
        </div>

        <div className="row story-tile-header">
          <div className="col-3 account-logo-container">
            {story.accountIcon ? (
              <img
                src={`tribyl/api/photo?location=${SanitizeUrl(
                  story.accountIcon
                )}`}
                alt="Account"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${accountImage}`;
                }}
              />
            ) : (
              <img src={accountImage} />
            )}
          </div>
          <div className="story-details-container">
            <p className="story-account-name">{story.accountName}</p>
            <div className="story-status-and-amount">
              {story.oppStatus === 'closed-won' && (
                <div className="account-opp-status green">
                  <span className="oppStatusLabel">Won</span>
                </div>
              )}
              {story.oppStatus === 'no-decision' && (
                <div className="account-opp-status orange">
                  <span className="oppStatusLabel">No Decision</span>
                </div>
              )}
              {story.oppStatus === 'closed-lost' && (
                <div className="account-opp-status red">
                  <span className="oppStatusLabel">Lost</span>
                </div>
              )}
              <p className="story-fiscal-range">{`${story.closeQtr} - ${story.closeYear}`}</p>
            </div>
            <p className="story-opp-amount">{`${
              story.opportunityAmount
                ? Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  }).format(story.opportunityAmount)
                : '$0'
            }`}</p>
            {this.getCheckMark(story)}
          </div>
          <div className="story-actions-container">
            {this.getShareStatus(story.shareStatus)}
            {this.getPitchVideo(story.videoFile)}
            <p
              className="story-tearsheet"
              onClick={() => this.handleViewTearSheet(story, opptyPlanId)}
            >
              <i className="material-icons blue">insert_drive_file</i>
              &nbsp;Tearsheet
            </p>
          </div>
        </div>
        <div className="story-info-container">
          <div className="context-protip-container">
            <p className="context-protip-title">Context</p>
            <p className="context-protip-text">{story.cardContext}</p>
          </div>
        </div>
        <div
          className={`insights-body ${
            this.props.isSideBar && 'insights-body-sidebar'
          }`}
        >
          {!this.state.loadingKeyMoments ? (
            this.state.keyMomentsDetails.length > 0 ? (
              this.renderKeyMomentsList()
            ) : (
              <div className="font-weight-bold text-center">
                No Key Moments Found
              </div>
            )
          ) : (
            <div className="text-center">Loading Key Moments </div>
          )}{' '}
          {/* eslint-disable-line */}
        </div>
      </section>
    );
  }
}
