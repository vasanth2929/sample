import React, { PureComponent } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types';

import { HeaderActions } from './containers/HeaderActions/HeaderActions';
import backArrow from '../../assets/images/header/ic-back-arrow.png';
import logo from '../../assets/images/header_logo.png';

import './styles/Header.style.scss';
import { getAllMediaFiles } from '../../util/promises/tutorials-promise';

export class Header extends PureComponent {
  state = {};
  constructor(props) {
    super(props);
    this.headerActionsNode = React.createRef();
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    const user = localStorage.getItem('user');

    if (user) {
      Promise.all([getAllMediaFiles()]).then(([allMediaFiles]) => {
        const videos = allMediaFiles.data || [];
        this.mounted && this.setState({ videos });
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      splashScreenHeader,
      noLink,
      goBack,
      goBackLink,
      viewName,
      handleIconClick,
      icons,
      viewHeader,
      customLeftComponent,
      customRightComponent,
      subviewName,
      opptyPlanId,
    } = this.props;
    const { videos } = this.state;

    return (
      <header className="header-component">
        {splashScreenHeader ? (
          <div className="header-content container-fluid" />
        ) : (
          <div className="header-content">
            <div className="d-flex">
              <div className="logo-box">
                <Link to="/splash-screen" title="Home">
                  <img src={logo} title="Tribyl" />
                </Link>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-4 nav-box">
                    {!noLink && goBack ? (
                      <div
                        className="go-back-link"
                        role="button"
                        onClick={goBackLink}
                      >
                        <img src={backArrow} className="back-arrow" />
                      </div>
                    ) : (
                      customLeftComponent
                    )}
                  </div>
                  <div className="col-4 text-center">
                    <p className="view-name">
                      {viewName}
                      <span className="sub-view-name">{subviewName || ''}</span>
                    </p>
                  </div>
                  <div className="col-4 text-right">
                    <HeaderActions
                      ref={this.headerActionsNode}
                      customRightComponent={customRightComponent}
                      icons={icons}
                      handleIconClick={handleIconClick}
                      opptyPlanId={opptyPlanId}
                      videos={videos}
                    />
                    {/* <SplashChicklet /> */}
                  </div>
                </div>
              </div>
            </div>
            {viewHeader && (
              <div className="container-fluid view-level-header">
                {viewHeader}
              </div>
            )}
          </div>
        )}
      </header>
    );
  }
}

Header.propTypes = {
  splashScreenHeader: PropTypes.bool,
  viewName: PropTypes.string,
  handleIconClick: PropTypes.func,
  icons: PropTypes.array,
};
