import React from 'react';
import { Async } from '../../../../../../../../basecomponents/async/async';
import { getConvDetailsForKeyMoments } from '../../../../../../../../util/promises/ai_promise';
import { getShortName } from '../../../../../../../../util/utils';
import './styles/KeyMomentDetailPanel.styles.scss';
import phone from '../../../../../../../../assets/iconsV2/phone.svg';

export class KeyMomentDetailPanel extends React.PureComponent {
  state = { isContentVisible: true };

  getCurrentIndex = (list, val) => {
    return list.indexOf(val);
  };

  getpromise = () => {
    const { selectedKeyMomentId } = this.props;
    return getConvDetailsForKeyMoments(selectedKeyMomentId);
  };

  decrementKeyMomentId = () => {
    const { selectedKeyMomentId, keyMomentIdList } = this.props;
    const index = this.getCurrentIndex(keyMomentIdList, selectedKeyMomentId);
    if (index === 0) {
      return;
    }
    this.props.updateSelectedKeyMomentId(keyMomentIdList[index - 1]);
  };

  incrementKeyMomentId = () => {
    const { selectedKeyMomentId, keyMomentIdList } = this.props;
    const index = this.getCurrentIndex(keyMomentIdList, selectedKeyMomentId);
    if (index === keyMomentIdList.length - 1) {
      return;
    }
    this.props.updateSelectedKeyMomentId(keyMomentIdList[index + 1]);
  };

  parseTranscriptJson({ convDetails, conversationAnnotationDetails }) {
    let sampleString = '';
    let transcript = '';
    try {
      transcript = JSON.parse(convDetails.transcript);
    } catch (error) {
      transcript = convDetails.transcript;
    }
    if (transcript && transcript.monologues) {
      transcript.monologues.forEach((monologue) => {
        sampleString += `<p><b>Speaker ${monologue.speaker}   (${Math.floor(
          monologue.elements[0].ts / 60
        )}:${
          Math.ceil(monologue.elements[0].ts % 60) > 10
            ? Math.ceil(monologue.elements[0].ts % 60)
            : '0' + Math.ceil(monologue.elements[0].ts % 60)
        })  : </b><span>`;
        for (let i = 0; i < monologue.elements.length; i += 1) {
          sampleString += monologue.elements[i].value;
        }
        sampleString += '</span></p>';
      });
    } else {
      switch (convDetails.type) {
        case 'call':
          sampleString = transcript
            ? transcript.replace(/\n+/g, '<br><br>')
            : '';
          break;
        default:
          sampleString = transcript
            ? transcript.replace('<div><br></div>', '').replace(/\n+/g, '')
            : '';
          break;
      }
    }

    conversationAnnotationDetails.forEach((item) => {
      sampleString = sampleString.replace(
        item.cardKeyMomentsText,
        `<mark class="highLighted-text">${item.cardKeyMomentsText}</mark>`
      );
    });
    return sampleString;
  }

  handleContentVisibility = () => {
    this.setState({ isContentVisible: !this.state.isContentVisible });
  };

  renderOtherAccordianHeader = (keyMomentDetail, isContentVisible) => {
    const {
      convMeetingMetadataBean,
      convDetails: { type },
    } = keyMomentDetail;
    if (!convMeetingMetadataBean) {
      return (
        <div
          role="button"
          className="accordian-header"
          onClick={this.handleContentVisibility}
        >
          <p>No Metadata found</p>
        </div>
      );
    }
    const { meetingDate, attendees } = convMeetingMetadataBean;
    return (
      <div
        role="button"
        className="accordian-header"
        onClick={this.handleContentVisibility}
      >
        <p className="blue-text">
          {new Date(meetingDate).toLocaleDateString()}
        </p>
        {isContentVisible ? (
          <i className="material-icons blue-text">keyboard_arrow_up</i>
        ) : (
          <i className="material-icons blue-text">keyboard_arrow_down</i>
        )}
        {this.renderAccordianIcons(type)}
        <p>{attendees && attendees.map((i) => getShortName(i)).join(',')}</p>
        <p>Matches</p>
        <p>Attachments</p>
      </div>
    );
  };
  renderEmailAccordianHeader = (keyMomentDetail, isContentVisible) => {
    const {
      subject,
      convDetails: { type },
      msgCount,
      adresseeNames,
      emailDate,
    } = keyMomentDetail;

    return (
      <div
        role="button"
        className="accordian-header"
        onClick={this.handleContentVisibility}
      >
        <p className="blue-text">{new Date(emailDate).toLocaleDateString()}</p>
        {isContentVisible ? (
          <i className="material-icons blue-text">keyboard_arrow_up</i>
        ) : (
          <i className="material-icons blue-text">keyboard_arrow_down</i>
        )}
        <p>{subject}</p>
        {this.renderAccordianIcons(type)}
        <p>{(adresseeNames || []).map((i) => getShortName(i)).join(',')}</p>
        <p>Matches</p>
        <p>Attachments </p>
        <p>Count: {msgCount || 0}</p>
      </div>
    );
  };
  renderAccordianHeader = (keyMomentDetail, isContentVisible) => {
    const {
      convDetails: { type },
    } = keyMomentDetail;

    return (
      <React.Fragment>
        {type !== 'email'
          ? this.renderOtherAccordianHeader(keyMomentDetail, isContentVisible)
          : this.renderEmailAccordianHeader(keyMomentDetail, isContentVisible)}
      </React.Fragment>
    );
  };
  renderAccordianIcons = (icon) => {
    switch (icon) {
      case 'email':
        return <i className="material-icons">email</i>;
      case 'call':
        return <img src={phone} />;
      case 'document':
        return <i className="material-icons">description</i>;
      case 'interview':
        return <i className="material-icons">record_voice_over</i>;
      default:
        return '';
    }
  };

  renderKeymomentContent = (keyMomentDetail) => {
    const { selectedKeyMomentId, keyMomentIdList, clearKeyMomentdetails } =
      this.props;
    const { isContentVisible } = this.state;
    if (!keyMomentDetail) {
      return <div />;
    }
    const { subject } = keyMomentDetail;
    return (
      <div className="key-moment-content-opty">
        <div className="header">
          <div>
            <span className="title-section">
              <span role="button" onClick={clearKeyMomentdetails}>
                <i className="material-icons">keyboard_backspace</i>
              </span>
              {subject || ''}
            </span>
          </div>
          <div className="actions">
            <span
              role="button"
              onClick={this.decrementKeyMomentId}
              className={
                this.getCurrentIndex(keyMomentIdList, selectedKeyMomentId) > 0
                  ? ''
                  : 'disabled'
              }
            >
              <i className="material-icons">keyboard_arrow_left</i>
              Previous
            </span>
            <span
              role="button"
              onClick={this.incrementKeyMomentId}
              className={
                this.getCurrentIndex(keyMomentIdList, selectedKeyMomentId) <
                keyMomentIdList.length - 1
                  ? ''
                  : 'disabled'
              }
            >
              Next
              <i className="material-icons">keyboard_arrow_right</i>
            </span>
          </div>
        </div>
        <div className="content-container">
          {this.renderAccordianHeader(keyMomentDetail, isContentVisible)}
          <div
            className={isContentVisible ? 'content' : 'content hide'}
            dangerouslySetInnerHTML={{
              __html: this.parseTranscriptJson(keyMomentDetail),
            }} // eslint-disable-line
          />
        </div>
      </div>
    );
  };

  render() {
    return (
      <Async
        identifier="key-moments"
        promise={this.getpromise}
        content={this.renderKeymomentContent}
        loader={<div>Loading...</div>}
        error={<div>Error...</div>}
      />
    );
  }
}
