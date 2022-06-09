
import React from 'react';
import { MatchedCardIcon } from '../../../_icons/MatchedCardIcon/MatchedCardIcon';
import { VerifyStatusIcon } from '../../../_icons/VerifyStatusIcon/VerifyStatusIcon';
import { ExpandIcon } from '../../../_icons/ExpandIcon/ExpandIcon';

export class CardHeader extends React.PureComponent {
    render() {
        const {
            topic,
            cardHeader,
            isSelectedCard,
            isMatchedCard,
            enableExpand,
            enableVerify,
            verified,
            verifyCount,
            checkboxBlank,
            checkboxChecked,
            updateVerifyStatus,
            handleCardExpand
        } = this.props;
        return (
            <div className={`header ${topic || ''} ${isSelectedCard ? 'selected-card' : ''}`} role="button" >
                <span className="headerLabel">
                    {enableExpand && <ExpandIcon onExpandClick={handleCardExpand} />}
                    {cardHeader}
                </span>
                <div className="headerIcons">
                    {isMatchedCard && <MatchedCardIcon />}
                    <VerifyStatusIcon
                        enableVerify={enableVerify}
                        verified={verified}
                        verifyCount={verifyCount}
                        checkboxBlank={checkboxBlank}
                        checkboxChecked={checkboxChecked}
                        updateVerifyStatus={updateVerifyStatus} />
                </div>
            </div>
        );
    }
}
