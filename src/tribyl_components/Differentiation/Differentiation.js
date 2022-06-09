import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showCustomModal } from '../../components/CustomModal/CustomModal';
import {
  getSurveyQuestionsAndCardsWithVerifyAndMatchCounts,
  upsertRatingForCardToCardRelForOppty,
  upsertNotesForCardToCardRelForOppty,
} from '../../util/promises/playbookcard_details_promise';
import { getCompetitorWithTypeForOppty } from '../../util/promises/survey_promise';
import { Loader } from '../../_tribyl/components/_base/Loader/Loader';
import { CollapsibleV2 } from '../Collapsible/Collapsible';
import { AddFeedBackForm } from './AddFeedBackForm';
import CustomeRater from './CustomeRater';
import './Differentiation.style.scss';

const DEFAULT_CLASSNAME = 'differentiation';

class Differentiation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionData: [],
      columnHeader: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { Categorydata, opptyId } = this.props;
    const questionId =
      Categorydata.marketStudyQuestionList &&
      Categorydata.marketStudyQuestionList[0].questionId;
    const response = await getSurveyQuestionsAndCardsWithVerifyAndMatchCounts(
      opptyId,
      questionId
    );
    const repsone2 = await getCompetitorWithTypeForOppty(opptyId);
    const columnHeader = repsone2 ? repsone2.data : [];
    const questionData = response.data
      ? response.data.relatedCardList.sort((a, b) =>
          a.title.localeCompare(b.title)
        )
      : [];
    this.setState({ questionData, columnHeader, isLoading: false });
  };

  getRating = (card1, card2) => {
    const { uiType } = this.props;
    if (card2) {
      const ratingCard = card1.relatedCompCards.find(
        (i) => i.cardId === card2.id
      );
      if (ratingCard) {
        const value =
          uiType === 'ds'
            ? { rating: ratingCard.rating, id: ratingCard }
            : { rating: ratingCard.avgRating, id: ratingCard };
        return value;
      }
      return 0;
    }
    return 0;
  };

  handleRating = async (rating, data) => {
    const { opptyId } = this.props;
    const rootCardId = data.Vpcard;
    const relatedCardId = data.compCard;
    try {
      await upsertRatingForCardToCardRelForOppty(
        opptyId,
        rootCardId,
        relatedCardId,
        rating
      );
      // await upsertNotesForCardToCardRelForOppty(
      //   '',
      //   opptyId,
      //   relatedCardId,
      //   rootCardId
      // );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };

  getFeedBackValue = (card1, card2) => {
    const { uiType } = this.props;
    if (card2) {
      const feedBackCard = card1.relatedCompCards.find(
        (i) => i.cardId === card2.id
      );
      if (feedBackCard) {
        return uiType === 'ds'
          ? feedBackCard.usersLatestNote
          : feedBackCard.notes;
      }
      return null;
    }
    return null;
  };

  displaySurveyFeedBack = (card1, card2) => {
    const { opptyId, uiType, surveyStatus } = this.props;
    const value = this.getFeedBackValue(card1, card2);
    const VPid = card1.id;
    const Compid = card2 && card2.id;
    /* console.log(">>>valuefeedbSurvey", value, VPid, Compid, opptyId); */
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      value ? (
        <div
          className="link view_feedback"
          onClick={() =>
            this.handleFeedBack(
              VPid,
              Compid,
              opptyId,
              value,
              uiType,
              surveyStatus
            )
          }
        >
          View Feedback
        </div>
      ) : (
        <div
          className="link"
          onClick={() =>
            this.handleFeedBack(
              VPid,
              Compid,
              opptyId,
              value,
              uiType,
              surveyStatus
            )
          }
        >
          Add Feedback
        </div>
      )
    );
  };

  displayDealFeedBack = (card1, card2) => {
    const { opptyId, uiType } = this.props;
    const value = this.getFeedBackValue(card1, card2);
    const VPid = card1.id;
    const Compid = card2 && card2.id;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      value ? (
        <div
          className="link"
          onClick={() =>
            this.handleFeedBack(VPid, Compid, opptyId, value, uiType)
          }
        >
          View Feedback
        </div>
      ) : (
        <div className="link disable" disabled>
          View Feedback
        </div>
      )
    );
  };

  handleFeedBack = (VPid, Compid, opptyId, value, uiType, surveyStatus) => {
    const header = <p>Feedback</p>;
    const body = (
      <AddFeedBackForm
        VPid={VPid}
        Compid={Compid}
        opptyId={opptyId}
        value={value}
        handleFeedBackChange={this.handleFeedBackChange}
        uiType={uiType}
        readOnly={uiType === 'ds' ? false : surveyStatus}
      />
    );
    showCustomModal(header, body, 'story-modal');
  };

  handleFeedBackChange = () => {
    this.loadData();
  };

  renderTableHeading = (type, typeCard) => {
    return (
      <div className="table_heading">
        <span>{typeCard ? typeCard.name : ''}</span>
      </div>
    );
  };

  renderBody = (Card, columnHeader) => {
    const winnerCard = columnHeader
      ? columnHeader.find((e) => e.competitorType === 'winner')
      : null;

    const finalistCard = columnHeader
      ? columnHeader.filter((e) => e.competitorType === 'finalist').slice(0, 3)
      : [];

    const usCard = columnHeader
      ? columnHeader.filter((e) => e.competitorType === 'Us')
      : null;

    let firstColumnCard = usCard.length ? usCard[0] : winnerCard;

    const { uiType, surveyStatus } = this.props;
    return (
      <table className="table table-borderless">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Decision criteria</th>
            <th style={{ width: '16%' }}>
              {this.renderTableHeading('Winner', firstColumnCard)}
            </th>
            <th style={{ width: '16%' }}>
              {this.renderTableHeading(
                'Finalist',
                finalistCard && finalistCard[0]
              )}
            </th>
            <th style={{ width: '19%' }}>
              {this.renderTableHeading(
                'Finalist',
                finalistCard && finalistCard[1]
              )}
            </th>
            <th style={{ width: '19%' }}>
              {this.renderTableHeading(
                'Finalist',
                finalistCard && finalistCard[2]
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {Card.length > 0 &&
            Card.map((i) => {
              const isReadOnly = uiType === 'ds' ? false : surveyStatus;
              return (
                <tr key={i.id}>
                  <td> {i.title}</td>
                  <td className="rating">
                    <div className="table_data">
                      {firstColumnCard && firstColumnCard.id ? (
                        <React.Fragment>
                          <CustomeRater
                            data={{
                              Vpcard: i.id,
                              compCard: firstColumnCard && firstColumnCard.id,
                            }}
                            onRate={this.handleRating}
                            rating={this.getRating(i, firstColumnCard).rating}
                            uiType={uiType}
                            readOnly={uiType !== 'ds'}
                          />
                          {uiType === 'ds'
                            ? this.displaySurveyFeedBack(i, firstColumnCard)
                            : this.displayDealFeedBack(i, firstColumnCard)}
                        </React.Fragment>
                      ) : (
                        ''
                      )}
                    </div>
                  </td>
                  <td className="rating">
                    <div className="table_data">
                      {finalistCard && finalistCard[0] ? (
                        <React.Fragment>
                          <CustomeRater
                            data={{
                              Vpcard: i.id,
                              compCard:
                                finalistCard && finalistCard[0]
                                  ? finalistCard[0].id
                                  : null,
                            }}
                            onRate={this.handleRating}
                            rating={this.getRating(i, finalistCard[0]).rating}
                            uiType={uiType}
                            readOnly={uiType !== 'ds'}
                          />
                          {uiType === 'ds'
                            ? this.displaySurveyFeedBack(
                                i,
                                finalistCard && finalistCard[0]
                              )
                            : this.displayDealFeedBack(
                                i,
                                finalistCard && finalistCard[0]
                              )}
                        </React.Fragment>
                      ) : (
                        ''
                      )}
                    </div>
                  </td>
                  <td className="rating">
                    <div className="table_data">
                      {finalistCard && finalistCard[1] ? (
                        <React.Fragment>
                          <CustomeRater
                            data={{
                              Vpcard: i.id,
                              compCard:
                                finalistCard && finalistCard[1]
                                  ? finalistCard[1].id
                                  : null,
                            }}
                            onRate={this.handleRating}
                            rating={this.getRating(i, finalistCard[1]).rating}
                            readOnly={uiType !== 'ds'}
                          />
                          {uiType === 'ds'
                            ? this.displaySurveyFeedBack(
                                i,
                                finalistCard && finalistCard[1]
                              )
                            : this.displayDealFeedBack(
                                i,
                                finalistCard && finalistCard[1]
                              )}
                        </React.Fragment>
                      ) : (
                        ''
                      )}
                    </div>
                  </td>
                  <td className="rating">
                    <div className="table_data">
                      {finalistCard && finalistCard[2] ? (
                        <React.Fragment>
                          <CustomeRater
                            data={{
                              Vpcard: i.id,
                              compCard:
                                finalistCard && finalistCard[2]
                                  ? finalistCard[2].id
                                  : null,
                            }}
                            onRate={this.handleRating}
                            rating={this.getRating(i, finalistCard[2]).rating}
                            uiType={uiType}
                            readOnly={uiType !== 'ds'}
                          />
                          {uiType === 'ds'
                            ? this.displaySurveyFeedBack(
                                i,
                                finalistCard && finalistCard[2]
                              )
                            : this.displayDealFeedBack(
                                i,
                                finalistCard && finalistCard[2]
                              )}
                        </React.Fragment>
                      ) : (
                        ''
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  };

  renderheaderOptions = () => {
    return (
      <div className="add">
        <span className="material-icons">add</span>
        Add Decision criteria
      </div>
    );
  };

  filterCardsByType = (questionData, type) => {
    const { uiType } = this.props;
    if (uiType === 'ds') {
      return questionData.filter(
        (i) => i.cardDetailsType === type && i.cardMetrics.verifiedByUser
      );
    }
    return questionData.filter(
      (i) => i.cardDetailsType === type && i.cardMetrics.verifyCount > 0
    );
  };

  render() {
    const { questionData, isLoading, columnHeader } = this.state;
    const { Categorydata, onComplete, goPrevious, uiType, surveyStatus } =
      this.props;
    const products = questionData
      ? this.filterCardsByType(questionData, 'product')
      : [];
    const position = questionData
      ? this.filterCardsByType(questionData, 'positioning')
      : [];
    const pricing = questionData
      ? this.filterCardsByType(questionData, 'pricing')
      : [];
    const success = questionData
      ? this.filterCardsByType(questionData, 'success')
      : [];

    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        <p className="page-title">Differentiation</p>
        <p className="sub-title">
          {Categorydata &&
            Categorydata.marketStudyQuestionList &&
            Categorydata.marketStudyQuestionList[0].questionText}
        </p>
        {!isLoading ? (
          <div className={`${DEFAULT_CLASSNAME}-body`}>
            <CollapsibleV2
              openDefault
              title={`Product (${products.length})`}
              body={
                products.length > 0 ? (
                  this.renderBody(products, columnHeader)
                ) : (
                  <i className="d-flex justify-content-center">
                    No survey insights found!
                  </i>
                )
              }
            />
            <CollapsibleV2
              openDefault
              title={`Positioning (${position.length})`}
              body={
                position.length > 0 ? (
                  this.renderBody(position, columnHeader)
                ) : (
                  <i className="d-flex justify-content-center">
                    No survey insights found!
                  </i>
                )
              }
            />
            <CollapsibleV2
              openDefault
              title={`Pricing (${pricing.length})`}
              body={
                pricing.length > 0 ? (
                  this.renderBody(pricing, columnHeader)
                ) : (
                  <i className="d-flex justify-content-center">
                    No survey insights found!
                  </i>
                )
              }
            />
            <CollapsibleV2
              openDefault
              title={`Success (${success.length})`}
              body={
                success.length > 0 ? (
                  this.renderBody(success, columnHeader)
                ) : (
                  <i className="d-flex justify-content-center">
                    No survey insights found!
                  </i>
                )
              }
            />
          </div>
        ) : (
          <Loader />
        )}
        <div className={`${DEFAULT_CLASSNAME}-footer`}>
          <button className="previous" onClick={() => goPrevious()}>
            Previous
          </button>
          <button className="save" onClick={() => onComplete()}>
            {uiType === 'dgt'
              ? 'Next'
              : surveyStatus
              ? 'Proceed'
              : 'Save and proceed'}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { surveyStatus: state.SurveyData.surveyStatus };
};

Differentiation.propTypes = {
  uiType: PropTypes.string,
  goPrevious: PropTypes.func,
  storyId: PropTypes.number,
  opptyId: PropTypes.number,
  Categorydata: PropTypes.object,
  onComplete: PropTypes.func,
  surveyStatus: PropTypes.bool,
};

export default connect(mapStateToProps)(Differentiation);
