/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideModal } from '../../../../../action/modalActions';
import img_avatar from '../../../../../assets/icons/img_avatar.png';
import { ToggleButton } from '../../../../../basecomponents/ToggleButton/ToggleButton';
import AddCardModal from '../../../../../components/AddCardModal/AddCardModal';
import Checkbox from '../../../../../components/Checkbox/Checkbox';
import Match from '../../../../../components/Match/Match';
import ReactQuillEditor from '../../../../../components/ReactQuillEditor/ReactQuillEditor';
import { Tags } from '../../../../../components/Tags/Tags';
import {
  ModalMUI,
  showCustomModal,
} from '../../../../../components/CustomModal/CustomModal';
import { CollapsibleV2 } from '../../../../../tribyl_components/Collapsible/Collapsible';
import { AddFeedBackForm } from '../../../../../tribyl_components/Differentiation/AddFeedBackForm';
import {
  tagCardToStory,
  unverifyDealCardForStory,
} from '../../../../../util/promises/dealcards_promise';
import {
  addNetnewWithPBCardRel,
  createPBCardForQuestionForSubtypeForSolution,
} from '../../../../../util/promises/playbooks_promise';
import { createStoryCardNote } from '../../../../../util/promises/storyboard_promise';
import {
  dispatch,
  getLoggedInUser,
  topicToolTips,
} from '../../../../../util/utils';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../../../constants/general';
import './Cards.style.scss';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';
import MatchedKeyword from './MatchedKeywords';
const DEFAULT_CLASSNAME = 'category-card';

class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetailModalOpen: false,
      detailModalType: '',
      detailModalValue: '',
      wordLimit: 100,
      id: null,
    };
  }

  sortData = (card) => {
    // sorting criteria as per priority highest vote count > highest match count > alphabetical
    const sortAlphabetical =
      card && card.data.sort((a, b) => a.title.localeCompare(b.title));
    const sortByVotes = sortAlphabetical.sort((a, b) => {
      if (a.verifyCount < b.verifyCount) {
        return 1;
      } else if (a.verifyCount === b.verifyCount) {
        if (a.matchCount < b.matchCount) {
          return 1;
        } else if (a.matchCount === b.matchCount) {
          return a.title.localeCompare(b.title);
        }
      }
      return -1;
    });
    return { ...card, data: sortByVotes };
    // return card;
  };

  toggleNotesTags = () => {
    const { toggleInsights, changeFilter } = this.props;
    if (toggleInsights === 'notes') {
      /* this.setState({ toggleState: "keyword" }); */
      changeFilter({ toggleInsightsKeyowrds: 'keyword' });
    } else {
      /* this.setState({ toggleState: "notes" }); */
      changeFilter({ toggleInsightsKeyowrds: 'notes' });
    }
  };

  renderVotes = (verifiedBy) => {
    const imgArray = [];
    if (verifiedBy && verifiedBy.length > 0) {
      verifiedBy.forEach((v, i) => {
        imgArray.push(<img key={i} src={img_avatar} title={v.name} />);
      });
    } else {
      imgArray.push(<img key={1} style={{ opacity: 0.5 }} src={img_avatar} />);
    }

    return imgArray.length > 0 ? imgArray : <div />;
  };

  handleVerification = async (status, id) => {
    const { storyId } = this.props;
    const user = getLoggedInUser();
    if (status) {
      await tagCardToStory(id, storyId, user.userId);
    } else {
      await unverifyDealCardForStory(id, user.userId, storyId);
    }
    // console.log({ status, id });
  };

  handleSubmit = async (note, id) => {
    const user = getLoggedInUser();
    const { storyId } = this.props;
    const payload = {
      cardId: id,
      notes: note,
      storyId: Number(storyId),
      type: 'context',
      subtype: 'string',
      userId: user.userId,
    };
    try {
      const repsone = await createStoryCardNote(payload);
    } catch (err) {
      // console.log(err);
    }
  };

  onVerify = async (card) => {
    const { reload } = this.props;
    const user = getLoggedInUser();
    const { storyId } = this.props;
    const response = await tagCardToStory(card.id, storyId, user.userId);
    hideModal();
    reload();
  };

  redirect = (cardId) => {
    return () => {
      const { history, storyId } = this.props;
      window.open(`/conversation-analysis/${storyId}/${cardId}`, '_blank');
    };
  };

  showMore = (cardId) => {
    const element = document.getElementById(`taglist-${cardId}`);
    element.classList.toggle('expand');
  };

  renderShowMoreTags(card) {
    let showMore = false;

    const expand = () => {
      const element = document.getElementById(`taglist-${card.id}`);
      element.classList.toggle('expand');
      showMore = !showMore;
      console.log({ showMore });
    };
    return () => {
      return (
        <div id={`taglist-${card.id}`} className="taglist">
          <React.Fragment>
            {card.matchedTags && card.matchedTags.length > 0 && (
              <Tags tags={card.matchedTags} />
            )}
            <div
              onClick={() => expand(card.id)}
              className="expand-key"
              id={`expand-${card.id}`}
            >
              {/* <Tooltip title="Toggle view">
                <ArrowDropDownCircleOutlinedIcon fontSize="medium" />
              </Tooltip> */}
              {!showMore ? <span>Show More</span> : <span>Show Less</span>}
            </div>
          </React.Fragment>
        </div>
      );
    };
  }

  handleRender = (Allcard) => {
    const { toggleInsights } = this.props;

    // const cardData = this.sortData(Allcard);
    const cardData = Allcard;
    return cardData.data?.length > 0 ? (
      <table className="table table-borderless">
        <thead>
          <tr>
            <th style={{ width: '30%' }}>TITLE</th>
            {cardData.mainTopic !== 'Competitors' && (
              <th style={{ width: '10%' }} />
            )}
            <th width="50%" className="toggleSwitch">
              Insights
              <ToggleButton
                value={toggleInsights !== 'notes'}
                handleToggle={this.toggleNotesTags}
              />
              Matched keywords
            </th>
            <th style={{ width: '10%' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {cardData &&
            cardData.data?.map((card) => (
              <tr key={card.id}>
                <td>
                  <span
                    role="button"
                    className="card_title"
                    title={card.title}
                    onClick={() =>
                      this.handleMoreClick(
                        'description',
                        card.description,
                        card.id
                      )
                    }
                  >
                    {card.title.length > 33
                      ? card.title.substring(0, 33) + '...'
                      : card.title}
                  </span>
                </td>
                {/* <ReactTooltip delayShow={300} delayHide={100} effect="solid" multiline place="top" /> */}
                {cardData.mainTopic !== 'Competitors' && (
                  <td>
                    <div className="avatar">
                      <div className="avatar-container">
                        {this.renderVotes(card.verifiedBy)}
                      </div>
                      <div className="votes">
                        {card.verifyCount ? card.verifyCount : 0} Votes
                      </div>
                    </div>
                  </td>
                )}
                <td className="notes">
                  {toggleInsights === 'notes' ? (
                    <div className="notes-wrap">
                      <ReactQuillEditor
                        defaultValue={
                          this.renderCardNotes(card.latestCardNote) || ''
                        }
                        id={card.id}
                        module
                        formats
                        readOnly /* onBlur={this.handleSubmit} */
                      />
                      {this.renderShowMore(card.latestCardNote)}
                    </div>
                  ) : (
                    <MatchedKeyword card={card} />
                  )}
                </td>
                <td className="action">
                  <Checkbox
                    isChecked={card.verifyCount > 0}
                    id={card.id}
                    oncheck={this.handleVerification}
                    className="question-checkbox"
                    readOnly
                  />
                  <Match
                    count={card.matchCount || 0}
                    onClick={this.redirect(card.id)}
                    isDisabled={card.matchCount === 0}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    ) : (
      <i className="d-flex justify-content-center">No Cards found!</i>
    );
  };
  renderCardNotes = (notes) => {
    const { wordLimit } = this.state;
    const newNotes = notes && notes.replace(/\\n\\n/g, '...');
    if (newNotes && newNotes.length > wordLimit) {
      const notesTruncated = newNotes.substring(0, wordLimit);
      return notesTruncated;
    }
    return newNotes;
  };

  renderShowMore = (notes) => {
    /* const matchNotes = notes && /\\n/.exec(notes); */
    const { wordLimit } = this.state;
    const newNotes = notes && notes.replace(/\\n/g, ' ');
    if (newNotes && newNotes.length > wordLimit) {
      return (
        <span
          role="button"
          className="show-more"
          onClick={() => this.handleMoreClick('insights', notes)}
        >
          More
        </span>
      );
    }
    return '';
  };

  handleMoreClick = (type, value, id = null) => {
    this.setState({
      isDetailModalOpen: true,
      detailModalType: type,
      detailModalValue: value,
      id,
    });
  };

  ellipsedText = (str) => {
    if (str?.length > 32) return str?.slice(0, 32) + '...';
    else return str;
  };

  showDetailModal = () => {
    const { isDetailModalOpen, detailModalType, detailModalValue, id } =
      this.state;
    const data = this.props.cardData?.data?.find((t) => t.id === id);
    return (
      <ModalMUI
        title={
          detailModalType === 'insights'
            ? 'Insights'
            : this.ellipsedText(data?.title || '') || 'Description'
        }
        className="story-modal"
        isOpen={isDetailModalOpen}
        onClose={() => this.setState({ isDetailModalOpen: false })}
        maxWidth="sm"
        showApproved={detailModalType === 'description'}
        approved={data?.isTestCard !== 'Y' ? 'Y' : 'N'}
      >
        <p style={{ marginBottom: '0px' }}>Description</p>
        <div style={{ marginTop: '-20px' }}>
          <AddFeedBackForm value={detailModalValue} uiType="dgt" />
        </div>
      </ModalMUI>
    );
  };

  showAddCardModal = (selectedTopic) => {
    selectedTopic.name = selectedTopic.topic;
    selectedTopic.mainTopic = selectedTopic.mainTopic;
    showCustomModal(
      <div className="d-flex justify-content-between">
        <h5 className="modal-title"> Add {selectedTopic.topic}</h5>
      </div>,
      <AddCardModal
        selectedTopic={selectedTopic}
        onCreate={this.onCreate}
        onVerify={this.onVerify}
      />,
      'story-modal',
      () => {},
      false,
      this.getLoader()
    );
  };

  getLoader = () => <div>Loading...</div>;

  onCreate = (value) => {
    const { storyId, topicList, reload } = this.props;
    let payload = {
      description: value.description || '',
      title: value.title,
      playbookId: 9,
      storyId: parseInt(storyId, 10),
      cardSubType: value.topic_name.toLowerCase(),
    };
    const SelectedtopicId = topicList.find(
      (item) => item.name === value.topic_name || item.name === value.main_topic
    );
    payload = {
      ...payload,
      topicId: SelectedtopicId ? SelectedtopicId.id : '',
      isTestCard: 'Y',
    };
    createPBCardForQuestionForSubtypeForSolution(payload).then((response) => {
      const card = response.data;
      addNetnewWithPBCardRel(card.id, storyId);
      hideModal();
      reload();
    });
  };

  headerOptions = () => {
    const { cardData } = this.props;
    return (
      <span
        role="button"
        className="material-icons link blue"
        onClick={() => this.showAddCardModal(cardData)}
      >
        add
      </span>
    );
  };

  renderTitle = (cardData) => {
    const tooltip = topicToolTips.find(
      (i) => i.topic.toLowerCase() === cardData.topic?.toLowerCase()
    );
    return (
      <div className="d-flex align-items-center">
        <span className="mr-2">
          {cardData.topic} ({cardData.data?.length})
        </span>
        <Tooltip title={tooltip?.tip}>
          <HelpOutlineIcon fontSize="small" />
        </Tooltip>
      </div>
    );
  };

  render() {
    const { cardData, isOpen } = this.props;

    return (
      <div className={DEFAULT_CLASSNAME}>
        <CollapsibleV2
          openDefault={isOpen}
          title={this.renderTitle(cardData)}
          body={this.handleRender(cardData)}
        />
        {this.showDetailModal()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    toggleInsights: state.marketPerformanceFilters.toggleInsightsKeyowrds,
  };
}

function mapDispatchToProps() {
  return bindActionCreators(
    {
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
    },
    dispatch
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cards));
