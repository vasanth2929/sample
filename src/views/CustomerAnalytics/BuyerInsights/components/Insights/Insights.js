import { isEqual, sortBy } from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { MediaBlock, TextBlock } from 'react-placeholder-shimmer';
import { connect } from 'react-redux';
import { reload } from '../../../../../action/loadingActions';
import avatar from '../../../../../assets/icons/ten-profile/avatar.svg';
import { Async } from '../../../../../basecomponents/async/async';
import TribylDealCards from '../../../../../tribyl_components/TribylDealCards/TribylDealCards';
import { getStoryNotesForCard } from '../../../../../util/promises/customer_analysis';
import { formatDate } from '../../../../../util/utils';
import Messaging from '../../../CompetitorAnalysis/components/DetailView/Messaging/Messaging';
import './Insights.style.scss';
import Select from 'react-select';
import { dealSort } from '../../../util/Util';
import moment from 'moment';
import classNames from 'classnames';

const DEFAULT_CLASSNAME = 'buyer-insights';

class Insights extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      insights: null,
      isLoading: true,
      selectedTab: 'deals',
      selectedSort: dealSort[1],
    };
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.selectedNoteCard, prevProps.selectedNoteCard)) {
      reload('insights-dim');
    }
  }

  getPromise = () => {
    const { selectedNoteCard, filter, cardAnalysisArray } = this.props;
    const id =
      selectedNoteCard && selectedNoteCard.id ? selectedNoteCard.id : null;
    const filterObject = [];
    const keys = Object.keys(filter);
    keys.forEach((key) => {
      if (key === 'market' && filter[key] !== null) {
        filterObject.push({
          name: 'salesPlayId',
          value: filter[key]?.value ? filter[key].value : filter[key],
        });
      } else if (filter[key] !== null) {
        filterObject.push({
          name: key,
          value: filter[key]?.value ? filter[key].value : filter[key],
        });
      }
    });
    if (filter.showLiveOpptys === 'Y')
      filterObject.push({
        name: 'isOpenOppty',
        value: filter['oppty']?.value,
      });
    return new Promise((resolve, reject) => {
      if (id) {
        getStoryNotesForCard(id, filterObject, cardAnalysisArray)
          .then((response) => resolve({ data: response ? response.data : [] }))
          .catch(() => reject());
      } else {
        resolve({ data: null });
      }
    });
  };

  loadData = (response) => {
    const insights = response ? response : [];
    this.setState({ insights });
  };

  renderNotes = (note) => {
    if (!note) return '';

    const div = document.createElement('div');
    div.innerHTML = note;
    return div.textContent || div.innerText || '';
  };

  renderInsights = (insights) => {
    return insights.map((card, cardIdx) => {
      return (
        <div className="note_details" key={`card-insights-${cardIdx}`}>
          <div className="header">
            <div className="d-flex align-items-center">
              <div className="account-avatar">
                <img src={avatar} />
              </div>
              <div className="profile-info">
                <p className="sub-heading">{card.accountName || ''}</p>
                <p className="small-text">
                  {card.userName} Posted on{' '}
                  {formatDate(card.insertTime, 'DD MMM, h A zz')}
                </p>
              </div>
            </div>
          </div>
          <div className="notes">{this.renderNotes(card.notes)}</div>
          <div className="footer">
            {/* <div className="pill"><img src={like} />{likes} Likes</div>
                            <div className="pill"><img src={comment} />{comments} Comments</div> */}
          </div>
        </div>
      );
    });
  };
  handleClick = (label) => {
    // TODO add handle click method
  };

  handleSubTab = (tab) => {
    this.setState({ selectedTab: tab });
  };

  renderDeals = () => {
    const { selectedTab } = this.state;
    const { selectedNoteCard, disableCheckbox, filter, selectedSort } =
      this.props;

    const sortedDeals = this.sortDeals(
      selectedNoteCard?.storyBeanList ? selectedNoteCard.storyBeanList : []
    );

    return (
      selectedTab === 'deals' &&
      selectedNoteCard &&
      selectedNoteCard.storyBeanList && (
        <TribylDealCards
          cards={sortedDeals}
          isDisabled={disableCheckbox}
          isVerifiedCards={filter.verifiedCardsOnly.value}
        />
      )
    );
  };

  sortDeals = (card) => {
    const { selectedSort } = this.state;
    if (card.length) {
      switch (selectedSort.value) {
        case 'Votes':
          const dealWithVotes = card.sort((a, b) => {
            if (a.voteCount === b.voteCount)
              return b.totalHeuristicScore - a.totalHeuristicScore;
            return b.voteCount - a.voteCount;
          });
          const score = sortBy(
            dealWithVotes.filter((deal) => {
              const res = deal.voteCount ?? false;
              return res === false;
            }),
            'totalHeuristicScore'
          ).reverse();

          const votes = dealWithVotes.filter((a) => {
            const res = a.voteCount ?? false;
            return res !== false;
          });
          return [...votes, ...score];
        case 'Close date':
          return card.sort((a, b) => {
            if (a.dateClosed === b.dateClosed)
              return a.accountName?.localeCompare(b.accountName);
            return moment(a.dateClosed).isBefore(moment(b.dateClosed)) ? 1 : -1;
          });
        case 'Score':
          return card.sort(
            (a, b) =>
              Number(b.totalHeuristicScore) - Number(a.totalHeuristicScore)
          );
        case 'Amount':
          return card.sort(
            (a, b) => Number(b.opportunityAmount) - Number(a.opportunityAmount)
          );
      }
    }
    return [];
  };

  handleSort = (selected) => {
    this.setState({ selectedSort: selected });
    reload('insights-dim');
  };

  renderContent = () => {
    const { selectedTab, insights, selectedSort } = this.state;
    const { selectedNoteCard } = this.props;
    const cardSubType = selectedNoteCard
      ? selectedNoteCard.cardSubType === 'compelling_event'
        ? 'Triggers'
        : selectedNoteCard.cardSubType
      : '';

    return (
      <React.Fragment>
        <div className={`${DEFAULT_CLASSNAME}-card-header`}>
          <p className="small-text medium card-title">{cardSubType}</p>
          <p className="sub-heading large medium">
            {selectedNoteCard ? selectedNoteCard.name : ''}
          </p>
          {selectedNoteCard && (
            <div
              className={classNames('status', {
                'test-c': selectedNoteCard.isTestCard === 'Y',
              })}
            >
              {selectedNoteCard?.isTestCard === 'N' ? 'Approved' : 'Test'}
            </div>
          )}
        </div>
        <div className={`${DEFAULT_CLASSNAME}-card-body`}>
          <div className="options">
            <span
              role="button"
              onClick={() => this.handleSubTab('deals')}
              className={`${selectedTab === 'deals' ? 'selected' : ''}`}
            >
              Deals
            </span>
            <span
              role="button"
              onClick={() => this.handleSubTab('insights')}
              className={`${selectedTab === 'insights' ? 'selected' : ''}`}
            >
              Insights
            </span>
            <span
              role="button"
              onClick={() => this.handleSubTab('messaging')}
              className={`${selectedTab === 'messaging' ? 'selected' : ''}`}
            >
              Messaging
            </span>
            <div className="sort">
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={selectedSort}
                options={dealSort}
                onChange={this.handleSort}
                isDisabled={selectedTab !== 'deals'}
              />
            </div>
          </div>
          {selectedTab === 'insights' && (
            <React.Fragment>
              {/* <div className="filter">
                <SwitchButton
                  isDisabled
                  labels={['Internal', 'External']}
                  onClick={this.handleClick}
                />
                <div>
                  <FormControlLabel
                    control={<Switch size="small" color="secondary" disabled />}
                    label="Survey sync"
                  />
                </div>
              </div> */}
              <div className="note-card">
                {insights && insights.length > 0 ? (
                  this.renderInsights(insights)
                ) : (
                  <i className="ml-4">No Survey Insight found...</i>
                )}
              </div>
            </React.Fragment>
          )}
          {this.renderDeals()}
          {selectedTab === 'messaging' && <Messaging />}
        </div>
      </React.Fragment>
    );
  };

  renderShimmer = () => {
    return (
      <div>
        <MediaBlock>
          <TextBlock textLines={[90]} />
        </MediaBlock>
        <div style={{ marginTop: '20px' }}>
          <MediaBlock>
            <TextBlock textLines={[90, 90, 90]} />
          </MediaBlock>
          <MediaBlock>
            <TextBlock textLines={[90, 90, 90]} />
          </MediaBlock>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={`${DEFAULT_CLASSNAME} card`}>
        <Async
          identifier="insights-dim"
          promise={this.getPromise}
          content={this.renderContent}
          handlePromiseResponse={this.loadData}
          loader={this.renderShimmer}
          error={<div>error</div>}
        />
      </div>
    );
  }
}
function mapStateToProps(state) {
  const {
    market,
    industry,
    segment,
    region,
    closeDate,
    opptyStatus,
    verifiedCard,
    buyingCompetitorId,
    opptyType,
    oppty,
    showLiveOpptys,
  } = state.marketPerformanceFilters;
  return {
    selectedNoteCard: state.marketAnalysisReducer.selectedNoteCard,
    cardAnalysisArray: state.marketAnalysisReducer.AnalyzeCards,
    filter: {
      market,
      industry,
      segment,
      region,
      opptystatus: opptyStatus,
      closePeriod: closeDate,
      verifiedCardsOnly: verifiedCard,
      competitorCardId: buyingCompetitorId,
      crmOpptyType: opptyType,
      oppty,
      showLiveOpptys,
    },
  };
}

Insights.propTypes = {
  selectedNoteCard: PropTypes.object,
  newVersion: PropTypes.string,
  filter: PropTypes.object,
  disableCheckbox: PropTypes.boolean,
};

export default connect(mapStateToProps)(Insights);
