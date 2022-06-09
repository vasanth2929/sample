/* eslint-disable no-tabs */
/* eslint-disable global-require */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { setSurveyStatus } from '../../action/SurveyActions';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { showCustomModal } from '../../components/CustomModal/CustomModal';
import {
  Icons,
  SURVEY_ACTIVE_INDEX,
  SURVEY_COMPLETED_CATEGORY,
} from '../../constants/general';
import { SingleAccountModel } from '../../model/AccountModel/AccountModel';
import { MetricsBox, SurveyNav } from '../../tribyl_components';
import SurveyContext from '../../tribyl_components/Context/SurveyContext';
import Differentiation from '../../tribyl_components/Differentiation/Differentiation';
import QuestionPanel from '../../tribyl_components/QuestionPanel';
import SurveyWrapup from '../../tribyl_components/WrapUp/SurveyWrapup';
import { getStoryTitle } from '../../util/promises/edittitle_promise';
import { getMarketStudyQuestionCategoryAndSequence } from '../../util/promises/expert-network';
import {
  getSurveyStatusForStoryForUser,
  upsertSurveyStatusForStoryForUser,
} from '../../util/promises/survey_promise';
import { dispatch, getLoggedInUser } from '../../util/utils';
import { Loader } from '../../_tribyl/components/_base/Loader/Loader';
import SurveyCompleted from './component/SurveyCompleted';
import './Survey.style.scss';

const DEFAULT_NAME = 'survey';

class Survey extends Component {
  constructor(props) {
    super(props);
    const { activeIndex, CompletedCategory } = props;
    this.state = {
      QuestionCategoryAndSequence: [],
      selectedQuestions: [],
      activeIndex: activeIndex || 0,
      completedCategories: CompletedCategory || [],
      categoryArray: [],
      storyStats: null,
      isLoading: true,
      user: {},
      percentComplete: 0,
      categoryId: [],
      isUnauthorized: false,
      isLoadingQuestion: true,
      activeQuestionIndex: 0,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({ isLoading: true });
    const { activeIndex } = this.state;
    const user = getLoggedInUser();
    const query = this.useQuery();
    const storyId = query.get('storyId') ? query.get('storyId') : 22;

    this.checkUser(user, query);

    // eslint-disable-next-line no-shadow
    const { setSurveyStatus } = this.props;
    // const storyId = (this.props.match.params.storyId && this.props.match.params.storyId !== "null") ? this.props.match.params.storyId : 22;
    const repsonse = await getMarketStudyQuestionCategoryAndSequence();
    const response2 = await getStoryTitle(storyId);
    const storyStats = response2 ? response2.data : [];
    SingleAccountModel.deleteAll();
    new SingleAccountModel({ id: storyStats.accountId, ...storyStats }).$save();
    const QuestionCategoryAndSequence = repsonse.data ? repsonse.data : [];
    const categoryArray = QuestionCategoryAndSequence.map(
      (i) => i.categoryName
    );
    const categoryId = QuestionCategoryAndSequence.map((i) => i.categoryId);
    const response3 = await getSurveyStatusForStoryForUser(
      storyId,
      user.userId
    );
    const percentComplete = response3 ? response3.data.percentComplete : 0;
    if (percentComplete === 100) {
      setSurveyStatus(true);
    } else {
      setSurveyStatus(false);
    }
    this.setState(
      {
        isLoadingQuestion: false,
        QuestionCategoryAndSequence,
        categoryArray,
        storyStats,
        user,
        percentComplete,
        categoryId,
      },
      () => {
        this.filterCards(activeIndex);
      }
    );
  };

  useQuery = () => {
    return new URLSearchParams(this.props.location.search);
  };

  checkUser = (user, query) => {
    if (!query.get('userId')) return;

    if (user.userId !== Number(query.get('userId'))) {
      this.setState({ isUnauthorized: true });
    }
  };

  handleClick = (question, index) => {
    const { completedCategories } = this.state;

    if (
      this.state.activeIndex >= index ||
      completedCategories.includes(index)
    ) {
      dispatch({
        type: SURVEY_ACTIVE_INDEX,
        payload: index,
      });
      this.setState({ selectedQuestions: question, activeIndex: index });
    }
  };

  setActiveQuestion = (index) => {
    this.setState({ activeQuestionIndex: index });
  };

  renderComponent = (
    index,
    selectedQuestions,
    stage,
    accountId,
    domainNames,
    industryId,
    activeQuestionIndex
  ) => {
    const query = this.useQuery();
    const storyId = query.get('storyId') ? query.get('storyId') : 22;
    const opptyId = query.get('OpptyId') ? query.get('OpptyId') : 22;
    switch (index) {
      case 0:
        return (
          <SurveyContext
            accountId={accountId}
            uiType="ds"
            stage={stage}
            onComplete={this.handleComplete}
            storyId={Number(storyId)}
            opptyId={Number(opptyId)}
            isLoadingQuestion={this.state.isLoading}
            domainNames={domainNames}
            industryId={industryId}
          />
        );
      case 1:
        return (
          <QuestionPanel
            goPrevious={this.handlePrevious}
            reload={this.loadData}
            isLoading={this.state.isLoading}
            storyId={storyId}
            opptyId={opptyId}
            location={this.props.location}
            type="Customer Needs"
            data={selectedQuestions}
            setActiveQuestion={this.setActiveQuestion}
            onComplete={this.handleComplete}
            activeIndex={activeQuestionIndex}
            uiType="ds"
            toolTipIndex={0}
          />
        );
      case 2:
        return (
          <QuestionPanel
            goPrevious={this.handlePrevious}
            reload={this.loadData}
            isLoading={this.state.isLoading}
            storyId={storyId}
            opptyId={opptyId}
            location={this.props.location}
            type="Decision Criteria"
            data={selectedQuestions}
            setActiveQuestion={this.setActiveQuestion}
            onComplete={this.handleComplete}
            activeIndex={activeQuestionIndex}
            uiType="ds"
            toolTipIndex={4}
          />
        );
      case 3:
        return (
          <Differentiation
            uiType="ds"
            goPrevious={this.handlePrevious}
            storyId={Number(storyId)}
            opptyId={Number(opptyId)}
            Categorydata={selectedQuestions}
            onComplete={this.handleComplete}
          />
        );
      default:
        return (
          <SurveyWrapup
            uiType="ds"
            goPrevious={this.handlePrevious}
            storyId={Number(storyId)}
            opptyId={Number(opptyId)}
            viewType="dealSurvey"
            onComplete={this.submmitSurvey}
          />
        );
    }
  };

  updateProgress = async (categoryId) => {
    const { percentComplete } = this.state;
    const query = this.useQuery();
    const storyId = query.get('storyId') ? query.get('storyId') : 22;
    const userId = this.state.user.userId;
    if (percentComplete !== 100) {
      const response = await upsertSurveyStatusForStoryForUser(
        categoryId,
        'N',
        storyId,
        userId
      );
      const updateddata = response.data && response.data.percentComplete;
      this.setState({ percentComplete: updateddata });
    }
  };

  submmitSurvey = async () => {
    const { user, categoryId, completedCategories, activeIndex } = this.state;
    const updatedCompletedCategories = [...completedCategories];
    updatedCompletedCategories.push(activeIndex);
    const query = this.useQuery();
    const storyId = query.get('storyId') ? query.get('storyId') : 22;
    const opptyId = query.get('OpptyId') ? query.get('OpptyId') : 22;
    const userId = user.userId;
    const catId = categoryId[categoryId.length - 1];
    const response = await upsertSurveyStatusForStoryForUser(
      catId,
      'Y',
      storyId,
      userId
    );
    const updateddata = response.data && response.data.percentComplete;
    this.setState(
      {
        percentComplete: updateddata,
        completedCategories: updatedCompletedCategories,
      },
      () => {
        /* window.open(`/dealgametape/storyId/${storyId}/opptyId/${opptyId}?Survey=completed`, '_self'); */
        /* window.open(`/dealgametape/storyId/${storyId}/opptyId/${opptyId}`, '_self'); */
        this.handleSurveySubmmit(storyId, opptyId);
      }
    );
  };

  handleComplete = () => {
    const { activeIndex, completedCategories, categoryId } = this.state;
    const nextIndex = activeIndex + 1;
    completedCategories.push(activeIndex);
    /* console.log(">>>afterclicking save", categoryId[activeIndex], activeIndex); */
    this.updateProgress(categoryId[activeIndex]);
    this.filterCards(nextIndex);
    dispatch({
      type: SURVEY_ACTIVE_INDEX,
      payload: nextIndex,
    });
    dispatch({
      type: SURVEY_COMPLETED_CATEGORY,
      payload: completedCategories,
    });
    this.setState({ activeIndex: nextIndex, completedCategories });
  };

  filterCards = (index) => {
    const { QuestionCategoryAndSequence, categoryArray } = this.state;
    const selectedQuestions = QuestionCategoryAndSequence.find(
      (i) => i.categoryName === categoryArray[index]
    );
    this.setState({ selectedQuestions, isLoading: false });
  };

  handlePrevious = () => {
    const { activeIndex, completedCategories } = this.state;
    const prevIndex = activeIndex - 1;
    this.filterCards(prevIndex);
    this.setState({ activeIndex: prevIndex, completedCategories });
  };

  handleSurveySubmmit = (storyId, opptyId) => {
    const header = <span>Survey</span>;
    const body = (
      <SurveyCompleted storyId={Number(storyId)} opptyId={Number(opptyId)} />
    );
    showCustomModal(header, body, 'story-modal');
  };

  goBackToDeal = () => {
    const { surveyStatus } = this.props;
    const query = this.useQuery();
    const storyId = query.get('storyId') ? query.get('storyId') : 22;
    const opptyId = query.get('OpptyId') ? query.get('OpptyId') : 22;
    if (surveyStatus) {
      this.props.history.push(
        `/dealgametape/storyId/${storyId}/opptyId/${opptyId}`
      );
    }
  };

  renderBackButton = () => {
    const { surveyStatus } = this.props;

    return (
      <div
        role="button"
        className={`${DEFAULT_NAME}-back ${!surveyStatus && 'role-disabled'}`}
        onClick={this.goBackToDeal}
      >
        <div className={`${DEFAULT_NAME}-back-icon`}>
          <i className="material-icons">chevron_left</i>
        </div>
        <span
          role="button"
          className={`${DEFAULT_NAME}-back-icon-text`}
          onClick={this.handleBackButton}
        >
          Go To Deal Game Tape
        </span>
      </div>
    );
  };

  render() {
    const {
      QuestionCategoryAndSequence,
      activeIndex,
      completedCategories,
      percentComplete,
      selectedQuestions,
      isUnauthorized,
      isLoading,
      activeQuestionIndex,
    } = this.state;

    const {
      accountName = '',
      domainNames,
      closingQuarter,
      closingYear,
      influenceAmt = 0,
      market = '',
      crmOpportunities = [],
      stage,
      industryName,
      industryId,
      accountId,
      storyName,
    } = this.props.storyStats || {};

    return (
      <MainPanel
        noSidebar
        viewName="Deal Survey"
        icons={[Icons.MAINMENU]}
        handleIconClick={this.handleHeaderIconClick}
        customClass="survey-container"
      >
        {!isUnauthorized ? (
          <div className={`${DEFAULT_NAME}`}>
            {this.renderBackButton()}
            {this.props.storyStats && (
              <MetricsBox
                detail={this.props.storyStats}
                metrics={[
                  {
                    label: 'Account',
                    value: accountName,
                  },
                  {
                    label: 'Opportunity Name ',
                    value: storyName,
                  },
                  {
                    label: 'Industry',
                    value: industryName,
                  },
                  {
                    label: 'Market',
                    value: market,
                  },
                  {
                    label: 'Close Status',
                    value: stage,
                  },
                  {
                    label: 'Close Period',
                    value: `${closingQuarter}-${closingYear}`,
                  },
                  {
                    label: 'Deal Size',
                    value: `${influenceAmt.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    })}`,
                  },
                  {
                    label: 'Opportunity Owner',
                    value: crmOpportunities[0]?.opportunityOwnerName,
                  },
                ]}
              />
            )}
            <div className={`${DEFAULT_NAME}-content-wrapper`}>
              {/*  send array of completed ids, send activeIndex to show active nav, all ids are as per the array index e.g 0,1,2 etc */}
              <SurveyNav
                completed={completedCategories}
                data={QuestionCategoryAndSequence}
                activeIndex={activeIndex}
                onClick={this.handleClick}
                percentComplete={percentComplete}
              />
              {!isLoading ? (
                <div className={`${DEFAULT_NAME}-content-panel`}>
                  {this.renderComponent(
                    activeIndex,
                    selectedQuestions,
                    stage,
                    accountId,
                    domainNames,
                    industryId,
                    activeQuestionIndex
                  )}
                </div>
              ) : (
                <Loader />
              )}
            </div>
          </div>
        ) : (
          <div
            className={`${DEFAULT_NAME}-unauthorized d-flex align-items-center`}
          >
            <h4>
              In order to access this survey, please log out of the current
              session and click on the email link again using the provided
              credentials.
            </h4>
          </div>
        )}
      </MainPanel>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    surveyStatus: state.SurveyData.surveyStatus,
    activeIndex: state.SurveyData.activeCategory,
    CompletedCategory: state.SurveyData.CompletedCategory,
    storyStats: SingleAccountModel.last()?.props,
  };
};

const mapDispatchToProps = () => {
  return bindActionCreators({ setSurveyStatus }, dispatch);
};

Survey.propTypes = {
  surveyStatus: PropTypes.bool,
  setSurveyStatus: PropTypes.func,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Survey));
