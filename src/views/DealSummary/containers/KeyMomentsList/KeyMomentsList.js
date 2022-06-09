// import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import './styles/KeyMomentsList.styles.scss';
import { getKeyMomentsForCardForOpptyPOrStoryforsubtype } from '../../../../util/promises/dealcards_promise';
import { CardKeyMoment } from '../../../OpptyPlanV3/containers/MyWorkspaceTab/_containers/CardKeyMoment/CardKeyMoment';
import { getOpptyPlanCardNotes } from '../../../../util/promises/opptyplan_promise';
import { marshallNoteOrProtip } from '../../../OpptyPlanV3/containers/MyWorkspaceTab/containers/InsightsModalBody/util/keymoments.util';

export class KeyMomentsList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            keyMomentsDetails: []
        };
    }

    componentWillMount() {
        this.getInsights();
    }

    componentDidUpdate(prevProps) {
        const { subType } = this.props;
        if (subType !== prevProps.subType) {
            this.setState({ keyMomentsDetails: [] });
            this.getInsights();
        }
    }

    getInsights = async () => {
        const { card, opptyPlanId } = this.props;
        const { cardId } = card;
        const subtype = 'context';
        const type = 'context';
        const response = await Promise.all([
            getKeyMomentsForCardForOpptyPOrStoryforsubtype(cardId, subtype, opptyPlanId),
            getOpptyPlanCardNotes(opptyPlanId, cardId, type),
        ]);
        const keyMoments = (response[0].data && response[0].data.keyMomentsDetails) || [];
        const cardNotes = response[1].data || [];
        const insights = [
            keyMoments,
            cardNotes
        ].flat().map(marshallNoteOrProtip)
            .filter(pt => pt.text && pt.text.length > 0)
            .sort((a, b) => b.sortTimestamp - a.sortTimestamp);
        this.setState({ keyMomentsDetails: insights });
    }

    render() {
        const {
            // cardId, 
            opptyPlanId,
        } = this.props;
        const {
            keyMomentsDetails
        } = this.state;
        return (
            (keyMomentsDetails && keyMomentsDetails.length > 0) &&
            <div className="key-moments-container">
                {
                    keyMomentsDetails.map((keyMomentDetail) => {
                        return (
                            <CardKeyMoment
                                charCount={210}
                                cardKeyMoment={keyMomentDetail}
                                keyMomentId={keyMomentDetail.cardKeyMomentsSummary ? keyMomentDetail.cardKeyMomentsSummary.cardKeyMomentsId : keyMomentDetail.id ? keyMomentDetail.id : keyMomentDetail.dealCardId}
                                type={keyMomentDetail.subtype}
                                createdBy={keyMomentDetail.createdBy && keyMomentDetail.createdBy.name}
                                convCreationDate={keyMomentDetail.timestamp}
                                keyMomentTitle={keyMomentDetail.convTitle || ''}
                                keyMomentsText={keyMomentDetail.text}
                                likes={keyMomentDetail.likes || 0}
                                likedBy={keyMomentDetail.likedBy || []}
                                comments={keyMomentDetail.cardKeyMomentsCommentBeans ? keyMomentDetail.cardKeyMomentsCommentBeans.filter(keymoment => keymoment.type !== 'coaching') : []}
                                coachingComments={(keyMomentDetail.cardKeyMomentsCommentBeans && keyMomentDetail.cardKeyMomentsCommentBeans.filter(keymoment => keymoment.type === 'coaching')) || []}
                                opptyPlanId={opptyPlanId}
                                handleUpdate={() => this.getInsights()} />

                            // <KeyMoment
                            // cardId={this.props.cardId}
                            // isKeyMoment={keyMomentDetail.isKeyMoment}
                            // keyMomentId={keyMomentDetail.cardKeyMomentsSummary.cardKeyMomentsId}
                            // type={keyMomentDetail.keyMomentType || 'call'}
                            // createdBy={keyMomentDetail.createdBy.name}
                            // convCreationDate={keyMomentDetail.convCreateDate 
                            //     ? new Date(keyMomentDetail.convCreateDate).toLocaleDateString() : ''}
                            // keyMomentTitle={keyMomentDetail.convTitle || ''}
                            // keyMomentsText={(keyMomentDetail.keyMomentsText && keyMomentDetail.keyMomentsText.join('')) || ''}
                            // likes={keyMomentDetail.likes || 0}
                            // likedBy={keyMomentDetail.likedBy || []}
                            // shareStatus={keyMomentDetail.shareStatus}
                            // isSideBar={this.props.isSideBar}
                            // keyMomentComments={keyMomentDetail.cardKeyMomentsCommentBeans || []}
                            // userId={getLoggedInUser().userId}
                            // subType={keyMomentDetail.subtype}
                            // opptyPlanId={this.props.opptyPlanId}
                            // parentViewName={keyMomentDetail.cardKeyMomentsSummary ? '' : 'protip'}
                            // likeOrUnlikeKeyMoments={this.likeOrUnlikeKeyMoments}
                            // reloadKeyMoments={this.getKeyMoments} />
                        );
                    })
                }
            </div>
        );
    }
}
