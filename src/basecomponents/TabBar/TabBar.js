import React from 'react';

// import base components
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import Tabs from '../Tabs/Tabs';

import './styles/TabBar.styles.scss';

export default class TabBar extends React.PureComponent {
  render() {
    const {
      tabComponents,
      tabLabels,
      title,
      topRightText,
      defaultActiveTabIndex,
      tabSideButtons,
      onTabClick,
      customClass,
    } = this.props;
    return (
      <ErrorBoundary>
        <div className="container-fluid tabBarContainer">
          <div className="row">
            <Tabs
              customClass={customClass}
              isSearchable={false}
              tabLabels={tabLabels}
              defaultActiveTabIndex={defaultActiveTabIndex}
              tabComponents={tabComponents}
              tabSideButtons={tabSideButtons}
              headerSection
              title={title}
              topRightText={topRightText}
              onTabClick={onTabClick}
            />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}
