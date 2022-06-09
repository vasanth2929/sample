import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import {
  DEAL_GAME_TAPE_ACTIVE_INDEX,
  DEAL_GAME_TAPE_COMPLETED_CATEGORY,
  DEAL_GAME_TAPE_RESET_ACTIVE_INDEX,
  DEAL_GAME_TAPE_RESET_COMPLETED_CATEGORY,
  Icons,
} from '../../constants/general';
import { SurveyNav } from '../../tribyl_components';
import DealGameTapeContext from '../../tribyl_components/Context/DealGameTapeContext';
import Differentiation from '../../tribyl_components/Differentiation/Differentiation';
import DealGameTapeWrapup from '../../tribyl_components/WrapUp/DealGameTapeWrapup';
import { getStoryTitle } from '../../util/promises/edittitle_promise';
import { getMarketStudyQuestionCategoryAndSequence } from '../../util/promises/expert-network';
import {
  getConversationStatsForStory,
  getSalesPlayForOpptyPOrStory,
  getSurveyStatsForStory,
} from '../../util/promises/opptyplan_promise';
import { dispatch } from '../../util/utils';
import Container from './component/Container/Container';
import { TribylButton } from '../../tribyl_components';
import Header from './component/Header/Header';
import './DealGameTape.style.scss';
import { CustomerNeedsModel, DecisionCriteriaModel } from '../../model/DealGameTapeModel/DealGameTapeModel';

const DEFAULT_CLASSNAME = 'DealGameTape';

class DealGameTape extends Component {
  constructor(props) {
    const { activeIndex, CompletedCategory } = props;
    super(props);
    this.state = {
      showTearsheet: false,
      tabSelection: 'all',
      storySolution: '',
      isLoading: true,
      storyStats: {},
      openShare: false,
      QuestionCategoryAndSequence: [],
      selectedQuestions: [],
      activeIndex: activeIndex || 0,
      completedCategories: CompletedCategory || [],
      showManageSurvey: false,
      categoryArray: [],
      surveyStats: {},
    };
  }

  componentDidMount() {
    this.getStoryTitle();
    this.loadCategory();
  }

  componentWillUnmount() {
    const {
      history: {
        location: { pathname },
      },
    } = this.props;

    if (!pathname.includes('conversation-analysis')) {
      this.resetDealGameTapeState();
    }
  }

  useQuery = () => {
    return new URLSearchParams(this.props.location.search);
  };

  handleClick = (question, index) => {
    // saveToLocalStorage(SURVEY_ACTIVE_INDEX, index);
    dispatch({
      type: DEAL_GAME_TAPE_ACTIVE_INDEX,
      payload: index,
    });
    this.setState({ selectedQuestions: question, activeIndex: index });
  };

  goToManageSurvey = () => {
    const { storyId, opptyId } = this.props.match
      ? this.props.match.params
      : this.props;
    const { history } = this.props;

    this.resetDealGameTapeState();
    history.push(`/manage-survey/${storyId}/${opptyId}`);
  };

  toConversation = () => {
    const { storyId } = this.props.match ? this.props.match.params : this.props;
    const { history } = this.props;
    history.push(`/conversation-detail/${storyId}`);
  };

  componentWillUnmount(){
    CustomerNeedsModel.deleteAll()
    DecisionCriteriaModel.deleteAll();
    dispatch({
      type: DEAL_GAME_TAPE_ACTIVE_INDEX,
      payload: 0,
    });
  }

  renderComponent = (index, story) => {
    const { storyId, opptyId } = this.props.match
      ? this.props.match.params
      : this.props;
    const { selectedQuestions } = this.state;
    const OpptyId = opptyId && opptyId !== 'null' ? opptyId : 22;
    switch (index) {
      case 0:
        return (
          <DealGameTapeContext
            uiType="dgt"
            goPrevious={this.handlePrevious}
            onComplete={this.handleComplete}
            opptyId={OpptyId}
            storyId={storyId}
            stage={story?.stage}
          />
        );
      case 1:
        return (
          <Container
            uiType="dgt"
            goPrevious={this.handlePrevious}
            onComplete={this.handleComplete}
            opptyId={OpptyId}
            storyId={storyId}
            type="customer-needs"
          />
        );
      case 2:
        return (
          <Container
            uiType="dgt"
            goPrevious={this.handlePrevious}
            onComplete={this.handleComplete}
            opptyId={OpptyId}
            storyId={storyId}
            type="decision-criteria"
          />
        );
      case 3:
        return (
          <Differentiation
            uiType="dgt"
            goPrevious={this.handlePrevious}
            onComplete={this.handleComplete}
            opptyId={Number(OpptyId)}
            storyId={Number(storyId)}
            Categorydata={selectedQuestions}
          />
        );
      case 4:
        return (
          <DealGameTapeWrapup
            uiType="dgt"
            goPrevious={this.handlePrevious}
            onComplete={this.handleComplete}
            opptyId={Number(OpptyId)}
            storyId={Number(storyId)}
            viewType="DealGameTape"
          />
        );
      default:
    }
  };

  handleComplete = () => {
    const { activeIndex, completedCategories } = this.state;
    const nextIndex = activeIndex + 1;
    completedCategories.push(activeIndex);
    dispatch({
      type: DEAL_GAME_TAPE_ACTIVE_INDEX,
      payload: nextIndex,
    });
    dispatch({
      type: DEAL_GAME_TAPE_COMPLETED_CATEGORY,
      payload: completedCategories,
    });
    this.filterCards(nextIndex);
    this.setState({ activeIndex: nextIndex, completedCategories });
  };

  handlePrevious = () => {
    const { activeIndex, completedCategories } = this.state;
    const prevIndex = activeIndex - 1;
    dispatch({
      type: DEAL_GAME_TAPE_ACTIVE_INDEX,
      payload: prevIndex,
    });
    this.filterCards(prevIndex);
    this.setState({ activeIndex: prevIndex, completedCategories });
  };

  filterCards = (index) => {
    const { QuestionCategoryAndSequence, categoryArray } = this.state;
    const selectedQuestions = QuestionCategoryAndSequence.find(
      (i) => i.categoryName === categoryArray[index]
    );
    this.setState({ selectedQuestions });
  };

  getStoryTitle() {
    const { storyId } = this.props.match ? this.props.match.params : this.props;
    Promise.all([
      getStoryTitle(storyId),
      getSalesPlayForOpptyPOrStory(storyId),
      getConversationStatsForStory(storyId),
      getSurveyStatsForStory(storyId),
    ])
      .then(([response, response1, stats, statsSurvey]) => {
        let storySolution = response1.data
          ? response1.data.filter((item) => item.currentSalesPlay === true)
          : [];
        storySolution = storySolution.length > 0 ? storySolution[0].name : '';
        const storyStats = stats && stats.data;
        const surveyStats = statsSurvey && statsSurvey.data;
        const query = this.useQuery();
        const tabSelection = query.get('tab');
        if (tabSelection) {
          this.setState({ tabSelection });
        }
        if (response && response.data) {
          this.setState({
            isLoading: false,
            storyTitle: response.data,
            buyerName: response.data.buyingCenter,
            storySolution,
            storyStats,
            surveyStats,
          });
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false });
      });
  }

  loadCategory = async () => {
    const repsonse = await getMarketStudyQuestionCategoryAndSequence();
    const QuestionCategoryAndSequence = repsonse.data ? repsonse.data : [];
    const categoryArray = QuestionCategoryAndSequence.map(
      (i) => i.categoryName
    );
    this.setState({ QuestionCategoryAndSequence, categoryArray });
  };

  resetDealGameTapeState = () => {
    dispatch({ type: DEAL_GAME_TAPE_RESET_ACTIVE_INDEX });
    dispatch({ type: DEAL_GAME_TAPE_RESET_COMPLETED_CATEGORY });
  };

  render() {
    const { storyId, opptyId } = this.props.match
      ? this.props.match.params
      : this.props;
    const {
      storyStats,
      storyTitle,
      isLoading,
      QuestionCategoryAndSequence,
      completedCategories,
      activeIndex,
      surveyStats,
    } = this.state;
    return (
      <ErrorBoundary>
        <MainPanel
          noSidebar
          viewName="Deal Game Tape"
          icons={[Icons.MAINMENU]}
          handleIconClick={this.handleHeaderIconClick}
        >
          <div className={DEFAULT_CLASSNAME}>
            <div className={`${DEFAULT_CLASSNAME}-container`}>
              <div className={`${DEFAULT_CLASSNAME}-container-header`}>
                {!isLoading ? (
                  <Header
                    opptyId={opptyId}
                    storyId={storyId}
                    storyStats={storyStats}
                    storyTitle={storyTitle}
                    manageSurvey={this.goToManageSurvey}
                    surveyStats={surveyStats}
                    toConversation={this.toConversation}
                  />
                ) : (
                  <i>Loading Data...</i>
                )}
              </div>
              <div className={`${DEFAULT_CLASSNAME}-container-body`}>
                <div className={`${DEFAULT_CLASSNAME}-container-body-nav`}>
                  <SurveyNav
                    uiType="dgt"
                    completed={completedCategories}
                    data={QuestionCategoryAndSequence}
                    activeIndex={activeIndex}
                    onClick={this.handleClick}
                  />
                </div>
                <div className={`${DEFAULT_CLASSNAME}-container-body-card`}>
                  {this.renderComponent(activeIndex, storyTitle)}
                </div>
              </div>
            </div>
          </div>
        </MainPanel>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activeIndex: state.dealGameTape.activeCategory,
    CompletedCategory: state.dealGameTape.CompletedCategory,
  };
};

export default withRouter(connect(mapStateToProps)(DealGameTape));
