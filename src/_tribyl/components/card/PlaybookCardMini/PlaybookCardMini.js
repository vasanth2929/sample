/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { createOrUpdateOpptyPlanCardDetail } from '../../../../util/promises/opptyplan_promise';
import { getLoggedInUser } from '../../../../util/utils';
import { Card } from '../Card/Card';
import { topicClassNameToDisplayNameMap } from '../../../../views/OpptyPlanV3/containers/MyWorkspaceTab/_constants/constants';
import './PlaybookCardMini.scss';
import { OpptyPlanCardModel } from '../../../../model/opptyPlanModels/OpptyPlanCardModel';
import { UtilModel } from '../../../../model/UtilModel';
import { pushCardToRedux } from './redux.util';

export class PlaybookCardMini extends PureComponent {
    _isMounted = false;
    constructor(props) {
        super(props);
        const { card } = this.props;
        this.state = {
            includeInCallPlan: card.includeInCallPlan,
            confByCustomer: card.confByCustomer,
            enableVerifyActionForUser: card.enableVerifyActionForUser,
            verifyCount: card.verifyCount
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate(previousProps, previousState) {
        const { card } = this.props;
        if ((!previousProps.card && card)
            || card.enableVerifyActionForUser !== previousState.enableVerifyActionForUser) {
            this.setState({
                includeInCallPlan: card.includeInCallPlan,
                confByCustomer: card.confByCustomer,
                enableVerifyActionForUser: card.enableVerifyActionForUser,
                verifyCount: card.enableVerifyActionForUser === 'N' && previousState.enableVerifyActionForUser === 'Y' ? card.verifyCount + 1 : card.verifyCount,
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // This function is used as a callback in the full card modal as well, beware if changing
    updateVerifyStatus = () => {
        // const card = event;
        const {
            card,
            opptyPlanId,
            handleCardUpdate,
            onUpdateComplete
        } = this.props;
        const enableVerifyActionForUser = (card && !this._isMounted) ? card.enableVerifyActionForUser : this.state.enableVerifyActionForUser;
        const payload = {
            cardId: card.cardId,
            custConf: enableVerifyActionForUser === 'N' ? 'N' : 'Y',
            opptyPlanId,
            userId: getLoggedInUser().userId || 19
        };
        const handleState = () => {
            if (this._isMounted) {
                this.setState(prevState => ({
                    enableVerifyActionForUser: enableVerifyActionForUser === 'N' ? 'Y' : 'N',
                    verifyCount: enableVerifyActionForUser === 'N' ? prevState.verifyCount - 1 : prevState.verifyCount + 1
                }), () => {
                    if (handleCardUpdate) {
                        handleCardUpdate({
                            ...card,
                            enableVerifyActionForUser: this.state.enableVerifyActionForUser,
                            verifyCount: this.state.verifyCount
                        });
                    }
                 });
            }
        };
        handleState();
        return createOrUpdateOpptyPlanCardDetail(payload)
            .then((response) => {
                if (response && response.data
                    && response.data.opptyPlanCardDetailBean) {
                    const results = response.data.opptyPlanCardDetailBean;
                    const updatedCard = {
                        ...card,
                        confByCustomer: results.confByCustomer || 'N',
                        enableVerifyActionForUser: results.enableVerifyForUser || 'N',
                        verifyCount: typeof results.verifyCount === 'number' ? results.verifyCount : 0
                    };
                    if (onUpdateComplete) onUpdateComplete(updatedCard);

                    // Temporary to integrate with card modal
                    pushCardToRedux(updatedCard);

                    return Promise.resolve({
                        ...updatedCard,
                        updateVerifyStatus: this.updateVerifyStatus
                    });
                }
            }).catch(() => handleState());
    }

    updateCallPlanStatus = () => {
        const {
            opptyPlanId, card, card: { cardId }, handleCardUpdate
        } = this.props;
        const { includeInCallPlan } = this.state;
        const payload = {
            cardId,
            includeInCallPlan: includeInCallPlan === 'Y' ? 'N' : 'Y',
            opptyPlanId,
            userId: getLoggedInUser().userId || 19
        };
        this.setState((prevState) => {
            return { includeInCallPlan: prevState.includeInCallPlan === 'Y' ? 'N' : 'Y' };
        }, () => {
            createOrUpdateOpptyPlanCardDetail(payload)
                .then((response) => {
                    if (response && response.data
                        && response.data.opptyPlanCardUserRelDataBeans
                        && response.data.opptyPlanCardUserRelDataBeans[0]) {
                        const results = response.data.opptyPlanCardUserRelDataBeans[0];
                        if (handleCardUpdate) handleCardUpdate({ ...card, includeInCallPlan: results.inncludeInCallPlan || 'N' });
                    }
                }).catch(() => this.setState({ includeInCallPlan: this.state.includeInCallPlan === 'Y' ? 'N' : 'Y' }, () => { }));
        });
    }

    handleCardExpand = () => {
        const { card } = this.props;
        OpptyPlanCardModel.deleteAll();
        UtilModel.updateData({ showOpptyInsightsModal: true });
        new OpptyPlanCardModel({ ...card, updateVerifyStatus: this.updateVerifyStatus }).$save();
    }

    render() {
        const {
            card,
            isSelectedCard,
            handleCardUpdate,
            handleCardSelect,
            customCardBody
        } = this.props;
        const {
            includeInCallPlan,
            enableVerifyActionForUser,
            verifyCount
        } = this.state;
        return (
            <Card
                key={card.cardId}
                uiId={card.cardId}
                cardHeader={topicClassNameToDisplayNameMap[card.topicName.replace(" ", "-").toLocaleLowerCase()]}
                cardTitle={card.title}
                card={{
                    ...card,
                    description: card.description || '',
                    className: card.topicName.replace(" ", "-").toLocaleLowerCase()
                }}
                customCardBody={customCardBody || <div className="playbook-card-mini-body">{card.title}</div>}
                topic={card.topicName.replace(" ", "-").toLocaleLowerCase()}
                isSelectedCard={isSelectedCard(card.cardId)}
                isMatchedCard={card.matchScore > 0}
                verified={enableVerifyActionForUser === 'N'}
                verifyCount={verifyCount}
                includeInCallPlan={includeInCallPlan === 'Y'}
                enableExpand
                enableVerify={enableVerifyActionForUser === 'Y'}
                enableCallPlan
                enableDelete={false}
                enableAddInsight
                handleCardUpdate={handleCardUpdate}
                handleCardSelect={handleCardSelect}
                handleCardExpand={this.handleCardExpand}
                updateVerifyStatus={this.updateVerifyStatus}
                updateCallPlanStatus={this.updateCallPlanStatus}
                hideFooter
            />
        );
    }
}

