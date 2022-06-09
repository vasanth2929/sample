import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import classNames from 'classnames';
import { hideModal } from '../../../../action/modalActions';
import { showAlert } from '../../../../components/MessageModal/MessageModal';
import { showCustomModal } from '../../../../components/CustomModal/CustomModal';
import { getStoryForTeam } from '../../../../util/promises/storyboard_promise';
import {
  getSurveyStatusForStoryForUser,
  surveyLinkSend,
  upsertUser,
  addUsersToOpptyTeam,
} from '../../../../util/promises/survey_promise';
import { getLoggedInUser, dispatch } from '../../../../util/utils';
import AddRow from '../AddRow/AddRow';
import PaginationManage from '../../../../components/PaginationManage/PaginationManage';
import './ManageSurvey.style.scss';
import {
  SURVEY_COMPLETED_CATEGORY,
  SURVEY_ACTIVE_INDEX,
  Icons,
} from '../../../../constants/general';
import { MainPanel } from '../../../../basecomponents/MainPanel/MainPanel';

const DEFUALT_CLASSNAME = 'manage-survey';

class ManageSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      percentCompleteUserList: [],
      sendLinkCompleted: [],
      currentPage: 1,
      postPerPage: null,
      loggedInUserEmailId: null,
    };
    this.timeOutId = null;
  }
  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { storyId } = this.props.match.params;
    const response = await getStoryForTeam(storyId);
    const tableData = response.data ? response.data : [];
    const userId = this.getUserId(tableData);
    const loggedInUserEmailId = getLoggedInUser().email;
    Promise.all(userId.map((i) => getSurveyStatusForStoryForUser(storyId, i)))
      // eslint-disable-next-line no-shadow
      .then((response) => {
        if (response) {
          const percentCompleteUserList = response.map(
            (i) => i.data.percentComplete
          );
          this.setState({ percentCompleteUserList });
        }
      });

    this.setState({ data: tableData, loggedInUserEmailId });
  };

  getUserId = (data) => {
    const id = data.map((i) => i.userId);
    return id;
  };

  getMailId = (data) => {
    const email = data.map((i) => i.email);
    return email;
  };

  getSatusForSurvey = (percent) => {
    // eslint-disable-next-line default-case
    switch (true) {
      case percent === 0:
        return 'Sent';
      case percent >= 1 && percent < 100:
        return 'In Progress';
      case percent === 100:
        return 'Complete';
      default:
        return 'Sent';
    }
  };

  getCurrentPosts = () => {
    const { currentPage, postPerPage, data } = this.state;
    if (postPerPage) {
      const indexOfLastPost = currentPage * postPerPage;
      const indexOfFirstPost = indexOfLastPost - postPerPage;
      const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
      return currentPosts;
    }
    return data;
  };

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  launchSurvey = (storyId, OpptyId) => {
    // start from the begining
    dispatch({
      type: SURVEY_ACTIVE_INDEX,
      payload: 0,
    });
    dispatch({
      type: SURVEY_COMPLETED_CATEGORY,
      payload: [],
    });
    this.props.history.push(`/survey?storyId=${storyId}&OpptyId=${OpptyId}`);
  };

  sendLink = async (userId, storyId, opptyId) => {
    const surveyLink = `survey?storyId=${storyId}&OpptyId=${opptyId}&userId=${userId}`;
    const link = encodeURIComponent(surveyLink);
    await surveyLinkSend(storyId, link, userId);
    this.setState({
      sendLinkCompleted: [...this.state.sendLinkCompleted, userId],
    });
    setTimeout(() => {
      this.setState({
        sendLinkCompleted: [],
      });
    }, 2000);
  };

  copyLink = (userId, storyId, opptyId) => {
    if (this.timeOutId) clearTimeout(this.timeOutId);
    const surveyLink = `survey?storyId=${storyId}&OpptyId=${opptyId}&userId=${userId}&fc=true`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/${surveyLink}`);
      this.setState({
        sendLinkCompleted: [userId],
      });
    }
    this.timeOutId = setTimeout(() => {
      this.setState({
        sendLinkCompleted: [],
      });
    }, 2000);
  };

  showAddCardModal = () => {
    showCustomModal(
      <div className="d-flex justify-content-between">
        <h5 className="modal-title">Add Team Members</h5>
      </div>,
      <AddRow onCreate={this.onCreate} />,
      'story-modal',
      () => {},
      false,
      this.getLoader()
    );
  };

  getLoader = () => <div>Loading...</div>;

  onReload = () => this.loadData();

  onCreate = (value) => {
    const { email, firstName, lastName } = value;
    const { opptyId } = this.props.match.params;
    const payload = {
      ...value,
      loginname: email,
      role: 'SELLER',
      username: `${firstName} ${lastName}`,
    };

    upsertUser(payload)
      .then(() => {
        addUsersToOpptyTeam(opptyId, [email]).then(() => {
          hideModal();
          this.onReload();
        });
      })
      .catch(() => {
        return showAlert(`Duplicate Email Address:-${email}`, 'error');
      });
  };

  handleBackButton = () => {
    const { history } = this.props;
    history.goBack();

    // window.open(`/dealgametape/storyId/${storyId}/opptyId/${opptyId}`, '_self');
  };

  renderBackButton = () => {
    return (
      <div
        className={`${DEFUALT_CLASSNAME}-back-button`}
        onClick={this.handleBackButton}
      >
        <i className="material-icons manage-icons">chevron_left</i>

        <span role="button" className={`${DEFUALT_CLASSNAME}-back-button-text`}>
          Go back to deal game tape.
        </span>
      </div>
    );
  };

  renderTable = () => {
    const { storyId, opptyId } = this.props.match.params;
    const { percentCompleteUserList, loggedInUserEmailId, data } = this.state;
    const userId = this.getUserId(data);
    const EmailId = this.getMailId(data);

    const currentPosts = this.getCurrentPosts();

    return (
      <div className="manage-table">
        <p className="manage-heading">Opportunity Team</p>
        <div className="rectangle" />
        <table className="table table-borderless">
          <thead>
            <tr className="heading">
              <th style={{ width: '140px' }}>FIRST NAME</th>
              <th style={{ width: '140px' }}>LAST NAME</th>
              <th style={{ width: '140px' }}>ROLE</th>
              <th style={{ width: '180px' }}>EMAIL</th>
              <th style={{ width: '100px' }}>Inbox fetched</th>
              {/* <th style={{ width: "164px" }}>SURVEY STATUS</th> */}
              {/* <th style={{ width: "180px" }}>LAST ACTIVITY</th> */}
              <th style={{ width: '248px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.length > 0 &&
              currentPosts.map((story, index) => {
                if (
                  story.email === 'cs@tribyl.com' ||
                  story.email === 'admin@tribyl.com'
                )
                  return;
                return (
                  <tr key={`current-post-${index}`}>
                    <td>
                      {story.userName ? story.userName.split(' ')[0] : ''}
                    </td>
                    <td>
                      {story.userName ? story.userName.split(' ')[1] : ''}
                    </td>
                    <td>{story.role}</td>
                    <td>{story.email}</td>
                    <td>{story.inboxFetched}</td>
                    <td className="manage-button">
                      <Button
                        onClick={
                          loggedInUserEmailId !== EmailId[index]
                            ? () => {}
                            : () => this.launchSurvey(storyId, opptyId)
                        }
                        disabled={loggedInUserEmailId !== EmailId[index]}
                        variant="outlined"
                        color="secondary"
                        className={classNames(
                          'row-icon launchSurvey text-nowrap',
                          {
                            disabled: loggedInUserEmailId !== EmailId[index],
                          }
                        )}
                      >
                        {story.surveyLinkSent ||
                        percentCompleteUserList[index] >= 0
                          ? this.getSatusForSurvey(
                              percentCompleteUserList[index]
                            )
                          : 'Not Sent'}
                      </Button>
                      <Button
                        onClick={() =>
                          this.sendLink(userId[index], storyId, opptyId)
                        }
                        variant="contained"
                        color="secondary"
                        disableElevation
                        className="row-icon bold"
                      >
                        Send Survey
                      </Button>
                      <Button
                        onClick={() =>
                          this.copyLink(userId[index], storyId, opptyId)
                        }
                        variant="outlined"
                        color="inherit"
                        disableElevation
                        className="row-icon bold ob"
                      >
                        Copy Link
                      </Button>
                      {this.state.sendLinkCompleted.includes(userId[index]) ? (
                        <span className="material-icons check-send-link">
                          check
                        </span>
                      ) : (
                        ''
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  };

  renderFloaterBtn = () => {
    return (
      <div className={`${DEFUALT_CLASSNAME}-addrow`}>
        <button
          id="addcard"
          className="floater-btn blue"
          title="Invite Team Members"
          onClick={() => this.showAddCardModal()}
        >
          <i className="material-icons addcard" role="presentation">
            add
          </i>
        </button>
      </div>
    );
  };

  renderPage = () => {
    const { postPerPage, data, currentPage } = this.state;
    return (
      <PaginationManage
        postPerPage={postPerPage}
        totalPost={data.length}
        paginate={this.paginate}
        currentPage={currentPage}
      />
    );
  };

  render() {
    return (
      <MainPanel
        noSidebar
        viewName="Buyer Intelligence"
        icons={[Icons.MAINMENU]}
        handleIconClick={this.handleHeaderIconClick}
      >
        <div className={`${DEFUALT_CLASSNAME}`}>
          <div className={`${DEFUALT_CLASSNAME}-container`}>
            {this.renderBackButton()}
            {this.renderTable()}
            {this.renderFloaterBtn()}
            {/* {this.renderPage()} */}
          </div>
        </div>
      </MainPanel>
    );
  }
}

ManageSurvey.propTypes = {
  storyId: PropTypes.number,
  opptyId: PropTypes.number,
  onVisibleChange: PropTypes.func,
};

export default withRouter(ManageSurvey);
