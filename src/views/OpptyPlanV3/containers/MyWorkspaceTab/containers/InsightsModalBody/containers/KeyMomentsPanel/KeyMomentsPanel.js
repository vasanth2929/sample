// import Scrollbar from 'perfect-scrollbar-react';
import moment from 'moment';
import 'perfect-scrollbar-react/dist/style.min.css';
import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { hideModal } from '../../../../../../../../action/modalActions';
import { showAlert } from '../../../../../../../../components/MessageModal/MessageModal';
import { DealCardsKeyMomentsModel } from '../../../../../../../../model/dealCardsModels/DealCardsModel';
import { StoryBoardCardModel } from '../../../../../../../../model/storyboardModels/StoryBoardCardModel';
import { removeKeyMomentText } from '../../../../../../../../util/promises/ai_promise';
import { getContactsForAccount, getKeyMomentsForCardForOpptyPOrStoryforsubtypes, likeOrUnlikeKeyMoments } from '../../../../../../../../util/promises/dealcards_promise';
import { createOrUpdateOpptyPlanCardDetailContextProtip } from '../../../../../../../../util/promises/opptyplan_promise';
import { getAccountTeam } from '../../../../../../../../util/promises/storyboard_promise';
import { ConversationTimeline } from '../ConversationTimeline/ConversationTimeline';
// import { KeyMomentTimeline } from '../KeyMomentTimeline/KeyMomentTimeline';
import { OptyPlanModel } from './../../../../../../../../model/opptyPlanModels/OpptyPlanModels';
import { getLoggedInUser } from './../../../../../../../../util/utils';
import './styles/KeyMomentsPanel.styles.scss';

class KeyMomentsPanelImpl extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cardId: props.cardId,
            them: [],
            us: [],
            accountTeam: [],
            selectedUs: null,
            accountContacts: [],
            selectedThem: null,
            loadingKeyMoments: true,
            distinctConversations: []
        };
    }

    componentDidMount() {
        this.getAccountTeam();
        this.getContactsForAccount();
        this.getKeyMomentsForCard(this.state.cardId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.cardId !== this.props.cardId) {
            this.setState({ cardId: nextProps.cardId }, () => this.getKeyMomentsForCard(this.state.cardId));
        }
    }

    getKeyMomentsForCard = async () => {
        const { opptyPlanId, storyId, cardId } = this.props;
        const res = await getKeyMomentsForCardForOpptyPOrStoryforsubtypes(cardId, ['machine_generated', 'context'], opptyPlanId, storyId);
        if (!res.data.keyMomentsDetails) {
            this.setState({ loadingKeyMoments: false, KEY_MOMENTS_NOT_FOUND: true });
            return;
        }
        const keyMoments = res.data.keyMomentsDetails.flat().map((pt) => {
            pt.createdBy = (() => {
                if (pt.createdBy && pt.createdBy.name) return pt.createdBy;
                if (pt.lastUpdatedBy && pt.lastUpdatedBy.name) return pt.lastUpdatedBy;
                if (pt.userName) return { name: pt.userName };
                return {};
            })();
            pt.timestamp = (() => {
                if (pt.keyMomentCreateTimestamp) return new Date(pt.keyMomentCreateTimestamp).toLocaleDateString();
                if (pt.effStartTime) return new Date(pt.effStartTime).toLocaleDateString();
                if (pt.protipTimestamp) return new Date(pt.protipTimestamp).toLocaleDateString();
                return '';
            })();
            pt.sortTimestamp = (() => {
                if (pt.keyMomentCreateTimestamp) return moment(pt.keyMomentCreateTimestamp).valueOf();
                if (pt.effStartTime) return moment(pt.effStartTime).valueOf();
                if (pt.protipTimestamp) return moment(pt.protipTimestamp).valueOf();
                return '';
            })();
            pt.text = (() => {
                if (pt.keyMomentsText) return typeof pt.keyMomentsText !== 'string' ? pt.keyMomentsText.join() : pt.keyMomentsText;
                if (pt.notes) return pt.notes;
                if (pt.storyTextProtip) return pt.storyTextProtip;
                return '';
            })();
            return pt;
        }).filter(pt => pt.text && pt.text.length > 0)
            .sort((a, b) => b.sortTimestamp - a.sortTimestamp); // eslint-disable-line
        const convDetails = keyMoments.map((item) => {
            return (
                {
                    conversationId: item.conversationId,
                    convCreateDate: item.convCreateDate,
                    convType: item.convType,
                    convTitle: item.convTitle,
                    convMeetingMetadataBean: item.convMeetingMetadataBean
                }
            );
        });
        const distinctConversations = Array.from(new Set(convDetails.map(c => c.conversationId))).map((item) => {
            return {
                conversationId: item,
                convCreateDate: convDetails.find(c => c.conversationId === item).convCreateDate,
                convType: convDetails.find(c => c.conversationId === item).convType,
                convTitle: convDetails.find(c => c.conversationId === item).convTitle,
                convMeetingMetadataBean: convDetails.find(c => c.conversationId === item).convMeetingMetadataBean
            };
        });
        this.setState({
            isDataLoading: false,
            loadingKeyMoments: false,
            keyMomentsDetails: keyMoments,
            distinctConversations
        });
    }
    async getAccountTeam() {
        const accountId = this.props.accountId;
        const response = await getAccountTeam(accountId);
        const accountTeam = (response.data || []).map(at => ({ ...at, value: at.userId, label: at.userName }));
        this.setState({ accountTeam });
    }
    async getContactsForAccount() {
        const accountId = this.props.accountId;
        const response = await getContactsForAccount(accountId);
        const accountContacts = (response.data || []).map(ac => ({ ...ac, value: ac.id, label: ac.name }));
        this.setState({ accountContacts });
    }
    handleKeyMomentsLikeOrUnlike = (type, keyMomentId, userId) => {
        likeOrUnlikeKeyMoments(type, keyMomentId, userId).then(() => {
            this.getKeyMomentsForCard(this.state.cardId);
        }).catch(() => {
            showAlert('Something went wrong! Please try again later.', 'error');
        });
    }

    handleKeyMomentHide = (keyMomentId) => {
        removeKeyMomentText(keyMomentId).then(() => {
            this.getKeyMomentsForCard(this.state.cardId);
        }).catch(() => {
            showAlert('Something went wrong! Please try again later.', 'error');
        });
    }

    handleKeyMomentSeeMore = (selectedKeyMomentId) => {
        const idList = this.props.keyMoments.map(item => item.cardKeyMomentsSummary.cardKeyMomentsId);
        this.props.handleKeyMomentSeeMore(selectedKeyMomentId, idList);
    }

    handleFilterChange = (value, key) => {
        this.setState({ [key]: value });
    }

    addContextFromKeyMoment = (context) => {
        const payload = {
            cardId: Number(this.props.cardId),
            context,
            opptyPlanId: Number(this.props.opptyPlanId),
            topicName: this.props.topicName,
            userId: getLoggedInUser().userId
        };
        createOrUpdateOpptyPlanCardDetailContextProtip(payload).then((res) => {
            OptyPlanModel.updateCardDetail({ ...this.props.card, ...res.data });
            hideModal();
        }).catch(() => {
            hideModal();
            showAlert('Something went wrong. Please try again later.', 'error');
        });
    }

    addProtipFromKeyMoment = (protip) => {
        const payload = {
            cardId: Number(this.props.cardId),
            protip,
            opptyPlanId: Number(this.props.opptyPlanId),
            topicName: this.props.topicName,
            userId: getLoggedInUser().userId
        };
        createOrUpdateOpptyPlanCardDetailContextProtip(payload).then((res) => {
            OptyPlanModel.updateCardDetail({ ...this.props.card, ...res.data });
            hideModal();
        }).catch(() => {
            hideModal();
            showAlert('Something went wrong. Please try again later.', 'error');
        });
    }

    likeOrUnlikeKeyMoments = (actionType, keyMomentId, loggedInUserId) => {
        likeOrUnlikeKeyMoments(actionType, keyMomentId, loggedInUserId).then(() => {
            this.getKeyMomentsForCard();
        }).catch(() => {
            showAlert('Something went wrong. Please try later.', 'error', () => StoryBoardCardModel.deleteAll());
        });
    }

    handleRemoveKeyMoment = (keyMomentId) => {
        removeKeyMomentText(keyMomentId).then(() => {
            this.getKeyMomentsForCard();
        }).catch(() => {
            showAlert('Something went wrong. Please try later.', 'error');
        });
    }

    render() {
        const {
            // viewType,
            modalType,
            cardId,
            storyId,
            opptyPlanId,
            // forStory,
            openStoryCardModal,
            openOpptyCardModal
        } = this.props;
        const {
            accountTeam,
            selectedUs,
            accountContacts,
            selectedThem,
            keyMomentsDetails,
            loadingKeyMoments,
            distinctConversations
        } = this.state;
        return (
            <React.Fragment>
                <div className="keymoments-filters-wrapper">
                    <div className="keymoments-filters">
                        <div className="filter-labels">
                            <label htmlFor="viewing-select" className="selectLabel margin-space">Stage</label>
                            <label className="selectLabel" style={{ marginRight: '17.5em' }}>Us</label>
                            <label className="selectLabel">Them</label>
                        </div>
                        <div className="filter-select">
                            <Select
                                id="stage-select"
                                clearable={false}
                                className="selectGroup margin-space-view"
                                name="stage-name"
                                value={{ label: "All", value: "All" }}
                                onChange={this.handleStageChange} // eslint-disable-line
                                options={[{ label: "All", value: "All" }]}
                            />
                            <div className="closed-period-label">Contains</div>
                            <Select
                                placeholder="Search users"
                                className="selectGroup margin-space-view"
                                options={accountTeam}
                                labelKey="userName"
                                valueKey="userId"
                                value={selectedUs}
                                onChange={e => this.handleFilterChange(e, 'selectedUs')} // eslint-disable-line
                            />
                            <div className="closed-period-label">and</div>
                            <Select
                                placeholder="Search contacts"
                                id="them"
                                className="selectGroup"
                                clearable={false}
                                labelKey="name"
                                valueKey="id"
                                value={selectedThem}
                                onChange={e => this.handleFilterChange(e, 'selectedThem')} // eslint-disable-line
                                options={accountContacts}
                            />
                            {/* {!forStory &&
                                <div className="show-hidden-wrapper" role="button" onClick={this.showUnverifiedCards}>
                                    <i className="material-icons">visibility</i>
                                    <span className="show-hidden-label">Show Hidden</span>
                                </div>} */}
                        </div>

                    </div>
                </div>
                <section className="key-moments-timeline-panel">
                    {loadingKeyMoments && <p className="font-weight-bold text-center">Loading Conversations...</p>}
                    {
                        !loadingKeyMoments && distinctConversations.length === 0 &&
                        <p className="font-weight-bold text-center">No Conversations Found</p>
                    }
                    {distinctConversations.length > 0 &&
                        <ConversationTimeline
                            conversations={distinctConversations}
                            cardId={cardId}
                            keyMomentsDetails={keyMomentsDetails}
                            userId={getLoggedInUser().userId}
                            storyId={storyId}
                            opptyPlanId={opptyPlanId}
                            modalType={modalType}
                            openStoryCardModal={openStoryCardModal}
                            openOpptyCardModal={openOpptyCardModal} />}
                </section>
                {/* <section className="key-moments-timeline-panel">
                    {loadingKeyMoments && <p className="font-weight-bold text-center">Loading Key Moments...</p>}
                    {
                        !loadingKeyMoments && !keyMomentsDetails &&
                        <p className="font-weight-bold text-center">No Key Moments Found</p>
                    }
                    {
                        keyMomentsDetails &&
                        keyMomentsDetails
                            .sort((a, b) => new Date(b.effStartTime || b.keyMomentCreateTimestamp || b.protipTimestamp) - new Date(a.effStartTime || a.keyMomentCreateTimestamp || a.protipTimestamp))
                            .map((km, index) => {
                                if (viewType === 'SIDEBAR' && index > 2) return null;
                                return (
                                    <div className="key-moment-tile-container">
                                        <KeyMomentTimeline
                                            cardId={this.props.cardId}
                                            keyMomentId={km.cardKeyMomentsSummary ? km.cardKeyMomentsSummary.cardKeyMomentsId : km.id}
                                            type={km.keyMomentType}
                                            createdBy={km.createdBy && km.createdBy.name}
                                            convCreationDate={km.timestamp}
                                            keyMomentTitle={km.convTitle || ''}
                                            keyMomentsText={km.text}
                                            likes={km.likes || 0}
                                            likedBy={km.likedBy || []}
                                            sharingStatus={km.sharingStatus}
                                            isSideBar={this.props.isSideBar}
                                            viewType={viewType}
                                            modalType={modalType}
                                            coachingKeyMoments={(km.cardKeyMomentsCommentBeans && km.cardKeyMomentsCommentBeans.filter(keymoment => keymoment.type === 'coaching')) || []}
                                            keyMomentComments={(km.cardKeyMomentsCommentBeans && km.cardKeyMomentsCommentBeans.filter(keymoment => keymoment.type !== 'coaching')) || []}
                                            userId={getLoggedInUser().userId}
                                            subType={km.subtype}
                                            opptyPlanId={this.props.opptyPlanId}
                                            storyId={this.props.storyId}
                                            parentViewName={km.cardKeyMomentsSummary}
                                            likeOrUnlikeKeyMoments={this.likeOrUnlikeKeyMoments}
                                            handleRemoveKeyMoment={this.handleRemoveKeyMoment}
                                            changeKeyMomentShareStatus={this.changeKeyMomentShareStatus}
                                            handleKmSubtypeChange={() => this.getKeyMomentsForCard(this.state.cardId)} />
                                    </div>
                                );
                            })
                    }
                </section> */}
            </React.Fragment>
        );
    }
}

function mapStateToProps() {
    return { keyMoments: DealCardsKeyMomentsModel.list().map(item => item.props) };
}

export const KeyMomentsPanel = connect(mapStateToProps)(KeyMomentsPanelImpl);
