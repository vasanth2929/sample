import { Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reload } from '../../../../action/loadingActions';
import { Async } from '../../../../basecomponents/async/async';
import { ToggleButton } from '../../../../basecomponents/ToggleButton/ToggleButton';
import { getPlaybookCardDetails } from '../../../../util/promises/playbookcard_details_promise';
import {
  archiveCardMessage,
  updateCard,
} from '../../../../util/promises/playbooks_promise';
import { updateCardTitle } from '../../../../util/promises/storyboard_promise';
import SideBarKeywords from './Components/SideBarKeywords/SideBarKeywords';
import SideBarMessage from './Components/SideBarMesssage/SideBarMessage';
import './MessageSidebar.style..scss';

// import Messaging from './Messaging/Messaging';

const DEFAULT_CLASSNAME = 'messagesidebar';

class MessageSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      insights: null,
      isLoading: true,
      selectedTab: 'keywords',
      storyMetricsdata: [],
      isTitleEditable: false,
      cardTitle: this.props.sidebardata.title || '',
      cards: [],
      fetcherKey: '',
      toggleFetcher: '',
      isTest: false,
      isArchiving: false,
      hide: false,
    };
  }

  componentDidUpdate(prevProps, st) {
    if (this.props.sidebardata.id !== prevProps.sidebardata.id) {
      this.setState({ cardTitle: this.props.sidebardata.title });
      reload('main-sidebar');
    }
    if (this.state.fetcherKey !== st.fetcherKey) {
      this.getPromise().then((d) => {
        this.loadData(d.data);
      });
    }

    if (this.state.toggleFetcher !== st.toggleFetcher) {
      this.props.reload();
    }
  }

  setRefetch = (isToggle = false) => {
    this.setState({ fetcherKey: new Date().toISOString() });
    if (isToggle) this.setState({ toggleFetcher: new Date().toString() });
  };

  getPromise = () => {
    const { sidebardata } = this.props;
    return new Promise((resolve, reject) => {
      Promise.all([getPlaybookCardDetails(sidebardata.id)])
        .then((response) => resolve({ data: response }))
        .catch((e) => reject(e));
    });
  };

  loadData = (response) => {
    const storyMetricsdata = response && response[0] ? response[0].data : {};
    this.setState({
      storyMetricsdata,
      isTest: storyMetricsdata?.isTestCard === 'Y',
    });
  };

  renderNotes = (note) => {
    if (!note) return '';

    const div = document.createElement('div');
    div.innerHTML = note;
    return div.textContent || div.innerText || '';
  };

  handleClick = (label) => {
    console.log(label);
  };

  handleSubTab = (tab) => {
    this.setState({ selectedTab: tab });
  };

  archiveCard = async (id) => {
    this.setState({ isArchiving: true });
    const { onCardArchived } = this.props;
    const repsonse = await archiveCardMessage(id);
    if (repsonse) {
      await onCardArchived();
      this.setState({ isArchiving: false, hide: true });
      setTimeout(() => this.setState({ hide: false }), 2200);
    }
  };

  options = [
    { value: 'personas', label: 'Personas' },
    { value: 'CISO', label: 'CISO' },
    { value: 'Head of AppDev', label: 'Head of AppDev' },
    { value: 'LOB Buyer', label: 'LOB Buyer' },
    { value: 'Enterprise Architect', label: 'Enterprise Architect' },
  ];

  handleSelect = (value) => {
    console.log({ cardTitle: value });
  };

  handleTitleSubmit = async () => {
    const { cardTitle } = this.state;
    const { sidebardata, reload } = this.props;
    const cardId = sidebardata && sidebardata.id;
    const repsonse = await updateCardTitle(cardId, '', cardTitle, '');
    if (repsonse.data) {
      this.setState({ isTitleEditable: false });
      reload();
      this.setRefetch();
    }
  };

  handleEditMode = (value) => {
    this.setState({ isTitleEditable: value });
  };

  handleTitleChange = (e) => {
    const value = e.target.value;
    this.setState({ cardTitle: value });
  };

  renderInsightTabs = (selectedTab, sidebardata) => {
    const { storyMetricsdata } = this.state;
    return (
      <div className={`${DEFAULT_CLASSNAME}-card-body`}>
        <div className="options">
          <span
            role="button"
            onClick={() => this.handleSubTab('keywords')}
            className={`${selectedTab === 'keywords' ? 'selected' : ''}`}
          >
            Keywords
          </span>
          <span
            role="button"
            onClick={() => this.handleSubTab('messaging')}
            className={`${selectedTab === 'messaging' ? 'selected' : ''}`}
          >
            Messaging
          </span>
        </div>
        {selectedTab === 'keywords' && (
          <SideBarKeywords
            reload={this.props.reload}
            sidebardata={sidebardata}
            setRefetch={this.setRefetch}
            storyMetricsdata={storyMetricsdata}
          />
        )}
        {selectedTab === 'messaging' && (
          <SideBarMessage
            reload={this.props.reload}
            sidebardata={sidebardata}
            storyMetricsdata={storyMetricsdata}
            setRefetch={this.setRefetch}
          />
        )}
      </div>
    );
  };

  toggleIsTest = (isTest) => {
    this.setState({ isTest });
    const { storyMetricsdata } = this.state;

    const cardDetails = {
      ...storyMetricsdata.cardDetails,
      type:
        storyMetricsdata.cardDetails.type &&
        storyMetricsdata.cardDetails.type.length > 0
          ? storyMetricsdata.cardDetails.type[0]
          : storyMetricsdata.cardDetails.type,
    };
    updateCard(this.props.sidebardata.id, {
      ...this.state.storyMetricsdata,
      cardDetails,
      isTestCard: isTest ? 'Y' : 'N',
    }).then(() => {
      this.setRefetch(true);
      this.props.onCardArchived();
    });
  };

  renderContent = () => {
    const {
      isLoading,
      selectedTab,
      storyMetricsdata,
      isTitleEditable,
      cardTitle,
    } = this.state;
    const { sidebardata } = this.props;
    const id = sidebardata && sidebardata.id;
    const status = sidebardata.status === 'final' ? 'Live' : sidebardata.status;

    return (
      <React.Fragment>
        <div className={`${DEFAULT_CLASSNAME}-group1`}>
          <div className={`${DEFAULT_CLASSNAME}-group1-container1`}>
            <div className={`${DEFAULT_CLASSNAME}-group1-container1-conatiner`}>
              <p
                className={`${DEFAULT_CLASSNAME}-group1-container1-container-heading`}
              >
                {sidebardata.topicName}
              </p>
              <div
                className={`${DEFAULT_CLASSNAME}-group1-container1-container-subheading mb-3`}
              >
                {isTitleEditable ? (
                  <input
                    className={`${DEFAULT_CLASSNAME}-group1-container1-container-editing`}
                    onChange={this.handleTitleChange}
                    value={cardTitle}
                    onBlur={this.handleTitleSubmit}
                  />
                ) : (
                  <div className="d-flex align-items-center">
                    <div className="card-title">{cardTitle || ''}</div>
                    <div className="edit-button">
                      <span
                        title="edit"
                        role="button"
                        className="material-icons"
                        onClick={() => this.handleEditMode(true)}
                      >
                        mode_edit
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <p
                className={`${DEFAULT_CLASSNAME}-group1-container1-container-subheading2`}
              >
                Updated by
                {storyMetricsdata && storyMetricsdata.userBean
                  ? ' ' + storyMetricsdata.userBean.name + ' '
                  : ''}
                on
                {storyMetricsdata.updateTime &&
                  ' ' +
                    moment
                      .unix(storyMetricsdata.updateTime / 1000)
                      .format('ll')}
              </p>
            </div>

            <div
              role="button"
              className={`${DEFAULT_CLASSNAME}-group1-container1-icon`}
              onClick={() => this.props.toggleSidebar()}
            >
              <span className="material-icons">close</span>
            </div>
          </div>

          <div
            className={`${DEFAULT_CLASSNAME}-group1-container2 ${
              status === 'Live' && sidebardata?.isTestCard !== 'Y'
                ? 'approved-group'
                : ''
            }`}
          >
            {/* <div className="pill datastatus">{status}</div> */}
            <Box display={'flex'} className="no">
              <p
                style={{
                  marginBottom: '0px',
                  opacity: status === 'archived' ? 0.6 : 1,
                }}
              >
                Approved
              </p>
              <ToggleButton
                customeClass="isApprovedToggle tb-a"
                value={this.state.isTest}
                handleToggle={this.toggleIsTest}
                disabled={status === 'archived'}
              />

              <p
                style={{
                  marginBottom: '0px',
                  opacity: status === 'archived' ? 0.6 : 1,
                }}
              >
                Test
              </p>
            </Box>
            {this.state.isArchiving && (
              <span
                style={{
                  backgroundColor: '#ffebea',
                  border: '1px solid red',
                  color: 'black',
                  padding: '0px 8px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Archiving...
              </span>
            )}
            {status !== 'archived' &&
              !this.state.hide &&
              !this.state.isArchiving && (
                <span
                  role="button"
                  className="archived"
                  onClick={() => this.archiveCard(id)}
                >
                  <span className="material-icons">delete</span> Archive
                </span>
              )}
          </div>
        </div>

        <div className={`${DEFAULT_CLASSNAME}-card card`}>
          {this.renderInsightTabs(selectedTab, sidebardata, isLoading)}
        </div>
      </React.Fragment>
    );
  };

  renderShimmer = () => {
    return (
      <div>
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
      <div className={`${DEFAULT_CLASSNAME} card`}>
        <Async
          identifier="main-sidebar"
          promise={this.getPromise}
          content={this.renderContent}
          handlePromiseResponse={this.loadData}
          loader={this.renderShimmer}
          error={<div>Error...</div>}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { selectedNoteCard: state.marketAnalysisReducer.selectedNoteCard };
}

export default connect(mapStateToProps)(MessageSidebar);
