import React, { useState } from 'react';
import { Tags } from '../../../../../components/Tags/Tags';

export default function MatchedKeywords({ card }) {
  const [showMore, setshowMore] = useState(false);

  const expand = () => {
    const element = document.getElementById(`taglist-${card.id}`);
    element.classList.toggle('expand');
    setshowMore(!showMore);
  };
  return (
    <div id={`taglist-${card.id}`} className="taglist">
      <React.Fragment>
        {card.matchedTags && card.matchedTags.length > 0 && (
          <Tags tags={card.matchedTags} />
        )}
        <div
          onClick={() => expand(card.id)}
          className="expand-key"
        >
          {!showMore ? <span>Show More</span> : <span>Show Less</span>}
        </div>
      </React.Fragment>
    </div>
  )
}
