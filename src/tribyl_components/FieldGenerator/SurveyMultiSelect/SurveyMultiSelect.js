import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { unverifyDealCardForStory } from '../../../util/promises/dealcards_promise';
import {
  getCompetitorWithTypeForOppty,
  getMarketForStory,
  linkStoryToMarket,
  verifyCompetitorWithTypeForOppty,
} from '../../../util/promises/survey_promise';
import { getLoggedInUser, isEmpty } from '../../../util/utils';
import './SurveyMultiSelect.style.scss';

const DEFAULT_CLASSNAME = 'survey_multiselect';

class SurveyMultiSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValues: null,
      marketSelected: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.targetMarket &&
      this.props.targetMarket !== prevProps.targetMarket
    ) {
      this.loadData();
    }

    if (
      this.props !== prevProps &&
      this.props.stage &&
      this.props.stage.toLowerCase().includes('won')
    ) {
      this.handleClosedWonStatus();
    }
  }

  componentDidMount() {
    if (this.props.isSingleSelectMarket) {
      this.loadMarketData();
    } else {
      this.loadData();
    }
  }

  loadData = async () => {
    const { opptyId, type, isSingleSelect } = this.props;
    const response = await getCompetitorWithTypeForOppty(opptyId);
    const cards = response.data ? this.filterCards(type, response.data) : [];
    if (isSingleSelect) {
      const options = cards.map((i) => ({
        value: i['id'],
        label: i['title'],
        dealCardId: i.dealCardId,
        dealCardUserId: i.dealCardUserId,
      }));
      this.setState({ selectedValues: options[0] });
    } else {
      const options = cards.map((i) => ({ value: i['id'], label: i['title'] }));
      this.setState({ selectedValues: options });
    }
  };

  handleClosedWonStatus = () => {
    const { options, stage, type } = this.props;
    const { selectedValues } = this.props;

    if (!isEmpty(selectedValues) || !stage || type !== 'winner') return;

    const value = options.find((option) => option.label.toLowerCase() === 'us');

    this.handleSingleChange(value, { action: 'select-option' });
  };

  loadMarketData = async () => {
    const { storyId, options, handledisableNext, setSelectedMarket } =
      this.props;
    const response = await getMarketForStory(storyId);
    const marketSelected = response.data.playbookSalesName;
    const selectedMarket = options.find((i) => i.label === marketSelected);
    selectedMarket && handledisableNext();
    setSelectedMarket && setSelectedMarket(response.data.playbookSalesPlayId);
    this.setState({ marketSelected: selectedMarket });
  };

  filterCards = (type, data) => {
    switch (type) {
      case 'finalist':
        return data.filter((i) => i.competitorType === 'finalist');
      case 'winner':
        return data.filter((i) => i.competitorType === 'winner');
      case 'incumbent':
        return data.filter((i) => i.competitorType === 'incumbent');
      default:
        break;
    }
  };

  handleChange = async (value, { action }) => {
    const user = getLoggedInUser();
    const { opptyId, type, storyId, limit, handleChange } = this.props;
    const { selectedValues } = this.state;

    switch (action) {
      case 'select-option':
        if (limit) {
          value.splice(limit, value.length - limit);
        }
        const cardId = value[value.length - 1].value;
        if (handleChange) handleChange(cardId);
        await verifyCompetitorWithTypeForOppty(Number(opptyId), cardId, type);
        break;
      case 'remove-value':
        let removedCard = [];
        if (value) {
          removedCard = selectedValues.find(
            (card) => !value.find((i) => i.value === card.value)
          );
        } else {
          removedCard = selectedValues[0];
        }
        await unverifyDealCardForStory(removedCard.value, user.userId, storyId);
        break;
    }
    this.setState({ selectedValues: value });
  };

  handleSingleChange = async (value) => {
    const { selectedValues } = this.state;
    const user = getLoggedInUser();
    const { opptyId, type, storyId } = this.props;
    const cardId = value.value;
    const promises = [];
    if (selectedValues && selectedValues.value !== cardId) {
      unverifyDealCardForStory(
        selectedValues.dealCardId,
        selectedValues.dealCardUserId,
        storyId
      ).then(() =>
        verifyCompetitorWithTypeForOppty(Number(opptyId), cardId, type).then(
          () => {
            this.setState({ selectedValues: value });
            this.loadData();
          }
        )
      );
    } else {
      verifyCompetitorWithTypeForOppty(Number(opptyId), cardId, type).then(
        () => {
          this.setState({ selectedValues: value });
          this.loadData();
        }
      );
    }
  };

  handleMarketChange = async (value, { action }) => {
    const { storyId, handledisableNext, onChange } = this.props;
    switch (action) {
      case 'select-option':
        // checking if marketSelected has any values or not.
        handledisableNext();
        const marketId = value.value;
        const marketName = value.label;
        const repsonse = await linkStoryToMarket(marketId, storyId);
        if (onChange && repsonse) onChange(marketId, marketName);
        break;
    }

    this.setState({ marketSelected: value });
  };

  renderMarketSelect = () => {
    const { options, placholder, uiType, stage } = this.props;
    const { marketSelected } = this.state;
    return (
      <Select
        className="card-select"
        classNamePrefix="multi-select"
        placholder={placholder}
        isClearable={false}
        onChange={this.handleMarketChange}
        options={options}
        value={marketSelected}
        isDisabled={
          uiType === 'dgt' ||
          (stage === 'Closed-No Decision' && uiType === 'ds')
        }
      />
    );
  };

  checkDisable = () => {
    const { uiType, stage, type } = this.props;
    switch (uiType) {
      case 'dgt':
        return true;
      case 'ds':
        if (stage?.toLowerCase().includes('no decision') && type === 'winner')
          return true;
        if (stage?.toLowerCase().includes('won') && type === 'winner')
          return true;
        break;
      default:
        return false;
    }
  };

  getMultiSelectOptions = () => {
    return this.props.options.filter(
      (option) =>
        option.label.toLowerCase() !== 'us' &&
        option.label.toLowerCase() !== 'none'
    );
  };

  getSingleSelectOptionsWinner = () => {
    return this.props.options.filter(
      (option) => option.label.toLowerCase() !== 'none'
    );
  };

  render() {
    const {
      options,
      placholder,
      isSingleSelect,
      isSingleSelectMarket,
      isDisabled,
      type,
      stage,
    } = this.props;
    const { selectedValues } = this.state;
    const multiSelectOptions =
      type === 'finalist' ? this.getMultiSelectOptions() : options;

    const singleSelectOptions =
      type === 'winner' ? this.getSingleSelectOptionsWinner() : options;

    return (
      <div className={DEFAULT_CLASSNAME}>
        {isSingleSelectMarket ? (
          this.renderMarketSelect()
        ) : isSingleSelect ? (
          <Select
            className="card-select"
            classNamePrefix="multi-select"
            placholder={placholder}
            isClearable={false}
            onChange={this.handleSingleChange}
            options={singleSelectOptions}
            value={
              stage?.toLowerCase().includes('won') && type === 'winner'
                ? { value: 'Us', label: 'Us' }
                : selectedValues
            }
            isDisabled={isDisabled || this.checkDisable()}
          />
        ) : (
          <Select
            className="card-select"
            classNamePrefix="multi-select"
            placholder={placholder}
            isMulti
            isClearable={false}
            onChange={this.handleChange}
            options={multiSelectOptions}
            value={selectedValues}
            isDisabled={isDisabled || this.checkDisable()}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { surveyStatus: state.SurveyData.surveyStatus };
};

export default connect(mapStateToProps)(SurveyMultiSelect);
