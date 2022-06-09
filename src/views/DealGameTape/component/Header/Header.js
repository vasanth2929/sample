import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Header.style.scss';
import {
  MetricsBox,
  TearsheetDock,
  TribylButton,
} from '../../../../tribyl_components';
import { DefaultOptions as StatusOptions } from '../../../../tribyl_components/StatusDropdown/StatusDropdown';
import {
  addConversation,
  handleConversationFileUploadAndSave,
} from '../../../../util/promises/conversation_promise';
import {
  createConvMeetingMetadata,
  updateReviewStatus,
} from '../../../../util/promises/transcript_promise';
import { showAlert } from '../../../../components/MessageModal/MessageModal';
import { withRouter } from 'react-router-dom';
import {
  CustomModal,
  showCustomModal,
} from '../../../../components/CustomModal/CustomModal';
import StoryDetail from '../StoryDetail/StoryDetail';
import TribylSelect from '../../../../tribyl_components/TribylSelect/TribylSelect';
import isEqual from 'lodash.isequal';
import classNames from 'classnames';

const DEFUALT_CLASSNAME = 'header-container';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTearsheet: false,
      statusDropdownValue: StatusOptions[0],
      showManageSurvey: false,
      isDisabled: false,
      shareStatus: this.props.storyTitle?.shareStatus
        ? {
            label: this.getLabel(this.props.storyTitle?.shareStatus),
            value: this.props.storyTitle?.shareStatus,
          }
        : { value: 'Review', label: 'Update share status' },
      shareStatusOptions: [
        { label: 'Share internally', value: 'Internal' },
        { label: 'Share publicly', value: 'Public' },
        { label: 'Update share status', value: 'Review' },
      ],
    };
  }

  componentDidMount() {
    this.getShareStatus();
  }
  getLabel = (val) => {
    if (val === 'Internal') return 'Share internally';
    else if (val === 'Public') return 'Share publicly';
    else return 'Update share status';
  };
  getShareStatus = (val) => {
    if (
      ['Internal', 'Public'].includes(
        val ? val : this.props.storyTitle?.shareStatus
      )
    )
      this.setState({
        shareStatusOptions: this.state.shareStatusOptions.slice(0, 2),
      });
  };

  handleFileUploadSelect = async (elem) => {
    elem.persist();
    const transcriptFile = elem.target.files[0];
    const meetingDate = new Date().toISOString().slice(0, -1);
    const payload = { storyId: Number(this.props.storyId), type: 'Document' };
    let conversationId = null;
    try {
      const metadataPayload = [
        {
          subject: '',
          attendees: [],
          activityType: null,
          meetingDate,
        },
      ];
      // const metadataPayload = [{ meetingDate }];
      const response = await addConversation(payload);
      conversationId = response.data.conversationId;
      metadataPayload[0].conversationId = conversationId;
      await createConvMeetingMetadata(metadataPayload);
      await handleConversationFileUploadAndSave(conversationId, transcriptFile);
      showAlert('Document uploaded successfully.', 'success');
    } catch (error) {
      console.log(error);
      showAlert(
        'Could not upload document. Please contact Administrator',
        'error'
      );
    } finally {
      elem.target.value = null;
    }
  };

  handleBackButton = () => {
    const {
      history,
      tabId,
      location: { state },
    } = this.props;
    // const currentTab = state.tabIndex ? state.tabIndex:tabId;
    // if (state.tabIndex) {
    //   history.push(`/market-performance/${currentTab}`);
    // } else {
    //   history.push('/market-performance/0');
    // }
    console.log(history);
    history.goBack();
  };

  toggleTearsheet = () => {
    this.setState({ showTearsheet: !this.state.showTearsheet });
  };

  renderMetricsBox = () => {
    const {
      accountName,
      closingQuarter,
      closingYear,
      influenceAmt = 0,
      market = '',
      crmOpportunities = [],
      stage = '',
      industryName,
      storyName,
    } = this.props.storyTitle || {};
    return (
      <MetricsBox
        showTearOut
        detail={this.props.storyTitle}
        metrics={[
          {
            label: 'Account',
            value: accountName,
          },
          {
            label: 'Opportunity Name',
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
    );
  };

  handleStatusChange = (val) => {
    if (isEqual(val, this.state.shareStatus)) return;
    this.setState({ isDisabled: true, shareStatus: val });
    const params = new URLSearchParams({
      shareStatus: val.value,
      storyId: this.props.storyId,
    });
    updateReviewStatus(`?${params.toString()}`).then(() => {
      console.log('success');
      this.setState({ isDisabled: false });
      this.getShareStatus(val.value);
    });
  };

  render() {
    const {
      storyTitle,
      storyStats,
      storyId,
      manageSurvey,
      surveyStats,
      toConversation,
      history,
    } = this.props;

    const { callCovCount, docCovCount, emailCovCount } = storyStats || {};
    const { showTearsheet } = this.state;
    const { completedSurveys, inProgressSurveys } = surveyStats || {};

    return (
      <div className={DEFUALT_CLASSNAME}>
        <div className={`${DEFUALT_CLASSNAME}-nav`}>
          <div className={`${DEFUALT_CLASSNAME}-nav-back-button`}>
            {history.length > 1 && (
              <a role="button" onClick={this.handleBackButton}>
                <div className={`${DEFUALT_CLASSNAME}-nav-back-button-icon`}>
                  <i className="material-icons">chevron_left</i>
                </div>
                <span
                  role="button"
                  className={`${DEFUALT_CLASSNAME}-nav-back-button-icon-text`}
                >
                  Go back to dashboard
                </span>
              </a>
            )}
          </div>
          <div className={`${DEFUALT_CLASSNAME}-nav-options`}>
            <TribylSelect
              className={classNames({
                'share-status-w': this.state.shareStatus.value === 'Review',
                'share-status': true,
              })}
              isDisabled={this.state.isDisabled}
              value={this.state.shareStatus}
              options={this.state.shareStatusOptions}
              onChange={this.handleStatusChange}
            />
            <TribylButton
              text="View Tearsheet"
              variant="secondary"
              onClick={this.toggleTearsheet}
            />
            <input
              type="file"
              accept=".txt, .doc, .docx, .pdf"
              id="transcript-btn"
              onChange={this.handleFileUploadSelect}
            />
            <label
              className="button upload-transcript"
              htmlFor="transcript-btn"
            >
              Upload Documents
            </label>
          </div>
        </div>
        {this.renderMetricsBox()}
        <div className={`${DEFUALT_CLASSNAME}-story`}>
          <div className={`${DEFUALT_CLASSNAME}-story-info`}>
            <span className="sub-heading large bold">Surveys:</span>
            <span className="text large">
              {inProgressSurveys} in-progress, {completedSurveys} completed
            </span>
            <span
              role="button"
              className="text large link mx-2"
              onClick={() => manageSurvey()}
            >
              Oppty Team
            </span>
            |
            <span
              role="button"
              className="text large link mx-2"
              onClick={() => toConversation()}
            >
              Conversations
            </span>
            :
            <span className="text large">
              Based on {callCovCount} calls, {emailCovCount} emails,{' '}
              {docCovCount} docs
            </span>
          </div>
        </div>
        {showTearsheet && (
          <TearsheetDock
            isVisible={showTearsheet}
            onVisibleChange={this.toggleTearsheet}
            storyId={storyId}
            buyingCenter="Information Technology"
            accountId={storyTitle?.accountId}
            isStoryDisabled={false}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tabId: state.marketAnalysisReducer.tabData.tabId,
});

export default connect(mapStateToProps)(withRouter(Header));
