import { FormControlLabel, Switch } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import avatar from '../../../../../assets/icons/ten-profile/avatar.svg';
import TribylDealCards from '../../../../../tribyl_components/TribylDealCards';
import { getStoryNotesForCard } from '../../../../../util/promises/customer_analysis';
import { formatDate } from '../../../../../util/utils';
import { dealSort } from '../../../util/Util';
import { SwitchButton } from '../../../BuyingJourneyInsights/components/SwitchButton/SwitchButton';
import Messaging from '../../../CompetitorAnalysis/components/DetailView/Messaging/Messaging';
import './InsightModal.style.scss';

const DEFAULT_CLASSNAME = 'insight-modal';

class InsightModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      insights: null,
      isLoading: true,
      selectedTab: 'deals',
      selectedSort: dealSort[1],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedNoteCard.id !== prevProps.selectedNoteCard.id) {
      this.loadData();
    }
  }

  loadData = async () => {
    const { selectedNoteCard, filter } = this.props;
    // const respsone = await getCardNotes(selectedNoteCard.id);
    const id =
      selectedNoteCard && selectedNoteCard.id ? selectedNoteCard.id : null;
    const filterObject = [];
    const keys = Object.keys(filter);
    keys.forEach((key) => {
      if (key === 'market' && filter[key] !== null) {
        filterObject.push({
          name: 'salesPlayId',
          value: filter[key].value ? filter[key].value : filter[key],
        });
      } else if (key === 'isVerifiedCards' && filter[key] !== null) {
        // only send when isverified is true or ignore
        filterObject.push({
          name: 'verifiedCardsOnly',
          value: filter[key].value,
        });
      } else if (filter[key] !== null) {
        filterObject.push({
          name: key,
          value: filter[key].value ? filter[key].value : filter[key],
        });
      }
    });
    if (filter.showLiveOpptys === 'Y')
      filterObject.push({
        name: 'isOpenOppty',
        value: filter['oppty']?.value,
      });
    if (id) {
      const response = await getStoryNotesForCard(
        selectedNoteCard.id,
        filterObject
      );
      const insights = response.data ? response.data : [];
      this.setState({ isLoading: false, insights });
    } else {
      this.setState({ isLoading: false });
    }
  };

  renderNotes = (note) => {
    if (!note) return '';

    const div = document.createElement('div');
    div.innerHTML = note;
    return div.textContent || div.innerText || '';
  };

  renderInsights = (insights) => {
    return insights.map((card) => {
      return (
        <div className="note_details">
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
        </div>
      );
    });
  };

  handleClick = (label) => {
    console.log(label);
  };

  handleSubTab = (tab) => {
    this.setState({ selectedTab: tab });
  };

  handleSort = (selected) => {
    this.setState({ selectedSort: selected });
  };

  render() {
    const { isLoading, insights, selectedTab, selectedSort } = this.state;
    const { selectedNoteCard, filter } = this.props;
    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        <div className={`${DEFAULT_CLASSNAME}-card-body`}>
          <div className="options-wrapper">
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
            </div>

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
                  defaultSelection="Internal"
                  onClick={this.handleClick}
                />
                <div className="disabled">
                  <FormControlLabel
                    disabled
                    control={<Switch size="small" color="primary" />}
                    label="Survey sync"
                  />
                </div>
              </div> */}
              <div className="note-card">
                {!isLoading ? (
                  insights.length > 0 ? (
                    this.renderInsights(insights)
                  ) : (
                    <i className="ml-4">No Survey Insight found...</i>
                  )
                ) : (
                  <i>Loading insights...</i>
                )}
              </div>
            </React.Fragment>
          )}
          {selectedTab === 'deals' &&
            selectedNoteCard &&
            selectedNoteCard.storyBeanList && (
              <TribylDealCards
                cards={selectedNoteCard.storyBeanList}
                gridSize={6}
                isOutlined
                openNewTab
                isVerifiedCards={filter.isVerifiedCards.value}
              />
            )}
          {selectedTab === 'messaging' && <Messaging />}
        </div>
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
    filter: {
      market,
      industry,
      segment,
      region,
      opptystatus: opptyStatus,
      closePeriod: closeDate,
      isVerifiedCards: verifiedCard,
      competitorCardId: buyingCompetitorId,
      crmOpptyType: opptyType,
      oppty,
      showLiveOpptys,
    },
  };
}

InsightModal.propTypes = {
  selectedNoteCard: PropTypes.object,
  newVersion: PropTypes.string,
};

export default connect(mapStateToProps)(InsightModal);
