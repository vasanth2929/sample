import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import lyrics_note from '../../../../../../assets/icons/lyrics_note.svg';
import pin from '../../../../../../assets/icons/pin.svg';
import rightArrow from '../../../../../../assets/icons/rightArrow.svg';
import { showCustomModal } from '../../../../../../components/CustomModal/CustomModal';
import Options from '../../../../../../components/TripleDotOptions/Options';
import BarChartIcon from '@material-ui/icons/BarChart';
import {
  ADD_ANALYZE_CARDS,
  REMOVE_ANALYZE_CARDS,
  SELECT_NOTE_CARD,
} from '../../../../../../constants/general';
import { CardModalContent } from '../../../../../../tribyl_components';
import { getPlaybookCardDetails } from '../../../../../../util/promises/playbookcard_details_promise';
import {
  avatarText,
  dispatch,
  ShortNumber,
} from '../../../../../../util/utils';
import Trends from '../Trends/Trends';
import './Card.style.scss';
import { GoalOptions } from '../../../../util/Util';
import Skeleton from '@material-ui/lab/Skeleton';
import { ToolTipText } from '../../../../../../components/ToolTipText/ToolTipText';

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

const CardNameArray = [
  { value: 'customerNeeds', label: 'Customer Needs' },
  { value: 'topPerformers', label: 'Top Performers' },
  { value: 'bottomPerformers', label: 'Bottom Performers' },
];

class CardImp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCardModal: {},
      keywords: false,
      selectedSubType: props.selectedSubType || '',
    };
  }

  renderCardTypeFilter(subTypes) {
    const { selectedSubType } = this.state;
    switch (subTypes) {
      case 'topPerformers':
        return (
          <React.Fragment>
            <div className="sub-type">
              {performer.map((i, index) => (
                <div
                  key={`card-type-${index}`}
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
              {performer.map((i, index) => (
                <div
                  key={`bottom-performer-${index}`}
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
              {customerNeed.map((i, index) => (
                <div
                  key={`customer-need-${index}`}
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

  setSubTypeFilter = (subtype) => {
    const { setSubtType, cardType, cardData } = this.props;
    this.setState({ selectedSubType: subtype }, () => {
      setSubtType(cardType, subtype);
      const filteredData = cardData
        ? cardData.filter((i) => i.cardSubType === subtype)
        : cardData;
      dispatch({
        type: SELECT_NOTE_CARD,
        payload: null,
      });
    });
  };

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
    const { cardAnalysisArray } = this.props;
    dispatch({
      type: SELECT_NOTE_CARD,
      payload: card,
    });
    if (cardAnalysisArray.length) {
      dispatch({
        type: REMOVE_ANALYZE_CARDS,
        payload: { cardId: card.id, name: card.name },
      });
    }
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
    getPlaybookCardDetails(card.id).then((response) => {
      showCustomModal(
        <div className="summary-card-modal-header">{card.name}</div>,
        <CardModalContent data={response.data} />
      );
    });
  }

  onHide() {
    this.setState({ showCardModal: {} });
  }

  showTimeline = (card) => {
    showCustomModal(
      <div className="timeline-modal-header">
        <h6 className="text">
          {GoalOptions.find((i) => i.value === card.cardSubType).label}
        </h6>
        <h5 className="heading">{card.name}</h5>
      </div>,
      <div className="timeline-modal-body">
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
      let pathname = `/customer-voice/${encodeURI(card.name)}/${encodeURI(
        this.props.selectedSubType
      )}/${card.id}`;
      if (card?.name?.includes('/')) {
        pathname += `/?containSpecialCharacter=true&cardTitle=${card.name}&type=${this.props.selectedSubType}&cardId=${card.id}`;
      }
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
              pathname,
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

  renderShimmer = () => {
    return (
      <div className="loading">
        <Skeleton variant="rectangular" width={296} height={15} />
        <Skeleton variant="rectangular" width={296} height={90} />
        <Skeleton variant="rectangular" width={296} height={90} />
        <Skeleton variant="rectangular" width={296} height={90} />
      </div>
    );
  };
  render() {
    const {
      title,
      tabSection,
      cardData,
      cardType,
      cardAnalysisArray,
      setViewAll,
      selectedNoteCard,
      isLoading,
    } = this.props;
    const { AnalyzeCards } = cardAnalysisArray;
    const { selectedSubType } = this.state;
    const filteredData =
      cardData && selectedSubType.length > 0
        ? cardData.filter((i) => i.cardSubType === selectedSubType)
        : cardData;
    return (
      <div className="summary-card card">
        <div className="card-header">
          <div className="d-flex align-items-center">
            <div className="account-avatar">
              <span>{avatarText(title)}</span>
            </div>
            <span className="heading">{title}</span>
          </div>
          <div className="more-link">
            <span
              className="sub-heading"
              role="button"
              onClick={() => setViewAll(cardType)}
            >
              {/* View all ({count || 0}) */}
              View all ({filteredData.length || 0})
            </span>
            <img src={rightArrow} />
          </div>
        </div>
        {!isLoading ? (
          <React.Fragment>
            <div className="filter">{this.renderCardTypeFilter(cardType)}</div>
            <div className="card-body">
              <div className="tab-section">{tabSection || ''}</div>

              {/* Show only 3 at a time */}
              {filteredData && filteredData.length > 0 ? (
                filteredData.splice(0, 3).map((card, index) => (
                  <div
                    key={card.id}
                    className={classNames('solution-cards', {
                      pinned:
                        selectedNoteCard && selectedNoteCard.id === card.id,
                      analyzed: this.isPinnedCard(card, AnalyzeCards),
                    })}
                  >
                    <div
                      className="heading medium mb-2 card-title-header"
                      onClick={() => this.AddNotesCard(card)}
                      role="button"
                    >
                      <ToolTipText limit={30}>{card.name}</ToolTipText>
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
                ))
              ) : (
                <i className="d-flex justify-content-center">
                  No Insights yet!
                </i>
              )}
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

export const Card = connect(mapStateToProps)(CardImp);
