/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
// import AppendCardContextForm from '../../../containers/AppendCardContextForm/AppendCardContextForm';
// import { showAlert } from '../../../../../../../components/ComponentModal/ComponentModal';
import { CardBody } from './CardBody/CardBody';
import { CardFooter } from './CardFooter/CardFooter';
import { CardHeader } from './CardHeader/CardHeader';
import './Card.scss';
import AppendCardContextForm
    from '../../../../views/OpptyPlanV3/containers/MyWorkspaceTab/containers/AppendCardContextForm/AppendCardContextForm';
import { showAlert } from '../../../../components/ComponentModal/ComponentModal';

export class Card extends PureComponent {
    insightClick = () => {
        const { card, opptyPlanId } = this.props;
        const appendCardContextModal = (
            <AppendCardContextForm
                card={card}
                cardId={card.cardId}
                opptyPlanId={opptyPlanId}
                topicName={card.topicName} />
        );
        showAlert('Add Insight', appendCardContextModal, 'add-card-context-modal');
    }

    handleClick = () => {
        const { card, handleCardSelect } = this.props;
        if (handleCardSelect) {
            handleCardSelect(
                card.topicName === 'Personas'
                    ? card.opptyPCardDetailContactRelId
                    : card.cardId,
                { updateVerifyStatus: this.updateVerifyStatus }
            );
        }
    }

    removeCard = (event) => {
        if (event && event.stopPropagation) event.stopPropagation();
        const { removeCard } = this.props;
        return removeCard && removeCard();
    }

    updateVerifyStatus = (event) => {
        if (event && event.stopPropagation) event.stopPropagation();
        const { updateVerifyStatus } = this.props;
        return updateVerifyStatus && updateVerifyStatus();
    }

    updateCallPlanStatus = (event) => {
        if (event && event.stopPropagation) event.stopPropagation();
        const { updateCallPlanStatus } = this.props;
        return updateCallPlanStatus && updateCallPlanStatus();
    }

    handleCardExpand = () => {
        const { handleCardExpand } = this.props;
        if (handleCardExpand) handleCardExpand();
    }

    render() {
        const {
            uiId,
            enableCallPlan,
            enableDelete,
            enableAddInsight,
            enableExpand,
            enableVerify,
            verified,
            verifyCount,
            includeInCallPlan,
            cardHeader,
            cardTitle,
            customCardBody,
            card,
            topic,
            isSelectedCard,
            isMatchedCard,
            hideFooter
        } = this.props;
        return (
            <div
                role="button"
                onClick={this.handleClick}
                id={uiId}
                className={isSelectedCard ? `card-v3 ${topic}-border selected-card-wrapper` : "card-v3"}>
                <CardHeader
                    topic={topic}
                    cardHeader={cardHeader}
                    isMatchedCard={isMatchedCard}
                    isSelectedCard={isSelectedCard}
                    enableExpand={enableExpand}
                    enableVerify={enableVerify}
                    verified={verified}
                    verifyCount={verifyCount}
                    updateVerifyStatus={this.updateVerifyStatus}
                    handleCardExpand={this.handleCardExpand}
                />
                <CardBody
                    title={cardTitle}
                    description={card.description || ''}
                    className={card.className}
                    customCardBody={customCardBody} />
                {
                    !hideFooter &&
                    <CardFooter
                        enableCallPlan={enableCallPlan}
                        includeInCallPlan={includeInCallPlan}
                        enableDelete={enableDelete}
                        enableAddInsight={enableAddInsight}
                        updateCallPlanStatus={this.updateCallPlanStatus}
                        removeCard={this.removeCard}
                        insightClick={this.insightClick}
                    />
                }
            </div>
        );
    }
}
