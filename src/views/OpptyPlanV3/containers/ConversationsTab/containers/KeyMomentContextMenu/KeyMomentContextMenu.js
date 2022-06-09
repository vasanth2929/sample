import React from 'react';
import { updateCardKeyMoments, removeKeyMomentForCard } from '../../../../../../util/promises/dealcards_promise';
import { showAlert } from '../../../../../../components/MessageModal/MessageModal';
import { createCardKeyMoments } from '../../../../../../util/promises/ai-promise';
import { ContextMenu } from '../_lib/ContextMenu/ContextMenu';

export class KeyMomentContextMenu extends React.PureComponent {
    contextMenuRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = { showMenu: true };
    }

    componentDidUpdate(prevProps) {
        if (this.props.contextMenuEvent && prevProps.contextMenuEvent
            && (prevProps.contextMenuEvent.clientX !== this.props.contextMenuEvent.clientX
                || prevProps.contextMenuEvent.clientY !== this.props.contextMenuEvent.clientY)) {
            this.setState({ showMenu: false }, this.setState(() => ({ showMenu: true })));
        }
    }

    addKeyMoment = (subtype) => {
        this.setState({ showMenu: false });

        const {
            cardId,
            transcript,
            selectedText,
            updateHandler,
            handleCardUpdate,
            scrollTo,
            // storyMode
        } = this.props;
        // console.log(storyMode);
        createCardKeyMoments(
            cardId,
            [{
                keyMomentSourceId: transcript.convDetails ? transcript.convDetails.convId : transcript.conversationId,
                keyMomentStartPosition: '',
                keyMomentText: [selectedText],
                keyMomentSubType: subtype,
                keyMomentType: transcript.keyMomentsType === 'zoom' ? 'interview' : transcript.keyMomentsType,
                shareStatus: subtype === 'context' ? 'team' : 'public'
            }]
        )
            .then((res) => {
                const data = res.data && res.data.length > 0 && res.data[0];
                if (handleCardUpdate) handleCardUpdate({ enableVerifyActionForUser: 'N' });
                if (updateHandler) updateHandler(() => data && data.cardKeyMomentsId && scrollTo(data.cardKeyMomentsId));
            })
            .catch(() => showAlert('Something went wrong.', 'error'));
    }

    updateKeyMomentSubtype = (subtype) => {
        const { 
            keyMoment: { cardKeyMomentsSummary }, 
            updateHandler, 
            scrollTo, 
            handleCardUpdate
        } = this.props;
        this.setState({ showMenu: false });
        if (scrollTo) scrollTo(cardKeyMomentsSummary.cardKeyMomentsId);
        updateCardKeyMoments({
            cardKeyMomentId: cardKeyMomentsSummary.cardKeyMomentsId,
            subType: subtype,
            shareStatus: subtype === 'context' ? 'team' : 'public'
        })
            .then(() => {
                if (handleCardUpdate) handleCardUpdate({ enableVerifyActionForUser: 'N' });
                if (updateHandler) updateHandler(() => scrollTo(cardKeyMomentsSummary.cardKeyMomentsId));
            })
            .catch(() => showAlert('Something went wrong.', 'error'));
    }

    provideCoaching = (e) => {
        const { provideCoachingHandler } = this.props;
        this.setState({ showMenu: false });
        return provideCoachingHandler && provideCoachingHandler(e);
    }

    removeKeyMoment = () => {
        const { keyMoment: { cardKeyMomentsSummary }, updateHandler } = this.props;
        this.setState({ showMenu: false });
        removeKeyMomentForCard(cardKeyMomentsSummary.cardKeyMomentsId)
            .then(() => {
                if (updateHandler) updateHandler(() => {});
            })
            .catch(() => showAlert('Something went wrong.', 'error'));
    }

    render() {
        const {
            keyMoment,
            contextMenuEvent,
            onClose,
            getPosition
        } = this.props;
        const { showMenu } = this.state;
        return showMenu && contextMenuEvent ? (
            <div role="button" onClick={e => e.stopPropagation()}>
                {
                    keyMoment && Object.keys(keyMoment).length > 0 ? (
                        <ContextMenu contextMenuEvent={contextMenuEvent} showMenu={showMenu} getPosition={getPosition} onClose={onClose}>
                            {keyMoment.subtype !== 'context' &&
                                <li onClick={() => this.updateKeyMomentSubtype('context')}>
                                    <p>Add to insight</p>
                                </li>}
                            {keyMoment.subtype !== 'protip' &&
                                <li onClick={() => this.updateKeyMomentSubtype('protip')}>
                                    <p>Add to protips</p>
                                </li>}
                            <li onClick={() => this.removeKeyMoment()}>
                                <p>Remove key moment</p>
                            </li>
                        </ContextMenu>
                    ) : (
                            <ContextMenu contextMenuEvent={contextMenuEvent} showMenu={showMenu} getPosition={getPosition} onClose={onClose}>
                                <li onClick={() => this.addKeyMoment('context')}><p>Add to insights</p></li>
                                <li onClick={() => this.addKeyMoment('protip')}><p>Add to protip</p></li>
                                <li onClick={e => this.provideCoaching(e)}><p>Provide coaching</p></li>
                            </ContextMenu>
                        )
                }
            </div>

        ) : <div />;
    }
}
