import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { actions, Control } from 'react-redux-form';
import { bindActionCreators } from 'redux';
import { showAlert } from '../../../../../../../../components/MessageModal/MessageModal';
import { OptyPlanModel } from '../../../../../../../../model/opptyPlanModels/OpptyPlanModels';
import { removeKeyMomentText } from '../../../../../../../../util/promises/ai_promise';
import { getKeyMomentsForCardForOpptyPOrStoryforsubtype, likeOrUnlikeKeyMoments, updateCardKeyMoments } from '../../../../../../../../util/promises/dealcards_promise';
import { createOpptyPlanCardNotes, createOrUpdateOpptyPlanCardDetailContextProtip, deleteOpptyPlanCardNote, getContextProtipForPersonaCardForOpptyP, getOpptyPCardDetailContextProtip, getOpptyPlanCardNotes, likeOrUnlikeNote, updateContextProtipForPersonaCardForOpptyP, updateOpptyPlanCardNote } from '../../../../../../../../util/promises/opptyplan_promise';
import { getLoggedInUser } from '../../../../../../../../util/utils';
import { marshallNoteOrProtip } from '../../util/keymoments.util';
import { KeyMomentTimeline } from '../KeyMomentTimeline/KeyMomentTimeline';
import { OpptyPlanCardModel } from './../../../../../../../../model/opptyPlanModels/OpptyPlanCardModel';
import { UtilModel } from './../../../../../../../../model/UtilModel';
import './styles/InsightsPanelV2.style.scss';

class InsightsPanelV2Impl extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isDataLoading: true,
            cardData: null,
            discoveryQuestionTextDisplay: '',
            loadingCardNotes: true,
            cardNotes: [],
            cardNoteInputText: '',
            loadingKeyMoments: true,
            keyMomentsDetails: [],
            discoveryQuestionUpdated: false,
        };
    }

    componentDidMount() {
        this.getInitialLoad();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.modalStatus !== nextProps.modalStatus) {
            this.getInitialLoad();
        }
    }

    componentDidUpdate(prevProps) {
        const { isPersonaCard } = this.props;
        if (!isPersonaCard && (prevProps.card !== this.props.card ||
            (this.props.reloadOpptySidebar && !prevProps.reloadOpptySidebar))) {
            this.getInitialLoad();
            UtilModel.updateData({ reloadOpptySidebar: false });
        } else if (isPersonaCard && (prevProps.card.opptyPCardDetailContactRelId !== this.props.card.opptyPCardDetailContactRelId ||
            (this.props.reloadOpptySidebar && !prevProps.reloadOpptySidebar))) {
            this.getInitialLoad();
            UtilModel.updateData({ reloadOpptySidebar: false });
        }
    }

    getInitialLoad = async () => {
        const { card, opptyPlanId, isPersonaCard } = this.props;
        const { cardId, } = card;
        const subtype = 'context';
        const type = 'context';
        const response = await Promise.all([
            this.getCardDetails(isPersonaCard, opptyPlanId, card, cardId),
            getKeyMomentsForCardForOpptyPOrStoryforsubtype(cardId, subtype, opptyPlanId),
            getOpptyPlanCardNotes(opptyPlanId, cardId, type),
        ]);
        const keyMoments = (response[1].data && response[1].data.keyMomentsDetails) || [];
        const cardNotes = response[2].data || [];
        const insights = [
            keyMoments,
            cardNotes
        ].flat().map(marshallNoteOrProtip)
            .filter(pt => pt.text && pt.text.length > 0)
            .sort((a, b) => b.sortTimestamp - a.sortTimestamp);
        this.setState({
            isDataLoading: false,
            loadingKeyMoments: false,
            keyMomentsDetails: insights,
            discoveryQuestionUpdated: false,
            editCommentId: null,
            editNoteText: ''
        });
    }

    async getCardDetails(isPersonaCard, opptyPlanId, card, cardId) {
        let resp;
        if (!isPersonaCard) {
            resp = await getOpptyPCardDetailContextProtip(opptyPlanId, cardId);
            const {
                context,
                protip,
                decisionCriteria,
                compellingEvent,
                file,
                url,
                products
            } = resp.data;
            let discoveryQuestions = resp.data.discoveryQuestions;
            if ((!discoveryQuestions || discoveryQuestions === '')) discoveryQuestions = card.cardDetails.discovery_questions;
            this.props.updateCardInsights('context', context || '');
            this.props.updateCardInsights('protip', protip || '');
            this.props.updateCardInsights('discoveryQuestions', discoveryQuestions || '');
            this.props.updateCardInsights('compellingEvent', compellingEvent === 'Y');
            this.props.updateCardInsights('decisionCriteria', decisionCriteria === 'Y');
            this.props.updateCardInsights('cardDetails.File', file || '');
            this.props.updateCardInsights('cardDetails.url', url || '');
            this.props.updateCardInsights('cardDetails.product', products || []);
        } else {
            try {
                resp = await getContextProtipForPersonaCardForOpptyP(card.opptyPCardDetailContactRelId);
                const {
                    context,
                    protip,
                } = resp.data;
                let discoveryQuestions = resp.data.discoveryQuestions;
                if (!discoveryQuestions || discoveryQuestions === '') discoveryQuestions = card.cardDetails.discovery_questions;
                this.props.updateCardInsights('context', context || '');
                this.props.updateCardInsights('discoveryQuestions', discoveryQuestions || '');
                this.props.updateCardInsights('protip', protip || '');
                this.setState({
                    cardData: {
                        ...this.state.cardData,
                        context,
                        protip,
                        talkingPoints: card.talkingPoints,
                        discoveryQuestions
                    }
                });
            } catch (error) {
                return error;
            }
        }
        let discoveryQuestions = this.state.cardData && this.state.cardData.discoveryQuestions;
        if (!discoveryQuestions || discoveryQuestions === '') {
            discoveryQuestions = card.cardDetails.discovery_questions;
        }
        return this.setState({ isDataLoading: false, discoveryQuestionTextDisplay: discoveryQuestions, cardData: { ...resp.data } });
    }

    handleNoteInput = (elem) => {
        this.setState({ cardNoteInputText: elem.target.value });
    }

    handleDqInput = (elem) => {
        this.setState({ discoveryQuestionTextDisplay: elem.target.value });
    }

    handleCardNoteSave = () => {
        this.setState({ loadingKeyMoments: true, cardNoteInputText: '' });
        const payload = {
            cardId: this.props.card.cardId,
            notes: this.state.cardNoteInputText,
            opptyPlanId: this.props.opptyPlanId,
            type: 'context',
            usersId: getLoggedInUser().userId
        };
        createOpptyPlanCardNotes(payload).then(() => {
            this.getInitialLoad();
        }).catch(() => {
            this.setState({ loadingKeyMoments: false, cardNoteInputText: '' });
            showAlert('Something went wrong. Please try later.', 'error');
        });
    }
    handleCardNoteDelete = (opptyPlanCardNoteId) => {
        this.setState({ loadingKeyMoments: true });
        deleteOpptyPlanCardNote(opptyPlanCardNoteId)
            .then(() => this.getInitialLoad())
            .catch(() => {
                this.setState({ loadingKeyMoments: false });
                showAlert('Something went wrong. Please try later.', 'error');
            });
    }
    editNotesSection = (editCommentId, editNoteText) => {
        this.setState({ editCommentId, editNoteText });
    }
    editNoteInput = (noteData) => {
        this.setState({ editNoteText: noteData });
    }
    saveNoteSection = (opptyPCardNoteId) => {
        const payload = {
            notes: this.state.editNoteText,
            opptyPCardNoteId,
            type: 'context',
        };
        updateOpptyPlanCardNote(payload).then(() => {
            this.getInitialLoad();
        }).catch(() => {
            this.setState({ loadingKeyMoments: false, editCommentId: null });
            showAlert('Something went wrong. Please try later.', 'error');
        });
    }
    handleSidebarExpansion = () => {
        UtilModel.updateData({ showOpptyInsightsModal: true });
    }

    changeCompellingEventDecisionCriteria = (type, isSideBar, val, opptyPlanId, cardId) => {
        let payload;
        if (type === 'CE') {
            payload = {
                cardId,
                opptyPlanId,
                compellingEvent: val
            };
        } else {
            payload = {
                cardId,
                opptyPlanId,
                decisionCriteria: val
            };
        }
        createOrUpdateOpptyPlanCardDetailContextProtip(payload).then(() => {
            this.getInitialLoad();
        }).catch(() => {
            showAlert('Something went wrong. Please try later.', 'error');
        });
    }

    handleSaveClick = () => {
        const { cardNoteInputText, discoveryQuestionUpdated } = this.state;
        const { card, opptyPlanId, isPersonaCard } = this.props;
        const { cardId } = card;
        if (cardNoteInputText.length > 0) {
            this.setState({ loadingKeyMoments: true, cardNoteInputText: '' });
            const payload = {
                cardId,
                notes: cardNoteInputText,
                opptyPlanId,
                type: 'context',
                usersId: getLoggedInUser().userId
            };
            const { selectedCard } = this.props;
            createOpptyPlanCardNotes(payload).then((response) => {
                OpptyPlanCardModel.updateCardDetails({
                    ...selectedCard,
                    enableVerifyActionForUser: response.data.enableVerifyForUser,
                    verifyCount: response.data.verifyCount
                });
                OptyPlanModel.updateCardDetail({
                    ...selectedCard,
                    enableVerifyActionForUser: response.data.enableVerifyForUser,
                    verifyCount: response.data.verifyCount
                });
                this.getInitialLoad();
            }).catch(() => {
                this.setState({ loadingKeyMoments: false, cardNoteInputText: '' });
                showAlert('Something went wrong. Please try later.', 'error');
            });
        }
        if (discoveryQuestionUpdated) {
            if (isPersonaCard) {
                const {
                    cardInsightsField,
                    card: { opptyPCardDetailContactRelId }
                } = this.props;
                const {
                    discoveryQuestions
                } = cardInsightsField;

                const payload = {
                    opptyPlanCardDetailPersonaContactRelId: opptyPCardDetailContactRelId,
                    userId: getLoggedInUser().userId,
                    discoveryQuestions,
                };
                this.setState({ isDataLoading: true });
                updateContextProtipForPersonaCardForOpptyP(payload).then(() => {
                    this.getInitialLoad();
                }).catch(() => {
                    this.setState({ isDataLoading: false, cardNoteInputText: '' });
                    showAlert('Something went wrong. Please try later.', 'error');
                });
            } else {
                const { discoveryQuestions } = this.props.cardInsightsField;
                const payload = {
                    cardId,
                    opptyPlanId,
                    discoveryQuestions
                };
                this.setState({ isDataLoading: true });
                createOrUpdateOpptyPlanCardDetailContextProtip(payload).then(() => {
                    this.getInitialLoad();
                }).catch(() => {
                    this.setState({ isDataLoading: false, cardNoteInputText: '' });
                    showAlert('Something went wrong. Please try later.', 'error');
                });
            }
        }
    }
    likeOrUnlikeKeyMoments = (actionType, keyMomentId, loggedInUserId, type) => {
        if (type === 'context') {
            likeOrUnlikeNote(keyMomentId, loggedInUserId, actionType, 'oppty_plan_card_notes').then(() => {
                this.getInitialLoad();
            }).catch(() => showAlert('Something went wrong. Please try again later,', 'error'));
        } else {
            likeOrUnlikeKeyMoments(actionType, keyMomentId, loggedInUserId).then(() => {
                this.getInitialLoad();
            }).catch(() => {
                showAlert('Something went wrong. Please try later.', 'error');
            });
        }
    }

    handleRemoveKeyMoment = (keyMomentId) => {
        this.setState({ loadingKeyMoments: true }, () => {
            removeKeyMomentText(keyMomentId).then(() => {
                this.getInitialLoad();
            }).catch(() => showAlert('Something went wrong. Please try again later,', 'error'));
        });
    }

    changeKeyMomentShareStatus = (keyMomentId, sharingStatus) => {
        const payload = {
            cardKeyMomentId: Number(keyMomentId),
            shareStatus: sharingStatus === 'team' ? 'public' : 'team'
        };
        updateCardKeyMoments(payload).then(() => {
            this.getInitialLoad();
        }).catch(() => {
            showAlert('Something went wrong. Please try later.', 'error');
        });
    }

    renderCeDcCheckBoxes = (card, cardData, isSideBar, opptyPlanId) => {
        if (card && card.topicName === 'Economic Drivers') {
            return (
                (cardData && cardData.compellingEvent === 'Y') && ''
            );
        } else if ((card && card.topicName === 'Value Proposition') || (card && card.topicName === 'Objections')) {
            return (
                (cardData && cardData.decisionCriteria === 'Y') ?
                    <div className="insights-top-wrapper">
                        <p className="compelling-decision-check">
                            <i className="material-icons active-check" onClick={() => this.changeCompellingEventDecisionCriteria('DC', isSideBar, 'N', opptyPlanId, card.cardId)} role="button">check_box</i>&nbsp;Decision Criterion
                        </p>
                    </div>
                    :
                    <div className="insights-top-wrapper">
                        <p className="compelling-decision-check">
                            <i className="material-icons inactive-check" onClick={() => this.changeCompellingEventDecisionCriteria('DC', isSideBar, 'Y', opptyPlanId, card.cardId)} role="button">check_box_outline_blank</i>&nbsp;Decision Criterion
                        </p>
                    </div>
            );
        } return <div />;
    }

    renderDiscoveryQuestions = (card, cardData, isSideBar) => {
        const { cardNoteInputText } = this.state;
        const discoveryQuestions = (cardData && cardData.discoveryQuestions && cardData.discoveryQuestions.length > 0) ? cardData.discoveryQuestions : ((card && card.cardDetails && card.cardDetails.discovery_questions && card.cardDetails.discovery_questions.length > 0 && card.cardDetails.discovery_questions[0]) || '');
        return (
            <section>
                <p className="heading">Discovery Questions </p>
                {isSideBar ? (
                    <React.Fragment>
                        <p className="description">
                            {discoveryQuestions}
                        </p>
                        <section className="card-notes-section">
                            <p className="heading">Notes</p>
                            <textarea rows="4" id="context-input" className="form-control" value={cardNoteInputText} onChange={e => this.handleNoteInput(e)} />
                            <div className="btn-controls text-right">
                                <button className="btn cancel-btn" onClick={() => this.setState({ cardNoteInputText: '' })}>Cancel</button>
                                <button className="btn save-btn" onClick={this.handleSaveClick}>Save</button>
                            </div>
                        </section>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <section className="update-dq-section">
                            <Control.textarea
                                rows="4"
                                id="discovery-questions-input"
                                className="form-control dq-textarea"
                                model="form.optyCardInsights.discoveryQuestions"
                                onChange={() => this.setState({ discoveryQuestionUpdated: true })} />
                        </section>
                        <section className="card-notes-section">
                            <p className="heading">Notes</p>
                            <textarea rows="4" id="context-input" className="form-control" value={cardNoteInputText} onChange={e => this.handleNoteInput(e)} />
                            <div className="btn-controls text-right">
                                <button className="btn cancel-btn" onClick={() => this.setState({ cardNoteInputText: '' })}>Cancel</button>
                                <button className="btn save-btn" onClick={this.handleSaveClick}>Save</button>
                            </div>
                        </section>
                    </React.Fragment>
                )}
            </section>
        );
    }

    renderNotesAndKeyMoments = () => {
        const { keyMomentsDetails } = this.state;
        const { viewType, isSideBar } = this.props;
        return (
            <React.Fragment>
                <div className="key-moment-tiles-section">
                    {
                        keyMomentsDetails
                            .sort((a, b) => new Date(b.effStartTime || b.keyMomentCreateTimestamp || b.protipTimestamp) - new Date(a.effStartTime || a.keyMomentCreateTimestamp || b.protipTimestamp))
                            .map((km, index) => {
                          if (isSideBar && index > 0) return null;
                                return (
                                    <div className="key-moment-tile-container">
                                        <KeyMomentTimeline
                                            cardId={this.props.card.cardId}
                                            keyMomentId={km.cardKeyMomentsSummary ? km.cardKeyMomentsSummary.cardKeyMomentsId : km.id}
                                            type={km.keyMomentType || km.type}
                                            convType={km.convType}
                                            createdBy={(km.createdBy && km.createdBy.name) || km.userName || '[Unknown]'}
                                            convCreationDate={km.timestamp}
                                            keyMomentTitle={km.convTitle || 'Insight'}
                                            keyMomentsText={km.text}
                                            likes={km.likes || 0}
                                            likedBy={km.likedBy || []}
                                            sharingStatus={km.sharingStatus}
                                            isSideBar={this.props.isSideBar}
                                            viewType={isSideBar ? 'SIDEBAR' : 'MODAL'}
                                            keyMomentComments={km.cardKeyMomentsCommentBeans || []}
                                            userId={getLoggedInUser().userId}
                                            subType="context"
                                            handleCardNoteDelete={this.handleCardNoteDelete}
                                            opptyPlanId={this.props.opptyPlanId}
                                            parentViewName={km.cardKeyMomentsSummary ? '' : 'context'}
                                            likeOrUnlikeKeyMoments={this.likeOrUnlikeKeyMoments}
                                            handleRemoveKeyMoment={this.handleRemoveKeyMoment}
                                            editNotesSection={this.editNotesSection}
                                            isEditNotesEnabled={this.state.editCommentId === km.id}
                                            editNoteText={this.state.editNoteText}
                                            editNoteInput={this.editNoteInput}
                                            saveNoteSection={this.saveNoteSection}
                                            changeKeyMomentShareStatus={this.changeKeyMomentShareStatus}
                                            handleKmSubtypeChange={() => this.getInitialLoad()} />
                                    </div>
                                );
                            })
                    }
                </div>
                {viewType === 'SIDEBAR' && keyMomentsDetails.length > 1 && <button className="see-more-protips" onClick={this.handleSidebarExpansion}>See all&nbsp;<i className="material-icons">keyboard_arrow_right</i></button>}
            </React.Fragment>
        );
    }

    render() {
        const {
            opptyPlanId,
            card,
            isSideBar,
            viewType
        } = this.props;
        const {
            isDataLoading,
            loadingKeyMoments,
            cardData,
            keyMomentsDetails
        } = this.state;
        return (
            <section className="insights-panel">
                {
                    isDataLoading ? (
                        <p className="text-center font-weight-bold loading-tex">Loading Insights...</p>
                    ) : (
                            <React.Fragment>
                                {this.renderCeDcCheckBoxes(card, cardData, isSideBar, opptyPlanId)}
                                {this.renderDiscoveryQuestions(card, cardData, isSideBar)}
                            </React.Fragment>
                        )
                }
                {
                    loadingKeyMoments ? (
                        <p className="text-center font-weight-bold loading-text">{isDataLoading ? '' : 'Loading insights...'}</p>
                    ) : (
                            <div className="insights-content" style={{ marginTop: '-1em', paddingBottom: viewType === 'SIDEBAR' ? '120px' : '1em' }}>
                                {
                                    keyMomentsDetails.length > 0 &&
                                    <div className={`insights-body ${isSideBar && 'insights-body-sidebar'}`}>
                                        {this.renderNotesAndKeyMoments()}
                                    </div>
                                }
                            </div>
                        )
                }
            </section>
        );
    }
}

function mapStateToProps(state) {
    const opptyCard = OpptyPlanCardModel.last() && OpptyPlanCardModel.last().props;
    return {
        selectedCard: opptyCard,
        cardInsightsField: state.form.optyCardInsights,
        reloadOpptySidebar: UtilModel.getValue('reloadOpptySidebar'),
        modalStatus: UtilModel.getValue('showOpptyInsightsModal')
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateCardInsights: (model, value) => actions.change(`form.optyCardInsights.${model}`, value),
        setInitialValues: value => actions.change('form.optyCardInsights', value),
    }, dispatch);
}

export const InsightsPanelV2 = connect(mapStateToProps, mapDispatchToProps)(InsightsPanelV2Impl);
