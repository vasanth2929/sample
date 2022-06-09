import React from 'react';
import Phone from '../../assets/iconsV2/phone-2.svg';
import Email from '../../assets/iconsV2/email.svg';
import Document from '../../assets/iconsV2/document.svg';
import Note from '../../assets/iconsV2/note.svg';

import './ConversationsCard.style.scss';

const DEFAULT_CLASSNAME = 'conversations-card';

const IconMap = {
  document: Document,
  email: Email,
  note: Note,
  call: Phone,
};

const ConversationsCard = (props) => {
  let parts = [];
  if (props.conversation.keyMoments && props.conversation.transcript) {
    parts = props.conversation.transcript
      .replace(props.conversation.keyMoments[0].keyMomentText, 'º')
      .split('º');
  } else {
    parts = [props.conversation.transcript];
  }
  const Icon = IconMap[props.conversation.type]
    ? IconMap[props.conversation.type]
    : IconMap.phone;

  return (
    <div
      onClick={props.onClick}
      className={`${DEFAULT_CLASSNAME}${props.selected ? ' selected' : ''}`}
      role="button"
    >
      <div className={`${DEFAULT_CLASSNAME}-row`}>
        <div className={`${DEFAULT_CLASSNAME}-icon-wrapper`}>
          <img src={Icon} />
        </div>
        <div className={`${DEFAULT_CLASSNAME}-content-wrapper`}>
          <div className={`${DEFAULT_CLASSNAME}-name-wrapper`}>
            <div className={`${DEFAULT_CLASSNAME}-name`}>
              {props.conversation.names.length > 0
                ? props.conversation.names.join(', ')
                : props.conversation.subject || 'No Participant Information'}
            </div>
            <div className={`${DEFAULT_CLASSNAME}-time`}>
              {props.conversation.date}
            </div>
          </div>
          {props.conversation.keyMoments ? (
            <div className={`${DEFAULT_CLASSNAME}-text`}>
              <span className={`${DEFAULT_CLASSNAME}-text match-text`}>
                {props.conversation.keyMoments[0].keyMomentText}
              </span>
              <span className={`${DEFAULT_CLASSNAME}-text post-text`}>
                {parts[1] &&
                  parts[1].slice(
                    0,
                    900 - props.conversation.keyMoments[0].keyMomentText.length
                  )}
                ...
              </span>
            </div>
          ) : (
            <div className={`${DEFAULT_CLASSNAME}-text`}>
              <span className={`${DEFAULT_CLASSNAME}-text pre-text`}>
                {`${parts[0] && parts[0].slice(0, 900)}${
                  parts[0] && parts[0].length > 300 ? '...' : ''
                }`}
              </span>
            </div>
          )}
          {/* <div className={`${DEFAULT_CLASSNAME}-text`}> 
						<span className={`${DEFAULT_CLASSNAME}-text pre-text`}>{`${parts[0].slice(0, 300)}${parts[0].length > 300 ? '...' : ''}`}</span>
						<span className={`${DEFAULT_CLASSNAME}-text match-text`}>{props.conversation.match}</span>
						<span className={`${DEFAULT_CLASSNAME}-text post-text`}>{parts[1]}</span>
					</div> */}
        </div>
      </div>
    </div>
  );
};

export default ConversationsCard;
