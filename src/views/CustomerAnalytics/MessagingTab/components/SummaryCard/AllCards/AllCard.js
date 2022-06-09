import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import lyrics_note from '../../../../../../assets/icons/lyrics_note.svg';
import pin from '../../../../../../assets/icons/pin.svg';
import { showCustomModal } from '../../../../../../components/CustomModal/CustomModal';
import Options from '../../../../../../components/TripleDotOptions/Options';
import {
  ADD_ANALYZE_CARDS,
  REMOVE_ANALYZE_CARDS,
  SELECT_NOTE_CARD,
} from '../../../../../../constants/general';
import { CardModalContent } from '../../../../../../tribyl_components';
import { getPlaybookCardDetails } from '../../../../../../util/promises/playbookcard_details_promise';
import { dispatch, ShortNumber } from '../../../../../../util/utils';
import Trends from '../Trends/Trends';
import BarChartIcon from '@material-ui/icons/BarChart';
import Skeleton from '@material-ui/lab/Skeleton';

import './AllCard.style.scss';

const DEFAULT_CLASSNAMES = 'winloss-all-cards';

const customerNeed = [
  { value: 'Use Cases', label: 'Use Cases' },
  { value: 'Pain Points', label: 'Pain Points' },
  { value: 'KPI', label: 'KPIs' },
  { value: 'compelling_event', label: 'Triggers' },
];

const performer = [
  { value: 'product', label: 'Product' },
  { value: 'positioning', label: 'Positioning' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'success', label: 'Success' },
];

class AllCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      selectedSubType: props.selectedSubType || '',
    };
  }

  componentDidMount() {
    const { selectedSubType, cardData } = this.props;
    const selectedCard = cardData
      ? cardData.find((i) => i.cardSubType === selectedSubType)
      : 0;

    // if note is not set then only set it
    dispatch({
      type: SELECT_NOTE_CARD,
      payload: selectedCard,
    });
  }

  isPinnedCard(card, AnalyzeCards) {
    return AnalyzeCards && AnalyzeCards.find((item) => item.id === card.id);
  }

  async AddAnalyze(data) {
    dispatch({
      type: ADD_ANALYZE_CARDS,
      payload: [data],
    });
    dispatch({
      type: SELECT_NOTE_CARD,
      payload: data,
    });
    localStorage.setItem('AnalysisCard', JSON.stringify(data));
  }

  async AddNotesCard(card) {
    card.cardId = card.id;
    card.cardName = card.name;
    dispatch({
      type: SELECT_NOTE_CARD,
      payload: card,
    });
  }

  RemoveAnalyze(cardId, name) {
    dispatch({
      type: REMOVE_ANALYZE_CARDS,
      payload: { cardId, name },
    });
  }

  toggleKeywords = () => {
    this.setState({ keywords: !this.state.keywords });
  };

  toggleCardModal(card) {
    return () => {
      getPlaybookCardDetails(card.id).then((response) => {
        showCustomModal(
          <div className="summary-card-modal-header">{card.name}</div>,
          <CardModalContent data={response.data} />
        );
      });
    };
  }

  setSubTypeFilter = (subtype) => {
    const { setSubtType, cardType, cardData } = this.props;
    this.setState({ selectedSubType: subtype }, () => {
      setSubtType(cardType, subtype);
      const filteredData = cardData
        ? cardData.filter((i) => i.cardSubType === subtype)
        : cardData;
      if (filteredData) {
        dispatch({
          type: SELECT_NOTE_CARD,
          payload: null,
        });
      }
    });
  };

  onHide() {
    this.setState({ showCardModal: {} });
  }

  handleOpen = (status) => {
    this.setState({ isOpen: status });
  };

  showTimeline = (card) => {
    showCustomModal(
      <div className="timeline-modal-header">
        <h6 className="text">{card.cardSubType}</h6>
        <h5 className="heading">{card.name}</h5>
      </div>,
      <div className="timeline-modal-header">
        <Trends card={card} />
      </div>,
      'timeline-modal'
    );
  };

  renderDotOptions = (card) => {
    const filteredStoryBeanList =
      card?.storyBeanList?.filter((bean) => bean.matchCount > 0) || [];
    const isDisabled =
      !filteredStoryBeanList?.length &&
      !filteredStoryBeanList?.includes((i) => i.card.matchCount);
    return [
      {
        label: (
          <div role="button">
            <img src={pin} />
            <span className="small-text link-text">Analyze</span>
          </div>
        ),
        id: 'analyze',
        data: card,
      },
      {
        label: (
          <Link
            to={{
              pathname: `/customer-voice/${encodeURI(card.name)}/${encodeURI(
                this.props.selectedSubType
              )}/${card.id}`,
              state: {
                storyBeanList: filteredStoryBeanList,
              },
            }}
            role="button"
          >
            <img src={lyrics_note} />
            <span className={'small-text link-text'}>VOC </span>
          </Link>
        ),
        id: 'voc',
        isDisabled,
      },
      {
        label: (
          <div
            role="button"
            role="button"
            onClick={() => this.showTimeline(card)}
          >
            <BarChartIcon fontSize="small" />
            <span className="small-text link-text">Trend</span>
          </div>
        ),
        id: 'timeline',
        isDisabled,
      },
    ];
  };

  onSelect = (option, data) => {
    switch (option) {
      case 'analyze':
        this.AddAnalyze(data);
        break;
      case 'detail':
        return this.toggleCardModal(data);
      default:
    }
  };

  renderCardTypeFilter(subTypes) {
    const { selectedSubType } = this.state;
    switch (subTypes) {
      case 'topPerformers':
        return (
          <React.Fragment>
            <div className="sub-type">
              {performer.map((i, idx) => (
                <div
                  key={`card-type-filter-${idx}`}
                  onClick={() => this.setSubTypeFilter(i.value)}
                  className={`small-text ${
                    i.value === selectedSubType && 'active'
                  }`}
                  role="button"
                >
                  {i.label}
                </div>
              ))}
            </div>
          </React.Fragment>
        );
      case 'bottomPerformers':
        return (
          <React.Fragment>
            <div className="sub-type">
              {performer.map((i, idx) => (
                <div
                  key={`bottom-performers-${idx}`}
                  onClick={() => this.setSubTypeFilter(i.value)}
                  className={`small-text ${
                    i.value === selectedSubType && 'active'
                  }`}
                  role="button"
                >
                  {i.label}
                </div>
              ))}
            </div>
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <div className="sub-type">
              {customerNeed.map((i, idx) => (
                <div
                  key={`customr-need-${idx}`}
                  onClick={() => this.setSubTypeFilter(i.value)}
                  className={`small-text ${
                    i.value === selectedSubType && 'active'
                  }`}
                  role="button"
                >
                  {i.label}
                </div>
              ))}
            </div>
          </React.Fragment>
        );
    }
  }

  renderShimmer = () => {
    return (
      <div className="loading">
        <Skeleton variant="rectangular" width={296} height={15} />
        <Skeleton variant="rectangular" width={'95%'} height={'95%'} />
      </div>
    );
  };

  render() {
    const { isOpen, selectedSubType } = this.state;
    const {
      cardData,
      cardAnalysisArray,
      setViewAll,
      title,
      selectedNoteCard,
      cardType,
      isLoading,
    } = this.props;
    const { AnalyzeCards } = cardAnalysisArray;
    const filteredData =
      cardData && selectedSubType.length > 0
        ? cardData.filter((i) => i.cardSubType === selectedSubType)
        : cardData;
    return (
      <div className={`${DEFAULT_CLASSNAMES} card`}>
        <div className="card-header">
          <div className="d-flex align-items-center">
            <div className="account-avatar">
              <span>{title.charAt(0)}</span>
            </div>
            <span
              className="heading"
              role="button"
              onClick={() => this.handleOpen(!isOpen)}
            >
              {title} ({filteredData.length || 0})
            </span>
          </div>
          <span
            className="material-icons back-link"
            role="button"
            title="back"
            onClick={() => setViewAll(null)}
          >
            keyboard_backspace
          </span>
        </div>
        {!isLoading ? (
          <React.Fragment>
            <div className="filter">{this.renderCardTypeFilter(cardType)}</div>
            <div className={`card-body ${isOpen ? 'open' : 'close'} `}>
              {filteredData &&
                filteredData.map((card, index) => (
                  <div
                    key={`all-solutions-cards-${index}`}
                    className={classNames('all-solution-cards', {
                      pinned:
                        selectedNoteCard && selectedNoteCard.id === card.id,
                      analyzed: this.isPinnedCard(card, AnalyzeCards),
                    })}
                  >
                    <div
                      role="button"
                      className="heading medium mb-2 card-title-header"
                      onClick={() => this.AddNotesCard(card)}
                    >
                      {card.name}
                    </div>

                    <div
                      className="metrics2"
                      onClick={() => this.AddNotesCard(card)}
                    >
                      <div>
                        <span className="small-text bold">Amt </span>
                        <span className="value text medium mx-1">
                          {ShortNumber(card.totalOpptyAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="small-text bold">Deals </span>
                        <span className="value text medium mx-1">
                          {card.totalOpptyCountForCard}
                        </span>
                      </div>
                      <div>
                        <span className="small-text bold">Days </span>
                        <span className="value text medium mx-1">
                          {card.avgSalesCycle
                            ? Math.round(card.avgSalesCycle)
                            : 0}
                        </span>
                      </div>
                      <Options
                        noLink
                        onSelect={this.onSelect}
                        className="card-options"
                        options={this.renderDotOptions(card)}
                      />
                    </div>
                    {cardType === 'customer-need' && index === 2 && (
                      <div className="status">New</div>
                    )}
                    {cardType === 'execution' && index === 0 && (
                      <div className="status">Trending</div>
                    )}
                  </div>
                ))}
            </div>
          </React.Fragment>
        ) : (
          this.renderShimmer()
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cardAnalysisArray: state.marketAnalysisReducer,
    selectedNoteCard: state.marketAnalysisReducer.selectedNoteCard,
  };
}

export default connect(mapStateToProps)(AllCard);
