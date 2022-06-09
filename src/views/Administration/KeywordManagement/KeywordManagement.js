import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// import sub-components
import { MainPanel } from '../../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import { Icons } from '../../../constants/general';
import { TopicKeywordManagementTab } from './containers/TopicKeywordManagementTab/TopicKeywordManagementTab';
import { PlaybookKeywordManagementTab } from './containers/PlaybookKeywordManagementTab/PlaybookKeywordManagementTab';

import './styles/KeywordManagement.style.scss';

export default class KeywordManagement extends React.PureComponent {
  render() {
    return (
      <ErrorBoundary>
        <section className="keyword-management-admin-section">
          <MainPanel
            viewName="Keywords Administration"
            icons={[Icons.MAINMENU]}
            handleIconClick={this.handleHeaderIconClick}
            viewHeader={
              <div className="container">
                <div className="title-label row">
                  <div className="col-8">
                    <p>Keywords Management</p>
                  </div>
                </div>
              </div>
            }
          >
            <div className="container keyword-mgmt-tab">
              <Tabs>
                <div className="col-10">
                  <TabList>
                    <Tab>
                      <span>Topics</span>
                    </Tab>
                    <Tab>
                      <span>Buying Center</span>
                    </Tab>
                  </TabList>
                </div>
                <TabPanel>
                  <TopicKeywordManagementTab />
                </TabPanel>
                <TabPanel>
                  <PlaybookKeywordManagementTab />
                </TabPanel>
              </Tabs>
            </div>
          </MainPanel>
        </section>
      </ErrorBoundary>
    );
  }
}
