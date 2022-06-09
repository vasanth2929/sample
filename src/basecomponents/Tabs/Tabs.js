import React, { PureComponent } from 'react';

import './styles/Tabs.styles.scss';

export default class Tabs extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = { activeTabIndex: this.props.defaultActiveTabIndex };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultActiveTabIndex !== nextProps.defaultActiveTabIndex) {
      this.setState({ activeTabIndex: nextProps.defaultActiveTabIndex });
    }
  }

  // Toggle currently active tab
  handleTabClick = (tabIndex) => {
    const { activeTabIndex } = this.state;
    this.setState({ activeTabIndex: tabIndex });
    if (this.props.onTabClick) {
      this.props.onTabClick(tabIndex, activeTabIndex);
    }
  };

  // Encapsulate <Tabs/> component API as props for <Tab/> children
  renderChildrenWithTabsApiAsProps() {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        onClick: this.handleTabClick,
        tabIndex: index,
        isActive: index === this.state.activeTabIndex,
        key: `tabs-${index}`,
      });
    });
  }

  // Render current active tab content
  renderActiveTabContent() {
    const { children } = this.props;
    const { activeTabIndex } = this.state;
    if (children[activeTabIndex]) {
      return children[activeTabIndex].props.children;
    }
    return null;
  }

  render() {
    const {
      tabComponents,
      tabLabels,
      currentContent,
      tabSideButtons,
      headerSection,
      title,
      topRightText,
      customClass,
    } = this.props;
    return (
      <div className="tabsV2">
        <div className={`${customClass} ${headerSection && 'header-wrapper'}`}>
          {headerSection && (
            <div className="row tabBarHeader">
              <div className="col-3" />
              <div className="col-6">
                <p className="titleText">{title}</p>
              </div>
              <div className="col-3">
                <p className="topRightText">{topRightText}</p>
              </div>
            </div>
          )}
          <div className="tabRowContainer">
            <div className="tabRow">
              {tabLabels.map((label, key) => {
                return (
                  <button
                    key={key}
                    className={`tab ${
                      key === this.state.activeTabIndex ? 'active' : ''
                    } ${
                      label.notInLicense || label.disabled
                        ? 'not-in-license'
                        : ''
                    }`}
                    disabled={label.disabled}
                    onClick={
                      label.notInLicense || label.disabled
                        ? ''
                        : () => this.handleTabClick(key)
                    }
                  >
                    <span className="tabLabel">
                      {label.name}
                      {label.notInLicense && (
                        <i
                          className="material-icons not-in-license-marker"
                          title="Not available with current license"
                        >
                          lock
                        </i>
                      )}
                      {label.disabled && (
                        <i
                          className="material-icons not-in-license-marker"
                          title="Unauthorized"
                        >
                          lock
                        </i>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="tabButtonContainer">
              {tabSideButtons && tabSideButtons.map((button) => button)}
            </div>
          </div>
        </div>
        <div className="tabsContent" id="tabsContent">
          {currentContent ||
            tabComponents.map((component, key) => {
              return key === this.state.activeTabIndex ? component : null;
            })}
        </div>
      </div>
    );
  }
}
