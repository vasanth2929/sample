import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Login from '../Login/Login';
import PropTypes from 'prop-types';
import { Loader } from '../../basecomponents/Loader/Loader';
import userManager from '../../util/userManager';
import {
  getIsSsoEnable,
  getJWTToken,
  getUserDetails,
} from '../../util/promises/login_promise';
import { eraseCookie, setCookie, getCookie } from '../../util/cookieUtils';

const HomePage = ({ user, history, location, onUserLoad }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.expired) {
      checkForSSO();
    } else {
      signInUser();
    }
  }, []);

  useEffect(() => {
    if (user && !user.expired) {
      setCookie('jwt', `${user.token_type} ${user.access_token}`, 7);
      navigateToSplashScreen();
    }
  }, [user]);

  const checkForSSO = async () => {
    setIsLoading(true);
    try {
      const resp = await getIsSsoEnable();

      if (resp.data.isSsoEnable === 'Y') {
        userManager.signinRedirect();
      } else {
        if (getCookie('jwt')) {
          const searchParam = new URLSearchParams(location.search);
          const redirectUrl = searchParam.get('redirectUrl');
          const user = await getUserDetails();
          localStorage.setItem('user', JSON.stringify(user.data));

          if (onUserLoad) onUserLoad();

          if (user.data.role === 'AE' && !user.data.authorized) {
            history.push(redirectUrl ? `/${redirectUrl}` : '/my-profile');
          }
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const signInUser = async () => {
    try {
      const userDetail = await userManager.getUser();
      getLoginCredentials({ idToken: user.id_token });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLoginCredentials = async (credentials) => {
    const AUTH = process.env.AUTH;
    const searchParam = new URLSearchParams(location.search);
    const redirectUrl = searchParam.get('redirectUrl');
    if (AUTH !== null && typeof AUTH !== 'undefined' && AUTH !== 'undefined') {
      let errorMessage = '';
      const response = await getJWTToken(credentials).catch((error) => {
        history.push('/login');
        if (error.response.status === 401) {
          errorMessage = 'Username or password is wrong';
        } else {
          errorMessage = 'Something went wront, Please try again later';
        }
        if (errorMessage !== '') {
          console.log(errorMessage);
        }
        eraseCookie('jwt');
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
      if (response && response.status === 200) {
        setCookie('jwt', response.headers.authorization, 7);
        const user = await getUserDetails();
        localStorage.setItem('user', JSON.stringify(user.data));

        if (onUserLoad) onUserLoad();

        if (user.data.role === 'AE' && !user.data.authorized) {
          history.push(redirectUrl ? `/${redirectUrl}` : '/my-profile');
        } else {
          history.push(redirectUrl ? `/${redirectUrl}` : '/splash-screen');
        }
      } else {
        if (errorMessage !== '') {
          console.log(errorMessage);
        }
        eraseCookie('jwt');
      }
      return null;
    }
  };

  const navigateToSplashScreen = () => {
    history.push('/splash-screen');
  };

  if (isLoading) return <Loader />;

  return !user || user.expired ? <Login onUserLoad={onUserLoad} /> : <Loader />;
};

HomePage.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.oidc.user,
});

export default connect(mapStateToProps)(withRouter(HomePage));
