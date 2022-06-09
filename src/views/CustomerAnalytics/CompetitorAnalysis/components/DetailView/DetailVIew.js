import React, { Component } from 'react';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { Skeleton } from '@material-ui/lab';
import { connect } from 'react-redux';
import { reload } from '../../../../../action/loadingActions';
import TribylDealCards from '../../../../../tribyl_components/TribylDealCards';
import Feedbacks from './Feedbacks/Feedbacks';
import Messaging from './Messaging/Messaging';
import { getDealsForVPAndCompCard } from '../../../../../util/promises/playbooks_promise';
import { Async } from '../../../../../basecomponents/async/async';
import { isEmpty } from '../../../../../util/utils';
import './DetailView.style.scss';
import { SwotDealsModel } from '../../../../../model/SwotDealsModel/SwotDealsModel';
import classNames from 'classnames';

const DEFAULT_CLASSNAME = 'buyer-insights';

class DetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      insights: null,
      isLoading: false,
      selectedTab: 'feedbacks',
      storyBeanList: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { selectedNoteCard, competitor, filter } = this.props;
    if (!isEqual(selectedNoteCard, prevProps.selectedNoteCard)) {
      reload('comp-feedback');
    }
  }

  getPromise = async () => {
    // if (this.state.selectedTab !== 'deals') return;
    // const { selectedNoteCard, competitor, filter } = this.props;
    // const competitorID = competitor && competitor ? competitor.value : null;
    // const id =
    //   selectedNoteCard && selectedNoteCard.id ? selectedNoteCard.id : null;
    // const filterObject = [];
    // const keys = Object.keys(filter);
    // keys.forEach((key) => {
    //   if (key === 'market' && filter[key] !== null) {
    //     filterObject.push({
    //       name: 'salesPlayId',
    //       value: filter[key].value ? filter[key].value : filter[key],
    //     });
    //   } else if (filter[key] !== null) {
    //     filterObject.push({
    //       name: key,
    //       value: filter[key].value ? filter[key].value : filter[key],
    //     });
    //   }
    // });

    // return new Promise((resolve, reject) => {
    //   if (id !== null) {
    //     getDealsForVPAndCompCard(
    //       selectedNoteCard.id,
    //       competitorID,
    //       filterObject
    //     )
    //       .then((response) => {
    //         resolve({ data: response.data });
    //       })
    //       .catch((e) => reject(e));
    //   } else {
    //     resolve({ data: [] });
    //   }
    // });
    return new Promise((resolve, reject) => resolve({ data: [] }));
  };

  loadData = (response) => {
    const { deals } = this.props;
    const storyBeanList = !isEmpty(response) ? response : [];
    this.setState({ storyBeanList: deals });
  };

  handleSubTab = (tab) => {
    this.setState({ selectedTab: tab }, this.handleDealTabClick);
  };

  renderShimmer = () => {
    return (
      <div className="p-4">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <div style={{ marginTop: '60px' }}>
          <Skeleton variant="rect" width={'100%'} height={400} />
        </div>
      </div>
    );
  };

  render() {
    const { selectedTab, storyBeanList } = this.state;
    const { selectedNoteCard, filter, deals } = this.props;
    return (
      <div className={`${DEFAULT_CLASSNAME} card`}>
        <div className={`${DEFAULT_CLASSNAME}-card-header`}>
          <p className="small-text medium card-title">
            {selectedNoteCard && selectedNoteCard.cardSubType}
          </p>
          <p className="sub-heading large medium">
            {selectedNoteCard ? selectedNoteCard.name : 'No insight yet'}
          </p>
          {selectedNoteCard && (
            <div
              className={classNames('status', {
                'test-c': selectedNoteCard.isTestCard !== 'Y',
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
              onClick={() => this.handleSubTab('feedbacks')}
              className={`${selectedTab === 'feedbacks' ? 'selected' : ''}`}
            >
              Feedback
            </span>
            <span
              role="button"
              onClick={() => this.handleSubTab('messaging')}
              className={`${selectedTab === 'messaging' ? 'selected' : ''}`}
            >
              Messaging
            </span>
          </div>
          {selectedNoteCard && (
            <div className={`${DEFAULT_CLASSNAME}-card-body-tabs`}>
              {selectedTab === 'feedbacks' && <Feedbacks />}
              {selectedTab === 'deals' && selectedNoteCard && storyBeanList && (
                <TribylDealCards
                  cards={deals}
                  isVerifiedCards={filter.VerifiedCardsOnly.value}
                />
              )}
              {selectedTab === 'messaging' && <Messaging />}
            </div>
          )}
        </div>
      </div>
    );
  }
}

DetailView.propTypes = { selectedNoteCard: PropTypes.object };

function mapStateToProps(state) {
  const {
    market,
    industry,
    segment,
    region,
    compCompetitor,
    opptyStatus,
    closeDate,
    verifiedCard,
    opptyType,
  } = state.marketPerformanceFilters;
  return {
    selectedNoteCard: state.marketAnalysisReducer.selectedNoteCard,
    filter: {
      market,
      industry,
      segment,
      region,
      opptyStatus: opptyStatus,
      closePeriod: closeDate,
      VerifiedCardsOnly: verifiedCard,
      crmOpptyType: opptyType,
    },
    deals: SwotDealsModel.list().map((item) => item.props),
    competitor: compCompetitor,
  };
}

export default connect(mapStateToProps)(DetailView);
