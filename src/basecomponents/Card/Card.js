/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Control, Form, actions } from 'react-redux-form';
import { bindActionCreators } from 'redux';
import editIcon from '../../assets/iconsV2/edit.svg';
import avatar from '../../assets/images/contact_avatar.png';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { OpptyPlanCardModel } from '../../model/opptyPlanModels/OpptyPlanCardModel';
import { updateDealCardContext } from '../../util/promises/dealcards_promise';
import { getLoggedInUser } from '../../util/utils';
import './styles/Card.styles.scss';
import { SHOW_TOOLTIP, HIDE_TOOLTIP } from '../../constants/general';

class CardImpl extends PureComponent {
    constructor(props) {
        super(props);
        this.topicClassNameToDisplayNameMap = {
            'key-moment': 'Key Moment',
            'economic-drivers': 'Economic Drivers',
            'use-cases': 'Use Cases',
            'pain-points': 'Pain Points',
            personas: 'Personas',
            'value-proposition': 'Value Proposition',
            functional: 'Value Proposition',
            technical: 'Value Proposition',
            strategic: 'Value Proposition',
            objections: 'Objections',
            competition: 'Competition',
            content: 'Content',
            partners: 'Partners',
            activities: 'Activities',
        };
    }
    handleAddContact = (e) => {
        e.stopPropagation();
        this.props.showContactList(true);
    }

    handleCancelForm = () => {
        this.props.resetFormValues();
        this.props.insightClose();
    }
    
    showTooltip = (e, jobTitleName) => {
        e.persist();
        this.props.showTooltip(e, jobTitleName);
    }

    // hideTooltip = () => dispatch({ type: HIDE_TOOLTIP })

    handleSubmit = async () => {
        const payload = {
            cardId: this.props.cardData.id,
            context: this.props.dealCardForm.description,
            storyId: Number(this.props.storyId),
            protip: this.props.dealCardForm.protip,
            userId: getLoggedInUser().userId
        };
        updateDealCardContext(payload).then(() => {
            this.handleCancelForm();
        });
    }

    renderPersonaCardBody = (cardData, isOptyCard) => {
        const contactName = cardData.contactName;
        if (contactName) {
            return (
                <div className="persona-card-body">
                    {cardData.jobTitleName && cardData.jobTitleName.length > 29 ? (
                        <div>
                            <p title={cardData.jobTitleName} className={`contact-job-title ${isOptyCard && 'contact-job-title-personas'} ${'contact-job-title-all'}`}>{cardData.jobTitleName && cardData.jobTitleName.slice(0, 29)} {cardData.jobTitleName.length > 29 ? '...' : ''}</p>
                        </div>
                    ) : (
                            <p className={`contact-job-title ${isOptyCard && 'contact-job-title-personas'} ${'contact-job-title-all'}`}>{cardData.jobTitleName}</p>
                        )}
                    <div className="d-flex">
                        <div>
                            <img
                                src={avatar}
                                height="56"
                                width="56"
                                className="contact-image" />
                            {isOptyCard &&
                                <div className="status">
                                    <span className={`status-wrapper ${cardData.contactBean.sentiment || 'Unknown'}`}>{cardData.contactBean.sentiment || 'Unknown'}</span>
                                </div>}
                        </div>
                        <div className="contact-info">
                            {!isOptyCard ?
                                (
                                    <React.Fragment>
                                        <p className="contact-name">{contactName}</p>
                                        <p className="contact-email" title={cardData.contactEmail}>{cardData.contactEmail && cardData.contactEmail.length > 28 ? (`${cardData.contactEmail.slice(0, 28)}...`) : (cardData.contactEmail)}</p>
                                        <p className="contact-conversations">{`${cardData.conversationCount || 0} Conversations`}</p>
                                        <p className="contact-conversations">0 days ago</p>
                                    </React.Fragment>
                                ) :
                                <React.Fragment>
                                    <p className="contact-name">{cardData && cardData.contactBean ? `${cardData.contactBean.firstName} ${cardData.contactBean.lastName}` : ' '}</p>
                                <p className="contact-phone optyCardPersona">Persona: {cardData && cardData.contactBean && cardData.contactBean.salesPersonaMasterBean && cardData.contactBean.salesPersonaMasterBean[0] ? (cardData.contactBean.salesPersonaMasterBean[0].salesPersonaName || 'N/A') : 'N/A'}</p>
                                    <p className="contact-email" title={cardData && cardData.contactBean ? cardData.contactBean.email : ''}>{cardData && cardData.contactBean ? (cardData.contactBean.email && cardData.contactBean.email.length > 28 ? (`${cardData.contactBean.email.slice(0, 28)}...`) : (cardData.contactBean.email)) : ''}</p>
                                    <p className="contact-phone optyCardPersona">Phone:{cardData && cardData.contactBean ? cardData.contactBean.phone : ''}</p>
                                    <p className="contact-phone optyCardPersona">Mobile:{cardData && cardData.contactBean ? cardData.contactBean.mobile : ''}</p>
                                    {/* <p className="contact-phone optyCardPersona">{`${cardData.conversationCount || 0} Conversations`}</p> */}
                                    <p className="contact-phone optyCardPersona">Last activity:{cardData && cardData.contactBean ? (cardData.contactBean.lastContacted || '') : ''}</p>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="persona-card-body">
                {!this.props.isStoryDisabled ?
                    <p onClick={this.handleAddContact} className="add-contact-link">Add a contact</p> :
                    <p style={{ curson: 'default' }} className="add-contact-link">No contact added</p>
                }
            </div>
        );
    }

    render() {
        const { props } = this;
        const {
            addInsight,
            removeAction,
            bShow,
            cardTitle,
            handleClick,
            shareColor,
            cardBody,
            topic,
            headerIcons,
            // handleRemoveCard,
            insightClick,
            insightClose,
            isPersonaCard,
            cardData,
            isOptyCard,
            handleCallPlanUpdate,
            isBuyingCommiteeCard,
            isStoryDisabled,
            isSelectedCard,
        } = props;
        const includeInCallPlan = cardData.includeInCallPlan === 'Y';
        const description = cardBody.description ? cardBody.description.slice(0, 165).split('\n') : '';
        return (
            <ErrorBoundary>
                <div className={isSelectedCard ? `card-v2 ${topic}-border` : "card-v2"} role="button">
                    <div className="standardButton">
                        <div className="front-card">
                            <div className={`header ${topic || ''} ${isSelectedCard ? 'selected-card' : ''}`}>
                                <p className={`headerLabel ${shareColor}`}>{isPersonaCard ? cardTitle : this.topicClassNameToDisplayNameMap[topic]}</p>
                                {!isStoryDisabled && headerIcons && <div className="headerIcons">{headerIcons.map(icon => icon)}</div>}
                            </div>
                            <div className="front-body" onClick={handleClick} role="button">
                                {isPersonaCard ? (
                                    this.renderPersonaCardBody(cardData, isOptyCard)
                                ) : (
                                    // Array.isArray(description) && description.length > 0 && (
                                    //     (description.length === 1) ? (
                                    //         <div className={`body ${this.props.activeNavkey && 'body-all'}`}>
                                    //             <p className="cardBodyTitle">{cardTitle + ' aman'}</p>
                                    //             <p className={`${cardBody.className} ${this.props.activeNavkey === 'all' && 'cardBodyContentDealAllTab'} body-content`}>
                                    //                 {`${cardBody.description ? cardBody.description.slice(0, 165) : ''} ${cardBody.description && cardBody.description.length > 165 ? '[...]' : ''}`}
                                    //             </p>
                                    //         </div>
                                    //     ) : (
                                    //         <div className={`body ${this.props.activeNavkey && 'body-all'}`}>
                                    //             <p className="cardBodyTitle">{cardTitle + ' aman'}</p>
                                    //             <p className={`${cardBody.className} ${this.props.activeNavkey === 'all' && 'cardBodyContentDealAllTab'} body-content`}>
                                    //                 {description && description.map((desc, index) => {
                                    //                     return (cardBody.description && cardBody.description.length > 165 && index === description.length - 1)
                                    //                         ? <div>{desc}<span className="trailing-text">{cardBody.description && cardBody.description.length > 165 ? '[...]' : ''}</span><br /></div> 
                                    //                         : <div>{desc}<br /></div>;
                                    //                 })
                                    //                 }
                                    //             </p>
                                    //         </div>
                                    //     )
                                    // )
                                    <div className={`body ${this.props.activeNavkey && 'body-all'}`}>
                                        <p className="cardBodyTitle">{cardTitle}</p>
                                        <p className={`${cardBody.className} ${this.props.activeNavkey === 'all' && 'cardBodyContentDealAllTab'} body-content`}>
                                            {description && description.map((desc, index) => {
                                                return (description && description.length > 165 && index === description.length - 1)
                                                    ? <div>{desc}<span className="trailing-text">{description && description.length > 165 ? '[...]' : ''}</span><br /></div> 
                                                    : <div>{desc}<br /></div>;
                                            })
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className={`footer ${isBuyingCommiteeCard && 'persona-card-footer'}`}>
                                {isOptyCard && topic !== 'personas' &&
                                    <div className="footerLabelContainer" style={{ justifyContent: 'flex-start' }} onClick={handleCallPlanUpdate} role="button">
                                        <p className={includeInCallPlan ? 'call-plan-label yellow' : 'call-plan-label'}>Call Plan</p>
                                        <i className={includeInCallPlan ? 'material-icons yellow' : 'material-icons'} >{includeInCallPlan ? 'star' : 'star_border'}</i>
                                    </div>
                                }
                                {isBuyingCommiteeCard &&
                                    <div className="footerLabelContainer" style={{ justifyContent: 'flex-start' }} onClick={removeAction} role="button">
                                        <i className="material-icons" style={{ cursor: 'pointer' }} title="Delete">delete</i>
                                    </div>
                                }
                                {addInsight && !isStoryDisabled &&
                                    <div className={`footerLabelContainer ${bShow ? 'active' : ''}`} onClick={insightClick} role="button">
                                        <p>Add context</p>
                                        {!bShow && <img className="edit-icon" src={editIcon} />}
                                        {bShow && <i className="material-icons">verified_user</i>}
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                {
                    bShow &&
                    <div className="popupContainer">
                        <div className="row d-flex justify-content-between headerSection">
                            <p className="headerLabel">Add notes</p>
                            <i className="material-icons" role="button" onClick={insightClose}>close</i>
                        </div>
                        <section className="add-card-insight-form-section">
                            <Form model="form.addCardInsights" className="add-oppty-card-form" onSubmit={this.handleSubmit}>
                                <div className="col-12">
                                    <div className="row">
                                        <label htmlFor="card-desc">Context</label>
                                        <Control.textarea
                                            rows={3}
                                            id="card-desc"
                                            maxLength="140"
                                            model=".description"
                                            defaultValue={this.props.dealCardForm.description}
                                            className="form-control card-desc-input"
                                            placeholder="Enter text..." />
                                        <figcaption className="figure-caption text-right">
                                            {`${this.props.dealCardForm.description ? (140 - this.props.dealCardForm.description.length) : (140)} characters left`}
                                        </figcaption>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <label htmlFor="card-desc">Protip</label>
                                        <Control.textarea
                                            rows={3}
                                            id="card-desc"
                                            maxLength="140"
                                            model=".protip"
                                            defaultValue={this.props.dealCardForm.protip}
                                            className="form-control card-desc-input"
                                            placeholder="Enter text..." />
                                        <figcaption className="figure-caption text-right">
                                            {`${this.props.dealCardForm.protip ? (140 - this.props.dealCardForm.protip.length) : (140)} characters left`}
                                        </figcaption>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-flex justify-content-end">
                                            <button type="button" className="cancelButton" onClick={this.handleCancelForm}>Cancel</button>
                                            <button type="submit" className="saveButton">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </section>
                    </div>
                }
            </ErrorBoundary >
        );
    }
}

CardImpl.propTypes = {
    handleClick: PropTypes.func,
    flippedContent: PropTypes.node,
    shareColor: PropTypes.string,
    dealAmount: PropTypes.string,
    cardTitle: PropTypes.string,
    subTitle: PropTypes.string,
    shareIcon: PropTypes.string,
    shareStatus: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    const opptyCard = OpptyPlanCardModel.last() && OpptyPlanCardModel.last().props;
    let id = null;
    let cardId = null;
    if (opptyCard) {
        id = opptyCard.id || null;
        cardId = opptyCard.cardId || null;
    }
    return {
        dealCardForm: state.form.addCardInsights,
        isSelectedCard: (cardId === ownProps.cardData.cardId || id === ownProps.cardData.id)
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFormFieldValue: (model, value) => actions.change(`form.addCardInsights.${model}`, value),
        setFormInitialValues: values => actions.change('form.addCardInsights', values),
        resetFormValues: () => actions.reset('form.addCardInsights'),
        showTooltip: (e, jobTitle) => ({ type: SHOW_TOOLTIP, message: jobTitle, jsEvent: e }),
        hideTooltip: () => ({ type: HIDE_TOOLTIP })
    }, dispatch);
}

const Card = connect(mapStateToProps, mapDispatchToProps)(CardImpl);
export default Card;
