import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Skeleton } from '@material-ui/lab';
import { Switch, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import avatar from '../../../../../../assets/icons/ten-profile/avatar.svg';
import { Async } from '../../../../../../basecomponents/async/async';
import CustomeRater from '../../../../../../tribyl_components/Differentiation/CustomeRater';
import { getInsightsForVPAndCompCard } from '../../../../../../util/promises/playbooks_promise';
import { formatDate, isEmpty } from '../../../../../../util/utils';
import './Feedbacks.style.scss';

const DEFAULT_CLASSNAME = 'feedback-tab';

class Feedbacks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FeedbacksData: [],
      isLoading: false,
      totalThemFeedbacks: 0,
      isThem: false,
    };
  }

  getPromise = async () => {
    const { selectedNoteCard, competitor, filter } = this.props;
    const competitorID = competitor && competitor ? competitor.value : null;
    const id =
      selectedNoteCard && selectedNoteCard.id ? selectedNoteCard.id : null;
    const filterObject = [];
    // change {market:value} -> {name: market, value: value} to map in the post method
    const keys = Object.keys(filter);
    keys.forEach((key) => {
      if (key === 'market' && filter[key] !== null) {
        filterObject.push({
          name: 'salesPlayId',
          value: filter[key].value ? filter[key].value : filter[key],
        });
      } else if (filter[key] !== null) {
        filterObject.push({
          name: key,
          value: filter[key].value ? filter[key].value : filter[key],
        });
      }
    });
    return new Promise((resolve, reject) => {
      if (id && competitorID) {
        getInsightsForVPAndCompCard(
          selectedNoteCard.id,
          competitorID,
          filterObject
        )
          .then((response) => {
            resolve({ data: response.data });
          })
          .catch((e) => reject(e));
      } else {
        resolve({ data: [] });
      }
    });
  };

  loadData = (response) => {
    const totalThemFeedbacks =
      response && !isEmpty(response)
        ? response.filter((feedback) => feedback.rating).length
        : 0;
    const FeedbacksData =
      response && response.length > 0
        ? response
        : //     .filter((feedback) => feedback.notesBeanList)
          //     .reduce((allnotes, feedback) => {
          //       allnotes.push(...feedback.notesBeanList);
          //       return allnotes;
          //     }, [])
          [];
    const averageRating =
      response && !isEmpty(response)
        ? response
            .filter((feedback) => feedback.rating)
            .reduce((avgRating, b) => {
              avgRating += b.rating;
              return avgRating;
            }, 0) / totalThemFeedbacks
        : 0;
    this.setState({ FeedbacksData, averageRating, totalThemFeedbacks });
  };

  renderNotes = (note) => {
    if (!note) return '';

    const div = document.createElement('div');
    div.innerHTML = note;
    return div.textContent || div.innerText || '';
  };

  handleRatingType = (event) => {
    const isChecked = event.target.checked;
    this.setState({ isThem: isChecked });
  };

  renderFeedbacks = (FeedbackData) => {
    const { isThem } = this.state;
    const { selectedNoteCard } = this.props;
    const data = isThem
      ? FeedbackData.map(
          (i) => i.notesBeanList && { ...i.notesBeanList[0], rating: i.rating }
        )
      : selectedNoteCard.usFeedback;

    return data && data.length > 0 ? (
      data.map((card, index) => {
        return (
          <div className="note_details" key={index}>
            <div className="header">
              <div className="d-flex align-items-center">
                <div className="account-avatar">
                  <img src={avatar} />
                </div>
                <div className="profile-info">
                  <p className="sub-heading">{card.accountName || ''}</p>
                  <p className="small-text">
                    <span>
                      <span>{card ? card.userName || card.name : ''}</span>
                      <span className="mx-1">Posted on </span>
                      <span>
                        {formatDate(card.insertTime, 'DD MMM, h A zz')}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {isThem ? (
              <CustomeRater
                customeClass="my-2"
                rating={card ? card.rating : 0}
                readOnly
              />
            ) : (
              <CustomeRater
                customeClass="my-2"
                readOnly
                rating={card ? card.rating : 0}
              />
            )}
            <div className="notes">
              {!isThem
                ? this.renderNotes(card.notes)
                : card
                ? this.renderNotes(card.notes)
                : ''}
            </div>
          </div>
        );
      })
    ) : (
      <i className="mx-2">No feedback found!</i>
    );
  };

  renderContent = () => {
    const { FeedbacksData, averageRating, totalThemFeedbacks, isThem } =
      this.state;
    const { selectedNoteCard } = this.props;
    const totalUsFeedbacks = selectedNoteCard?.usFeedback?.length;
    return (
      <div className={DEFAULT_CLASSNAME}>
        <React.Fragment>
          <div className={`${DEFAULT_CLASSNAME}-avg-rate`}>
            {isThem ? (
              <div className="small-text bold mr-1">Them :</div>
            ) : (
              <div className="small-text bold mr-1">Us :</div>
            )}
            <CustomeRater
              customeClass="feedback-rating"
              rating={isThem ? averageRating : selectedNoteCard.usAverageRating}
              readOnly
            />
            {isThem ? (
              <div className="ml-2 small-text">{`(${totalThemFeedbacks} Reviews)`}</div>
            ) : (
              <div className="ml-2 small-text">{`(${totalUsFeedbacks} Reviews)`}</div>
            )}
            <Grid container alignItems="center" justify="flex-end" xs={5}>
              <Grid item className="font-weight-bold text-dark">
                US
              </Grid>
              <Grid item>
                <Switch
                  size="small"
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                  checked={isThem}
                  onChange={this.handleRatingType}
                />
              </Grid>
              <Grid item className="font-weight-bold text-dark">
                THEM
              </Grid>
            </Grid>
          </div>
          {this.renderFeedbacks(FeedbacksData)}
        </React.Fragment>
      </div>
    );
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
    return (
      <Async
        identifier="comp-feedback"
        promise={this.getPromise}
        content={this.renderContent}
        handlePromiseResponse={this.loadData}
        loader={this.renderShimmer}
        error={<div>Error...</div>}
      />
    );
  }
}
Feedbacks.propTypes = {
  selectedNoteCard: PropTypes.object,
  filter: PropTypes.object,
};

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
    competitor: compCompetitor,
  };
}
export default connect(mapStateToProps)(Feedbacks);
