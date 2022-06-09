import React, { Component } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import './SwotContainer.style.scss';
import CardContainer from './CardContainer/CardContainer';
import { getCompetitorSwotCards } from '../../../../../util/promises/playbooks_promise';
import { dispatch } from '../../../../../util/utils';
import { SELECT_NOTE_CARD, UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../../../constants/general';
import { Loader } from '../../../../../_tribyl/components/_base/Loader/Loader';
import { SwotDealsModel } from '../../../../../model/SwotDealsModel/SwotDealsModel';

const DEFAULT_CLASSNAME = 'swot-card-container';

class SwotContainerImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ourStrengthCards: [],
      ourWeaknessCards: [],
      theirstrengths: [],
      theirweakness: [],
      selectedType: null,
    };
  }

  componentDidMount() {
    this.loadSwotCards();
  }

  componentDidUpdate = (prevProps) => {
    const { selectedComp, filter } = this.props;
    if (!isEqual(selectedComp, prevProps.selectedComp)) {
      this.loadSwotCards();
    } else if (!isEqual(filter, prevProps.filter)) {
      this.loadSwotCards();
    }
  };

  loadSwotCards = async () => {
    SwotDealsModel.deleteAll();
    this.setState({ isLoading: true });
    const { filter, selectedComp, changeFilter } = this.props;
    const cardId = selectedComp ? selectedComp.value : null;
    const filterObject = [];
    // change {market:value} -> {name: market, value: value} to map in the post method
    const keys = Object.keys(filter);
    keys.forEach((key) => {
      if (key === 'market' && filter[key] !== null) {
        filterObject.push({
          name: 'salesPlayId',
          value: filter[key].value ? filter[key].value : filter[key],
        });
      } else if (key === 'isTestCard' && filter[key] !== null) {
        if (filter[key].value === 'MY_CARDS') {
          filterObject.push({ name: 'myTestCards', value: 'Y' });
          filterObject.push({
            name: 'isTestCard',
            value: 'Y',
          });
        } else
          filterObject.push({
            name: 'isTestCard',
            value: filter[key].value,
          });
      } else if (filter[key] !== null) {
        filterObject.push({
          name: key,
          value: filter[key]?.value ? filter[key].value : filter[key],
        });
      }
    });

    try {
      if (cardId) {
        changeFilter({ isDataLoading: true });
        const repsonse = await getCompetitorSwotCards(cardId, filterObject);
        const ourStrengthCards =
          repsonse && repsonse.data && repsonse.data.ourStrengthCards
            ? repsonse.data.ourStrengthCards
            : [];
        const ourWeaknessCards =
          repsonse && repsonse.data && repsonse.data.ourWeaknessCards
            ? repsonse.data.ourWeaknessCards
            : [];
        const theirstrengths =
          repsonse && repsonse.data && repsonse.data.theirStrengthCards
            ? repsonse.data.theirStrengthCards
            : [];
        const theirweakness =
          repsonse && repsonse.data && repsonse.data.theirWeaknessCards
            ? repsonse.data.theirWeaknessCards
            : [];

        this.setState({
          ourStrengthCards,
          ourWeaknessCards,
          theirstrengths,
          theirweakness,
        });

        // to get the first available card to be selected as a note card
        const allCards = [
          ...ourStrengthCards,
          ...theirstrengths,
          ...ourWeaknessCards,
          ...theirweakness,
        ];
        const selectedCard = allCards.length > 0 ? allCards[0] : null;
        selectedCard?.dealsListForCard &&
          selectedCard.dealsListForCard.map((deal) =>
            new SwotDealsModel({ id: deal.id, ...deal }).$save()
          );
        dispatch({
          type: SELECT_NOTE_CARD,
          payload: selectedCard,
        });
      } else {
        this.setState({
          ourStrengthCards: [],
          ourWeaknessCards: [],
          theirstrengths: [],
          theirweakness: [],
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
      changeFilter({ isDataLoading: false });
    }
  };

  toggleShowAll = (type) => {
    const { settoggleShowAll } = this.props;
    this.setState({ selectedType: type });
    if (settoggleShowAll) settoggleShowAll();
  };

  renderAllViewCard = () => {
    const {
      ourStrengthCards,
      ourWeaknessCards,
      theirstrengths,
      theirweakness,
      selectedType,
    } = this.state;
    switch (selectedType) {
      case 'strength':
        return (
          <CardContainer
            data={ourStrengthCards}
            type="strength"
            title="Our strengths"
            isAllView
            toggleShowAll={this.toggleShowAll}
          />
        );
      case 'weakness':
        return (
          <CardContainer
            data={theirstrengths}
            type="weakness"
            title="Their strengths"
            isAllView
            toggleShowAll={this.toggleShowAll}
          />
        );
      case 'opportunities':
        return (
          <CardContainer
            data={ourWeaknessCards}
            type="opportunities"
            title="Our weaknesses"
            isAllView
            toggleShowAll={this.toggleShowAll}
          />
        );
      case 'threats':
        return (
          <CardContainer
            data={theirweakness}
            type="threats"
            title="Their weaknesses"
            isAllView
            toggleShowAll={this.toggleShowAll}
          />
        );
      default:
    }
  };

  renderComponent = () => {
    const {
      ourStrengthCards,
      ourWeaknessCards,
      theirstrengths,
      theirweakness,
      isLoading,
    } = this.state;
    const { isAllView } = this.props;
    return (
      <div className={`${DEFAULT_CLASSNAME} ${isAllView && 'viewAll'}`}>
        {!isLoading ? (
          !isAllView ? (
            <React.Fragment>
              <CardContainer
                data={ourStrengthCards}
                type="strength"
                limit={4}
                title="Our strengths"
                toggleShowAll={this.toggleShowAll}
              />
              <CardContainer
                data={theirstrengths}
                type="weakness"
                limit={4}
                title="Their strengths"
                toggleShowAll={this.toggleShowAll}
              />
              <CardContainer
                data={ourWeaknessCards}
                type="opportunities"
                limit={4}
                title="Our weaknesses"
                toggleShowAll={this.toggleShowAll}
              />
              <CardContainer
                data={theirweakness}
                type="threats"
                limit={4}
                title="Their weaknesses"
                toggleShowAll={this.toggleShowAll}
              />
            </React.Fragment>
          ) : (
            this.renderAllViewCard()
          )
        ) : (
          <Loader />
        )}
      </div>
    );
  };

  render() {
    return this.renderComponent();
  }
}

SwotContainerImpl.propTypes = { selectedComp: PropTypes.object };

function mapStateToProps(state) {
  const {
    market,
    industry,
    segment,
    region,
    opptyStatus,
    closeDate,
    searchString,
    compSort,
    verifiedCard,
    opptyType,
    isTestCardBJI,
  } = state.marketPerformanceFilters;

  return {
    filter: {
      market,
      industry,
      segment,
      region,
      opptyStatus: opptyStatus,
      closePeriod: closeDate,
      VerifiedCardsOnly: verifiedCard,
      searchString,
      sortCriteria: compSort,
      sortOrder: compSort?.sortBy,
      crmOpptyType: opptyType,
      isTestCard: isTestCardBJI,
    },
    selectedNoteCard: state.marketAnalysisReducer.selectedNoteCard,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    changeFilter: payload=> dispatch({type:UPDATE_MARKET_PERFORMANCE_FILTERS,payload})
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SwotContainerImpl);
