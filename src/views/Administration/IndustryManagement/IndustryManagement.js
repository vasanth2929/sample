import React, { Component } from 'react';
import { Icons } from './../../../constants/general';
import { MainPanel } from '../../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import './IndustryManagement.scss';
import Tabs from '../../../basecomponents/Tabs/Tabs';
import { TribylIndustriesTab } from './TribylIndustriesTab/TribylIndustriesTab';
import { CRMTribylIndustryMappingsTab } from './CRMTribylIndustryMappingsTab/CRMTribylIndustryMappingsTab';
import { AccountTribylIndustryMappingsTab } from './AccountTribylIndustryMappingsTab/AccountTribylIndustryMappingsTab';
// import { AccountTribylIndustryMappingsTab } from './AccountTribylIndustryMappingsTab./AccountTribylIndustryMappingsTab';

export default class IndustryManagement extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTabIndex: 0 };
  }

  handleTabClick = (tabIndex) => {
    // const { activeTabIndex } = this.state;
    // if (tabIndex !== activeTabIndex)
    this.setState({ activeTabIndex: tabIndex });
  };

  getTabLabels() {
    return [
      { name: 'Tribyl Industries', value: 'Tribyl Industries' },
      {
        name: 'CRM-Tribyl Industry Mapping',
        value: 'CRM-Tribyl Industry Mapping',
      },
      {
        name: 'Account Industry Mappings',
        value: 'Account Industry Mappings',
        notInLicense: false,
      },
    ];
  }

  getTabComponents() {
    return [
      <div className="tab-panel">
        <TribylIndustriesTab />
      </div>,
      <div className="tab-panel">
        <CRMTribylIndustryMappingsTab />
      </div>,
      <div className="tab-panel">
        <AccountTribylIndustryMappingsTab />
      </div>,
    ];
  }

  render() {
    return (
      <ErrorBoundary>
        <section className="account-research-topic-admin">
          <MainPanel
            viewName="Industry Management Administration"
            icons={[Icons.MAINMENU]}
            handleIconClick={this.handleHeaderIconClick}
            viewHeader={
              <div className="container">
                <div className="title-label row">
                  <div className="col-8">
                    <p>Industry Management</p>
                  </div>
                </div>
              </div>
            }
          >
            <div className="body-container container">
              <Tabs
                // ref={this.tabsRef}
                onTabClick={this.handleTabClick}
                tabLabels={this.getTabLabels()}
                defaultActiveTabIndex={0}
                tabComponents={this.getTabComponents()}
              />
            </div>
          </MainPanel>
        </section>
      </ErrorBoundary>
    );
  }
}
