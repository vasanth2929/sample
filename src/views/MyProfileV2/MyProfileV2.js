import React from 'react';
import { actions } from 'react-redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { showAlert } from '../../components/ComponentModal/ComponentModal';
import { showAlert as showMessageModal } from '../../components/MessageModal/MessageModal';
import { UserDetailsForm } from '../Administration/UserAdministrationV2/containers/UserDetailsForm/UserDetailsForm';
import { UpdatePasswordForm } from '../Administration/UserAdministrationV2/containers/UpdatePasswordForm/UpdatePasswordForm';
import { hideModal } from '../../action/modalActions';
import { Icons } from '../../constants/general';

import '../Administration/UserAdministrationV2/styles/UserAdministration.style.scss';

import {
  getUserDetails,
  getAllUserTypes,
  getAllFunctionalTeams,
  getAllRoles,
  updateUser,
  getAllUsers,
} from '../../util/promises/usercontrol_promise';
import {
  UserTypeModels,
  FunctionalTeamModels,
  UserRoleModels,
} from '../../model/userControlModels/UserControlModels';

class MyProfileImpl extends React.PureComponent {
  constructor(props) {
    super(props);
    this.userData = localStorage.getItem('user');
    if (this.userData) {
      this.userData = JSON.parse(this.userData);
    } else {
      this.userData = {
        username: 'system',
        role: 'system role',
        userId: 1,
      };
    }
    this.state = { users: [], updatePasswordError: '' };
  }

  componentWillMount() {
    this.initialLoads(this.userData.userId);
  }

  async getAllRoles() {
    UserRoleModels.deleteAll();
    const response = await getAllRoles();
    const roles = response.data.map(
      (role) => new UserRoleModels({ id: role.id, ...role })
    );
    UserRoleModels.saveAll(roles);
  }
  async getAllUsers() {
    const response = await getAllUsers();
    this.setState({ users: response.data });
  }
  async getAllUserTypes() {
    UserTypeModels.deleteAll();
    const response = await getAllUserTypes();
    const userTypes = response.data.map(
      (userType) =>
        new UserTypeModels({ id: userType.displaySequence, ...userType })
    );
    UserTypeModels.saveAll(userTypes);
  }

  async getAllFunctionalTeams() {
    FunctionalTeamModels.deleteAll();
    const response = await getAllFunctionalTeams();
    const functionalTeams = response.data.map(
      (functionalTeam) =>
        new FunctionalTeamModels({
          id: functionalTeam.displaySequence,
          ...functionalTeam,
        })
    );
    FunctionalTeamModels.saveAll(functionalTeams);
  }

  async getUserDetails(selectedUserId) {
    const response = await getUserDetails(selectedUserId);
    this.props.setUserFormInitialValues({
      loginname: response.data.loginname,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email,
      type: response.data.type || this.props.userTypes[0]?.enumValue,
      functionalTeam:
        response.data.functionalTeam ||
        this.props.functionalTeams[0]?.enumValue,
      role: response.data.role,
      password: response.data.password,
      repeatpassword: response.data.password,
      status: response.data.status,
      userId: response.data.userId,
      pictureFile: response.data.pictureFile,
      manager: response.data.parentUserId,
    });
  }

  getUploadedUserFileName = () => {
    this.getUserDetails(this.state.selectedUserId);
  };

  handleUserFormSubmit = () => {
    const updatePayload = {
      email: this.props.userDetailsForm.email,
      firstName: this.props.userDetailsForm.firstName,
      lastName: this.props.userDetailsForm.lastName,
      loginname: this.props.userDetailsForm.loginname,
      role: this.props.userDetailsForm.role,
      type: this.props.userDetailsForm.type,
      functionalTeam: this.props.userDetailsForm.functionalTeam,
      status: this.props.userDetailsForm.status,
      userId: this.props.userDetailsForm.userId,
      pictureFile: this.props.userDetailsForm.pictureFile,
      parentId: this.props.userDetailsForm.manager,
    };
    this.setState({ isLoading: true });
    updateUser(updatePayload)
      .then(() => {
        showMessageModal('Profile updated successfully.', 'success', () =>
          this.initialLoads(updatePayload.userId)
        );
      })
      .catch(() => {
        showMessageModal(
          'Something went wrong. Please try again later.',
          'error',
          () => this.initialLoads(updatePayload.userId)
        );
      });
  };

  initialLoads = (userId) => {
    this.getAllRoles();
    this.getAllUserTypes();
    this.getAllFunctionalTeams();
    this.getUserDetails(userId);
    this.getAllUsers();
  };

  showUpdatePasswordForm = (event) => {
    event.preventDefault();
    const updatePasswordForm = (
      <UpdatePasswordForm
        error={this.state.updatePasswordError}
        handleUpdatePasswordSubmit={this.handleUpdatePasswordSubmit}
      />
    );
    showAlert('Update Password', updatePasswordForm);
  };

  handleUpdatePasswordSubmit = async () => {
    const payload = {
      userId: this.props.userDetailsForm.userId,
      loginname: this.props.userDetailsForm.loginname,
      pass: this.props.userDetailsForm.password,
      currentPass: this.props.userDetailsForm.currentPass,
    };
    try {
      console.log({payload})

      this.setState({ isLoading: true });
      const response = await updateUser(payload);
      this.initialLoads(payload.userId);
      hideModal();
      showMessageModal('Password Updated Successfully!', 'success');
    } catch (error) {
      const updatePasswordError = error?.response?.data
        ? error.response.data
        : 'Password does not conform to our requirements';
      showMessageModal(updatePasswordError, 'error');
    }
  };

  handleHeaderIconClick = (action) => {
    switch (action) {
      default:
        break;
    }
  };

  render() {
    const { userTypes, functionalTeams, roles } = this.props;
    const { users } = this.state;
    const selectedUser = this.props.userDetailsForm;
    return (
      <ErrorBoundary>
        <section className="user-administrationv2-view my-profile-form-view">
          <MainPanel
            noSidebar
            // goBack
            // goBackLink={() => {
            //     if (window.history.length > 2) {
            //         window.history.go(-1);
            //     } else { window.open('browse-stories', '_self'); }
            // }}
            viewName="My Profile"
            icons={[Icons.MAINMENU]}
            handleIconClick={this.handleHeaderIconClick}
          >
            <div className="container">
              <div
                className="row user-admin-tab"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <div className="col-8">
                  <UserDetailsForm
                    formType="edit-user"
                    closeForm
                    userId={this.userData.userId}
                    username={
                      this.userData &&
                      `${this.userData.firstName || ''} ${
                        this.userData.lastName || ''
                      }`
                    }
                    userTypes={userTypes}
                    functionalTeams={functionalTeams}
                    status={this.userData && `${this.userData.status}`}
                    roles={roles}
                    users={users}
                    selectedUser={selectedUser}
                    handleUserFormSubmit={this.handleUserFormSubmit}
                    showUpdatePasswordForm={this.showUpdatePasswordForm}
                    handleUpdatePasswordSubmit={this.handleUpdatePasswordSubmit}
                    getUploadedFileName={this.getUploadedUserFileName}
                  />
                </div>
              </div>
            </div>
          </MainPanel>
        </section>
      </ErrorBoundary>
    );
  }
}

function mapStateToProps(state) {
  return {
    functionalTeams: FunctionalTeamModels.list().map((item) => item.props),
    userTypes: UserTypeModels.list().map((item) => item.props),
    roles: UserRoleModels.list().map((item) => item.props),
    userDetailsForm: state.form.userDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUserFormInitialValues: (values) =>
        actions.change('form.userDetails', values),
      resetUserFormValues: () => actions.reset('form.userDetails'),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileImpl);
