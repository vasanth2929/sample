import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import mock from '../../../../mock/SplashScreen.mock.json';
import './SplashChicklet.scss';
import { dispatch, getLoggedInUser } from '../../../../util/utils';
import { SplashIconMap } from '../../SplashScreen';

class SplashChickletImpl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      splashMenus: [...mock.SplashMenus],
      user: null,
    };
    this.mounted = false;
  }

  componentWillMount() {
    this.mounted = true;
    const userData = localStorage.getItem('user');
    if (userData && this.mounted) {
      this.setState({ user: JSON.parse(userData) });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  containsAuthorizeRoles = (arr1) => {
    const AUTH = process.env.AUTH;
    if (AUTH !== null && typeof AUTH !== 'undefined' && AUTH !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const found = arr1.includes(user.role);
        return found;
      }
      window.open('/', '_self');
      return null;
    }

    return true;
  };

  containsLicensePermissions = (item) => {
    const permissions = item.permissions;
    const user = getLoggedInUser();
    return permissions.find((permission) =>
      user.licenseTypePermissionBeans[0].licenseTypePermissionNames.includes(
        permission
      )
    );
  };

  navigateMenu = (navigateTo) => {
    if (navigateTo.action) {
      dispatch(navigateTo.action);
    }
    this.props.history.push(`/${navigateTo.path}`);
  };

  render() {
    const menu = this.state.splashMenus;

    return (
      <div className="splash-chicklet">
        <div className="splash-container">
          <div className="row card-container">
            {menu.map((item, key) => (
              <div key={`splash-chiklet-${key}`}>
                {
                  this.containsAuthorizeRoles(item.roles) &&
                    typeof this.containsAuthorizeRoles(item.roles) !==
                      'undefined' &&
                    this.containsLicensePermissions(item) && (
                      <div
                        className="splash-card"
                        key={key}
                        role="link"
                        onClick={() => this.navigateMenu(item.navigateTo)}
                      >
                        <div className="image-section">
                          <img
                            className={`${item.title
                              .toLowerCase()
                              .replace('&', 'and')
                              .replace(/([\ ])/g, '-')}-icon`}
                            src={SplashIconMap[item.title].icon}
                          />{' '}
                          {/* eslint-disable-line */}
                        </div>
                        <div className="header-section">
                          <p>{item.title}</p>
                        </div>
                      </div>
                    )
                  // : (
                  //     item.title !== 'Conversation Planner' && item.title !== 'Guided Prospecting' &&
                  //     <div className="splash-card disabled" key={key} style={{ cursor: "default" }} >
                  //         <div className="image-section" style={{ background: "#cecece" }} >
                  //             <img
                  //                 className={`${item.title === "Performance Management" ? 'magnifying_glass' : ''}`}
                  //                 src={SplashIconMap[item.title].icon} /> {/* eslint-disable-line */}
                  //         </div>
                  //         <div className="header-section">
                  //             <p>{item.title}</p>
                  //         </div>
                  //     </div>
                  // )
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export const SplashChicklet = withRouter(SplashChickletImpl);
