import React, { PureComponent } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types';

import { Alerts } from '../Alerts/Alerts';

import createNew from '../../../../assets/images/header/ic_add.png';
import filter from '../../../../assets/images/header/ic_filter.png';
import help from '../../../../assets/images/header/ic_information.png';
import guide from '../../../../assets/images/header/ic_guide.png';
import bin from '../../../../assets/images/header/ic_delete.png';
import play from '../../../../assets/images/header/ic_play.png';
import vidRecord from '../../../../assets/images/header/ic_record.png';
import transcript from '../../../../assets/images/header/ic_transcript.png';
import bookmark from '../../../../assets/images/header/ic_bookmark.png';
import share from '../../../../assets/images/header/ic_share.png';
import save from '../../../../assets/images/header/ic_save.png';
import podcast from '../../../../assets/images/header/ic_podcast.png';
import tiles from '../../../../assets/images/header/ic_tile_view.png';
import widget from '../../../../assets/images/header/ic_card_view.png';
import avatar from '../../../../assets/images/avatar.png';

import { Icons } from '../../../../constants/general';
import { Notes } from '../Notes/Notes';
import { logout } from '../../../../util/promises/usercontrol_promise';
import { SplashChicklet } from '../../../../views/SplashScreen/containers/SplashChicklet/SplashChicklet';
import { HelpChicklet } from '../../../../views/SplashScreen/containers/HelpChicklet/HelpChicklet';
import { SanitizeUrl, saveToLocalStorage } from '../../../../util/utils';
import history from '../../../../util/history';

export class HeaderActions extends PureComponent {
  tutorialsMenuRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      chickletMenu: false,
      userMenu: false,
    };
    this.userData = localStorage.getItem('user');
    if (this.userData) {
      this.userData = JSON.parse(this.userData);
    } else {
      this.userData = {
        username: 'admin',
        firstName: 'Tribyl',
        lastName: 'Admin',
        role: 'system role',
        userId: 9,
      };
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick = ({ target }) => {
    if (
      this.tutorialsMenuRef.current &&
      !this.tutorialsMenuRef.current.contains(target) &&
      target.id !== 'help-menu-btn' &&
      target.id !== 'help-menu-btn-icon'
    ) {
      this.setState({ helpChickletMenu: false });
    }
  };

  showHelpChickletMenu = () => {
    this.setState({ helpChickletMenu: !this.state.helpChickletMenu });
  };

  showChickletMenu = () => {
    this.setState({ chickletMenu: !this.state.chickletMenu });
  };

  hideChickletMenu = () => {
    this.setState({ chickletMenu: false });
  };

  showUserMenu = () => {
    this.setState({ userMenu: !this.state.userMenu });
  };

  hideUserMenu = () => {
    this.setState({ userMenu: false });
  };

  containsPermission = (permission) => {
    const AUTH = process.env.AUTH;
    if (AUTH !== null && typeof AUTH !== 'undefined' && AUTH !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const found = user.authorities.indexOf(permission) >= 0;
        return found;
      }
      history.push('/');
      return false;
    }
    return true;
  };

  handleLogout = () => {
    logout()
    .then(() => {
      history.push({ pathname: '/logout', state: { logout: true } });
      saveToLocalStorage('isFiltered', false);
      })
      .catch(() => history.push('/logout'));
  };

  render() {
    const { videos, handleIconClick, icons, customRightComponent } = this.props;
    return (
      <div className="header-actions">
        <div className="action-icons">
          {customRightComponent && customRightComponent}
          {icons.indexOf(Icons.WIDGET) > -1 && (
            <a>
              <img
                src={widget}
                title="Back to Storyboard Card View"
                onClick={() => handleIconClick(Icons.WIDGET)}
              />
            </a>
          )}
          {icons.indexOf(Icons.GUIDED_STORYBUILDING) > -1 && (
            <a>
              <img
                src={guide}
                title="Switch to Guided Storybuilding Mode"
                onClick={() => handleIconClick(Icons.GUIDED_STORYBUILDING)}
              />
            </a>
          )}
          {icons.indexOf(Icons.TRANSCRIPT) > -1 && (
            <a>
              <img
                src={transcript}
                title="See Transcipt for Story"
                onClick={() => handleIconClick(Icons.TRANSCRIPT)}
              />
            </a>
          )}
          {icons.indexOf(Icons.CALL_TRANSCRIPT) > -1 && (
            <a>
              <i
                className="material-icons call-transcript-icon"
                title="Call Transcripts"
                role="button"
                onClick={() => handleIconClick(Icons.CALL_TRANSCRIPT)}
              >
                perm_phone_msg
              </i>
            </a>
          )}
          {icons.indexOf(Icons.EMAIL_TRANSCRIPT) > -1 && (
            <a>
              <i
                className="material-icons email-transcript-icon"
                title="Email Transcripts"
                role="button"
                onClick={() => handleIconClick(Icons.EMAIL_TRANSCRIPT)}
              >
                message
              </i>
            </a>
          )}
          {icons.indexOf(Icons.PLAY) > -1 && (
            <a>
              <img
                src={play}
                title="Play Elevator Pitch"
                onClick={() => handleIconClick(Icons.PLAY)}
              />
            </a>
          )}
          {icons.indexOf(Icons.RECORD) > -1 && (
            <a>
              <img
                src={vidRecord}
                title="Record Elevator Pitch"
                onClick={() => handleIconClick(Icons.RECORD)}
              />
            </a>
          )}
          {icons.indexOf(Icons.RECORD_DISABLED) > -1 && (
            <a>
              <img
                src={vidRecord}
                title="Record Elevator Pitch"
                onClick={() => handleIconClick(Icons.RECORD)}
              />
            </a>
          )}
          {icons.indexOf(Icons.DELETE) > -1 && (
            <a>
              <img
                src={bin}
                title="Delete Story"
                onClick={() => handleIconClick(Icons.DELETE)}
              />
            </a>
          )}
          {icons.indexOf(Icons.DELETE_DISABLED) > -1 && (
            <a>
              <img
                src={bin}
                title="Delete Story"
                onClick={() => handleIconClick(Icons.DELETE)}
              />
            </a>
          )}
          {icons.indexOf(Icons.CREATE_NEW) > -1 && (
            <a>
              <img
                src={createNew}
                title="Create New"
                onClick={() => handleIconClick(Icons.CREATE_NEW)}
              />
            </a>
          )}
          {icons.indexOf(Icons.CREATE_NEW_DISABLED) > -1 && (
            <a>
              <img
                src={createNew}
                title="Create New"
                onClick={() => handleIconClick(Icons.CREATE_NEW)}
              />
            </a>
          )}
          {icons.indexOf(Icons.SHARE) > -1 && (
            <a>
              <img
                src={share}
                title="Share"
                className="disabled"
                onClick={() => handleIconClick(Icons.SHARE)}
              />
            </a>
          )}
          {icons.indexOf(Icons.PODCAST) > -1 && (
            <a>
              <img
                src={podcast}
                title="Share"
                className="disabled"
                onClick={() => handleIconClick(Icons.PODCAST)}
              />
            </a>
          )}
          {icons.indexOf(Icons.SAVE) > -1 && (
            <a>
              <img
                src={save}
                title="Share"
                className="disabled"
                onClick={() => handleIconClick(Icons.SAVE)}
              />
            </a>
          )}
          {icons.indexOf(Icons.BOOKMARK) > -1 && (
            <a>
              <img
                src={bookmark}
                title="Bookmark"
                className="disabled"
                onClick={() => handleIconClick(Icons.BOOKMARK)}
              />
            </a>
          )}
          {icons.indexOf(Icons.FILTER) > -1 && (
            <a>
              <img
                src={filter}
                title="Filter"
                className="disabled"
                onClick={() => handleIconClick(Icons.FILTER)}
              />
            </a>
          )}
          {icons.indexOf(Icons.DOCUMENT) > -1 && (
            <a>
              <img
                src={document}
                title="Tearsheet"
                onClick={() => handleIconClick(Icons.DOCUMENT)}
              />
            </a>
          )}
          {icons.indexOf(Icons.NOTIFICATION) > -1 && <Alerts />}
          {icons.indexOf(Icons.NOTES) > -1 && (
            <Notes opptyPlanId={this.props.opptyPlanId} />
          )}
          {icons.indexOf(Icons.HELP) > -1 && (
            <a>
              <img
                src={help}
                title="Help"
                className="disabled"
                onClick={() => handleIconClick(Icons.HELP)}
              />
            </a>
          )}
          <a className="help-menu-btn" href="/expert-network">
            <i
              id="help-menu-btn-icon"
              role="button"
              className="material-icons"
              title="Market"
            >
              online_prediction
            </i>
          </a>
          <a className="help-menu-btn" href="/market-performance">
            <i
              id="help-menu-btn-icon"
              role="button"
              className="material-icons"
              title="Dashboard"
            >
              storefront
            </i>
          </a>
          <a id="help-menu-btn" className="help-menu-btn">
            <i
              id="help-menu-btn-icon"
              role="button"
              className="material-icons"
              title="Help"
              onClick={this.showHelpChickletMenu}
            >
              help_outline
            </i>
          </a>
          {icons.indexOf(Icons.MAINMENU) > -1 && (
            <a>
              <img
                src={tiles}
                title="Main Menu"
                onClick={this.showChickletMenu}
              />
            </a>
          )}
          <div className="logout_container">
            <a>
              <img
                src={
                  this.userData.pictureFile
                    ? `tribyl/api/photo?location=${SanitizeUrl(
                        this.userData.pictureFile
                      )}`
                    : avatar
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${avatar}`;
                }}
                title={`${this.userData.firstName} ${this.userData.lastName}`}
                onClick={this.showUserMenu}
                width="32"
                height="32"
              />
            </a>
          </div>
        </div>
        {this.state.userMenu && (
          <div
            className="user-menu"
            role="button"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="col-12">
              <Link
                to="/my-profile"
                title="My Profile"
                className="inner-link my-profile-nav-link"
              >
                <div className="row" style={{ padding: '1em 0' }}>
                  <div className="col-4">
                    <img
                      src={
                        this.userData.pictureFile
                          ? `tribyl/api/photo?location=${SanitizeUrl(
                              this.userData.pictureFile
                            )}`
                          : avatar
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${avatar}`;
                      }}
                      title={`${this.userData.firstName} ${this.userData.lastName}`}
                      onClick={this.showUserMenu}
                      width="48"
                      height="48"
                    />
                  </div>
                  <div className="col-8">
                    <p className="inner-menu-name menu-name">{`${this.userData.firstName} ${this.userData.lastName}`}</p>
                    <figcaption>View/Update your profile</figcaption>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-12 logout-action-section">
              {/* <Link to="/logout" title="Logout" className="inner-link logout-nav-link"> */}
              <button className="btn" onClick={this.handleLogout}>
                Logout
              </button>
              {/* </Link> */}
            </div>
          </div>
        )}
        {this.state.helpChickletMenu && (
          <div ref={this.tutorialsMenuRef}>
            <HelpChicklet
              videos={videos}
              closeMenu={() => this.setState({ helpChickletMenu: false })}
            />
          </div>
        )}
        {this.state.chickletMenu && <SplashChicklet />}
      </div>
    );
  }
}

HeaderActions.propTypes = { viewName: PropTypes.string };
