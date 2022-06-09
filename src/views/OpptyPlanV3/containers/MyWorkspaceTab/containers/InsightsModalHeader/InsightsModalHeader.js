/* eslint-disable radix */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from 'react-redux-form';
import Select from 'react-select';
import { showAlert } from '../../../../../../components/MessageModal/MessageModal';
import { updateCardTitle } from '../../../../../../util/promises/storyboard_promise';
import { StoryboardCardListModel } from './../../../../../../model/storyboardModels/StoryboardCardListModel';
import './styles/InsightsModalHeader.style.scss';
import { createOrUpdateOpptyPlanCardDetail, verifyPersonaCardForOpptyP, addOrUpdatePersonaForOpptyP } from '../../../../../../util/promises/opptyplan_promise';
import { OptyPlanModel, OptyPersonaModel } from '../../../../../../model/opptyPlanModels/OpptyPlanModels';
import { getLoggedInUser, sentimentOptions } from '../../../../../../util/utils';
import { OpptyPlanCardModel } from '../../../../../../model/opptyPlanModels/OpptyPlanCardModel';
import signalPlus0 from '../../../../../../assets/iconsV2/signalPlus0.svg';
import signalPlus25 from '../../../../../../assets/iconsV2/signalPlus25.svg';
import signalPlus5 from '../../../../../../assets/iconsV2/signalPlus5.svg';
import signalPlus75 from '../../../../../../assets/iconsV2/signalPlus75.svg';
import signalPlus1 from '../../../../../../assets/iconsV2/signalPlus1.svg';
import signalMinus25 from '../../../../../../assets/iconsV2/signalMinus25.svg';
import signalMinus5 from '../../../../../../assets/iconsV2/signalMinus5.svg';
import signalMinus75 from '../../../../../../assets/iconsV2/signalMinus75.svg';
import signalMinus1 from '../../../../../../assets/iconsV2/signalMinus1.svg';
import { SHOW_TOOLTIP, HIDE_TOOLTIP } from '../../../../../../constants/general';
import { getSalesPersonaMasterForCard, addSalesPersonaMasteValuesToCard, getAllSalesPersonaMasterValues, getAllSalesPersonaMasterValuesForBuyerName, getContactFromId } from '../../../../../../util/promises/playbooks_promise';
import { reload } from '../../../../../../action/loadingActions';

export class InsightsModalHeaderImpl extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editableTitleMode: false,
            titleValue: props.cardDetails.title,
            sentiment: {
                id: ((props.cardDetails || '').contactBean || '').sentiment || 'Unknown',
                name: ((props.cardDetails || '').contactBean || '').sentiment || 'Unknown',
                value: ((props.cardDetails || '').contactBean || '').sentiment || 'Unknown',
                label: ((props.cardDetails || '').contactBean || '').sentiment || 'Unknown'
            },
            tribylPersonas: {
                id: props.cardDetails.contactBean && props.cardDetails.contactBean.opptyPlanContactBean.tribylPersonaRole,
                name: props.cardDetails.contactBean && props.cardDetails.contactBean.opptyPlanContactBean.tribylPersonaRole,
                value: props.cardDetails.contactBean && props.cardDetails.contactBean.opptyPlanContactBean.tribylPersonaRole,
                label: props.cardDetails.contactBean && props.cardDetails.contactBean.opptyPlanContactBean.tribylPersonaRole
            }
        };
        this.roles = [
            {
                id: 'Economic Buyer',
                name: 'Economic Buyer',
                label: 'Economic Buyer',
                value: 'Economic Buyer'
            }, {
                id: 'Champion',
                name: 'Champion',
                label: 'Champion',
                value: 'Champion'
            }, {
                id: 'Influencer',
                name: 'Influencer',
                label: 'Influencer',
                value: 'Influencer'
            }, {
                id: 'Procurement',
                name: 'Procurement',
                label: 'Procurement',
                value: 'Procurement'
            }, {
                id: 'Legal',
                name: 'Legal',
                label: 'Legal',
                value: 'Legal'
            }
        ];
    }
    componentDidMount() {
        const { cardDetails } = this.props;
        const isPersonaCard = cardDetails.topicName === 'Personas';
        if (isPersonaCard) {
            this.fetchPersonas();
            this.fetchCardPersona();
        }
    }

    componentDidUpdate(prevProps) {
        const { cardDetails } = this.props;
        if (cardDetails.id !== prevProps.cardDetails.id) {
            this.setState({ selectedPersona: null });
            this.fetchCardPersona();
        }
    }

    fetchPersonas = () => {
        const { playbookName } = this.props;
        getAllSalesPersonaMasterValuesForBuyerName(playbookName)
            .then((response) => {
                const personas = (response.data || [])
                    .filter(persona => persona.type === 'persona')
                    .map(persona => ({ value: persona.id, label: persona.salesPersonaName }));
                this.setState({ personas });
            });
    }

    fetchCardPersona = () => {
        const { cardDetails } = this.props;
        getContactFromId(cardDetails.contactId)
            .then((response) => {
                const contact = response.data || {};
                if (contact.salesPersonaMasterBean && contact.salesPersonaMasterBean[0]) {
                    const salesPersonaName = contact.salesPersonaMasterBean[0].salesPersonaName;
                    const selectedPersona = { value: salesPersonaName, label: salesPersonaName };
                    this.setState({ selectedPersona });
                }
            });
    }

    // updateSelectedPersona = () => {
    //     const { cardDetails } = this.props;
    //     const { selectedPersona } = this.state;
    //     addSalesPersonaMasteValuesToCard(cardDetails.parentCardId, selectedPersona.label)
    //         .then(() => {
    //             // reload('opty-plan-buying-personas-card-tab');
    //             this.setState({ selectedPersona: null }, () => {
    //                 this.fetchCardPersona();
    //                 reload('opty-plan-buying-personas-card-tab');
    //             });
    //         });
    // }

    updateSelectedPersona = () => {
        const { cardDetails, opptyPlanId } = this.props;
        const { selectedPersona } = this.state;
        const payload = {
            opptyPlanId: typeof opptyPlanId === 'string' ? parseInt(opptyPlanId) : opptyPlanId,
            role: cardDetails.title,
            salesPersonaNames: [selectedPersona.label],
            contactId: cardDetails.contactBean && cardDetails.contactBean.id,
            userId: getLoggedInUser().userId,
            opptyPCardDetailConRelId: cardDetails.opptyPCardDetailContactRelId
        };
        addOrUpdatePersonaForOpptyP(payload)
            .then(() => {
                this.fetchCardPersona();
                reload('opty-plan-buying-personas-card-tab');
            });
    }


    getTopicClass = (topic) => {
        switch (topic) {
            case 'Economic Drivers':
                return 'eco-driver';
            case 'Use Cases':
                return 'use-cases';
            case 'Pain Points':
                return 'pain-points';
            case 'Personas':
                return 'personas';
            case 'Objections':
                return 'objections';
            case 'Competition':
                return 'competition';
            case 'Content':
                return 'content';
            case 'Partners':
                return 'partners';
            case 'Activities':
                return 'activities';
            case 'Value Proposition':
                return 'value-proposition';
            default:
                return 'activities';
        }
    }
    getThermometer = (impactGrade) => {
        switch (impactGrade) {
            case 0:
                return <img className="thermometer" src={signalPlus0} />;
            case 0.25:
                return <img className="thermometer" src={signalPlus25} />;
            case 0.5:
                return <img className="thermometer" src={signalPlus5} />;
            case 0.75:
                return <img className="thermometer" src={signalPlus75} />;
            case 1:
                return <img className="thermometer" src={signalPlus1} />;
            case -0.25:
                return <img className="thermometer" src={signalMinus25} />;
            case -0.5:
                return <img className="thermometer" src={signalMinus5} />;
            case -0.75:
                return <img className="thermometer" src={signalMinus75} />;
            case -1:
                return <img className="thermometer" src={signalMinus1} />;
            default:
                return '';
        }
    }
    handleTitleEditMode = () => {
        this.setState({ editableTitleMode: !this.state.editableTitleMode });
    }

    handleTitleChange = (elem) => {
        this.setState({ titleValue: elem.target.value });
    }

    handleEditTitleSave = () => {
        const cardId = this.props.cardDetails.id;
        const storyId = this.props.storyId;
        const title = this.state.titleValue;
        const userId = this.props.userId;
        updateCardTitle(cardId, storyId, title, userId).then(() => {
            StoryboardCardListModel.updateCardData(cardId, { title });
            this.setState({ editableTitleMode: false });
        }).catch(() => {
            showAlert('Something went wrong!', 'error');
        });
    }
    handlePersonaVerify = async (cardDetails) => {
        const { enableVerifyActionForUser, opptyPCardDetailContactRelId } = cardDetails;
        try {
            const verifyOrUnverify = enableVerifyActionForUser === 'Y' ? 'verify' : 'unverify';
            const resp = await verifyPersonaCardForOpptyP(opptyPCardDetailContactRelId, getLoggedInUser().userId, verifyOrUnverify);
            const {
                enableVerifyForUser: verify,
                verifyCount
            } = resp.data;
            OpptyPlanCardModel.updateCardDetails({
                ...cardDetails,
                enableVerifyActionForUser: verify,
                verifyCount
            });
            OptyPlanModel.updateCardDetail({
                ...cardDetails,
                enableVerifyActionForUser: verify,
                verifyCount
            });

            OptyPersonaModel.updateCardDetail(cardDetails.id, {
                ...cardDetails,
                enableVerifyActionForUser: verify,
                verifyCount
            });
            return resp;
        } catch (error) {
            return error;
        }
    }
    handleVerfiy = async () => {
        const { opptyPlanId, cardDetails, isPersonaCard } = this.props;
        const { cardId, enableVerifyActionForUser } = cardDetails;
        if (cardDetails.updateVerifyStatus) {
            cardDetails.updateVerifyStatus();
            // .then((card) => {
            //     delete card.updateVerifyStatus;
            //     OpptyPlanCardModel.updateCardDetails({
            //         ...cardDetails,
            //         confByCustomer: card.confByCustomer,
            //         enableVerifyActionForUser: card.enableVerifyActionForUser,
            //         verifyCount: card.verifyCount
            //     });
            //     OptyPlanModel.updateCardDetail({
            //         ...cardDetails,
            //         confByCustomer: card.confByCustomer,
            //         enableVerifyActionForUser: card.enableVerifyActionForUser,
            //         verifyCount: card.verifyCount
            //     });
            //     OptyPersonaModel.updateCardDetail(cardDetails.id, {
            //         ...cardDetails,
            //         confByCustomer: card.confByCustomer,
            //         enableVerifyActionForUser: card.enableVerifyActionForUser,
            //         verifyCount: card.verifyCount
            //     });
            // });
        } else if (isPersonaCard) {
            this.handlePersonaVerify(cardDetails);
        } else {
            const payload = {
                cardId,
                custConf: enableVerifyActionForUser !== 'Y' ? 'N' : 'Y',
                opptyPlanId,
                userId: getLoggedInUser().userId
            };
            const resp = await createOrUpdateOpptyPlanCardDetail(payload);
            const {
                confByCustomer: confCust,
                enableVerifyForUser: verify,
                verifyCount
            } = resp.data.opptyPlanCardDetailBean;
            OpptyPlanCardModel.updateCardDetails({
                ...cardDetails,
                confByCustomer: confCust,
                enableVerifyActionForUser: verify,
                verifyCount
            });
            OptyPlanModel.updateCardDetail({
                ...cardDetails,
                confByCustomer: confCust,
                enableVerifyActionForUser: verify,
                verifyCount
            });
            OptyPersonaModel.updateCardDetail(cardDetails.id, {
                ...cardDetails,
                confByCustomer: confCust,
                enableVerifyActionForUser: verify,
                verifyCount
            });
        }
    }

    handleSentimentEdit = (sentiment) => {
        this.setState({ sentiment });
        this.props.updateCardInsights('sentiment', sentiment.name !== 'Unknown' ? sentiment.name : null);
    }
    handleTribylPersonas = (tribylPersonas) => {
        this.setState({ tribylPersonas });
        this.props.updateCardInsights('role', tribylPersonas.name);
    }

    showTooltip = (e, message) => {
        e.persist();
        this.props.dispatch({ type: SHOW_TOOLTIP, message, jsEvent: e });
    }

    hideTooltip = () => this.props.dispatch({ type: HIDE_TOOLTIP })

    handlePersonaEdit = (selectedPersona) => {
        this.setState({ selectedPersona }, () => {
            this.updateSelectedPersona();
        });
    }

    render() {
        const {
            cardDetails,
            isPersonaCard,
            isEdit
        } = this.props;
        const {
            editableTitleMode,
            titleValue,
            sentiment,
            tribylPersonas
        } = this.state;
        const {
            topicName,
            insertBy,
            insertTime,
            wins,
            loss,
            noDecision,
            // type,
            // dealCardIds,
            contactName,
            enableVerifyActionForUser,
            isOptyCard,
            impactGrade,
            jobTitleName,
            verifyCount
        } = cardDetails;
        const { selectedPersona, personas = [] } = this.state;
        const verified = enableVerifyActionForUser !== 'Y';
        const checkbox = verified ? (
            <span className="status text-capitalize">
                Verified&nbsp;
                {!this.props.isStoryDisabled &&
                    <React.Fragment>
                        <i role="button" className="material-icons" onClick={this.handleVerfiy}>check_box</i>
                        {verifyCount && verifyCount > 0 && <div className="verifyCountContainer"><p>{verifyCount}</p></div>}
                    </React.Fragment>
                }
            </span>
        ) : (
                <span className="status text-capitalize">
                    Not Verified&nbsp;
                    {!this.props.isStoryDisabled &&
                        <React.Fragment>
                            <i role="button" className="material-icons" onClick={this.handleVerfiy}>check_box_outline_blank</i>
                            {verifyCount && verifyCount > 0 && <div className="verifyCountContainer"><p>{verifyCount}</p></div>}
                        </React.Fragment>
                    }
                </span>
            );
        return (
            <header className="header">
                <p className={`${this.getTopicClass(topicName)} card-type text-uppercase`}>
                    {topicName}
                </p>
                <div className=" card-type text-uppercase pull-right">
                    {!isOptyCard || isPersonaCard ? checkbox : <div />}
                </div>
                {editableTitleMode ? (
                    <div className="d-flex edit-title-section">
                        <input
                            className="edit-card-title-input"
                            value={titleValue}
                            onChange={this.handleTitleChange}
                            maxLength="33" />
                        <i className="material-icons" onClick={this.handleEditTitleSave} role="button">check</i>
                        <i className="material-icons" onClick={this.handleTitleEditMode} role="button">close</i>
                    </div>
                ) : (
                        <p className="card-title" >
                            <span className={topicName === 'Personas' && 'personas'}>{titleValue}</span>
                            {!this.props.isStoryDisabled && topicName !== 'Personas' && <i className="material-icons" onClick={this.handleTitleEditMode} role="button">edit</i>}
                        </p>
                    )}

                {isPersonaCard &&
                    <React.Fragment>
                        <p className="modal-header-job-title" >
                            {jobTitleName}
                        </p>

                    </React.Fragment>
                }

                {!isPersonaCard &&
                    <figcaption className="created-by">
                        Created {insertBy ? Object.keys(insertBy).length > 0 && insertBy.firstName && `by ${insertBy.firstName} ${insertBy.lastName || ''}` : ''} on {new Date(insertTime).toDateString()}
                    </figcaption>}
                <div className={isPersonaCard ? 'personaCard-bottom-wrapper' : 'bottom-row-wrapper'}>
                    {!isPersonaCard &&
                        <div className="counters">
                            <p className="win">
                                <span
                                    onMouseOver={e => this.showTooltip(e, 'Win')}
                                    onMouseOut={this.hideTooltip}
                                    onFocus={e => this.showTooltip(e, 'Win')}
                                    onBlur={this.hideTooltip}
                                >
                                    {`W ${wins || 0}`}
                                </span>
                            </p>
                            <p className="loss">
                                <span
                                    onMouseOver={e => this.showTooltip(e, 'Loss')}
                                    onMouseOut={this.hideTooltip}
                                    onFocus={e => this.showTooltip(e, 'Loss')}
                                    onBlur={this.hideTooltip}
                                >
                                    {`L ${loss || 0}`}
                                </span>
                            </p>
                            <p className="no-decision">
                                <span
                                    onMouseOver={e => this.showTooltip(e, 'No Decision')}
                                    onMouseOut={this.hideTooltip}
                                    onFocus={e => this.showTooltip(e, 'No Decision')}
                                    onBlur={this.hideTooltip}
                                >
                                    {`? ${noDecision || 0}`}
                                </span>
                            </p>
                        </div>}
                    {!isPersonaCard && this.getThermometer(impactGrade)}

                </div>
                {isPersonaCard &&
                    <div className="bottom-job-sentiment-wrapper">
                        <p className="modal-header-job-title" >
                            {contactName}
                        </p>
                        <div className="contact-persona-sentiment-wrapper">
                            <div className="tribyl-persona-container">
                                <div className="sentiment-label">Role</div>
                                <Select
                                    className="sort-select"
                                    onChange={this.handleTribylPersonas}
                                    placeholder="Select"
                                    value={tribylPersonas}
                                    options={this.roles}
                                    clearable={false}
                                    valueKey="id"
                                    labelKey="name"
                                    disabled={!isEdit}
                                />
                            </div>
                            <div className="sentiment-container">
                                <div className="sentiment-label">Persona</div>
                                <Select
                                    className="sort-select"
                                    value={selectedPersona}
                                    onChange={this.handlePersonaEdit}
                                    options={personas} />
                            </div>
                        </div>
                    </div>}
            </header>
        );
    }
}
function mapStateToProps(state) {
    const opptyCard = OpptyPlanCardModel.last() && OpptyPlanCardModel.last().props;
    return {
        isEdit: state.form.editInsightsTab.isEdit,
        selectedCard: opptyCard
    };
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ updateCardInsights: (model, value) => actions.change(`form.opptyContactDetails.${model}`, value), }, dispatch)
    };
}

export const InsightsModalHeader = connect(mapStateToProps, mapDispatchToProps)(InsightsModalHeaderImpl);

InsightsModalHeader.propTypes = { cardDetails: PropTypes.object };

InsightsModalHeader.defaultProps = {
    cardDetails: {
        topicName: 'Pain Points',
        verified: 'final',
        title: 'Low Lead Conversion',
        insertBy: 'System',
        insertTime: 1539210818838
    }
};
