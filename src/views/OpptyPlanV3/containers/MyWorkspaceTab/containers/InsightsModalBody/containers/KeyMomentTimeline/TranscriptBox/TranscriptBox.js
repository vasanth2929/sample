import Scrollbar from 'perfect-scrollbar-react';
import React, { PureComponent } from 'react';
import { showAlert } from '../../../../../../../../../components/MessageModal/MessageModal';
import { createCardKeyMoments, createCardKeyMomentsComment } from '../../../../../../../../../util/promises/ai-promise';
import { getConvDetailsForKeyMoments } from '../../../../../../../../../util/promises/ai_promise';
import { getKeyMomentsForCardForOpptyPOrStoryforsubtype, removeKeyMomentForCard, updateCardKeyMoments, getKeyMomentsForCardForOpptyPOrStoryforsubtypes } from '../../../../../../../../../util/promises/dealcards_promise';
import './styles/TranscriptBox.style.scss';
import { getLoggedInUser, SanitizeUrl } from '../../../../../../../../../util/utils';
import avatar from '../../../../../../../../../assets/images/avatar.png';
import { KeyMomentContextMenu } from '../../../../../../ConversationsTab/containers/KeyMomentContextMenu/KeyMomentContextMenu';

export class TranscriptBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keyMomentId: this.props.keyMomentId,
      loadingTranscript: true,
      transcript: null,
      selectedKeyMomentIndex: 0,
      keyMoments: [],
      showKeyMomentsRemoveMenu: false,
      showKeyMomentsAddMenu: false,
      selectedKeyMomentId: null,
      selectedKeyMomentText: null,
      showCommentsForm: false,
      commentText: '',
      privateComment: true,
      showComment: false,
      selectedCard: {},
      selectedKeyMomentComment: null,
      contextMenuEvent: null,
      searchString: '',
      searchTranscript: null,
      matchCount: 0,
      count: 0
    };
    // this.removeKeyMomentMenu = React.createRef();
    this.addKeyMomentMenu = React.createRef();
    this.commentsFormBox = React.createRef();
    this.commentBox = React.createRef();
    this.changeSubtypeMenu = React.createRef();
  }

  componentDidMount() {
    this.getTranscript(this.props.conversationId, this.props.cardId);
    document.body.addEventListener('oncontextmenu', this.handleCloseAllMenus);
    // window.addEventListener("keydown", (e) => {
    //   if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) { 
    //       e.preventDefault();
    //       const { showSearch } = this.state;
    //       if (showSearch) {
    //         this.setState({
    //           showSearch: false,
    //           searchString: ''
    //         });
    //       } else {
    //         this.setState({ showSearch: true }, () => document.getElementById('search-transcript-text-control').focus());
    //       }
    //   }
    // });
  }

  componentDidUpdate(nextProps, nextState) {
    if (this.state.loadingTranscript !== nextState.loadingTranscript) {
      const elmt = document.getElementById(`keymoment-${nextProps.keyMomentId}`);
      if (elmt) elmt.scrollIntoView({ behavior: "instant", block: "start", inline: "nearest" });
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('oncontextmenu', this.handleCloseAllMenus);
  }

  handleCloseAllMenus = () => this.setState({
    contextMenuEvent: null,
    showKeyMomentsRemoveMenu: false,
    showKeyMomentsAddMenu: false,
    showChangeSubtypeMenu: false
  })

  getTypeIcon = (type) => {
    switch (type) {
      case 'call':
        return 'local_phone';
      case 'interview':
        return 'record_voice_over';
      case 'email':
        return 'email';
      default:
        return 'description';
    }
  }

  getTranscript = async () => {
    const {
      // userId, 
      keyMomentId,
      cardId,
      // conversationId,
      modalType,
      subType,
      opptyPlanId,
      storyId
    } = this.props;
    const resp1 = await getConvDetailsForKeyMoments(keyMomentId);
    let resp2;
    let resp3;
    if (opptyPlanId) {
      resp2 = modalType === 'MKM' ? await getKeyMomentsForCardForOpptyPOrStoryforsubtypes(cardId, ['machine_generated', 'context'], opptyPlanId, storyId)
        : await getKeyMomentsForCardForOpptyPOrStoryforsubtype(cardId, subType, opptyPlanId);
      resp3 = modalType !== 'MKM' ? await getKeyMomentsForCardForOpptyPOrStoryforsubtype(cardId, subType === 'context' ? 'protip' : 'context', opptyPlanId) : {};
    } else {
      resp2 = modalType === 'MKM' ? await getKeyMomentsForCardForOpptyPOrStoryforsubtypes(cardId, ['machine_generated', 'context'], opptyPlanId, storyId)
        : await getKeyMomentsForCardForOpptyPOrStoryforsubtype(cardId, subType, null, storyId);
      resp3 = modalType !== 'MKM' ? await getKeyMomentsForCardForOpptyPOrStoryforsubtype(cardId, subType === 'context' ? 'protip' : 'context', null, storyId) : {};
    }
    const transcript = resp1.data;
    const keyMomentsType1 = resp2.data.keyMomentsDetails || [];
    const keyMomentsType2 = resp3.data ? resp3.data.keyMomentsDetails || [] : [];
    const keyMoments = keyMomentsType1.filter(item => item.conversationId === transcript.convDetails.convId)
      .concat((keyMomentsType2 || []).filter(item => item.conversationId === transcript.convDetails.convId)) || [];
    const selectedKeyMomentIndex = keyMoments.filter(item => item.conversationId === transcript.convDetails.convId)
      .findIndex(item => (this.props.keyMomentId === item.cardKeyMomentsSummary.cardKeyMomentsId));
    if (keyMoments.length > 0) {
      const keyMomentIds = keyMoments.filter(item => item.subtype === 'machine_generated').map(item => item.cardKeyMomentsSummary.cardKeyMomentsId);
      for (let i = 0; i < keyMomentIds.length; i += 1) {
        setTimeout(() => {
          const selectedString = document.getElementById(`${keyMomentIds[i]}`);
          selectedString.addEventListener("contextmenu", (e) => { this.showChangeSubtypeMenu(e); });
        }, 50);
      }
      const keyMomentComments = keyMoments.map(item => item.cardKeyMomentsCommentBeans).flat().filter(item => item !== null);
      for (let i = 0; i < keyMomentComments.length; i += 1) {
        setTimeout(() => {
          const selectedCommentInd = document.getElementById(`key-moment-comment-${keyMomentComments[i].id}`);
          if (selectedCommentInd) selectedCommentInd.addEventListener("click", (e) => { this.showComment(e, keyMomentComments[i]); });
        }, 50);
      }
    }
    return this.setState({
      transcript,
      loadingTranscript: false,
      keyMoments: transcript.convDetails.type === 'notes' ? [] : keyMoments,
      selectedKeyMomentIndex
    }, () => {
      this.assignContextOption(this.state.keyMoments);
    });
  }

  getPosition = (e) => {
    const x = (e.clientX + document.body.scrollLeft);
    const y = (e.clientY + document.body.scrollTop);
    return { x, y };
  }

  formatSubtype = (subtype) => {
    return subtype === 'context' ? 'Insight' : (subtype.charAt(0).toUpperCase() + subtype.slice(1));
  }

  formatTextForTranscript(text) { // eslint-disable-line
    const transcriptArray = text ? text.split("\n") : '';
    const lastIndex = i => ((i !== transcriptArray.length - 1) ? '\n' : '');
    // console.log('transcriptArray: ');
    // console.log(transcriptArray);
    const formattedText = transcriptArray.length > 0
    ? transcriptArray
      .reduce(
        (section, str, index) => {
          return (str ? section + str.trim().replace(/\s+/g, " ") + lastIndex(index) : section);
        },
        ''
      )
    : '';

    return formattedText;
  }

  parseTranscriptJson({ convDetails }) {
    const { keyMoments } = this.state;
    const transcript = convDetails.transcript && convDetails.transcript;
    let formattedTranscript = this.formatTextForTranscript(transcript);
    if (keyMoments.length > 0) {
      for (let i = 0; i < keyMoments.length; i += 1) {
        if (!keyMoments[i].keyMomentsText) keyMoments[i].keyMomentsText = '';
        const formattedKeyMomentText = this.formatTextForTranscript(keyMoments[i].keyMomentsText[0] || '');
        formattedTranscript = formattedTranscript.replace(
          formattedKeyMomentText,
          this.renderKeyMoment(keyMoments[i], i)
        );
      }
    }
    return formattedTranscript.replace(/\n+/g, '<br><br>');
  }

  updateSelectedKeyMomentIndex = (e) => {
    const id = e.target.id;
    const { selectedKeyMomentIndex, keyMoments } = this.state;
    const value = selectedKeyMomentIndex + Number(id);
    if (value > -1 && value < keyMoments.length) {
      const elmt = document.getElementById(`keymoment-${keyMoments[value].cardKeyMomentsSummary.cardKeyMomentsId}`);
      if (elmt) elmt.scrollIntoView({ behavior: "instant", block: "start", inline: "nearest" });
      this.setState({ selectedKeyMomentIndex: value });
    }
  }

  assignContextOption = (keyMoments) => {
    const keyMomentIds = keyMoments.map(item => item.cardKeyMomentsSummary.cardKeyMomentsId);
    for (let i = 0; i < keyMomentIds.length; i += 1) {
      const selectedString = document.getElementById(`keymoment-${keyMomentIds[i]}`);
      if (selectedString) selectedString.addEventListener("contextmenu", (e) => { this.showChangeSubtypeMenu(e); });
    }
  }

  removeKeyMoment = () => {
    const keyMomentId = this.state.selectedKeyMomentId.split('-').pop();
    removeKeyMomentForCard(keyMomentId).then(() => {
      this.setState({ showKeyMomentsRemoveMenu: false, selectedKeyMomentId: null }, () => {
        return this.getTranscript(this.props.conversationId, this.props.cardId);
      });
    }).catch(() => {
      this.setState({ showKeyMomentsRemoveMenu: false, selectedKeyMomentId: null });
      showAlert('Something went wrong.', 'error');
    });
  }

  addKeyMoment = (subtype) => {
    const {
      cardId,
    } = this.props;
    const {
      selectedKeyMomentText,
      transcript
    } = this.state;
    const payload = [{
      keyMomentSourceId: transcript.convDetails.convId,
      keyMomentStartPosition: '',
      keyMomentText: [selectedKeyMomentText],
      keyMomentSubType: subtype,
      keyMomentType: transcript.keyMomentsType === 'zoom' ? 'interview' : transcript.keyMomentsType,
      shareStatus: 'public'
    }];
    createCardKeyMoments(cardId, payload).then(() => {
      this.setState({ showKeyMomentsAddMenu: false, selectedKeyMomentText: null }, () => {
        return this.getTranscript(this.props.conversationId, this.props.cardId);
      });
    }).catch(() => {
      this.setState({ showKeyMomentsAddMenu: false, selectedKeyMomentText: null });
      showAlert('Something went wrong.', 'error');
    });
  }

  provideCoaching = (e) => {
    const clientY = e.clientY;
    const clientX = e.clientX;
    const {
      cardId
    } = this.props;
    const {
      selectedKeyMomentText,
      transcript
    } = this.state;
    const payload = [{
      keyMomentSourceId: transcript.convDetails.convId,
      keyMomentStartPosition: '',
      keyMomentText: [selectedKeyMomentText],
      keyMomentSubType: 'protip',
      keyMomentType: transcript.keyMomentsType === 'zoom' ? 'interview' : transcript.keyMomentsType,
      shareStatus: 'public'
    }];
    createCardKeyMoments(cardId, payload).then((resp) => {
      this.commentsFormBox.current.style.top = `${clientY - 240}px`;
      this.commentsFormBox.current.style.left = `${clientX - 690}px`;
      this.setState({
        showKeyMomentsAddMenu: false,
        selectedKeyMomentText: null,
        showCommentsForm: true,
        selectedKeyMomentId: resp.data[0].cardKeyMomentsId
      }, () => {
        return this.getTranscript(this.props.conversationId, this.props.cardId);
      });
    }).catch(() => {
      this.setState({ showKeyMomentsAddMenu: false, selectedKeyMomentText: null });
      showAlert('Something went wrong.', 'error');
    });
  }

  handleCancelComment = () => {
    this.setState({
      showCommentsForm: false,
      commentText: ''
    });
  }

  handleKmSubtypeChange = (subType) => {
    const cardKeyMomentId = Number(this.state.selectedKeyMomentId);
    const payload = {
      cardKeyMomentId,
      subType,
      shareStatus: 'public'
    };
    updateCardKeyMoments(payload).then(() => {
      this.setState({ showChangeSubtypeMenu: false, selectedKeyMomentId: null }, () => {
        return this.getKeyMomentsForCardForConversation(this.props.gongCallForm.currentSelectedCard.cardId, this.props.conversationId);
      });
    }).catch(() => {
      this.setState({ showChangeSubtypeMenu: false, selectedKeyMomentId: null });
      showAlert('Something went wrong.', 'error');
    });
  }

  handleAddComment = () => {
    const keyMomentId = this.state.selectedKeyMomentId;
    const comment = this.state.commentText;
    const status = 'private';
    createCardKeyMomentsComment(keyMomentId, comment, status, 'coaching').then(() => {
      this.setState({
        showCommentsForm: false,
        commentText: '',
      }, () => {
        return this.getTranscript();
      });
    }).catch(() => {
      this.setState({
        showCommentsForm: false,
        commentText: '',
      });
      showAlert('Something went wrong', 'error');
    });
  }

  getCommentIndicator = (keyMomentComment) => {
    const coachingKeyMoments = keyMomentComment.find(keyMomentComm => keyMomentComm.type === 'coaching');
    return coachingKeyMoments ? `<span class='comment-indicator' id='key-moment-comment-${coachingKeyMoments.id}' data-comment=${coachingKeyMoments.commentText}>C</span>` : '';
  }

  showComment = (e, keyMomentComment) => {
    const position = this.getPosition(e);
    this.commentBox.current.style.top = `${position.y - 100}px`;
    this.commentBox.current.style.left = `${position.x - 560}px`;
    this.setState({ showComment: true, selectedKeyMomentComment: keyMomentComment });
  }

  handleCloseComment = () => {
    this.setState({ showComment: false, selectedKeyMomentComment: null });
  }

  showChangeSubtypeMenu = (e) => {
    e.preventDefault();
    if (!e.target.id || e.target.id.length === 0) return;
    const position = this.getPosition(e);
    this.setState({ contextMenuEvent: e });
    if (this.changeSubtypeMenu.current) {
      this.changeSubtypeMenu.current.style.top = `${position.y - 100}px`;
      this.changeSubtypeMenu.current.style.left = `${position.x - 560}px`;
    }
    this.setState({ showChangeSubtypeMenu: true, selectedKeyMomentId: e.target.id });
  }

  showAddKeyMomentOptions = (e) => {
    e.persist();
    e.preventDefault();
    const selectedString = window.getSelection().toString().trim();
    if (selectedString.length > 0 && !this.state.showKeyMomentsAddMenu) {
      const position = this.getPosition(e);
      this.setState({ contextMenuEvent: e });
      if (this.addKeyMomentMenu.current) {
        this.addKeyMomentMenu.current.style.top = `${position.y - 100}px`;
        this.addKeyMomentMenu.current.style.left = `${position.x - 560}px`;
      }
      this.setState({ showKeyMomentsAddMenu: true, selectedKeyMomentText: selectedString, selectedKeyMomentId: e.target.id });
    } else if (!this.state.showKeyMomentsAddMenu) {
      if (!e.target.id || e.target.id.length === 0) return;
      this.showChangeSubtypeMenu(e);
    }
  }

  renderKeyMoment = (item) => {
    return (
      this.props.keyMomentId !== item.cardKeyMomentsSummary.cardKeyMomentsId ?
        (`${item.cardKeyMomentsCommentBeans && item.cardKeyMomentsCommentBeans.length > 0 ? this.getCommentIndicator(item.cardKeyMomentsCommentBeans) : ''}<mark class="highLighted-text" title=${item.subtype === 'context' ? 'insights' : item.subtype} id=${`keymoment-${item.cardKeyMomentsSummary.cardKeyMomentsId}`}>${this.formatTextForTranscript(item.keyMomentsText[0])}</mark>`).replace(/\n+/g, '<br><br>')
        :
        (`${item.cardKeyMomentsCommentBeans && item.cardKeyMomentsCommentBeans.length > 0 ? this.getCommentIndicator(item.cardKeyMomentsCommentBeans) : ''}<mark class="current-keymoment" title=${item.subtype === 'context' ? 'insights' : item.subtype} id=${`keymoment-${item.cardKeyMomentsSummary.cardKeyMomentsId}`}>${this.formatTextForTranscript(item.keyMomentsText[0])}</mark>`).replace(/\n+/g, '<br><br>') // eslint-disable-line
    );
  }

  renderPageSection = () => {
    const { selectedKeyMomentIndex, keyMoments } = this.state;
    const length = keyMoments.length;
    let currentKeyMomentNumber = 0;
    if (length > 0) {
      currentKeyMomentNumber = selectedKeyMomentIndex + 1;
    }
    if (currentKeyMomentNumber > length) {
      currentKeyMomentNumber = length;
    }
    return (
      <div className="page-section-modal d-flex justify-content-between">
        <p id="-1" className={currentKeyMomentNumber === 1 ? "link disabled" : "link "} onClick={e => this.updateSelectedKeyMomentIndex(e)}>
          <i className="material-icons">navigate_before</i>Previous
                </p>
        <p className="data">{currentKeyMomentNumber}/{length}</p>
        <p id="1" className={currentKeyMomentNumber !== length ? "link" : "link disabled"} onClick={e => this.updateSelectedKeyMomentIndex(e)}>
          Next <i className="material-icons">navigate_next</i>
        </p>
      </div >
    );
  }

  handleSearch = (searchString) => {
    if (!searchString.target.value) {
      return this.setState({ searchString: '', matchCount: 0 });
    }
    const transcript = document.getElementById('transcript-data');
    const value = searchString.target.value;
    const matchCount = transcript.innerText.match(new RegExp(value, 'gi'));
    const matchedTexts = transcript.innerText.match(new RegExp(value, 'i'));
    const formattedTranscript = this.replaceAll(transcript.innerText, matchedTexts[0], `<strong class="search-word">${matchedTexts[0]}</strong>`);
    this.setState({ searchTranscript: { convDetails: { transcript: formattedTranscript } }, searchString, matchCount: matchCount.length }, () => {
      document.getElementsByClassName('search-word')[0].scrollIntoView();
    });
  }

  escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  replaceAll = (str, term, replacement) => {
    return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
  }

  renderContextMenu() {
    const { cardId } = this.props;
    const {
      keyMoments,
      transcript,
      selectedKeyMomentId,
      showKeyMomentsAddMenu,
      showChangeSubtypeMenu,
      contextMenuEvent,
      selectedKeyMomentText
    } = this.state;
    const id = (selectedKeyMomentId && selectedKeyMomentId.split) ? selectedKeyMomentId.split('-')[1] : null;
    const selectedKeyMoment = keyMoments.find(km => km.cardKeyMomentsSummary.cardKeyMomentsId === Number(id)) || {};
    return (showChangeSubtypeMenu || showKeyMomentsAddMenu) &&
      <KeyMomentContextMenu
        // keyMomentId={id}
        cardId={cardId}
        keyMoment={selectedKeyMoment}
        transcript={transcript}
        selectedText={selectedKeyMomentText}
        contextMenuEvent={contextMenuEvent}
        updateHandler={this.getTranscript}
        provideCoachingHandler={this.provideCoaching}
        onClose={() => {
          this.setState({
            contextMenuEvent: null,
            showKeyMomentsRemoveMenu: false,
            showKeyMomentsAddMenu: false,
            showChangeSubtypeMenu: false
          });
        }} />;
  }

  handleClearSearch = () => {
    const { searchString } = this.state;
    if (searchString) {
      this.setState({ searchString: '' });
      document.getElementById('search-transcript-text-control').value = '';
    } else {
      return false;
    }
  }

  render() {
    // const { subType } = this.props;
    const {
      loadingTranscript,
      transcript,
      // showKeyMomentsRemoveMenu,
      showCommentsForm,
      commentText,
      showComment,
      selectedKeyMomentComment,
      searchString,
      searchTranscript,
      matchCount,
      // showSearch
    } = this.state;
    const user = getLoggedInUser();
    return (
      <section className="transcript-box">
        {transcript &&
          <div className="transcript-box-header-section row">
            <div className="col-3">
              <p className="font-weight-bold meeting-date-type" title="Meeting date">
                {new Date(transcript.convMeetingMetadataBean.meetingDate).toLocaleDateString()}
              </p>
            </div>
            <div className={transcript.convDetails.type === 'call' ? 'col-6 text-center' : 'col-9 text-right'}>
              <p className="font-weight-bold meeting-date-type" title={transcript.convMeetingMetadataBean.meetingType}>
                {transcript.convMeetingMetadataBean.meetingType ? (
                  transcript.convMeetingMetadataBean.meetingType.length > 55 ? (
                    `${transcript.convMeetingMetadataBean.meetingType.slice(0, 55)}...`
                  ) : (
                      transcript.convMeetingMetadataBean.meetingType)
                ) : ''
                }
              </p>
            </div>
            {transcript.convDetails.type === 'call' &&
              <div className="col-3 text-right">
                <p className="font-weight-bold meeting-duration-link" title="Call duration">
                  {transcript.convMeetingMetadataBean.callDurationInMinutes ? `${Math.floor(transcript.convMeetingMetadataBean.callDurationInMinutes / 60)} Hrs ${transcript.convMeetingMetadataBean.callDurationInMinutes % 60} Mins` : ''}
                  {<i className="material-icons" title="Open audio link" onClick={() => window.open(transcript.convMeetingMetadataBean.audioLink, '_blank')} role="button">play_arrow</i>}
                </p>
              </div>}
          </div>}
        {loadingTranscript ? (<p className="font-weight-bold text-center" style={{ marginTop: '1em' }}>Loading transcript. Please wait...</p>) : (
          <section className="transcript-window">
            <header>
              <div className="row">
                <div className="col-4">
                  <div className={`searchStringWrapper ${searchString ? 'active-search' : ''}`}>
                    <input
                      ref={this.searchInput}
                      className="search-transcript-text-control"
                      id="search-transcript-text-control"
                      type="search"
                      placeholder="Search..."
                      onChange={this.handleSearch} />
                    <i className="material-icons searchbar-icon" role="button" onClick={() => this.handleClearSearch()}>{searchString ? 'close' : 'search'}</i>
                  </div>
                </div>
                <div className="col-4">
                  {searchString && <p className="search-count">{matchCount} occurences found</p>}
                  <p className="convo-subject font-weight-bold">{transcript.subject || ''}</p>
                </div>
                <div className="col-4 text-right page-section-wrapper">
                  {this.renderPageSection()}
                </div>
              </div>
            </header>
            <section className="transcript-textarea">
              <Scrollbar>
                <div className="transcript-text">
                  <p id="transcript-data" onContextMenu={e => this.showAddKeyMomentOptions(e)} dangerouslySetInnerHTML={{ __html: searchString ? this.parseTranscriptJson(searchTranscript) : this.parseTranscriptJson(transcript) }} /> {/* eslint-disable-line */}
                </div>
              </Scrollbar>
            </section>
          </section>
        )}
        {this.renderContextMenu()}
        <div className={`comments-form-box ${showCommentsForm ? 'active' : ''}`} ref={this.commentsFormBox} onClick={e => e.stopPropagation()} role="button">
          <div className="d-flex">
            <div className="user-info d-flex">
              <img
                src={user.pictureFile ? `tribyl/api/photo?location=${SanitizeUrl(user.pictureFile)}` : avatar}
                onError={(e) => { e.target.onerror = null; e.target.src = `${avatar}`; }}
                title={`${user.firstName} ${user.lastName}`}
                width="48"
                height="48" />
              <div>
                <p className="user-name-label font-weight-bold">{`${user.firstName} ${user.lastName}`}</p>
                <p className="comment-date">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="ml-auto comment-status">
              <p><i className="material-icons" title="Public">group</i></p>
            </div>
          </div>
          <div className="comment-textbox">
            <textarea
              rows="3"
              placeholder="Comment..."
              value={commentText}
              onChange={e => this.setState({ commentText: e.target.value })} />
          </div>
          <div className="comment-form-actions d-flex justify-content-end">
            <button className="cancel-btn btn" onClick={this.handleCancelComment}>Cancel</button>
            <button className="save-btn btn" onClick={this.handleAddComment} disabled={commentText.length === 0}>Save</button>
          </div>
        </div>
        <div className={`comments-show-box ${showComment ? 'active' : ''}`} ref={this.commentBox} onClick={e => e.stopPropagation()} role="button">
          <div className="d-flex">
            <div className="user-info d-flex">
              <img
                src={selectedKeyMomentComment && selectedKeyMomentComment.insertBy.pictureFile ? `tribyl/api/photo?location=${SanitizeUrl(selectedKeyMomentComment && selectedKeyMomentComment.insertBy.pictureFile)}` : avatar}
                onError={(e) => { e.target.onerror = null; e.target.src = `${avatar}`; }}
                title={`${selectedKeyMomentComment && (selectedKeyMomentComment.insertBy.firstName || '')} ${selectedKeyMomentComment && (selectedKeyMomentComment.insertBy.lastName || '')}`}
                width="48"
                height="48" />
              <div>
                <p className="user-name-label font-weight-bold">{`${selectedKeyMomentComment && (selectedKeyMomentComment.insertBy.firstName || '')} ${selectedKeyMomentComment && (selectedKeyMomentComment.insertBy.lastName || '')}`}</p>
                <p className="comment-date">{(selectedKeyMomentComment && selectedKeyMomentComment.insertTime) ? new Date(selectedKeyMomentComment.insertTime).toLocaleDateString() : ''}</p>
              </div>
            </div>
            <div className="ml-auto comment-status">
              <p><i className="material-icons" title={selectedKeyMomentComment && selectedKeyMomentComment.status === 'private' ? 'Private' : 'Public'}>{selectedKeyMomentComment && selectedKeyMomentComment.status === 'private' ? 'person' : 'people'}</i></p>
            </div>
          </div>
          <div className="comment-textbox">
            <p className="comment-display-text">
              {selectedKeyMomentComment && selectedKeyMomentComment.commentText}
            </p>
          </div>
          <div className="comment-form-actions d-flex justify-content-end">
            <button className="close-btn btn" onClick={this.handleCloseComment}>Close</button>
          </div>
        </div>
      </section>
    );
  }
}
