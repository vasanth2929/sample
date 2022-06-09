import React from 'react';
import { HIDE_TOOLTIP, SHOW_TOOLTIP } from '../../../../constants/general';
import { dispatch } from '../../../../util/utils';
import './SalesStageCard.scss';

export class SalesStageCard extends React.Component {
    showTooltip = (e, stageActivity) => {
        e.persist();
        dispatch({ type: SHOW_TOOLTIP, message: stageActivity.title, jsEvent: e });
    }

    hideTooltip = () => dispatch({ type: HIDE_TOOLTIP })

    handleClick = (card) => {
        const { handleClick } = this.props;
        if (handleClick) handleClick(card);
    }

    render() {
        const { cards } = this.props;
        return (
            cards.map((card, index) => {
                return (
                    <div className="activity-card-wrapper">
                        <div className="activity-first-column" key={index}>
                            <span
                                role="button"
                                className={card.status === 'complete' ? 'activity-name completed-activity' : 'activity-name'}
                                onMouseOver={e => this.showTooltip(e, card)}
                                onMouseOut={this.hideTooltip}
                                onFocus={e => this.showTooltip(e, card)}
                                onBlur={this.hideTooltip}
                                onClick={() => this.handleClick(card)}
                            >
                                {card.title}
                            </span>
                        </div>
                    </div>
                );
            })
        );
    }
}
