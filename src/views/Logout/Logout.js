import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RESET_MARKET_PERFORMANCE_FILTERS } from '../../constants/general';
import { eraseCookie, setCookie } from '../../util/cookieUtils';
import history from '../../util/history';
import { dispatch } from '../../util/utils';

class Logout extends PureComponent {
  componentDidMount() {
    dispatch({ type: 'USER_LOGOUT' });
    dispatch({ type: RESET_MARKET_PERFORMANCE_FILTERS });
    const redirectUrl = sessionStorage.getItem('redirectUrl');
    const isLoggingOut = history.location.state?.logout;
    setCookie('jwt', '');
    eraseCookie('jwt');
    localStorage.clear();
    sessionStorage.clear();

    if (redirectUrl && !isLoggingOut) {
      sessionStorage.setItem('redirectUrl', redirectUrl);
      history.push(`/login?redirectUrl=${redirectUrl}`);
    } else {
      history.push(`/login`);
    }
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => ({
  user: state.oidc.user,
});

export default connect(mapStateToProps)(withRouter(Logout));
