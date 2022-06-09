/* eslint-disable no-nested-ternary */
import FileSaver from 'file-saver';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import {
  clearComponent,
  reload,
} from '../../../../../../action/loadingActions';
import { UtilModel } from '../../../../../../model/UtilModel';
import { downloadPdfFile } from '../../../../../../util/promises/tearsheet_promise';
import { Discussion } from '../../../../../PersonaDealCards/container/Discussion/Discussion';
import { TearsheetModalTab } from '../../../StoriesTab/containers/TearSheetModal/TearSheet';
import { OpptyPlanCardModel } from './../../../../../../model/opptyPlanModels/OpptyPlanCardModel';
import { ContactPanel } from './containers/ContactPanel/ContactPanel';
import { InsightsPanelV2 } from './containers/InsightsPanelV2/InsightsPanelV2';
import { ViewStoryPanel } from './containers/InsightsSidebar/containers/ViewStoryPanel/ViewStoryPanel';
import { KeyMomentDetailPanel } from './containers/KeyMomentDetailPanel/KeyMomentDetailPanel';
import { KeyMomentsPanel } from './containers/KeyMomentsPanel/KeyMomentsPanel';
import { OverviewPanel } from './containers/OverviewPanel/OverviewPanel';
import { ProtipPanel } from './containers/ProtipPanel/ProtipPanel';
import { StoriesPanel } from './containers/StoriesPanel/StoriesPanel';
import './styles/InsightsModalBody.style.scss';
import { AnalyticsPanel } from '../../../../../PlaybookDetails/containers/PlaybookWinPath/PlaybookCardModal/AnalyticsPanel/AnalyticsPanel';

class InsightsModalBodyImpl extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      IS_LOADING: true,
      cardDetails: {},
      playbookDetails: {},
      selectedKeyMomentId: null,
      keyMomentIdList: [],
      playbookCardProductList: [],
      isTearSheetView: false,
      storyId: null,
    };
  }

  componentWillUnmount() {
    UtilModel.updateData({ showOpptyInsightsModal: false });
    clearComponent('key-moments');
  }

  clearKeyMomentdetails = () => {
    this.setState({ keyMomentIdList: [], selectedKeyMomentId: null });
  };

  handleDateFormat = (date) => new Date(date).toDateString();

  handleKeyMomentSeeMore = (selectedKeyMomentId, keyMomentIdList) => {
    this.setState({ selectedKeyMomentId, keyMomentIdList });
  };

  updateSelectedKeyMomentId = (selectedKeyMomentId) => {
    this.setState({ selectedKeyMomentId }, () => reload('key-moments'));
  };

  updatePlaybookCardProductList = (playbookCardProductList) => {
    this.setState({ playbookCardProductList });
  };
  handleTearSheetView = (data) => {
    this.setState({ isTearSheetView: !this.state.isTearSheetView, ...data });
  };
  async downloadPdfFile(storyId, accountName, closeYear) {
    const buyingCenter =
      document.getElementsByClassName('sub-view-name')[0].innerText;
    const strFileName = `${accountName}_${buyingCenter}_FY${closeYear}.pdf`
      .split(' ')
      .join('_');
    const download = await downloadPdfFile(storyId);
    const blob = new Blob([download.data], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blob, strFileName);
  }
  renderDiscussionPanel = (commentsList) => (
    <div>
      {commentsList.map((item, key) => (
        <Discussion
          key={key}
          commentId={item.id}
          author={item.author}
          handleDateFormat={this.handleDateFormat(item.createdAt)}
          discussion={item.discussion}
          likedBy={item.likedBy}
          handleLikeOrUnlike={this.handleLikeOrUnlike}
        />
      ))}
    </div>
  );

  renderTearSheetView = (storyId, accountId, accountName, closeYear) => {
    return (
      <div>
        <div className="stories-tearsheet-insights">
          <div className="main-action-container">
            <p>
              <i
                className="material-icons"
                onClick={() => this.setState({ isTearSheetView: false })}
                role="button"
              >
                arrow_back
              </i>
              &nbsp;Back to Stories
            </p>
          </div>
          <div
            className="primary"
            role="button"
            onClick={() =>
              this.downloadPdfFile(storyId, accountName, closeYear)
            }
          >
            <i className="material-icons">get_app</i>
            <div>Download</div>
          </div>
        </div>
        <TearsheetModalTab
          storyId={storyId}
          accountId={accountId}
          insightsModal
        />
      </div>
    );
  };

  render() {
    const enableAnalytics = process.env.PLAYBOOK_ANALYTICS;
    const {
      cardId,
      userId,
      type,
      dealCardIds,
      isPersonaCard,
      showContactList,
      cardDetails,
      showEditMode,
      opptyPlanId,
      accountId,
      topicName,
      sentiment,
      hideEditButton,
      playbookName,
    } = this.props;
    const {
      // playbookDetails,
      selectedKeyMomentId,
      keyMomentIdList,
      // playbookCardProductList,
      // isTearSheetView,
      storyId,
      // accountName,
      // closeYear
    } = this.state;

    return (
      <section className="insights-modal-body">
        {selectedKeyMomentId && (
          <KeyMomentDetailPanel
            selectedKeyMomentId={selectedKeyMomentId}
            keyMomentIdList={keyMomentIdList}
            updateSelectedKeyMomentId={this.updateSelectedKeyMomentId}
            clearKeyMomentdetails={this.clearKeyMomentdetails}
          />
        )}
        {/* <Tabs style={{ display: selectedKeyMomentId ? 'none' : 'unset' }} defaultIndex={isPersonaCard ? ((this.props.defaultIndex || this.props.defaultIndex === 0) ? this.props.defaultIndex : 1) : (this.props.defaultIndex ? this.props.defaultIndex : 0)}> */}
        <Tabs
          style={{ display: selectedKeyMomentId ? 'none' : 'unset' }}
          defaultIndex={
            this.props.selectedCard.selectedIndex
              ? this.props.selectedCard.selectedIndex
              : this.props.defaultIndex || this.props.defaultIndex === 0
              ? this.props.defaultIndex
              : isPersonaCard
              ? 1
              : 0
          }
        >
          <TabList>
            <Tab onClick={() => this.props.handleDefaultTab(0)}> OVERVIEW</Tab>
            {isPersonaCard &&
              (cardDetails.contactBean &&
              (cardDetails.contactBean || '').type === 'lead' ? (
                <Tab onClick={() => this.props.handleDefaultTab(1)}>
                  LEAD DETAILS
                </Tab>
              ) : (
                <Tab onClick={() => this.props.handleDefaultTab(1)}>
                  {' '}
                  CONTACT DETAILS
                </Tab>
              ))}
            <Tab
              onClick={() => this.props.handleDefaultTab(isPersonaCard ? 2 : 1)}
            >
              INSIGHTS
            </Tab>
            <Tab onClick={() => this.props.handleDefaultTab(2)}>PROTIP</Tab>
            {!isPersonaCard && (
              <Tab onClick={() => this.props.handleDefaultTab(2)}>STORIES</Tab>
            )}
            {!isPersonaCard && <Tab>MATCHES</Tab>}
            {/* {!isPersonaCard && (
              <Tab onClick={() => this.props.handleDefaultTab(3)}>Experts</Tab>
            )} */}
            {(enableAnalytics === true || enableAnalytics === 'true') && (
              <Tab onClick={() => this.props.handleDefaultTab(4)}>
                ANALYTICS
              </Tab>
            )}
          </TabList>
          <TabPanel className="overview-panel">
            <OverviewPanel
              cardId={cardId}
              userId={userId}
              playbookName={playbookName}
              // isPersonaCard={isPersonaCard}
              isSideBar={this.props.isSideBar}
              cardDetails={cardDetails}
              updatePlaybookCardProductList={this.updatePlaybookCardProductList}
            />
          </TabPanel>
          {isPersonaCard && (
            <TabPanel className="contact-panel">
              <ContactPanel
                cardId={cardId}
                cardDetails={cardDetails}
                accId={localStorage.getItem('accountId')}
                showContactList={() => showContactList(cardDetails)}
                showEditMode={showEditMode}
                opptyPlanId={opptyPlanId}
                handleBodyContentEditing={this.props.handleBodyContentEditing}
                sentiment={sentiment}
                hideEditButton={hideEditButton}
              />
            </TabPanel>
          )}
          <TabPanel className="insights-panel">
            <InsightsPanelV2
              card={cardDetails}
              opptyPlanId={opptyPlanId}
              isPersonaCard={isPersonaCard}
              viewType="MODAL"
            />
          </TabPanel>
          <TabPanel className="overview-panel">
            <ProtipPanel
              cardId={cardId}
              card={cardDetails}
              isPersonaCard={isPersonaCard}
              opptyPlanId={opptyPlanId}
              viewType="MODAL"
            />
          </TabPanel>
          {!isPersonaCard && (
            <TabPanel className="stories-panel">
              {this.state.story ? (
                <ViewStoryPanel
                  story={this.state.story}
                  cardId={cardId}
                  viewType="MODAL"
                  handleBackButton={() => this.setState({ story: null })}
                />
              ) : (
                <StoriesPanel
                  {...this.props}
                  cardId={cardId}
                  type={type}
                  dealCardIds={dealCardIds}
                  cardDetails={cardDetails}
                  isSideBar={this.props.isSideBar}
                  handleStoryClick={(story) => this.setState({ story })}
                />
              )}
            </TabPanel>
          )}
          {!isPersonaCard && (
            <TabPanel className="key-moment-panel">
              <KeyMomentsPanel
                cardId={cardId}
                opptyPlanId={opptyPlanId}
                card={cardDetails}
                type={type}
                dealCardIds={dealCardIds}
                handleKeyMomentSeeMore={this.handleKeyMomentSeeMore}
                storyId={storyId}
                accountId={accountId}
                modalType="MKM"
                openOpptyCardModal
                // isStoryDisabled={isStoryDisabled}
              />
            </TabPanel>
          )}
          {/* {!isPersonaCard && (
            <TabPanel className="discussion-panel">
              <ExpertsPanel cardId={cardId} topicName={topicName} />
            </TabPanel>
          )} */}
          {(enableAnalytics === true || enableAnalytics === 'true') && (
            <TabPanel className="analytics-panel">
              <AnalyticsPanel />
            </TabPanel>
          )}
        </Tabs>
      </section>
    );
  }
}

function mapStateToProps() {
  const opptyCard =
    OpptyPlanCardModel.last() && OpptyPlanCardModel.last().props;
  return { selectedCard: opptyCard };
}

export const InsightsModalBody = connect(mapStateToProps)(
  InsightsModalBodyImpl
);

InsightsModalBody.propTypes = { cardDetails: PropTypes.object };
