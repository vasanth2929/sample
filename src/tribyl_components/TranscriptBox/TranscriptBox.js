import { isEqual } from 'lodash';
import React, { Component } from 'react';
import Select from 'react-select';
import './TranscriptBox.style.scss';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Button, CircularProgress } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import { ModalMUI } from '../../components/CustomModal/CustomModal';
import { getTranscriptWithFragmentsForConvAndCard } from '../../util/promises/conversation_promise';
import { withRouter } from 'react-router';
const DEFAULT_CLASSNAME = 'transcript-box';
class TranscriptBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullView: false,
      isLoadingTranscript: true,
      keymomentHighlights: [],
      currentKeymoment: [],
      keymomentList: [],
      transcriptData: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.keymomentList, prevProps.keymomentList)) {
      this.goToKeymoment('prev');
    }

    if (!isEqual(this.props.isLoading, prevProps.isLoading)) {
      this.goToKeymoment('prev');
    }
    if (
      !isEqual(this.props.selectedConversation, prevProps.selectedConversation) || (!isEqual(prevProps.dropdownValue,this.props.dropdownValue) && this.props.usedIn==='ca')
    ) {
      this.loadTranscriptAndKeyhighlights();
    }
  }

  componentDidMount() {
    this.loadTranscriptAndKeyhighlights();
  }

  loadTranscriptAndKeyhighlights = async () => {
    this.setState({ isLoadingTranscript: true });
    const { match, selectedConversation } = this.props;
    let cardId = match.params.cardId;
    const url = new URL(window.location.href);
    if (url.searchParams.get('containSpecialCharacter') === 'true') {
      cardId = +url.searchParams.get('cardId');
    }
    try {
      if (selectedConversation?.id) {
        const reponse = await getTranscriptWithFragmentsForConvAndCard(
          Number(cardId),
          selectedConversation.id,
          this.props.dropdownValue?.id
        );
        const transcriptData = reponse ? reponse.data : null;
        this.setState({ transcriptData }, () => this.highlightMatchedText());
      } else {
        this.setState({ transcriptData: null }, () =>
          this.highlightMatchedText()
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoadingTranscript: false });
    }
  };

  handlePlay = () => {
    const { transcriptData } = this.state;
    const gongUrl = transcriptData?.gongUrl;
    window.open(`${gongUrl}`, '_blank');
  };

  renderPlayButton = () => {
    const { transcriptData } = this.state;
    if (transcriptData?.convType === 'call' && transcriptData?.gongUrl) {
      return (
        <Button
          color="secondary"
          className="play-button"
          size="small"
          variant="contained"
          onClick={this.handlePlay}
          endIcon={<PlayArrowIcon />}
        >
          Play
        </Button>
      );
    } else return <div />;
  };

  renderTearOut = () => {
    return (
      <div>
        <LaunchIcon
          role="button"
          size="small"
          onClick={() => this.setState({ isFullView: true })}
        />
      </div>
    );
  };

  scrollToKeymoment = (keyMomentId) => {
    const id = `match-${keyMomentId}`;
    const element = document.getElementById(id);
    if (element)
      element.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'start',
      });
  };

  highlightMatchedText = () => {
    const { transcriptData } = this.state;
    let keymomentList = [];
    let parts = [];
    let currentKeymoment = [];
    if (
      transcriptData &&
      transcriptData.keyMomentsForConv &&
      transcriptData.keyMomentsForConv.length > 0
    ) {
      currentKeymoment = transcriptData.keyMomentsForConv[0].keyMomentId
        ? transcriptData.keyMomentsForConv[0].keyMomentId
        : [];
      keymomentList = transcriptData.keyMomentsForConv?.map(
        (i) => i.keyMomentId
      );
      parts = [transcriptData.transcript];
      transcriptData.keyMomentsForConv?.forEach((keyMoment) => {
        // replace <em></em> tags with "" to match with transcript, as transcript dont have em
        const keymomentWithoutEm = keyMoment.keyMomentText.replaceAll(
          /<em>|<\/em>/gm,
          ''
        );
        parts.forEach((part, jitter) => {
          if (typeof part === 'string' && part.includes(keymomentWithoutEm)) {
            const newParts = part.split(keymomentWithoutEm);
            const boldKeymoment = keyMoment.keyMomentText.split(' ').map((i) =>
              // search for string <em>example</em> if found then replace <em</em> with space
              i.search(/<em>\w+<\/em>/gm) !== -1 ? (
                <strong>{i.replaceAll(/<em>|<\/em>/gm, ' ')}</strong>
              ) : (
                i + ' '
              )
            );
            newParts.splice(
              1,
              0,
              <span
                id={`match-${keyMoment.keyMomentId}`}
                className={`${DEFAULT_CLASSNAME}-transcript-part-highlited`}
              >
                {boldKeymoment}
              </span>
            );
            parts.splice(jitter, 1, ...newParts);
          }
        });
      });
      this.setState(
        {
          isLoadingTranscript: false,
          keymomentHighlights: parts,
          currentKeymoment,
          keymomentList,
        },
        () => this.scrollToKeymoment(currentKeymoment)
      );
    } else {
      this.setState(
        {
          isLoadingTranscript: false,
          keymomentHighlights: [],
          keymomentList: [],
          currentKeymoment: [],
        },
        () => this.scrollToKeymoment(currentKeymoment)
      );
    }
  };

  goToKeymoment = (type) => {
    const { currentKeymoment, keymomentList } = this.state;
    const index = keymomentList.indexOf(currentKeymoment);
    let newkeyMomentId = currentKeymoment;
    if (type === 'next' && index < keymomentList.length) {
      newkeyMomentId = keymomentList[index + 1];
    } else if (type === 'prev' && index > 0) {
      newkeyMomentId = keymomentList[index - 1];
    }
    this.scrollToKeymoment(newkeyMomentId);
    this.setState({ currentKeymoment: newkeyMomentId });
  };

  renderTranscript = (showDropDown) => {
    const {
      isLoadingTranscript,
      keymomentHighlights,
      currentKeymoment,
      keymomentList,
    } = this.state;
    const { isFullView } = this.state;
    return (
      <div
        className={`trans-wrap ${DEFAULT_CLASSNAME}-content-section-selected-conversations ${
          isFullView ? 'fullview' : ''
        }`}
      >
        {showDropDown && <Select
          className={`keyword-filter-label ${this.props.usedIn}`}
          classNamePrefix="keyword-filter-label-select"
          options={this.props.options}
          value={this.props.dropdownValue}                 
          onChange={this.props.onDropdownChange}
        />}
        {!isLoadingTranscript ? (
          <React.Fragment>
            <div
              className={`${DEFAULT_CLASSNAME}-content-section-selected-conversations-header`}
            >
              {!isFullView ? this.renderTearOut() : <div />}
              <div
                className={`${DEFAULT_CLASSNAME}-content-section-selected-conversations-header-pagination`}
              >
                <div
                  role="button"
                  onClick={() => this.goToKeymoment('prev')}
                  className={`${DEFAULT_CLASSNAME}-content-section-selected-conversations-header-pagination-button ${
                    !currentKeymoment ||
                    currentKeymoment.length === 0 ||
                    keymomentList[0] === currentKeymoment
                      ? 'disabled'
                      : ''
                  }`}
                >
                  <i role="button" className="material-icons">
                    chevron_left
                  </i>
                  Previous
                </div>
                <div
                  className={`${DEFAULT_CLASSNAME}-content-section-selected-conversations-header-pagination-counter`}
                >
                  {`${keymomentList?.indexOf(currentKeymoment) + 1}/${
                    keymomentList.length
                  }`}
                </div>
                <div
                  role="button"
                  onClick={() => this.goToKeymoment('next')}
                  className={`${DEFAULT_CLASSNAME}-content-section-selected-conversations-header-pagination-button ${
                    !currentKeymoment ||
                    currentKeymoment.length === 0 ||
                    keymomentList[keymomentList.length - 1] === currentKeymoment
                      ? 'disabled'
                      : ''
                  }`}
                >
                  Next
                  <i role="button" className="material-icons">
                    chevron_right
                  </i>
                </div>
              </div>
              {this.renderPlayButton()}
            </div>
            <div
              className={`${DEFAULT_CLASSNAME}-content-section-selected-conversations-scrollable-content`}
            >
              <div
                className={`${DEFAULT_CLASSNAME}-content-section-selected-conversations-transcript`}
              >
                {keymomentHighlights}
              </div>
            </div>
          </React.Fragment>
        ) : (
          <div className={`${DEFAULT_CLASSNAME}-loading`}>
            <CircularProgress />
          </div>
        )}
      </div>
    );
  };

  renderFullView = () => {
    return (
      <ModalMUI
        title="Transcript"
        isOpen={this.state.isFullView}
        onClose={() => this.setState({ isFullView: false })}
        maxWidth="lg"
      >
        {this.renderTranscript(false)}
      </ModalMUI>
    );
  };

  render() {
    const { isFullView } = this.state;
    return isFullView ? this.renderFullView() : this.renderTranscript(true);
  }
}

export default withRouter(TranscriptBox);
