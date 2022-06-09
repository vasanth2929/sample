/* eslint-disable jsx-quotes */
/* eslint-disable no-tabs */
import React from 'react';
import Select from 'react-select';
import { Form, actions, Control } from 'react-redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ErrorBoundary } from '../../../../../components/ErrorBoundary/ErrorBoundary';
import { ImageSelector } from '../../../../../components/ImageSelector/ImageSelector';
import { showAlert } from '../../../../../components/MessageModal/MessageModal';
import { showAlert as showComponentModal } from '../../../../../components/ComponentModal/ComponentModal';
import { ControlledToggleSwitch } from '../../../../../basecomponents/ToggleSwitch/ControlledToggleSwitch';
import profileImage from '../../../../../assets/images/dummy.png';
import overlayImage from '../../../../../assets/images/overlay-image.png';
import { handlePhotoUploadAndSave } from '../../../../../util/promises/usercontrol_promise';
import {
  UserTypeModels,
  FunctionalTeamModels,
  ManagerModel,
} from '../../../../../model/userControlModels/UserControlModels';
import { hideModal } from '../../../../../action/modalActions';

import {
  checkUserGmailAuth,
  sendUserGmailToken,
  checkUserSalesforceAuth,
} from '../../../../../util/promises/email_promise';
import { SanitizeUrl } from '../../../../../util/utils';

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
      showGmailAuthRequired: false,
      showGmailAuthGranted: false,
      showGmailAuthNotDone: false,
      authLink: 'gmail.google.com',
      salesforceAuthLink: '',
      showSalesforceAuthRequired: true,
      showSalesforceAuthGranted: false,
      showSalesforceAuthNotDone: false,
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
    this.checkSalesforceAuth();
    this.checkUserGmailAuth();
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
      this.checkSalesforceAuth();
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
        salesforceAuthLink: response.data.authRedirectUrl,
        showSalesforceAuthNotDone: false,
      });
    } else {
      this.setState({
        showSalesforceAuthGranted: false,
        showSalesforceAuthNotDone: true,
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
      // below condition only match for admin user for other selected user it doesnt match
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
          showGmailAuthRequired: false,
        });
      } else {
        this.setState({
          showGmailAuthRequired: true,
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
      window.open('/browse-stories', '_self');
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

  handleJobRoleSelection = (elem) => {
    this.props.setFormFieldValue('functionalTeam', elem.enumValue);
  };

  sortUsername = (a, b) => {
    const first = a.username ? a.username.toLowerCase() : '';
    const second = b.username ? b.username.toLowerCase() : '';
    if (first < second) {
      return -1;
    }
    if (first > second) {
      return 1;
    }
    return 0;
  };

  renderFormBody = (
    username,
    userTypes,
    functionalTeams,
    status,
    roles,
    formType,
    users,
    restricted
  ) => {
    const { licenseTypes, userDetailsForm } = this.props;
    const sortedusers = Array.from(users).sort(this.sortUsername);
    return (
      <React.Fragment>
        <div className="form-group row" style={{ width: '100%' }}>
          <div
            className={`${
              formType === 'edit-user' ? 'col-3' : 'col-6'
            } d-flex flex-column`}
          >
            <input
              style={{
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
              }}
              type={'password'}
            />
            <input
              id="user-login-name"
              model=".loginname"
              style={{
                position: 'absolute',
                opacity: 0,
                pointerEvents: 'none',
              }}
              type="text"
              disabled={formType === 'edit-user'}
              className="form-control login-name-input"
              placeholder="Enter Login Name"
            />
            <label htmlFor="user-login-name" className="user-login-name">
              Login Name*:
            </label>
            <Control.text
              id="user-login-name"
              required
              model=".loginname"
              type="text"
              disabled={formType === 'edit-user'}
              className="form-control login-name-input"
              placeholder="Enter Login Name"
            />
          </div>
          {formType === 'edit-user' && (
            <div className="col-3 d-flex mt-4">
              <button
                className="btn btn-primary btn-password-update"
                onClick={(e) => this.props.showUpdatePasswordForm(e)}
              >
                Update Password
              </button>
            </div>
          )}
          {formType === 'edit-user' && (
            <div className="col-6 text-center d-flex flex-column">
              <React.Fragment>
                <div className="image-box">
                  <div
                    className={
                      formType === 'edit-user'
                        ? 'overlay-img-box'
                        : 'overlay-img-box add-form'
                    }
                  >
                    <img
                      onClick={this.handleChangeProfileImageClick}
                      src={overlayImage}
                      className="overlay-image"
                    />
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
            </div>
          )}
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
          <div className="col-6">
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
          <div className="col-6">
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
        </div>
        <div className="form-group row">
          <div className="col-6">
            <label htmlFor="user-email">Email*:</label>
            <Control.text
              id="user-email"
              maxLength="50"
              model=".email"
              type="email"
              className="form-control email-input"
              placeholder="Enter Email Address"
              required
            />
          </div>
          <div className="col-6">
            <label htmlFor="user-type">Team/Department*:</label>
            <div className="dropdown-form-control">
              <Control.select
                model=".type"
                id="user-type"
                placeholder="-- Select a Team or Department --"
                ignore={['focus', 'blur']}
                className="form-control dropdown"
                required
              >
                {userTypes &&
                  userTypes.map((item, key) => (
                    <option value={item.enumValue} key={key}>
                      {item.enumValue}
                    </option>
                  ))}
              </Control.select>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-6">
            <label htmlFor="functional-team">Job Role*:</label>
            <div className="dropdown-form-control">
              <Control.select
                model=".functionalTeam"
                id="functional-team"
                placeholder="-- Select a Functional Team --"
                ignore={['focus', 'blur']}
                className="form-control dropdown"
                defaultValue={this.props.userDetailsForm.functionalTeam}
                required
              >
                {functionalTeams &&
                  functionalTeams.map((item, key) => (
                    <option value={item.enumValue} key={key}>
                      {item.enumDisplayValue}
                    </option>
                  ))}
              </Control.select>
            </div>
          </div>
          {/* <div className="col-6 text-center">
            <ControlledToggleSwitch
              model=".restricted"
              toggleSwitchClass="user-status-toggle"
              required
              checkValue={restricted ? 'on' : 'off'}
              handleToggleChange={(e) =>
                this.props.setUserRestricted(e === 'off')
              }
              activeText="Restricted"
              inactiveText="Non-Restricted"
            />
          </div> */}
          <div className="col-6 text-center">
            <ControlledToggleSwitch
              model=".status"
              toggleSwitchClass="user-status-toggle"
              required
              checkValue={status === 'Active' ? 'on' : 'off'}
              handleToggleChange={(e) =>
                this.props.setUserStatus(e === 'off' ? 'Active' : 'Inactive')
              }
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="col-6">
            <label htmlFor="functional-team">Manager</label>
            <div className="dropdown-form-control">
              <Control.select
                model=".manager"
                id="manager-team"
                placeholder="-- Select a Manager Team --"
                ignore={['focus', 'blur']}
                className="form-control dropdown"
                required
              >
                {sortedusers &&
                  sortedusers.map((item, key) => (
                    <option value={item.userId} key={key}>
                      {item.username}
                    </option>
                  ))}
              </Control.select>
            </div>
          </div>
        </div>
        <fieldset className="form-group radio-form-group">
          <legend>&nbsp;&nbsp;Tribyl Roles*: </legend>
          <div className="row roles">
            {roles.map((item, key) => (
              <div className="col-2" key={key}>
                <label
                  htmlFor={`${item.name}-radio`}
                  className="radio-container"
                >
                  {item.name}
                  <Control.radio
                    id={`${item.name}-radio`}
                    model=".role"
                    updateOn={['change']}
                    ignore={['focus', 'blur']}
                    value={item.name}
                    required
                  />
                  <span className="checkmark" />
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </React.Fragment>
    );
  };

  renderFormFooter = () => {
    return (
      <div className="form-footer row">
        <div className="col-5 text-left" />
        <div className="col-7 text-right">
          <button
            className="btn btn-primary btn-reset"
            onClick={(event) => this.resetForm(event)}
          >
            Reset
          </button>
          <button type="submit" className="btn btn-primary btn-submit">
            Submit
          </button>
        </div>
      </div>
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
      manager,
      restricted,
      // showUpdatePasswordForm
    } = this.props;
    return (
      <ErrorBoundary>
        <div className="user-detail-form">
          <Form
            model="form.userDetails"
            className="user-add-edit-form"
            onSubmit={() => this.props.handleUserFormSubmit()}
          >
            {this.renderFormHeader(formType)}
            {this.renderFormBody(
              username,
              userTypes,
              functionalTeams,
              status,
              roles,
              formType,
              users,
              restricted
            )}
            {this.renderFormFooter(formType)}
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
      setFormFieldValue: (model, value) =>
        actions.change(`form.userDetails.${model}`, value),
      setPictureFile: (value) =>
        actions.change('form.userDetails.pictureFile', value),
      setUserStatus: (status) =>
        actions.change('form.userDetails.status', status),
      setUserRestricted: (value) =>
        actions.change('form.userDetails.restricted', value),
      resetFormValues: () => actions.reset('form.userDetails'),
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetailsFormImpl);
