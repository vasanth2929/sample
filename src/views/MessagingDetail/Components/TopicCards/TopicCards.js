import { Box, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import AddCardModal from '../../../../components/AddCardModal/AddCardModal';
import { ModalMUI } from '../../../../components/CustomModal/CustomModal';
import { createPBCardForQuestionForSubtypeForSolution } from '../../../../util/promises/playbooks_promise';
import { topicToolTips } from '../../../../util/utils';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import './TopicCards.style.scss';
import { getUserId } from '../../util';
import { ToggleButton } from '../../../../basecomponents/ToggleButton/ToggleButton';

const typeSubTypeObject = [
  {
    type: 'Pain Points',
    subtype: [],
  },
  {
    type: 'Decision Criteria',
    subtype: [
      { value: 'product', label: 'Product' },
      { value: 'pricing', label: 'Pricing' },
      { value: 'positioning', label: 'Positioning' },
      { value: 'success', label: 'Success' },
    ],
  },
  {
    type: 'Justification',
    subtype: [
      {
        value: 'KPI',
        label: 'KPIs',
      },
      {
        value: 'compelling_event',
        label: 'Triggers',
      },
    ],
  },
  {
    type: 'Use Cases',
    subtype: [],
  },
  {
    type: 'Competitors',
    subtype: [],
  },
  {
    type: 'Partners',
    subtype: [],
  },
];
const DEFAULT_CLASSNAME = 'topic-cards';

class TopicCards extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      typefilter: this.props.subtopicfilter,
      selectedCard: null,
      isAddCardModalOpen: false,
      isMyTest: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { selectedCard } = this.props;
    if (this.props.selectedTopic !== prevProps.selectedTopic) {
      this.setState({ typefilter: this.props.subtopicfilter });
    }
    if (selectedCard !== prevProps.selectedCard) {
      this.setState({ selectedCard });
    }
  }

  renderCards = (type, data) => {
    const { selectedCard } = this.state;
    const typeName = type.replace(/ /g, '').toLowerCase();
    let status =
      data.status.toLowerCase() === 'final' ? 'Approved' : data.status;
    const isTest = data.isTestCard === 'Y' && status !== 'archived';
    if (isTest) {
      status = 'Test';
    }
    if (
      this.props.status === 'test' &&
      this.props.isMyTest &&
      data?.createdByUserId !== getUserId()
    )
      return '';

    return (
      <div
        key={data.id}
        className={`topicCard ${status} ${
          isTest ? 'Approved test-card' : ''
        } ${typeName} ${
          selectedCard && selectedCard.id === data.id ? `${status}-color` : ''
        }`}
        onClick={() => {
          this.props.setSideBarStatus(data);
          this.setState({ selectedCard: data });
        }}
        role="link"
      >
        <div className={`header ${typeName}`}>
          <span>{data.title}</span>
        </div>
        <div className={`body ${typeName}`}>{data.description}</div>
        <div className={`footer ${typeName}`}>
          <div className="pill">{status}</div>
        </div>
      </div>
    );
  };

  setSubType = (type, subtype) => {
    const { onSubTypeChange } = this.props;
    this.setState({ typefilter: subtype }, () => {
      if (onSubTypeChange) onSubTypeChange(type, subtype);
    });
  };

  filterCardsOnType = (type, selectedTopic) => {
    if (type === 'KPI') {
      return selectedTopic.cards
        .filter(
          (card) =>
            card.cardDetails.KPI === 'Y' || card.cardDetails.type === 'KPI'
        )
        .map((card) => this.renderCards(card.topicName, card));
    } else if (type === 'compelling_event') {
      return selectedTopic.cards
        .filter(
          (card) =>
            card.cardDetails.compelling_event === 'Y' ||
            card.cardDetails.type === 'compelling_event'
        )
        .map((card) => this.renderCards(card.topicName, card));
    } else if (type) {
      return selectedTopic.cards
        .filter((card) => card.cardDetails.type === type)
        .map((card) => this.renderCards(card.topicName, card));
    }
    return selectedTopic.cards.map((cards) =>
      this.renderCards(cards.topicName, cards)
    );
  };

  renderSubTopics = (type) => {
    const typeArray = typeSubTypeObject.find((i) => i.type === type);
    const { selectedTopic } = this.props;
    return (
      <div className={`${DEFAULT_CLASSNAME}-header-tabs`}>
        {typeArray.subtype.map((sub, idx) => (
          <div
            key={`subtopic-${idx}`}
            role="button"
            className={this.state.typefilter === sub.value ? 'selected' : ''}
            onClick={() => this.setSubType(type, sub.value)}
          >
            <span>{sub.label} </span>
            <span>
              {`(${this.filterCardsOnType(sub.value, selectedTopic).length})`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  getLoader = () => <div>Loading...</div>;

  onCreate = (value) => {
    const { storyId, topicList, market_id } = this.props;
    const { typefilter } = this.state;
    let cardSubType = typefilter;
    if (
      value.topic_name !== 'Justification' &&
      value.topic_name !== 'Decision Criteria'
    ) {
      cardSubType = value.topic_name;
    }
    if (value.topic_name === 'Competitors') {
      cardSubType = 'Competition';
    }
    const payload = {
      ...value,
      cardDetails: { url: [], File: [] },
      topicId: topicList.find((item) => item.name === value.topic_name).id,
      cardSubType,
      storyId: parseInt(storyId),
      playbookId: 9,
      marketId: window.atob(market_id),
    };
    createPBCardForQuestionForSubtypeForSolution(payload).then((response) => {
      this.setState({ isAddCardModalOpen: false });
      this.props.reload();
    });
  };

  renderTitle = (selectedTopic) => {
    let tooltip = '';

    switch (selectedTopic.name) {
      case 'Decision Criteria':
        tooltip = (
          <React.Fragment>
            <span>
              <strong>Pricing/Packaging: </strong>
              {topicToolTips.find((i) => i.topic === 'pricing').tip}
            </span>
            <br />
            <span>
              <strong>Positioning: </strong>
              {topicToolTips.find((i) => i.topic === 'positioning').tip}
            </span>
            <br />
            <span>
              <strong>Customer Success: </strong>
              {topicToolTips.find((i) => i.topic === 'success').tip}
            </span>
          </React.Fragment>
        );
        break;
      case 'Justification':
        tooltip = (
          <React.Fragment>
            <span>
              <strong>KPI:</strong>
              {topicToolTips.find((i) => i.topic === 'KPI').tip}
            </span>
            <br />
            <span>
              <strong>Triggers:</strong>
              {topicToolTips.find((i) => i.topic === 'compelling_event').tip}
            </span>
            ;
          </React.Fragment>
        );
        break;
      default:
        tooltip = topicToolTips.find(
          (i) => i.topic.toLowerCase() === selectedTopic.name.toLowerCase()
        )?.tip;
    }
    return (
      <div className="topic-tooltip">
        <Tooltip title={tooltip}>
          <HelpOutlineIcon fontSize="small" />
        </Tooltip>
      </div>
    );
  };

  render() {
    const { selectedTopic } = this.props;
    const { typefilter, isAddCardModalOpen } = this.state;
    const type = selectedTopic && selectedTopic.name;
    const typeFilterTitle = typefilter
      ? '- ' + typefilter.charAt(0).toUpperCase() + typefilter.slice(1)
      : '';
    const modalTitle = `Add Card for ${selectedTopic.name} ${
      typeFilterTitle?.includes('_eve') ? ' - Triggers' : typeFilterTitle
    }`;

    return (
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}-header`}>
          {this.renderSubTopics(type)}
          <Box display={'flex'} alignItems="center">
            <div className="topic-title">
              List of {selectedTopic && selectedTopic.name}{' '}
            </div>
            <Box display={'flex'} alignItems="center" mx={4} mt={'5px'}>
              {this.props.status === 'test' && (
                <>
                  <p style={{ marginBottom: '0px' }}>All</p>
                  <Box mt={'-5px'}>
                    <ToggleButton
                      customeClass="isApprovedToggle"
                      value={this.props.isMyTest}
                      handleToggle={this.props.toggleMyTest}
                    />
                  </Box>
                  <p style={{ marginBottom: '0px' }}>My test</p>
                </>
              )}
            </Box>
          </Box>
          {this.renderTitle(selectedTopic)}
        </div>
        <div className={`${DEFAULT_CLASSNAME}-body mt-4`}>
          {selectedTopic.cards && selectedTopic.cards.length > 0 ? (
            this.filterCardsOnType(this.state.typefilter, selectedTopic)
              .length > 0 ? (
              this.filterCardsOnType(this.state.typefilter, selectedTopic)
            ) : (
              <i>Click on ‘+’ to add a card</i>
            )
          ) : (
            <i>Click on ‘+’ to add a card</i>
          )}
        </div>
        <ModalMUI
          isOpen={isAddCardModalOpen}
          onClose={() => this.setState({ isAddCardModalOpen: false })}
          title={modalTitle}
          closeStyles={{ position: 'absolute', right: 8 }}
        >
          <AddCardModal
            onCreate={this.onCreate}
            selectedTopic={selectedTopic}
            isTest={this.props.status === 'test'}
          />
        </ModalMUI>

        <div className={`${DEFAULT_CLASSNAME}-addcard`}>
          <button
            id="addcard"
            className="floater-btn blue"
            title="Add new card"
            onClick={() => this.setState({ isAddCardModalOpen: true })}
          >
            <i className="material-icons addcard" role="presentation">
              add
            </i>
          </button>
        </div>
      </div>
    );
  }
}

TopicCards.propTypes = {
  market_id: PropTypes.string,
  onSubTypeChange: PropTypes.func,
  reload: PropTypes.func,
  selectedTopic: PropTypes.object,
  setSideBarStatus: PropTypes.func,
  storyId: PropTypes.number,
  subtopicfilter: PropTypes.string,
  topicList: PropTypes.array,
};

export default TopicCards;
