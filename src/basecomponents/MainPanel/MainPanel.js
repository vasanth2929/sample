import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { Header } from '../../components/Header/Header';
import './styles/MainPanel.style.scss';
import { Tooltip } from '../../components/Tooltip/Tooltip';

export class MainPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.headerNode = React.createRef();
  }

  collapseChicklet = () => {
    if (this.headerNode.current.headerActionsNode.current.state.chickletMenu) {
      this.headerNode.current.headerActionsNode.current.hideChickletMenu();
    }
    if (this.headerNode.current.headerActionsNode.current.state.userMenu) {
      this.headerNode.current.headerActionsNode.current.hideUserMenu();
    }
  };

  render() {
    const {
      customClass,
      customSidebar,
      noLink,
      goBack,
      goBackLink,
      viewName,
      icons,
      handleIconClick,
      children,
      viewHeader,
      customLeftComponent,
      customRightComponent,
      noSidebar,
      subviewName,
      opptyPlanId,
    } = this.props;
    return (
      <section
        className={`main-panel ${customClass}`}
        onClick={this.collapseChicklet}
        role="link"
      >
        <div id="header-wrapper">
          <Header
            noLink={noLink}
            goBack={goBack}
            goBackLink={goBackLink}
            viewName={viewName}
            subviewName={subviewName}
            icons={icons}
            handleIconClick={handleIconClick}
            viewHeader={viewHeader}
            customLeftComponent={customLeftComponent}
            customRightComponent={customRightComponent}
            ref={this.headerNode}
            opptyPlanId={opptyPlanId}
          />
        </div>
        <div id="main-wrapper">
          {!noSidebar && (
            <div id="sidebar-section">
              {customSidebar || <Sidebar active={viewName} />}
            </div>
          )}
          <div id="main-content-section">{children}</div>
        </div>
        <Tooltip />
      </section>
    );
  }
}

MainPanel.propTypes = {
  hideSideBar: PropTypes.bool,
  viewName: PropTypes.string,
  icons: PropTypes.array,
  handleIconClick: PropTypes.func,
  children: PropTypes.element,
  viewHeader: PropTypes.element,
  customeLeftComponent: PropTypes.object,
};
