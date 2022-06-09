import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { bindActionCreators } from 'redux';
import { getAllProtipForCard, deleteOpptyPlanCardNote, updateOpptyPlanCardNote, likeOrUnlikeNote } from '../../../../../../../../util/promises/opptyplan_promise';
import { getAllKeyMomentsForCard, createOpptyPlanCardNote, likeOrUnlikeKeyMoments, updateCardKeyMoments } from '../../../../../../../../util/promises/dealcards_promise';
import { UtilModel } from '../../../../../../../../model/UtilModel';
import { getLoggedInUser } from '../../../../../../../../util/utils';
import { KeyMomentTimeline } from '../KeyMomentTimeline/KeyMomentTimeline';
import '../InsightsPanel/styles/insightsPanel.style.scss';
import './styles/ProtipPanel.style.scss';
import { showAlert } from '../../../../../../../../components/MessageModal/MessageModal';
import { marshallNoteOrProtip } from '../../util/keymoments.util';
import { removeKeyMomentText } from '../../../../../../../../util/promises/ai_promise';
import { OpptyPlanCardModel } from '../../../../../../../../model/opptyPlanModels/OpptyPlanCardModel';
import { OptyPlanModel } from '../../../../../../../../model/opptyPlanModels/OpptyPlanModels';

export class ProtipPanelImpl extends React.PureComponent {
    state = {
        isDataLoading: true,
        cardData: null,
        loadingKeyMoments: true,
        keyMomentsDetails: [],
        selectedKeyMomentIndex: 0
    }

    componentDidMount() {
        this.getProtips();
    }

    componentDidUpdate(prevProps) {
        const { isPersonaCard } = this.props;
        if (!isPersonaCard && (prevProps.card !== this.props.card ||
            (this.props.reloadOpptySidebar && !prevProps.reloadOpptySidebar))) {
            this.getProtips();
            UtilModel.updateData({ reloadOpptySidebar: false });
        } else if (isPersonaCard && (prevProps.card.opptyPCardDetailContactRelId !== this.props.card.opptyPCardDetailContactRelId ||
            (this.props.reloadOpptySidebar && !prevProps.reloadOpptySidebar))) {
            this.getProtips();
            UtilModel.updateData({ reloadOpptySidebar: false });
        }
    }

    getProtips = async () => {
        const { card } = this.props;
        const { cardId } = card;
        // const subtype = 'protip';
        // const type = 'protip';
        const response = await Promise.all([
            getAllKeyMomentsForCard(cardId),
            getAllProtipForCard(cardId),
        ]);
        const keyMoments = response[0].data.keyMomentsDetails || [];
        const cardNotes = response[1].data || [];
        // const storyProtips = response[2].data || [];
        const protips = [
            keyMoments,
            cardNotes,
            // storyProtips
        ].flat()
            .map(marshallNoteOrProtip)
            .filter(pt => pt.text && pt.text.length > 0)
            .sort((a, b) => b.sortTimestamp - a.sortTimestamp);
        this.setState({
            isDataLoading: false,
            loadingKeyMoments: false,
            keyMomentsDetails: protips,
            editCommentId: null,
            editNoteText: ''
        });
    }

    handleProtipChange = (e) => {
        this.setState({ notes: e.target.value });
    }

    handleSeeMoreProtipsClick = (e) => {
        e.stopPropagation();
        UtilModel.updateData({ showOpptyInsightsModal: true });
    }
    handleCardNoteDelete = (opptyPlanCardNoteId) => {
        this.setState({ loadingKeyMoments: true });
        deleteOpptyPlanCardNote(opptyPlanCardNoteId)
            .then(() => this.getProtips())
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
            type: 'protip',
        };
        updateOpptyPlanCardNote(payload).then(() => {
            this.getProtips();
        }).catch(() => {
            this.setState({ loadingKeyMoments: false, editCommentId: null });
            showAlert('Something went wrong. Please try later.', 'error');
        });
    }
    likeOrUnlikeKeyMoments = (actionType, keyMomentId, loggedInUserId, type) => {
        if (type === 'protip') {
            likeOrUnlikeNote(keyMomentId, loggedInUserId, actionType, 'oppty_plan_card_notes').then(() => {
                this.getProtips();
            }).catch(() => showAlert('Something went wrong. Please try again later,', 'error'));
        } else {
            likeOrUnlikeKeyMoments(actionType, keyMomentId, loggedInUserId).then(() => {
                this.getProtips();
            }).catch(() => {
                showAlert('Something went wrong. Please try later.', 'error');
            });
        }
    }

    handleRemoveKeyMoment = (keyMomentId) => {
        removeKeyMomentText(keyMomentId).then(() => {
            this.getProtips();
        }).catch(() => {
            showAlert('Something went wrong. Please try later.', 'error');
        });
    }

    changeKeyMomentShareStatus = (keyMomentId, sharingStatus) => {
        const payload = {
            cardKeyMomentId: Number(keyMomentId),
            shareStatus: sharingStatus === 'team' ? 'public' : 'team'
        };
        updateCardKeyMoments(payload).then(() => {
            this.getProtips();
        }).catch(() => {
            showAlert('Something went wrong. Please try later.', 'error');
        });
    }

    // createOpptyPlanCardNotes = async () => {
    //     const {
    //         card: { cardId },
    //         opptyPlanId,
    //     } = this.props;
    //     const { notes } = this.state;
    //     const type = 'protip';
    //     const usersId = getLoggedInUser().userId || 19;
    //     const payload = {
    //         cardId,
    //         opptyPlanId: typeof opptyPlanId === 'string' ? parseInt(opptyPlanId) : opptyPlanId,  // eslint-disable-line
    //         type,
    //         usersId,
    //         notes
    //     };
    //     this.setState({ isDataLoading: true, loadingKeyMoments: true, notes: null });
    //     await createOpptyPlanCardNote(payload);
    //     this.getProtips();
    // }

    createOpptyPlanCardNotes = () => {
        const {
            card: { cardId },
            opptyPlanId,
        } = this.props;
        const { notes } = this.state;
        const type = 'protip';
        const usersId = getLoggedInUser().userId || 19;
        const payload = {
            cardId,
            opptyPlanId: typeof opptyPlanId === 'string' ? parseInt(opptyPlanId) : opptyPlanId,  // eslint-disable-line
            type,
            usersId,
            notes
        };
        const { selectedCard } = this.props;
        this.setState({ isDataLoading: true, loadingKeyMoments: true, notes: null });
        createOpptyPlanCardNote(payload).then((response) => {
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
            this.this.getProtips();
        });
    }

    renderKeyMomentsList = () => {
        const { keyMomentsDetails } = this.state;
        const { viewType } = this.props;
        return (
            <React.Fragment>
                <div className="key-moment-tiles-section">
                    {
                        keyMomentsDetails.map((km, index) => {
                            if (viewType === 'SIDEBAR' && index > 2) return null;
                            return (
                                <div className="key-moment-tile-container">
                                    <KeyMomentTimeline
                                        cardId={this.props.cardId}
                                        isKeyMoment={km.isKeyMoment}
                                        keyMomentId={km.cardKeyMomentsSummary ? km.cardKeyMomentsSummary.cardKeyMomentsId : km.id ? km.id : km.dealCardId}
                                        type={km.keyMomentType || km.type}
                                        convType={km.convType}
                                        createdBy={km.createdBy && km.createdBy.name}
                                        convCreationDate={km.timestamp}
                                        keyMomentTitle={km.convTitle || 'Protip'}
                                        keyMomentsText={km.text}
                                        likes={km.likes || 0}
                                        likedBy={km.likedBy || []}
                                        sharingStatus={km.sharingStatus}
                                        isSideBar={this.props.isSideBar}
                                        viewType={viewType}
                                        coachingKeyMoments={(km.cardKeyMomentsCommentBeans && km.cardKeyMomentsCommentBeans.filter(keymoment => keymoment.type === 'coaching')) || []}
                                        keyMomentComments={(km.cardKeyMomentsCommentBeans && km.cardKeyMomentsCommentBeans.filter(keymoment => keymoment.type !== 'coaching')) || []}
                                        userId={getLoggedInUser().userId}
                                        subType="protip"
                                        opptyPlanId={this.props.opptyPlanId}
                                        parentViewName={km.cardKeyMomentsSummary ? '' : 'protip'}
                                        likeOrUnlikeKeyMoments={this.likeOrUnlikeKeyMoments}
                                        handleRemoveKeyMoment={this.handleRemoveKeyMoment}
                                        handleCardNoteDelete={this.handleCardNoteDelete}
                                        editNotesSection={this.editNotesSection}
                                        isEditNotesEnabled={this.state.editCommentId === km.id}
                                        editNoteText={this.state.editNoteText}
                                        editNoteInput={this.editNoteInput}
                                        saveNoteSection={this.saveNoteSection}
                                        changeKeyMomentShareStatus={this.changeKeyMomentShareStatus}
                                        handleKmSubtypeChange={() => this.getProtips()} />
                                </div>
                            );
                        })
                    }
                </div>
                {viewType === 'SIDEBAR' && keyMomentsDetails.length > 3 && <button className="see-more-protips" onClick={this.handleSeeMoreProtipsClick}>See all&nbsp;<i className="material-icons">keyboard_arrow_right</i></button>}
            </React.Fragment>
        );
    }

    render() {
        const {
            loadingKeyMoments,
            keyMomentsDetails,
            notes
        } = this.state;
        const {
            isSideBar,
            viewType
        } = this.props;
        return (
            <section className="insights-panel">
                {viewType !== 'SIDEBAR' && (
                    <div className="add-protip">
                        <textarea rows="4" className="form-control protip-input" value={notes || ''} placeholder="Add Protip..." onChange={this.handleProtipChange} onKeyDown={e => e.keyCode === 13 && this.handleProtipChange(e)} />
                        <div className="form-options btn-controls text-right">
                            <button className="cancel btn" onClick={() => this.setState({ notes: null })}>Cancel</button>
                            <button className="btn save-btn" onClick={this.createOpptyPlanCardNotes}>Save</button>
                        </div>
                    </div>
                )}
                {loadingKeyMoments ? (
                    <p className="text-center font-weight-bold loading-text">Loading insights...</p>
                ) : (
                        <div className="insights-content" style={{ marginTop: '-1em', paddingBottom: viewType === 'SIDEBAR' ? '120px' : '1em' }}>
                            <div className={`insights-body ${isSideBar && 'insights-body-sidebar'}`}>
                                {
                                    keyMomentsDetails.length > 0 && (
                                        <React.Fragment>
                                            {this.renderKeyMomentsList()}
                                        </React.Fragment>
                                    )
                                }
                            </div>
                        </div>
                    )}
            </section>
        );
    }
}

function mapStateToProps(state) {
    const opptyCard = OpptyPlanCardModel.last() && OpptyPlanCardModel.last().props;
    return {
        selectedCard: opptyCard,
        cardInsightsField: state.form.optyCardInsights,
        reloadOpptySidebar: UtilModel.getValue('reloadOpptySidebar')
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateCardInsights: (model, value) => actions.change(`form.optyCardInsights.${model}`, value),
        setInitialValues: value => actions.change('form.optyCardInsights', value),
    }, dispatch);
}

export const ProtipPanel = connect(mapStateToProps, mapDispatchToProps)(ProtipPanelImpl);
