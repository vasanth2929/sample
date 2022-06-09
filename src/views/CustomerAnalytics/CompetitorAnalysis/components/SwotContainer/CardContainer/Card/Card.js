import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import CustomeRater from '../../../../../../../tribyl_components/Differentiation/CustomeRater';
import { ShortNumber, dispatch } from '../../../../../../../util/utils';
import { SELECT_NOTE_CARD } from '../../../../../../../constants/general';
import './Card.style.scss';
import { SwotDealsModel } from '../../../../../../../model/SwotDealsModel/SwotDealsModel';

const DEFAULT_CLASSNAME = 'swot-oppty-cards';

class Card extends Component {
  showRating = (rate) => {
    return <CustomeRater interactive={false} rating={rate} readOnly />;
  };

  setSelectedCard = () => {
    const { cardData } = this.props;
    dispatch({
      type: SELECT_NOTE_CARD,
      payload: cardData,
    });
    SwotDealsModel.deleteAll();
    cardData.dealsListForCard?.length > 0 &&
      cardData.dealsListForCard.map((deal) =>
        new SwotDealsModel({ id: deal.id, ...deal }).$save()
      );
  };

  renderCards = (cardData, otherProps, selectedNoteCard) => {
    return (
      <div
        className={`${DEFAULT_CLASSNAME} ${
          selectedNoteCard && selectedNoteCard.id === cardData.id
            ? 'selected'
            : ''
        } `}
        {...otherProps}
        onClick={this.setSelectedCard}
        role="button"
      >
        <p role="button" className="sub-heading large bold">
          {cardData.name}
        </p>
        <div className={`${DEFAULT_CLASSNAME}-info`}>
          <div>
            <div className="mr-2 d-flex">
              <span className="small-text bold">Amt: </span>
              <span className="ml-1 blue">
                ${ShortNumber(cardData.totalOpptyAmount) || '0'}{' '}
              </span>
            </div>
            <div className="mr-2 d-flex align-items-center">
              <span className="small-text bold"> Us:</span>{' '}
              <div className="orange mx-1">
                {this.showRating(cardData.usAverageRating)}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="small-text bold"> Them:</span>{' '}
              <div className="green mx-1">
                {this.showRating(cardData.competitorCardAverageRating)}
              </div>
            </div>
          </div>
          {/* <Options
                        noLink
                        className='swot-options'
                        options={[]}
                    /> */}
        </div>
        {cardData.cardSubType && (
          <div className="status">{cardData.cardSubType || ''}</div>
        )}
      </div>
    );
  };

  render() {
    const { cardData, selectedNoteCard, otherProps } = this.props;
    return (
      <div>{this.renderCards(cardData, otherProps, selectedNoteCard)}</div>
    );
  }
}

Card.propTypes = {
  cardData: PropTypes.object,
  selectedNoteCard: PropTypes.object,
  otherProps: PropTypes.object,
};

function mapStateToProps(state) {
  const { market, industry, segment, region, verifiedCard } =
    state.marketPerformanceFilters;

  return {
    filter: {
      market,
      industry,
      segment,
      region,
      isVerifiedCards: verifiedCard,
    },
    selectedNoteCard: state.marketAnalysisReducer.selectedNoteCard,
  };
}

export default connect(mapStateToProps, null)(Card);
