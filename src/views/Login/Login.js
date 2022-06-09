/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Control } from 'react-redux-form';
import {
  getIsSsoUser,
  getJWTToken,
  getUserDetails,
} from '../../util/promises/login_promise';
import logo from '../../assets/images/logo.png';
import './styles/Login.Style.scss';
import userManager from '../../util/userManager';
import { eraseCookie, setCookie } from '../../util/cookieUtils';

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
      username: 'admin',
      password: 'admin',
      lostClicked: false,
      enablePassword: false,
    };
  }

  async getLoginCredentials(username, password) {
    const AUTH = process.env.AUTH;
    const redirectUrl = sessionStorage.getItem('redirectUrl');

    if (AUTH !== null && typeof AUTH !== 'undefined' && AUTH !== 'undefined') {
      let errorMessage = '';
      const response = await getJWTToken({
        username: `${username}`,
        password: `${password}`,
      }).catch((error) => {
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
        if (this.props.onUserLoad) this.props.onUserLoad();

        if (user.data.role === 'AE' && !user.data.authorized) {
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            this.props.history.push('/my-profile');
          }
        } else {
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            this.props.history.push('/splash-screen');
          }
        }
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

  handleSSOLoginClick = (event) => {
    event.preventDefault();
    userManager.signinRedirect();
  };

  handleclick = () => {
    this.setState({ lostClicked: true });
  };

  CheckLoginType = async (e) => {
    e.preventDefault();
    const { loginForm } = this.props;

    try {
      if (loginForm.username) {
        const emailDomain = loginForm.username.split('@')[1];
        const response = await getIsSsoUser(loginForm.username);
        const isSSoUser = response && response.data;
        if (isSSoUser === 'N') {
          this.setState({ enablePassword: true });
        } else {
          userManager.signinRedirect();
        }
      }
    } catch (error) {
      this.setState({ enablePassword: true });
    }
  };

  render() {
    const { enablePassword } = this.state;
    return (
      <div className="login-screen">
        <Form
          model="form.login"
          className="login-form"
          name="login-form"
          onSubmit={this.handleLogin}
        >
          <div className="text-center">
            <img src={logo} alt="_Tribyl" title="Welcome to Tribyl" />
          </div>
          {!enablePassword && (
            <div className="d-flex align-items-center justify-content-between">
              <Control.text
                id="username"
                placeholder="Username"
                model=".username"
              />
              <i className="prompt-icon ion-person" />
            </div>
          )}
          {/* {enablePassword && <p className="username" onClick={()=> this.setState({enablePassword: false})}>
            <ArrowBackIcon className="back" title="edit username"/>
            <span>{loginForm.username}</span>
            <i className="prompt-icon ion-person" />
          </p>} */}

          <React.Fragment>
            <Control
              id="password"
              type="password"
              placeholder="Password"
              model=".password"
            />
            <i className="prompt-icon ion-locked" />
          </React.Fragment>
          <p
            className={
              this.state.error
                ? 'd-block error-message'
                : 'd-none error-message'
            }
          >
            <i className="ion-ios-information" />
            {this.state.errorMessage}
          </p>
          <button type="submit">Login</button>
          {/* {loginForm.username && enablePassword ? 
            <button onClick={this.CheckLoginType} >Next</button> 
          } */}
          {/* <button type="button" onClick={this.handleSSOLoginClick}>
            Login with your Company email
          </button> */}
          <a className="forgot-password-link" onClick={this.handleclick}>
            Lost your password?
          </a>
          {this.state.lostClicked ? (
            <p>
              Contact your system administrator for reset of password or email
              Tribyl at success@tribyl.com for help
            </p>
          ) : (
            ''
          )}
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { loginForm: state.form.login, user: state.oidc.user };
}

export default withRouter(connect(mapStateToProps)(Login));
