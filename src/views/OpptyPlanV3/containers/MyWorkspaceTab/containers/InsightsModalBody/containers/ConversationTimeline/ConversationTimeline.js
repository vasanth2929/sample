import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { showCustomModal } from '../../../../../../../../components/CustomModal/CustomModal';
import { TranscriptBox } from '../KeyMomentTimeline/TranscriptBox/TranscriptBox';
import { OpptyPlanCardModel } from './../../../../../../../../model/opptyPlanModels/OpptyPlanCardModel';
import { StoryBoardCardModel } from './../../../../../../../../model/storyboardModels/StoryBoardCardModel';
import { UtilModel } from './../../../../../../../../model/UtilModel';
import './styles/ConversationTimeline.style.scss';

class ConversationTimelineImpl extends PureComponent {
  getIcon = (convType) => {
    switch (convType) {
      case 'call':
        return 'local_phone';
      case 'interview':
        return 'record_voice_over';
      case 'email':
        return 'email';
      default:
        return 'description';
    }
  };

  handleSeeMoreClick = (conversationId, convType) => {
    StoryBoardCardModel.deleteAll();
    OpptyPlanCardModel.deleteAll();
    const { selectedStoryCard, selectedOpptyCard } = this.props;
    const {
      userId,
      keyMomentsDetails,
      cardId,
      opptyPlanId,
      storyId,
      modalType,
      openStoryCardModal,
      openOpptyCardModal,
    } = this.props;
    const convKeyMoments = keyMomentsDetails.filter(
      (item) => item.conversationId === conversationId
    );
    const keyMomentId =
      convKeyMoments[convKeyMoments.length - 1].cardKeyMomentsSummary
        .cardKeyMomentsId;
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
        subType="machine_generated"
        modalType={modalType}
        opptyPlanId={opptyPlanId}
        storyId={storyId}
      />,
      'transcript-window-modal',
      () => {
        if (openStoryCardModal) {
          new StoryBoardCardModel({
            ...selectedStoryCard,
            selectedIndex: 2,
          }).$save();
        } else if (openOpptyCardModal) {
          new OpptyPlanCardModel({
            ...selectedOpptyCard,
            selectedIndex: 4,
          }).$save();
          UtilModel.updateData({ showOpptyInsightsModal: true });
        } else {
          return false;
        }
      }
    );
  };

  render() {
    const { conversations, keyMomentsDetails } = this.props;
    return (
      <section className="conversation-timeline">
        <VerticalTimeline layout="1-column">
          {conversations.map((item) => (
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              // contentStyle={{ background: '#b0bec5', color: '#fff' }}
              contentArrowStyle={{ borderRight: '7px solid  #f7f7f7' }}
              date={
                <div className="date-section">
                  <p>{new Date(item.convCreateDate).toLocaleDateString()}</p>
                  <p>
                    <label>Stage:</label> N/A
                  </p>
                </div>
              }
              iconStyle={{ background: 'rgb(55, 141, 210)', color: '#fff' }}
              icon={
                <i className="material-icons" title={item.convType}>
                  {this.getIcon(item.convType)}
                </i>
              }
            >
              <div className="vertical-timeline-element-wrapper">
                <h3 className="vertical-timeline-element-title">
                  <span>{item.convTitle}</span>
                  <i
                    className="material-icons"
                    role="button"
                    onClick={() =>
                      this.handleSeeMoreClick(
                        item.conversationId,
                        item.convType
                      )
                    }
                  >
                    open_in_new
                  </i>
                </h3>
                <div className="detail-body">
                  {/* <p> <label>Participants:</label> {item.convMeetingMetadataBean.attendees && item.convMeetingMetadataBean.attendees.length > 0 && item.convMeetingMetadataBean.attendees.join().replace(/,/g, ', ')}</p> */}
                  <div className="d-flex justify-content-between">
                    <p>
                      <label>Matches:</label>{' '}
                      {
                        keyMomentsDetails.filter(
                          (conv) => conv.conversationId === item.conversationId
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>
              {/* {<KeymomentTimeline keyMoments={item.keyMoments || []} />} */}
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </section>
    );
  }
}

function mapStateToProps() {
  const selectedStoryCard = StoryBoardCardModel.last()
    ? StoryBoardCardModel.last().props
    : null;
  const selectedOpptyCard =
    OpptyPlanCardModel.last() && OpptyPlanCardModel.last().props;
  return {
    selectedStoryCard,
    selectedOpptyCard,
  };
}

export const ConversationTimeline = connect(mapStateToProps)(
  ConversationTimelineImpl
);
