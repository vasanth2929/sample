/* eslint-disable no-console */
import './styles/LoginExpert.Style.scss';
import { connect } from 'react-redux';
import { Form, Control } from 'react-redux-form';
import { getJWTToken, getUserDetails } from '../../util/promises/login_promise';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import { signup } from '../../util/promises/usercontrol_promise';
import email from '../../assets/iconsV2/expert-email.svg';
import linkedin from '../../assets/iconsV2/expert-linkedin.svg';
import LoginSplash from '../../assets/iconsV2/login-splash.svg';
import password from '../../assets/iconsV2/expert-password.svg';
import React, { PureComponent } from 'react';
import user from '../../assets/iconsV2/expert-user.svg';
import { eraseCookie, setCookie } from '../../util/cookieUtils';

/*
************************************

This is mostly a copy of Login.js, but will point to a different splash page on login.

************************************
*/

const clientId = '867uis0thknm7u';

class LoginExpertImpl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
      username: 'admin',
      password: 'admin',
      lostClicked: false,
      code: '',
      errorMessage: '',
    };
  }

  async getLoginCredentials(username, password) {
    const AUTH = process.env.AUTH;
    const searchParam = new URLSearchParams(this.props.location.search);
    const redirectUrl = searchParam.get('redirectUrl');

    if (AUTH !== null && typeof AUTH !== 'undefined' && AUTH !== 'undefined') {
      let errorMessage = '';
      const response = await getJWTToken({
        username: `${username}`,
        password: `${password}`,
      }).catch((error) => {
        errorMessage = error.message;

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
        setCookie('jwt', response.headers.authorization);
        const user = await getUserDetails();
        localStorage.setItem('user', JSON.stringify(user.data));
        const redirectUrl = redirectUrl
          ? `/${redirectUrl}`
          : '/expert-network-user-profile';
        window.open(redirectUrl, '_self');
        location.reload();
      } else {
        if (errorMessage !== '') {
          this.setState({ error: true, errorMessage });
          console.log(errorMessage);
        }
        eraseCookie('jwt');
      }
      return null;
    }
  }

  getError() {
    const username = this.props.loginForm.username;
    const password = this.props.loginForm.password;
    if (username === '' && password === '') {
      return 'Username and Password cannot be left blank';
    }
    if (password === '') {
      return 'Password cannot be empty!';
    }
    if (username === '') {
      return 'Username cannot be empty!';
    }
    return null;
  }
  handleLogin = () => {
    const error = this.getError();
    if (error !== null) {
      this.setState({ error: true, errorMessage: this.getError() });
    } else {
      this.getLoginCredentials(
        this.props.loginForm.username,
        this.props.loginForm.password
      );
    }
  };

  handleSignup = () => {
    const { email, firstname, lastname, linkedinurl, password, username } =
      this.props.loginForm;
    signup({
      name: `${firstname} ${lastname}`,
      firstName: firstname,
      lastName: lastname,
      linkedinUrl: linkedinurl,
      username: email,
      loginname: email,
      email,
      password,
      role: 'ADMIN',
      roleId: 6,
      licenseTypeId: 2,
    }).then((response) => {
      console.log({ response });
      this.getLoginCredentials(email, password);
    });
  };

  handleclick = () => {
    this.setState({ lostClicked: true });
  };

  handleSuccess = (data) => {
    this.setState({
      code: data.code,
      errorMessage: '',
    });
  };

  handleFailure = (error) => {
    this.setState({
      code: '',
      errorMessage: error.errorMessage,
    });
  };

  toggleSignUp = () => {
    this.setState({ signup: !this.state.signup });
  };

  render() {
    const {
      match: { params },
    } = this.props;

    const displaySignup = params.form ? true : this.state.signup;

    const linkedInProps = {
      clientId,
      onFailure: this.handleFailure,
      onSuccess: this.handleSuccess,
      scope: 'r_liteprofile',
      redirectUri:
        'https://qa.tribylcloud.com/tribyl-expert/api/linkedin/oauth2redirect',
    };

    return (
      <div className="expert-login-screen">
        <div className="expert-login-screen-section left">
          <div className="expert-login-screen-image-wrapper">
            Where SaaS buyers connect to share, learn, and network.
            <img src={LoginSplash} />
          </div>
        </div>
        {!displaySignup ? (
          <div className="expert-login-screen-section right">
            <Form
              model="form.login"
              className="login-form"
              name="login-form"
              onSubmit={this.handleLogin}
            >
              <div
                className="signin-title"
                style={{ marginBottom: '32px', marginTop: '45px' }}
              >
                Sign in to continue,
              </div>

              <Control.text
                id="username"
                placeholder="Email"
                model=".username"
              />
              <img src={user} />

              <Control
                id="password"
                type="password"
                placeholder="Password"
                model=".password"
              />
              <img src={password} />

              {this.state.error && (
                <p className="d-block error-message">
                  <i className="ion-ios-information" />
                  {this.state.errorMessage}
                </p>
              )}

              <button className="login-btn" type="submit">
                Sign In
              </button>
              <div className="or-row">
                <div className="or-row-or">Or</div>
              </div>
              <LinkedIn {...linkedInProps}>Sign in with Linkedin</LinkedIn>
            </Form>
            <div className="new-user-row">
              <div className="new-user-row-label">New user?</div>
              <div className="new-user-row-button" onClick={this.toggleSignUp}>
                Sign up
              </div>
            </div>
          </div>
        ) : (
          <div className="expert-login-screen-section right">
            <Form
              model="form.login"
              className="login-form"
              name="login-form"
              onSubmit={this.handleSignup}
            >
              <div
                className="signin-title"
                style={{ marginBottom: '32px', marginTop: '45px' }}
              >
                Apply to join the Tribyl Expert Network
              </div>
              <Control.text
                id="firstname"
                placeholder="First Name"
                model=".firstname"
              />
              <img src={user} />

              <Control.text
                id="lastname"
                placeholder="Last Name"
                model=".lastname"
              />
              <img src={user} />

              <Control.text
                id="linkedinURL"
                placeholder="Linkedin profile URL"
                model=".linkedinurl"
              />
              <img src={linkedin} />

              <Control.text id="email" placeholder="Email" model=".email" />
              <img src={email} />

              <Control.password
                id="password"
                placeholder="Password"
                model=".password"
              />
              <img src={password} />

              {this.state.error && (
                <p className="d-block error-message">
                  <i className="ion-ios-information" />
                  {this.state.errorMessage}
                </p>
              )}

              <button className="login-btn" type="submit">
                Sign Up
              </button>
            </Form>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { loginForm: state.form.login };
}

export default connect(mapStateToProps)(LoginExpertImpl);
