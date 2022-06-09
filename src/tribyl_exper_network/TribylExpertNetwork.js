import React, { Component } from 'react';
import TabBar from '../basecomponents/TabBar/TabBar';
import { getSubMarketsForPlaybook } from '../util/promises/expert-network';
import BuyerStudies from './BuyerStudies/BuyerStudies';
import Header from './components/Header/Header';
import Pill from './components/Pill/Pill';
import Profile from './components/Profile/Profile';
import Sidebar from './components/Sidebar/Sidebar';
import Question from './Questions/Question';
import './TribylExpertNetwork.style.scss';

const DEFAULT_CLASSNAME = 'expert-network';

class TribylExpertNetwork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ActiveTabIndex: 1,
      isLoading: true,
      subMarketTabs: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const repsonse = await getSubMarketsForPlaybook(9);
    const submarket =
      repsonse && repsonse.data.childPlaybookSummary[0].marketStudyDtoList;
    this.setState({ subMarketTabs: submarket, isLoading: false });
  };

  onTabClick = (tabindex) => {
    this.setState({ ActiveTabIndex: tabindex });
  };

  render() {
    const { subMarketTabs, isLoading } = this.state;
    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        <Header />
        <div className={`${DEFAULT_CLASSNAME}-container`}>
          <div className={`${DEFAULT_CLASSNAME}-content`}>
            <Sidebar />
            <div className={`${DEFAULT_CLASSNAME}-content-data`}>
              <p className="page-title">Information Technology</p>
              {!isLoading ? (
                <div className={`${DEFAULT_CLASSNAME}-content-pills`}>
                  {subMarketTabs.map((market, index) => (
                    <Pill
                      selected={index === 1}
                      text={market.marketStudyName}
                    />
                  ))}
                </div>
              ) : (
                <i>Loading Data...</i>
              )}
              <div>
                <TabBar
                  customClass="tab-content"
                  tabComponents={[
                    <div />,
                    <BuyerStudies playbookId={9} />,
                    <Question />,
                    <div />,
                  ]}
                  defaultActiveTabIndex={1}
                  onTabClick={this.onTabClick}
                  tabLabels={[
                    {
                      name: 'Feed',
                      slug: 'feed',
                    },
                    {
                      name: 'Buyer studies',
                      slug: 'buyer-studies',
                    },
                    {
                      name: 'Questions',
                      slug: 'questions',
                    },
                    {
                      name: 'Polls',
                      slug: 'polls',
                    },
                  ]}
                  //  tabSideButtons={[
                  //     <Select
                  //         value={{ label: "Recommended", value: "Recommended" }}
                  //         className="recommended"
                  //         classNamePrefix="recommended"
                  //     />
                  // ]
                  // }
                />
              </div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}-content-profile`}>
              <Profile />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TribylExpertNetwork;
