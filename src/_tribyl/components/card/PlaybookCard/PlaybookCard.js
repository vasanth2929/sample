/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { createOrUpdateOpptyPlanCardDetail } from '../../../../util/promises/opptyplan_promise';
import { getLoggedInUser } from '../../../../util/utils';
import { Card } from '../Card/Card';
import { topicClassNameToDisplayNameMap } from '../../../../views/OpptyPlanV3/containers/MyWorkspaceTab/_constants/constants';

export class PlaybookCard extends PureComponent {
    _isMounted = false;
    constructor(props) {
        super(props);
        const { card } = this.props;
        this.state = {
            includeInCallPlan: card.includeInCallPlan,
            confByCustomer: card.confByCustomer ? ((card.confByCustomer === card.enableVerifyActionForUser)
                ? (card.confByCustomer === 'Y' ? 'N' : 'Y') : card.confByCustomer)
                : (card.enableVerifyActionForUser === 'N' ? 'Y' : 'N'),
            enableVerifyActionForUser: card.enableVerifyActionForUser,
            verifyCount: card.verifyCount
        };
    }

    componentDidMount() {
        console.log('PB Card is mounting !');
        this._isMounted = true;
    }

    componentDidUpdate(previousProps) {
        const { card } = this.props;
        if (!previousProps.card && card) {
            this.setState({
                includeInCallPlan: card.includeInCallPlan,
                confByCustomer: card.confByCustomer ? ((card.confByCustomer === card.enableVerifyActionForUser)
                    ? (card.confByCustomer === 'Y' ? 'N' : 'Y') : card.confByCustomer)
                    : (card.enableVerifyActionForUser === 'N' ? 'Y' : 'N'),
                enableVerifyActionForUser: card.enableVerifyActionForUser,
                verifyCount: card.verifyCount,
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // This function is used as a callback in the full card modal as well, beware if changing
    updateVerifyStatus = () => {
        console.log('updateVerifyStatus');
        console.log(event);
        console.log(event && event.stopPropagation);
        // const card = event;
        const { card, opptyPlanId, handleCardUpdate } = this.props;
        const confByCustomer = (card && !this._isMounted) ? card.confByCustomer : this.state.confByCustomer;
        const payload = {
            cardId: card.cardId,
            custConf: confByCustomer === 'Y' ? 'N' : 'Y',
            opptyPlanId,
            userId: getLoggedInUser().userId || 19
        };
        const handleState = () => {
            if (this._isMounted) {
                this.setState(prevState => ({
                    confByCustomer: prevState.confByCustomer === 'Y' ? 'N' : 'Y',
                    enableVerifyActionForUser: prevState.enableVerifyActionForUser === 'Y' ? 'N' : 'Y',
                    verifyCount: prevState.confByCustomer === 'Y' ? prevState.verifyCount - 1 : prevState.verifyCount + 1
                }), () => { });
            }
        };
        console.log(payload);
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
                    if (handleCardUpdate) handleCardUpdate(updatedCard);
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

    render() {
        const {
            card,
            isSelectedCard,
            handleCardUpdate,
            handleCardSelect,
        } = this.props;
        const {
            includeInCallPlan,
            confByCustomer,
            enableVerifyActionForUser,
            verifyCount
        } = this.state;
        return (
            <Card
                key={card.cardId}
                cardHeader={topicClassNameToDisplayNameMap[card.topicName.replace(" ", "-").toLocaleLowerCase()]}
                cardTitle={card.title}
                // cardBody={}
                card={{
                    ...card,
                    description: card.description || '',
                    className: card.topicName.replace(" ", "-").toLocaleLowerCase()
                }}
                topic={card.topicName.replace(" ", "-").toLocaleLowerCase()}
                isSelectedCard={isSelectedCard(card.cardId)}
                isMatchedCard={card.isMatchedCard}
                verified={confByCustomer === 'Y'}
                verifyCount={verifyCount}
                includeInCallPlan={includeInCallPlan === 'Y'}
                enableVerify={enableVerifyActionForUser === 'Y'}
                enableCallPlan
                enableDelete={false}
                enableAddInsight
                handleCardUpdate={handleCardUpdate}
                handleCardSelect={handleCardSelect}
                updateVerifyStatus={this.updateVerifyStatus}
                updateCallPlanStatus={this.updateCallPlanStatus}
            />
        );
    }
}
