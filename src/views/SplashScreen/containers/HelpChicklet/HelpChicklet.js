import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import mock from '../../../../mock/SplashScreen.mock.json';
import { getLoggedInUser } from '../../../../util/utils';
import { modalService } from '../../../../_tribyl/services/modal.service';
import { PitchRecorder } from '../../../OpptyPlanV3/containers/PitchRecorder/PitchRecorder';
import './HelpChicklet.scss';

class HelpChickletImpl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      splashMenus: [...mock.SplashMenus],
      user: null,
      icons: [
        {
          icon: 'story.svg',
          color: '#81C784',
        },
        {
          icon: 'calender.svg',
          color: '#F3A33A',
        },
        {
          icon: 'workbook.svg',
          color: '#F0906D',
        },
        {
          icon: 'flash.svg',
          color: '#0080FF',
        },
        {
          icon: 'star.svg',
          color: '#AF6EC3',
        },
        {
          icon: 'magnifying_glass.png',
          color: 'transparent',
        },
        {
          icon: 'bell.svg',
          color: '#B0BEC5',
        },
      ],
    };
  }

  componentWillMount() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.setState({ user: JSON.parse(userData) });
    }
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

  handleShowMediaCapture = (option) => {
    const { closeMenu } = this.props;
    if (closeMenu) closeMenu();
    this.setState({ mediaCaptureMenuOpen: false });
    if (option.location) {
      this.playCompetencyVideo(option);
    }
  };

  playCompetencyVideo = (option) => {
    modalService.showInteractiveModal(
      <PitchRecorder
        title={option.name}
        statusLabel="Tutorial Video"
        watchOnly
        pitchVideo={`tribyl/api/video?location=${option.location}`}
        close={modalService.closeInteractiveModal}
      />
    );
  };

  navigateMenu = () => {
    const win = window.open('/support-center', '_blank');
    win.focus();
  };

  render() {
    return (
      <div className="splash-chicklet help">
        <div className="splash-container">
          <div className="row card-container">
            <div
              className="splash-card"
              role="link"
              onClick={() => this.navigateMenu()}
            >
              <div className="image-section" style={{ background: '#B0BEC5' }}>
                <i className="material-icons">videocam</i>
              </div>
              <div className="header-section">
                <p>Coaching</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const HelpChicklet = withRouter(HelpChickletImpl);
