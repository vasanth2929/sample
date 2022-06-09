/* eslint-disable jsx-quotes */
/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { connect } from 'react-redux';
import { actions, Control, Form } from 'react-redux-form';
import { bindActionCreators } from 'redux';
import { hideModal } from '../../../../../action/modalActions';
import camera from '../../../../../assets/images/camera.svg';
import profileImage from '../../../../../assets/images/dummy.png';
import { showAlert as showComponentModal } from '../../../../../components/ComponentModal/ComponentModal';
import { ErrorBoundary } from '../../../../../components/ErrorBoundary/ErrorBoundary';
import { ImageSelector } from '../../../../../components/ImageSelector/ImageSelector';
import { showAlert } from '../../../../../components/MessageModal/MessageModal';
import {
  FunctionalTeamModels,
  UserTypeModels,
} from '../../../../../model/userControlModels/UserControlModels';
import {
  checkUserGmailAuth,
  checkUserSalesforceAuth,
  sendUserGmailToken,
  setSlackAuthorizationToken,
} from '../../../../../util/promises/email_promise';
import { handlePhotoUploadAndSave } from '../../../../../util/promises/usercontrol_promise';
import { SanitizeUrl } from '../../../../../util/utils';
import '../../styles/UserAdministration.style.scss';

class UserDetailsFormImpl extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: props.selectedUser,
      profileImage: props.selectedUser.pictureFile
        ? `tribyl/api/photo?location=${SanitizeUrl(
            props.selectedUser.pictureFile
          )}`
        : profileImage,
      showGmailAuthRequired: true,
      showGmailAuthGranted: false,
      showGmailAuthNotDone: false,
      authLink: 'gmail.google.com',
      salesforceAuthLink: '',
      showSalesforceAuthRequired: true,
      showSalesforceAuthGranted: false,
      showSalesforceAuthNotDone: false,
      SlackAuthLink: '',
      showSlackAuthRequired: true,
      showSlackAuthGranted: false,
      showSlackAuthNotDone: false,
    };
    this.userData = localStorage.getItem('user');
    if (this.userData) {
      this.userData = JSON.parse(this.userData);
    } else {
      this.userData = {
        username: 'system',
        role: 'system role',
        userId: 75,
      };
    }
  }

  componentDidMount() {
    this.checkUserGmailAuth();
    this.checkSalesforceAuth();
    this.checkSlackforceAuth();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedUser !== this.props.selectedUser) {
      this.setState({
        selectedUser: nextProps.selectedUser,
        profileImage: nextProps.selectedUser.pictureFile
          ? `tribyl/api/photo?location=${SanitizeUrl(
              nextProps.selectedUser.pictureFile
            )}`
          : profileImage,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.checkUserGmailAuth();
    }
  }

  onPasswordChange = (event) => {
    const password = event.target.value;
    if (password.length < 8) {
      event.target.setCustomValidity(
        'Password should be minimum 8 characters long.'
      );
    } else {
      event.target.setCustomValidity('');
    }
  };

  onRepeatPasswordChange = (event) => {
    const password = document.getElementById('user-password').value;
    const repeatPassword = event.target.value;
    if (password !== repeatPassword) {
      event.target.setCustomValidity("Passwords don't match.");
    } else {
      event.target.setCustomValidity('');
    }
  };

  getUploadedFileName = (uploadedFile) => {
    const profileImg = `tribyl/api/photo?location=${SanitizeUrl(uploadedFile)}`;
    this.setState({ profileImage: profileImg });
    this.props.setPictureFile(uploadedFile);
  };

  async checkSalesforceAuth() {
    const response = await checkUserSalesforceAuth();
    if (this.userData.userId === this.props.userId) {
      this.setState({
        showSalesforceAuthRequired: !response.data.authorized,
        showSalesforceAuthGranted: response.data.authorized,
        salesforceAuthLink: response.data.authRedirectUrl,
        showSalesforceAuthNotDone: false,
      });
    } else if (response.data.authorized) {
      this.setState({
        showSalesforceAuthGranted: true,
        authLink: response.data.authRedirectUrl,
        showSalesforceAuthNotDone: false,
      });
    } else {
      this.setState({
        showSalesforceAuthGranted: false,
        showSalesforceAuthNotDone: true,
      });
    }
  }

  async checkSlackforceAuth() {
    const response = await setSlackAuthorizationToken();

    if (this.userData.userId === this.props.userId) {
      this.setState({
        showSlackAuthRequired: !response.data.authorized,
        showSlackAuthGranted: response.data.authorized,
        SlackAuthLink: response.data.authRedirectUrl,
        showSlackAuthNotDone: false,
      });
    } else if (response.data.authorized) {
      this.setState({
        showSlackAuthGranted: true,
        SlackAuthLink: response.data.authRedirectUrl,
        showSlackAuthNotDone: false,
      });
    } else {
      this.setState({
        showSlackAuthGranted: false,
        showSlackAuthNotDone: true,
      });
    }
  }

  async checkUserGmailAuth() {
    const payload = {
      userId: this.props.userId,
      emailAddress: '',
      token: '',
    };

    try {
      const response = await checkUserGmailAuth(payload);
      if (this.userData.userId === this.props.userId) {
        this.setState({
          showGmailAuthRequired: !response.data.authorized,
          showGmailAuthGranted: response.data.authorized,
          authLink: response.data.authRedirectUrl,
          showGmailAuthNotDone: false,
        });
      } else if (response.data.authorized) {
        this.setState({
          showGmailAuthGranted: true,
          authLink: response.data.authRedirectUrl,
          showGmailAuthNotDone: false,
        });
      } else {
        this.setState({
          showGmailAuthGranted: false,
          showGmailAuthNotDone: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  resetForm = (event) => {
    event.preventDefault();
    this.props.resetFormValues();
  };

  handleChangeProfileImageClick = () => {
    const selectedUserId = this.state.selectedUser.userId;
    const selectImage = (
      <ImageSelector
        handleFileUpload={(attachment, filename) =>
          this.handleFileUpload(selectedUserId, attachment, filename)
        }
      />
    );
    showComponentModal(
      'Upload Profile Picture',
      selectImage,
      'image-selector-modal'
    );
  };

  async handleFileUpload(userId, attachment, filename) {
    const response = await handlePhotoUploadAndSave(
      userId,
      attachment,
      filename
    );
    if (response.status === 200) {
      hideModal();
      this.getUploadedFileName(response.data.location);
    } else {
      showAlert(
        'Unable to upload profile picture. Please contact System Administrator.',
        'error'
      );
    }
  }

  submitGmailToken = async () => {
    const payload = {
      emailAddress: '',
      token: this.props.userDetailsForm.gmailToken,
      userId: this.props.userId,
    };
    await sendUserGmailToken(payload);
    this.setState({
      showGmailAuthGranted: true,
      showGmailAuthRequired: false,
    });
  };

  updateGmailToken = () => {
    this.setState({
      showGmailAuthRequired: true,
      showGmailAuthGranted: false,
      showGmailAuthNotDone: false,
    });
  };

  handleFormClose = () => {
    if (window.history.length > 2) {
      window.history.go(-1);
    } else {
      window.open('/splash-screen', '_self');
    }
  };

  renderFormHeader = (formType) => {
    return (
      <div className="form-header d-flex justify-content-between">
        <h3>{formType === 'edit-user' ? 'Edit User' : 'Add User'}</h3>
        {this.props.closeForm && (
          <i
            className="material-icons close-form-icon"
            title="Exit"
            onClick={this.handleFormClose}
            role="button"
          >
            close
          </i>
        )}
      </div>
    );
  };

  // submit = async(e) => {
  //     e.preventDefault();
  //     const { userDetailsForm } = this.props;
  //     try {
  //         const repsone = await updateUser(userDetailsForm);
  //         if (repsone) {
  //             showAlert("Profile is updated successfully", "success");
  //         }
  //     } catch (e) {
  //         showAlert("Something went wrong", "error");
  //     }
  // }

  renderFormBody = (
    username,
    userTypes,
    functionalTeams,
    status,
    roles,
    formType
  ) => {
    return (
      <React.Fragment>
        <div className="form-group row title-section">
          <div className="col-4 text-left d-flex">
            {formType === 'edit-user' && (
              <React.Fragment>
                <div className="image-box">
                  <div
                    className={
                      formType === 'edit-user'
                        ? 'overlay-img-box'
                        : 'overlay-img-box add-form'
                    }
                  >
                    <div className="overlay">
                      <img
                        onClick={this.handleChangeProfileImageClick}
                        src={camera}
                        className="overlay-image"
                      />
                    </div>
                  </div>
                  <div className="profile-img-box">
                    <img
                      src={this.state.profileImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${profileImage}`;
                      }}
                      title="Profile Image"
                      className="profile-image"
                      alt="_profile"
                    />
                  </div>
                </div>
                <h5 className="user-name-label">{username}</h5>
              </React.Fragment>
            )}
          </div>
          <div className="col-4">
            <label htmlFor="user-login-name">Login Name*:</label>
            <Control.text
              id="user-login-name"
              required
              maxLength="25"
              model=".loginname"
              type="text"
              // disabled
              disabled={formType === 'edit-user'}
              className="form-control login-name-input"
              placeholder="Enter Login Name"
            />
          </div>
          <div className="custome-button">
            <div className="col-4 text-left">
              <button
                className="btn btn-primary btn-password-update"
                onClick={this.props.showUpdatePasswordForm}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
        {formType === 'add-user' && (
          <div className="form-group row">
            <div className="col-6">
              <label htmlFor="user-password">New Password*:</label>
              <Control.text
                id="user-password"
                onChange={this.onPasswordChange}
                required
                maxLength="25"
                model=".password"
                type="password"
                className="form-control password-input"
                placeholder="Enter Password"
              />
              <p className="small">
                *Password should be minimum 8 characters long
              </p>
            </div>
            <div className="col-6">
              <label htmlFor="user-repeat-password">
                Repeat New Password*:
              </label>
              <Control.text
                id="user-repeat-password"
                onChange={this.onRepeatPasswordChange}
                required
                maxLength="25"
                model=".repeatpassword"
                type="password"
                className="form-control repeat-password-input"
                placeholder="Repeat New Password"
              />
            </div>
          </div>
        )}
        <div className="form-group row">
          <div className="col-4">
            <label htmlFor="user-first-name">First Name:</label>
            <Control.text
              id="user-first-name"
              maxLength="25"
              model=".firstName"
              type="text"
              className="form-control first-name-input"
              placeholder="Enter First Name"
            />
          </div>
          <div className="col-4">
            <label htmlFor="user-last-name">Last Name:</label>
            <Control.text
              id="user-last-name"
              maxLength="25"
              model=".lastName"
              type="text"
              className="form-control last-name-input"
              placeholder="Enter Last Name"
            />
          </div>
          <div className="col-4">
            <label htmlFor="user-email">Email*:</label>
            <Control.text
              id="user-email"
              maxLength="50"
              model=".email"
              type="email"
              className="form-control email-input"
              placeholder="Enter Email Address"
              required
              readOnly={!this.userData.email.includes('tribyl.com')}
            />
          </div>
        </div>

        {this.userData.role === 'ADMIN' ? (
          <React.Fragment>
            <legend>&nbsp;&nbsp;Tribyl Roles* </legend>
            <fieldset className="form-group radio-form-group tribyl-roles">
              <div className="row">
                {roles.map((item, key) => (
                  <div className="col-3" key={key}>
                    <label
                      htmlFor={`${item.name}-radio`}
                      className="radio-container"
                    >
                      {item.name}
                      <Control.radio
                        id={`${item.name}-radio`}
                        model=".role"
                        updateOn={['change']}
                        disabled
                        ignore={['focus', 'blur']}
                        value={item.name}
                        required
                      />
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </React.Fragment>
        ) : (
          <div className="col-12">
            <strong>Role : {this.userData.role}</strong>
          </div>
        )}
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary update mr-2"
            onClick={() => this.props.handleUserFormSubmit()}
          >
            Update
          </button>
        </div>
      </React.Fragment>
    );
  };

  render() {
    const {
      username,
      userTypes,
      functionalTeams,
      status,
      roles,
      formType,
      users,
    } = this.props;
    return (
      <ErrorBoundary>
        <div className="user-detail-form">
          <Form model="form.userDetails" className="user-add-edit-form">
            {this.renderFormHeader(formType)}
            {this.renderFormBody(
              username,
              userTypes,
              functionalTeams,
              status,
              roles,
              formType,
              users
            )}
          </Form>
        </div>
      </ErrorBoundary>
    );
  }
}

function mapStateToProps(state) {
  return {
    userDetailsForm: state.form.userDetails,
    userTypes: UserTypeModels.list().map((item) => item.props),
    functionalTeams: FunctionalTeamModels.list().map((item) => item.props),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setFormInitialValues: (values) =>
        actions.change('form.userDetails', values),
      setPictureFile: (value) =>
        actions.change('form.userDetails.pictureFile', value),
      setUserStatus: (status) =>
        actions.change('form.userDetails.status', status),
      resetFormValues: () => actions.reset('form.userDetails'),
    },
    dispatch
  );
}

export const UserDetailsForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetailsFormImpl);
