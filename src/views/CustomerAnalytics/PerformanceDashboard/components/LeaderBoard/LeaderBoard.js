import { Tooltip } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { bindActionCreators } from 'redux';
import { lyrics_note as LyricsNote } from '../../../../../assets/icons/lyrics_note.svg';
import Options from '../../../../../components/TripleDotOptions/Options';
import {
  ADD_ANALYZE_CARDS,
  UPDATE_MARKET_PERFORMANCE_FILTERS,
} from '../../../../../constants/general';
import { dispatch, ShortNumber } from '../../../../../util/utils';
import { leaderBoardsortOptions } from '../../../util/Util';
import './LeaderBoard.style.scss';

const DEFAULT_CLASSNAME = 'performance-dashboard-leaderBoard';

class LeaderBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MatchedCards: [],
      isLoading: true,
      selectedCardType: null,
    };
  }

  renderDotOptions = (card) => {
    const filteredStoryBeanList =
      card?.storyBeanList?.filter((bean) => bean.matchCount > 0) || [];

    return [
      {
        label: (
          <Link
            to={{
              pathname: `/customer-voice/${encodeURI(card.name)}/${encodeURI(
                this.props.topicType
              )}/${card.id}`,
              state: {
                storyBeanList: filteredStoryBeanList,
              },
            }}
            role="button"
          >
            <img src={LyricsNote} />
            <span className="small-text link-text">VOC </span>
          </Link>
        ),
        id: 'voc',
      },
    ];
  };

  async AddAnalyze(cardId, name) {
    dispatch({
      type: ADD_ANALYZE_CARDS,
      payload: { cardId, name },
    });
    localStorage.setItem('AnalysisCard', cardId);
  }

  onSelect = (option, data) => {
    switch (option) {
      case 'analyze':
        this.AddAnalyze(data.id, data.name);
        break;
      case 'detail':
        return this.toggleCardModal(data);
      default:
    }
  };

  onSort = (value) => {
    const { changeFilter } = this.props;
    if (changeFilter)
      changeFilter({ performanceSortCriteria: value, sortBy: value.sortBy });
  };

  cardName = (str) => {
    if (str.length > 23) return str.slice(0, 21) + '...';
    else return str;
  };

  render() {
    const { cardData, isLoading, sortCriteria } = this.props;
    const { topicType } = this.props;
    // const cards = this.getCardPerTopic(MatchedCards, topicType);

    return (
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}-container`}>
          <div className={`${DEFAULT_CLASSNAME}-container-header`}>
            <div className="card-type">{topicType}</div>
            <div className="sub-heading large bold">Leaderboard</div>
            <div className="amount">
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={sortCriteria}
                options={leaderBoardsortOptions}
                onChange={this.onSort}
              />
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}-container-body`}>
            {!isLoading ? (
              cardData?.length ? (
                cardData.map((card) => (
                  <div key={card.id} className="solution-cards">
                    <Tooltip title={card?.name || ''}>
                      <div
                        style={{ width: 'max-content' }}
                        className="heading medium mb-2 card-title-header"
                      >
                        {this.cardName(card?.name || '')}
                      </div>
                    </Tooltip>
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: 5,
                        background:
                          card.isTestCard !== 'Y' ? '#00B257' : '#fff3d7',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        color: card.isTestCard !== 'Y' ? 'white' : 'black',
                        padding:
                          card.isTestCard !== 'Y' ? '2px 8px' : '2px 10px',
                        fontSize: '14px',
                      }}
                    >
                      {card.isTestCard !== 'Y' ? 'Approved' : 'Test'}
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
                        <span className="value text medium">
                          {card.avgSalesCycle}
                        </span>
                      </div>
                      <Options
                        noLink
                        onSelect={this.onSelect}
                        className="card-options"
                        options={this.renderDotOptions(card)}
                      />
                    </div>
                    {/* {index === 2 && <div className="status">New</div>}
                                    {index === 0 && <div className="status">Trending</div>} */}
                  </div>
                ))
              ) : (
                <i>No insights yet</i>
              )
            ) : (
              <i>Loading data...</i>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { performanceSortCriteria } = state.marketPerformanceFilters;
  return { sortCriteria: performanceSortCriteria };
}

function mapDispatchToProps() {
  return bindActionCreators(
    {
      resetAlertsCount: () =>
        dispatch({
          type: UPDATE_MARKET_PERFORMANCE_FILTERS,
          payload: {
            market: '',
            industry: '',
            segment: '',
            region: '',
          },
        }),
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
