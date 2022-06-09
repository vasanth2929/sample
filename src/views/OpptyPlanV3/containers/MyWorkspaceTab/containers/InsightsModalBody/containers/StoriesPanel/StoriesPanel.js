// import Scrollbar from 'perfect-scrollbar-react';
/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { bindActionCreators } from 'redux';
import { TextBlock } from 'react-placeholder-shimmer';

// import shareGlobal from '../../../../../../../../assets/iconsV2/share-global.png';
// import shareLimited from '../../../../../../../../assets/iconsV2/share-limited.png';
// import shareRestricted from '../../../../../../../../assets/iconsV2/share-restricted.png';
import { showCustomModal } from '../../../../../../../../components/CustomModal/CustomModal';
import { OpptyPlanCardModel } from '../../../../../../../../model/opptyPlanModels/OpptyPlanCardModel';
import { UtilModel } from '../../../../../../../../model/UtilModel';
import { getDealCard } from '../../../../../../../../util/promises/dealcards_promise';
import { getStoriesForCardForOpptyP } from '../../../../../../../../util/promises/opptyplan_promise';
import { getStoryForCard } from '../../../../../../../../util/promises/playbookcard_details_promise';
import { getLoggedInUser } from '../../../../../../../../util/utils';
import { InsightsModalBody } from '../../../InsightsModalBody/InsightsModalBody';
import { InsightsModalHeader } from '../../../InsightsModalHeader/InsightsModalHeader';
import { StorySeeMoreModalBody } from '../StorySeeMoreModalBody/StorySeeMoreModalBody';
import './styles/StoriesPanel.style.scss';
import { StoriesListDataGrid } from '../../../../../StoriesTab/containers/StoriesListDataGrid/StoriesListDataGrid';

class StoriesPanelImpl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { stories: [], isStoriesLoading: true };
  }

  componentDidMount() {
    this.getStoriesForCardForOpptyP();
  }
  componentDidUpdate(prevProps) {
    if (this.props.cardId !== prevProps.cardId) {
      this.getStoriesForCardForOpptyP();
    }
  }
  async getStoryForCard() {
    const response = await getStoryForCard(this.props.cardId);
    this.setState({ stories: response.data });
  }

  async getStoriesForCardForOpptyP() {
    const response = await getStoriesForCardForOpptyP(
      this.props.cardId,
      this.props.opptyPlanId
    );
    const stories = (response.data || []).sort((a, b) => {
      // Need to do secondary sort by timestamp if score is the same, but timestamp is currently null
      // if(a.scoreForOpptyPlan === b.scoreForOpptyPlan) return b.scoreForOpptyPlan - a.scoreForOpptyPlan;
      // else b.scoreForOpptyPlan - a.scoreForOpptyPlan;
      return b.scoreForOpptyPlan - a.scoreForOpptyPlan;
    });
    this.setState({ stories, isStoriesLoading: false });
  }

  getLoader = () => {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  };

  async getDealCard(dealCardId, userId) {
    const response = await getDealCard(dealCardId, userId);
    this.setState({ isDataLoading: false, cardData: response.data }, () => {
      this.props.updateCardInsights(
        'description',
        this.state.cardData.description || ''
      );
      this.props.updateCardInsights('protip', this.state.cardData.protip || '');
      this.props.updateCardInsights(
        'cardDetails.File',
        this.state.cardData.cardDetails.File || ''
      );
      this.props.updateCardInsights(
        'cardDetails.url',
        this.state.cardData.cardDetails.url || ''
      );
      this.props.updateCardInsights(
        'cardDetails.product',
        this.state.cardData.cardDetails.product || []
      );
      this.props.updateCardInsights(
        'cardDetails.compelling_event',
        this.state.cardData.cardDetails.compelling_event || 'N'
      );
      this.props.updateCardInsights(
        'cardDetails.criterion',
        this.state.cardData.cardDetails.criterion || 'N'
      );
    });
  }

  showDetailModal = (showEditMode) => {
    const { selectedCard, opptyPlanId, accountId, isStoryDisabled } =
      this.props;
    const userId = getLoggedInUser().userId;
    const name = selectedCard.name || selectedCard.title;
    const isPersonaCard =
      name &&
      name.match(
        /^(Relationship Map|Economic Buyer|Legal|Champion|Influencer|Procurement|Legal)$/
      );
    showCustomModal(
      <InsightsModalHeader
        storyId={11}
        cardDetails={selectedCard}
        isPersonaCard={isPersonaCard}
        userId={userId}
        isStoryDisabled={isStoryDisabled}
        opptyPlanId={opptyPlanId}
      />,
      <InsightsModalBody
        cardDetails={selectedCard}
        userId={userId}
        cardId={selectedCard.cardId || selectedCard.id}
        topicName={selectedCard.topicName}
        accountId={accountId}
        defaultIndex={2}
        type={selectedCard.type}
        dealCardIds={selectedCard.dealCardIds}
        isPersonaCard={isPersonaCard}
        showContactList={this.showContactList}
        showEditMode={showEditMode}
        opptyPlanId={opptyPlanId}
      />,
      'detail-view-modal',
      () => OpptyPlanCardModel.deleteAll(),
      null,
      this.getLoader()
    );
  };

  handleSeeMore = (e, selectedStory) => {
    e.stopPropagation();
    showCustomModal(
      <p>Insights</p>,
      <StorySeeMoreModalBody storyDetails={selectedStory} />,
      'stories-seemore-view-modal',
      () => {
        this.showDetailModal(false);
      },
      null,
      null
    );
  };

  render() {
    const { stories, isStoriesLoading } = this.state;
    return !isStoriesLoading ? (
      stories.length > 0 ? (
        <StoriesListDataGrid
          opptyPlanId={this.props.opptyPlanId}
          stories={stories}
          handleStoryView={this.props.handleStoryClick}
          minWidth={880}
          modalView
        />
      ) : (
        <div className="font-weight-bold text-center">No Stories Found</div>
      )
    ) : (
      <section className="grid-loader">
        <TextBlock
          textLines={[
            96.5, 96.5, 96.5, 96.5, 96.5, 96.5, 96.5, 96.5, 96.5, 96.5, 96.5,
            96.5, 96.5, 96.5, 96.5, 96.5, 96.5, 96.5, 96.5, 96.5, 96.5,
          ]}
        />
      </section>
    );
  }
}

function mapStateToProps(state) {
  const selectedCard = OpptyPlanCardModel.last()
    ? OpptyPlanCardModel.last().props
    : null;
  return {
    selectedCard,
    cardInsightsField: state.form.cardInsights,
    isStoryDisabled: UtilModel.getValue('isStoryDisabled'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateCardInsights: (model, value) =>
        actions.change(`form.cardInsights.${model}`, value),
      setInitialValues: (value) => actions.change('form.cardInsights', value),
    },
    dispatch
  );
}

export const StoriesPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(StoriesPanelImpl);
