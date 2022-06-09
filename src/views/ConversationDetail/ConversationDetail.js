import React, { Component } from 'react';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import TabBar from '../../basecomponents/TabBar/TabBar';
import { Icons } from '../../constants/general';
import Emails from './Emails/Emails';
import Documents from './Documents/Documents';
import Calls from './Calls/Calls';
import { getLoggedInUser } from '../../util/utils';
import { getNotificationsForUser } from '../../util/promises/leads_prospects_promise';
import { withRouter } from 'react-router-dom';

import './ConversationDetail.style.scss';

const DEFUALT_CLASSNAME = "conversation-detail-container";

class ConversationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { ActiveTabIndex: 0 };
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  getCurrentUser = async () => {
    const currentUser = getLoggedInUser();
    const resp = await getNotificationsForUser(currentUser.userId);
    const { notificationText, notificationType } = resp?.data[0] || {};

    this.setState({
      notificationType,
      notificationText,
      userId: currentUser.userId,
      currentUser,
    });
  };

  onTabClick = (tabindex) => {
    this.setState({ ActiveTabIndex: tabindex });
  };

  handleBackButton = () =>{
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const { ActiveTabIndex } = this.state;
    return (
      // removed ErrorBoundary wrapper for unkown reason it was blocking the tab switching action.
      <MainPanel
        noSidebar
        viewName="Conversation Detail"
        icons={[Icons.MAINMENU]}
      >
        <div className="conversation-detail-container">
          <div className="main-container">
          <div className={`${DEFUALT_CLASSNAME}-nav-back-button`}>
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
          </div>
            <TabBar
              customClass="tab-content"
              tabComponents={[<Emails />, <Calls />, <Documents />]}
              defaultActiveTabIndex={ActiveTabIndex}
              onTabClick={this.onTabClick}
              tabLabels={[
                {
                  name: 'Emails',
                  slug: 'emials',
                },
                {
                  name: 'Calls',
                  slug: 'calls',
                },
                {
                  name: 'Documents',
                  slug: 'documents',
                },
              ]}
            />
          </div>
        </div>
      </MainPanel>
    );
  }
}

export default withRouter(ConversationDetail);
