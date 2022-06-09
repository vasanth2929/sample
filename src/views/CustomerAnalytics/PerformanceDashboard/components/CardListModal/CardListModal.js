import React from 'react';
import { ShortNumber } from '../../../../../util/utils';
import { Tooltip } from '@material-ui/core';
import './CardListModal.style.scss';

const DEFAULT_CLASSNAME = 'card-list-container';

export default function CardListModal({ onSelect, cards }) {
  //   const handleClick = (card) => {
  //     dispatch({
  //       type: SELECT_NOTE_CARD,
  //       payload: card,
  //     });
  //     showCustomModal(
  //       <div className="insight-modal-header">
  //         <div className="type">{card.type}</div>
  //         <h5 className="heading">{card.name}</h5>
  //         <div className="status">Live</div>
  //       </div>,
  //       <div className="insight-modal-body">
  //         <InsightModal selectedNoteCard={card} />
  //       </div>,
  //       'market-insight-modal'
  //     );
  //   };

  return (
    <div className={DEFAULT_CLASSNAME}>
      {cards.map((card) => (
        <div
          key={card.id}
          className="solution-cards"
          onClick={() => onSelect(card,true)}
        >
          <div className="heading medium mb-2 card-title-header">
            {card.name}
          </div>
          <div className="metrics2">
            <div>
              <span className="small-text bold">Amt </span>
              <span className="value text medium">
                {ShortNumber(card.totalOpptyAmount)}
              </span>
            </div>
            <div>
              <span className="small-text bold">Deals </span>
              <span className="value text medium">
                {card.totalOpptyCountForCard}
              </span>
            </div>
            <div>
              <span className="small-text bold">Days </span>
              <span className="value text medium">{card.avgSalesCycle}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
