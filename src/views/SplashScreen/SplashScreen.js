/* eslint-disable global-require */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';

import mock from '../../mock/SplashScreen.mock.json';
import { Icons } from '../../constants/general';
import './styles/SplashScreen.style.scss';
import { dispatch, getLoggedInUser } from '../../util/utils';

import Story from '../../assets/iconsV2/story.svg';
import Calendar from '../../assets/iconsV2/calender.svg';
import Workbook from '../../assets/iconsV2/workbook.svg';
import Flash from '../../assets/iconsV2/flash.svg';
import MagnifyingGlass from '../../assets/iconsV2/magnifying_glass.png';
import Charts from '../../assets/iconsV2/charts.svg';
import Star from '../../assets/iconsV2/star.svg';
import BuyingJourney from '../../assets/iconsV2/buyingjourney.svg';
import Surveys from '../../assets/iconsV2/surveys.svg';
import PerfDashboard from '../../assets/iconsV2/perfdashboard.svg';
import GameTape from '../../assets/iconsV2/gametape.svg';
import Messaging from '../../assets/iconsV2/messaging.svg';
import Executive from '../../assets/iconsV2/tag.svg';
import { TribylButton } from '../../tribyl_components';
import Filter from '../CustomerAnalytics/Filters/Filter';

export const SplashIconMap = {
  'Performance Dashboard': {
    icon: PerfDashboard,
    color: '#81C784',
  },
  'Buying Journey Insights': {
    icon: BuyingJourney,
    color: '#F3A33A',
  },
  'Deal Game Tapes': {
    icon: GameTape,
    color: '#F44336',
  },
  'Tribyl Product Analytics': {
    icon: Surveys,
    color: '#B0BEC5',
  },
  Messaging: {
    icon: Messaging,
    color: '#F44336',
  },
  Administration: {
    icon: Star,
    color: '#AF6EC3',
  },
  'Show me the Money': {
    icon: Executive,
    color: '#AF6EC3',
  },
  Playbook: {
    icon: Workbook,
    color: '#0080FF',
  },
  Stories: {
    icon: Story,
    color: '#0080FF',
  },
  'Customer Intelligence': {
    icon: Workbook,
    color: '#F0906D',
  },
  'Guided Prospecting': {
    icon: Flash,
    color: '#0080FF',
  },
  'Conversation Planner': {
    icon: Calendar,
    color: '#0080FF',
  },
  'Performance Management': {
    icon: MagnifyingGlass,
    color: '#0080FF',
  },
  'Usage & Impact Metrics': {
    icon: Charts,
    color: '#F44336',
  },
};

class SplashScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      splashMenus: [...mock.SplashMenus],
      user: null,
    };
    this.mounted = false;
  }

  componentDidMount() {
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
      // window.open('/', '_self');
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

  navigateToHome = () => {
    this.props.history.push('/');
  };

  transformPropSet = (properties) => {
    return properties.reduce(
      (memo, property) => ({
        ...memo,
        [property.propertyName]:
          property.propsetPropvalIncontextValue || property.defaultValue,
      }),
      {}
    );
  };

  render() {
    const menu = this.state.splashMenus;
    const userData = localStorage.getItem('user');

    if (!this.props.user && !userData) this.navigateToHome();

    return (
      <div className="splash-screen">
        <MainPanel
          viewName=""
          noSidebar
          icons={[Icons.HELP, Icons.MAINMENU]}
          handleIconClick={() => {}}
        >
          <div className="splash-container">
            <div className="splash-profile">
              <div className="splash-profile-greeting">
                {`Hi ${this.state.user ? this.state.user.firstName : 'there'},`}
              </div>
              <div className="splash-profile-welcome">Welcome back</div>
            </div>
            <Filter hide/>
            <div className="row card-container">
              {menu
                .filter((item) => item.splashScreenEnabled)
                .map((item, key) =>
                  this.containsAuthorizeRoles(item.roles) &&
                  typeof this.containsAuthorizeRoles(item.roles) !==
                    'undefined' &&
                  this.containsLicensePermissions(item) ? (
                    <div
                      className="splash-card"
                      key={key}
                      role="link"
                      onClick={() => this.navigateMenu(item.navigateTo)}
                    >
                      <div className="card-content">
                        <div className="image-section">
                          <img
                            className={`${
                              SplashIconMap[item.title].icon === Star
                                ? 'magnifying_glass'
                                : ''
                            }`}
                            src={SplashIconMap[item.title].icon}
                          />{' '}
                        </div>
                        <div className="header-section">
                          <p>{item.title}</p>
                        </div>
                        <div className="footer-section">
                          <p>{item.content}</p>
                        </div>
                        <div className="next-button">
                          <TribylButton
                            variant="splash"
                            text={
                              <div className="next-button-button-content">
                                <div>View</div>
                                <div className="right-side">{'>'}</div>
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    item.title !== 'Conversation Planner' &&
                    item.title !== 'Guided Prospecting' && (
                      <div
                        className="splash-card"
                        key={key}
                        style={{ cursor: 'default' }}
                      >
                        <div className="card-content">
                          <div
                            className="image-section"
                            style={{ background: '#cecece' }}
                          >
                            <img
                              className={`${
                                SplashIconMap[item.title].icon ===
                                'magnifying_glass.png'
                                  ? 'magnifying_glass'
                                  : ''
                              }`}
                              src={SplashIconMap[item.title].icon}
                            />{' '}
                          </div>
                          <div className="header-section">
                            <p>{item.title}</p>
                          </div>
                          <div className="footer-section">
                            <p>{item.content}</p>
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
            </div>
          </div>
        </MainPanel>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.oidc.user,
});

export default connect(mapStateToProps)(withRouter(SplashScreen));
