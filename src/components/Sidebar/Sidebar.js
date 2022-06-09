import React, { PureComponent } from 'react';
import { getConditionalMenu } from './navUtil';
import toggle from '../../assets/images/expand-menu.png';

import './styles/Sidebar.styles.scss';

export class Sidebar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sidebarCollapsed: true,
      showStoriesMenu: false,
      showPlaybooksMenu: false,
    };
  }

  toggleNav = () => {
    this.setState({ sidebarCollapsed: !this.state.sidebarCollapsed });
  };

  render() {
    const { active } = this.props;
    return (
      <div className="sidebar-component">
        <nav
          id="sidebar"
          className={!this.state.sidebarCollapsed ? 'active' : null}
        >
          <img
            src={toggle}
            className={
              this.state.sidebarCollapsed
                ? 'toggler collapsed'
                : 'toggler expanded'
            }
            title={this.state.sidebarCollapsed ? 'Expand' : 'Collapse'}
            onClick={this.toggleNav}
          />
          {getConditionalMenu(active)}
        </nav>
      </div>
    );
  }
}
