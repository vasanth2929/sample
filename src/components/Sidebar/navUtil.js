import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';

export function getConditionalMenu(activeView) {
  if (activeView === 'My Stories') {
    return (
      <ul className="list-unstyled components outer-list">
        <li className="home-menu-list">
          <Link
            to="/splash-screen"
            title="Home"
            className="outer-link home-nav-link"
          >
            <i className="ion-home" title="Home" />
            <span className="menu-name">Home</span>
          </Link>
        </li>
        <li className="stories-menu-list active">
          <span className="active-bar" />
          <Link
            to="/my-stories?view=list"
            title="My Stories"
            className="outer-link my-stories-nav-link"
          >
            <i className="icon-sidebar_mystories" title="My Stories" />
            <span className="menu-name">My Stories</span>
          </Link>
        </li>
        <li className="stories-menu-list">
          <span className="active-bar" />
          <Link
            to="/browse-stories?view=list"
            title="Browse Stories"
            className="outer-link browse-stories-nav-link"
          >
            <i className="icon-sidebar_browsestories" title="Browse Stories" />
            <span className="menu-name">Browse Stories</span>
          </Link>
        </li>
      </ul>
    );
  } else if (
    activeView.includes('Administration') ||
    activeView.includes('Configuration')
  ) {
    return (
      <ul className="list-unstyled components outer-list">
        <li className="home-menu-list">
          <Link
            to="/splash-screen"
            title="Home"
            className="outer-link home-nav-link"
          >
            <i className="ion-home" title="Home" />
            <span className="menu-name">Home</span>
          </Link>
        </li>
        {/* <li className={activeView === 'Playbooks' ? 'playbooks active' : 'playbooks'}>
                    <span className="active-bar" />
                    <Link to="/playbooks" title="Playbooks" className="outer-link user-admin-nav-link">
                        <i className="ion-ios-book" title="Playbooks" />
                        <span className="menu-name">Playbooks</span>
                    </Link>
                </li> */}
        <li
          className={
            activeView === 'User Administration'
              ? 'user-admin-list active'
              : 'user-admin-list'
          }
        >
          <span className="active-bar" />
          <Link
            to="/user-administration"
            title="User Administration"
            className="outer-link user-admin-nav-link"
          >
            <i className="ion-person" title="User Administration" />
            <span className="menu-name">User Administration</span>
          </Link>
        </li>
        <li
          className={
            activeView === 'Account Administration'
              ? 'account-admin-list active'
              : 'account-admin-list'
          }
        >
          <span className="active-bar" />
          <Link
            to="/account-administration"
            title="Account Administration"
            className="outer-link account-admin-nav-link"
          >
            <i className="ion-ios-people" title="Account Administration" />
            <span className="menu-name">Account Administration</span>
          </Link>
        </li>
        <li
          className={
            activeView === 'Keywords Administration'
              ? 'keyword-mgmt-list active'
              : 'keyword-mgmt-list'
          }
        >
          <span className="active-bar" />
          <Link
            to="/keyword-management"
            title="Keyword Management"
            className="outer-link keyword-mgmt-nav-link"
          >
            <i className="ion-compose" title="Keyword Management" />
            <span className="menu-name">Keyword Management</span>
          </Link>
        </li>
        {/* <li
          className={
            activeView === 'Evaluation Question Administration'
              ? 'evaluation-quest-mgmt active'
              : 'evaluation-quest-mgmt'
          }
        >
          <span className="active-bar" />
          <Link
            to="/evaluation-questions-admin"
            title="Evaluation Question Management"
            className="outer-link evaluation-quest-mgmt-nav-link"
          >
            <i
              className="ion-ios-help"
              title="Evaluation Question Management"
            />
            <span className="menu-name">Evaluation Question Management</span>
          </Link>
        </li> */}
        <li
          className={
            activeView === 'Industry Management Administration'
              ? 'industry-management active'
              : 'industry-management'
          }
        >
          <span className="active-bar" />
          <Link
            to="/industry-management"
            title="Industry Management"
            className="outer-link industry-management-nav-link"
          >
            <i className="ion-gear-b" title="Industry Management" />
            <span className="menu-name">Industry Management</span>
          </Link>
        </li>
        <li
          className={
            activeView === 'Tribyl Platform Configuration '
              ? 'configuration-properties active'
              : 'configuration-properties'
          }
        >
          <span className="active-bar" />
          <Link
            to="/configuration-properties"
            title="Configuration Properties"
            className="outer-link configuration-properties-nav-link"
          >
            <i className="ion-wrench" title="Configuration Properties" />
            <span className="menu-name">Configuration Properties</span>
          </Link>
        </li>
        {/* <li
          className={
            activeView === 'Tribyl Platform Configuration'
              ? 'outreach-properties active'
              : 'outreach-properties'
          }
        >
          <span className="active-bar" />
          <Link
            to="/outreach-administration"
            title="Outreach Properties"
            className="outer-link outreach-properties-nav-link"
          >
            <i className="ion-share" title="Outreach Properties" />
            <span className="menu-name">Outreach Properties</span>
          </Link>
        </li> */}
        {/* <li
          className={
            activeView === 'CRM Mapping Administration'
              ? 'crm-mapping-administration active'
              : 'crm-mapping-administration'
          }
        >
          <span className="active-bar" />
          <Link
            to="/crm-mapping-administration"
            title="CRM Mapping Administration"
            className="outer-link crm-mapping-administration-nav-link"
          >
            <i
              className="material-icons crm-mapping-icon"
              title="CRM Mapping Administration"
            >
              sync_alt
            </i>
            <span className="menu-name">CRM Mapping Administration</span>
          </Link>
        </li> */}
        {/* <li
          className={
            activeView === 'Tribyl Tutorials Administration'
              ? 'tutorials-administration active'
              : 'tutorials-administration'
          }
        >
          <span className="active-bar" />
          <Link
            to="/tutorials-administration"
            title="Tribyl Tutorials Administration"
            className="outer-link tutorials-administration-nav-link"
          >
            <i
              className="ion-ios-videocam"
              title="Tribyl Tutorials Administration"
            />
            <span className="menu-name">Tutorials Administration</span>
          </Link>
        </li> */}
        <li
          className={
            activeView === 'CSV Account Load Administration'
              ? 'account-research-topic-admin active'
              : 'account-research-topic-admin '
          }
        >
          <span className="active-bar" />
          <Link
            to="/upload-csv"
            title="CSV Account Load"
            className="outer-link account-research-topic-admin-nav-link"
          >
            <i className="ion-upload" title="CSV Account Load" />
            <span className="menu-name">CSV Account Load</span>
          </Link>
        </li>
        <li
          className={
            activeView === 'Account Purge Administration'
              ? 'account-purge active'
              : 'account-purge'
          }
        >
          <span className="active-bar" />
          <Link
            to="/account-purge"
            title="Account Purge"
            className="outer-link account-purge-nav-link"
          >
            <i className="ion-trash-a" title="Account Purge" />
            <span className="menu-name">Account Purge</span>
          </Link>
        </li>
        <li
          className={
            activeView === 'Account Research - Future'
              ? 'account-research-topic-admin'
              : 'account-research-topic-admin '
          }
        >
          <span className="active-bar" />
          <Link
            to="#"
            title="Account Research - Future"
            className="outer-link account-research-topic-admin-nav-link disabled"
          >
            <i className="ion-briefcase" title="Account Research - Future" />
            <span className="menu-name">Account Research - Future</span>
          </Link>
        </li>
      </ul>
    );
  } else if (activeView === 'Browse Stories') {
    return (
      <ul className="list-unstyled components outer-list">
        <li className="home-menu-list">
          <Link
            to="/splash-screen"
            title="Home"
            className="outer-link home-nav-link"
          >
            <i className="ion-home" title="Home" />
            <span className="menu-name">Home</span>
          </Link>
        </li>
        <li className="stories-menu-list">
          <span className="active-bar" />
          <Link
            to="/my-stories?view=list"
            title="My Stories"
            className="outer-link my-stories-nav-link"
          >
            <i className="icon-sidebar_mystories" title="My Stories" />
            <span className="menu-name">My Stories</span>
          </Link>
        </li>
        <li className="stories-menu-list active">
          <span className="active-bar" />
          <Link
            to="/browse-stories?view=list"
            title="Browse Stories"
            className="outer-link browse-stories-nav-link"
          >
            <i className="icon-sidebar_browsestories" title="Browse Stories" />
            <span className="menu-name">Browse Stories</span>
          </Link>
        </li>
      </ul>
    );
  } else if (
    activeView.includes('-') ||
    activeView === 'Economic Drivers' ||
    activeView === 'Use Cases' ||
    activeView === 'Pain Points' ||
    activeView === 'Personas' ||
    activeView === 'Value Proposition' ||
    activeView === 'Objections' ||
    activeView === 'Competition' ||
    activeView === 'Content' ||
    activeView === 'Partners' ||
    activeView === 'Activities' ||
    activeView.includes('Tearsheet') ||
    activeView === 'Transcripts' ||
    activeView === 'Guided Storybuilding' ||
    activeView === 'AI Verification'
  ) {
    return (
      <ul className="list-unstyled components outer-list">
        <li className="home-menu-list">
          <Link
            to="/splash-screen"
            title="Home"
            className="outer-link home-nav-link"
          >
            <i className="ion-home" title="Home" />
            <span className="menu-name">Home</span>
          </Link>
        </li>
        <li className="stories-menu-list">
          <span className="active-bar" />
          <Link
            to="/my-stories?view=list"
            title="My Stories"
            className="outer-link my-stories-nav-link"
          >
            <i className="icon-sidebar_mystories" title="My Stories" />
            <span className="menu-name">My Stories</span>
          </Link>
        </li>
        <li className="stories-menu-list">
          <span className="active-bar" />
          <Link
            to="/browse-stories?view=list"
            title="Browse Stories"
            className="outer-link browse-stories-nav-link"
          >
            <i className="icon-sidebar_browsestories" title="Browse Stories" />
            <span className="menu-name">Browse Stories</span>
          </Link>
        </li>
      </ul>
    );
  } else if (
    activeView === 'Manage Playbooks' ||
    activeView === 'Manage Stories' ||
    activeView.includes('Playbook:')
  ) {
    return (
      <ul className="list-unstyled components outer-list">
        <li className="home-menu-list">
          <Link
            to="/splash-screen"
            title="Home"
            className="outer-link home-nav-link"
          >
            <i className="ion-home" title="Home" />
            <span className="menu-name">Home</span>
          </Link>
        </li>
        <li className="playbooks-menu-list active">
          <span className="active-bar" />
          <Link
            to="/playbooks"
            title="Manage Playbooks"
            className="outer-link manage-playbooks-nav-link"
          >
            <i
              className="icon-sidebar_manageplaybooks"
              title="Manage Playbooks"
            />
            <span className="menu-name">Manage Playbooks</span>
          </Link>
        </li>
        <li className="playbooks-menu-list">
          <span className="active-bar" />
          <Link
            to="/playbook-board"
            title="Browse Playbooks"
            className="outer-link browse-playbooks-nav-link"
          >
            <i
              className="icon-sidebar_browseplaybooks"
              title="Browse Playbooks"
            />
            <span className="menu-name">Browse Playbooks</span>
          </Link>
        </li>
      </ul>
    );
  } else if (activeView === 'Browse Playbooks' || activeView.includes('-')) {
    return (
      <ul className="list-unstyled components outer-list">
        <li className="home-menu-list">
          <Link
            to="/splash-screen"
            title="Home"
            className="outer-link home-nav-link"
          >
            <i className="ion-home" title="Home" />
            <span className="menu-name">Home</span>
          </Link>
        </li>
        <li className="playbooks-menu-list">
          <span className="active-bar" />
          <Link
            to="/playbooks"
            title="Manage Playbooks"
            className="outer-link manage-playbooks-nav-link"
          >
            <i
              className="icon-sidebar_manageplaybooks"
              title="Manage Playbooks"
            />
            <span className="menu-name">Manage Playbooks</span>
          </Link>
        </li>
        <li className="playbooks-menu-list active">
          <span className="active-bar" />
          <Link
            to="/playbook-board"
            title="Browse Playbooks"
            className="outer-link browse-playbooks-nav-link"
          >
            <i
              className="icon-sidebar_browseplaybooks"
              title="Browse Playbooks"
            />
            <span className="menu-name">Browse Playbooks</span>
          </Link>
        </li>
      </ul>
    );
  } else {
    // eslint-disable-line
    return (
      <ul className="list-unstyled components outer-list">
        <li className="home-menu-list">
          <Link
            to="/splash-screen"
            title="Home"
            className="outer-link home-nav-link"
          >
            <i className="ion-home" title="Home" />
            <span className="menu-name">Home</span>
          </Link>
        </li>
      </ul>
    );
  }
}
