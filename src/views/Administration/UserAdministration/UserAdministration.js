/* eslint-disable radix */
/* eslint-disable no-underscore-dangle,no-new */
import React, { PureComponent } from 'react';
import ReactDataGrid from 'react-data-grid';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { TextBlock } from 'react-placeholder-shimmer';
import { bindActionCreators } from 'redux';
import { hideModal } from '../../../action/modalActions';
import { MainPanel } from '../../../basecomponents/MainPanel/MainPanel';

// import sub-components
import { showAlert } from '../../../components/ComponentModal/ComponentModal';
import { showAlert as showMessageModal } from '../../../components/MessageModal/MessageModal';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import { Icons } from '../../../constants/general';
import {
  FunctionalTeamModels,
  LicenseTypeModels,
  UserControlModels,
  UserRoleModels,
  UserTypeModels,
} from '../../../model/userControlModels/UserControlModels';

// import data
import {
  getAllFunctionalTeams,
  getAllLicenseTypes,
  getAllRoles,
  getAllUsers,
  getAllUserTypes,
  getUserDetails,
  signup,
  updateUser,
} from '../../../util/promises/usercontrol_promise';
import '../../Playbooks/styles/Playbooks.style.scss';
import { UpdatePasswordForm } from './containers/UpdatePasswordForm/UpdatePasswordForm';
import UserDetailsForm from './containers/UserDetailsForm/UserDetailsForm';
import './styles/UserAdministration.style.scss';
import { SearchInput } from '../../../_tribyl/components/_base/SearchInput/SearchInput';

class UserAdministrationImpl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSubmitPlaybookModal: false,
      isLoading: true,
      selectedUserId: null,
      formType: 'edit-user',
      usersListForManager: [],
      selectedIndexes: { ' ': true },
      searchValue: '',
      sortColumn: null,
      sortDirection: 'NONE',
      updatePasswordError: '',
    };
    this.gridColumns = [
      {
        key: 'loginname',
        width: '27%',
        name: 'Login Name',
        formatter: <LoginNameFormatter />,
      },
      {
        key: 'fullName',
        width: '30%',
        name: 'Name',
        sortable: true,
      },
      // {
      //   key: 'authorized',
      //   width: '43%',
      //   name: 'Auth status',
      //   formatter: <AuthorizationStatusFormatter />,
      //   sortable: true,
      // },
    ];
  }

  componentWillMount() {
    this.initialLoads();
  }

  async getAllUsers(selectedUserId) {
    UserControlModels.deleteAll();

    try {
      const response = await getAllUsers();
      const users = response.data
        .sort((a, b) => b.userId - a.userId)
        .filter(
          (i) => i.email !== 'admin@tribyl.com' && i.loginname !== 'system'
        )
        .map((user) => new UserControlModels({ id: user.userId, ...user }));
      UserControlModels.saveAll(users);
      const id = response?.data?.sort((a, b) => b.userId - a.userId)[0]?.userId;
      this.setState(
        {
          selectedUserId: selectedUserId || id,
        },
        () => {
          this.getAllUserTypes();
          this.getAllFunctionalTeams();
          this.getUserDetails(this.state.selectedUserId);
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
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
      licenseTypeId: response.data.licenseTypeId
        ? response.data.licenseTypeId.toString()
        : response.data.licenseTypeId,
      password: response.data.password,
      repeatpassword: response.data.password,
      status: response.data.status,
      userId: response.data.userId,
      pictureFile: response.data.pictureFile,
      manager: response.data.parentUser ? response.data.parentUser.id : '',
      restricted: response.data.restricted,
    });
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

  async getAllRoles() {
    UserRoleModels.deleteAll();
    const response = await getAllRoles();
    const roles = response.data.map(
      (role) => new UserRoleModels({ id: role.id, ...role })
    );
    UserRoleModels.saveAll(roles);
  }

  async getLicenseTypes() {
    const response = await getAllLicenseTypes();
    const licenseTypes = response.data || [];
    const licenseTypeModels = licenseTypes.map(
      (licenseType) =>
        new LicenseTypeModels({ id: licenseType.licenseId, ...licenseType })
    );
    LicenseTypeModels.saveAll(licenseTypeModels);
  }

  getUploadedUserFileName = () => {
    this.getUserDetails(this.state.selectedUserId);
  };

  initialLoads = (selectedUserId) => {
    this.getAllUsers(selectedUserId);
    this.getAllRoles();
    // this.getLicenseTypes();
  };

  handleHeaderIconClick = (action) => {
    switch (action) {
      default:
        break;
    }
  };

  handleUserSelection = (selectedUserId) => {
    this.setState({ selectedUserId, formType: 'edit-user' }, () =>
      this.getUserDetails(this.state.selectedUserId)
    );
  };

  handleUserFormSubmit = async () => {
    const updatePayload = {
      email: this.props.userDetailsForm.email,
      firstName: this.props.userDetailsForm.firstName,
      lastName: this.props.userDetailsForm.lastName,
      loginname: this.props.userDetailsForm.loginname,
      role: this.props.userDetailsForm.role,
      licenseTypeId: parseInt(this.props.userDetailsForm.licenseTypeId),
      type: this.props.userDetailsForm.type,
      functionalTeam: this.props.userDetailsForm.functionalTeam,
      status: this.props.userDetailsForm.status,
      userId: this.props.userDetailsForm.userId,
      pictureFile: this.props.userDetailsForm.pictureFile,
      parentId: this.props.userDetailsForm.manager,
      restricted: this.props.userDetailsForm.restricted,
    };
    const createPayload = {
      email: this.props.userDetailsForm.email,
      firstName: this.props.userDetailsForm.firstName,
      lastName: this.props.userDetailsForm.lastName,
      loginname: this.props.userDetailsForm.loginname,
      pass: this.props.userDetailsForm.password,
      role: this.props.userDetailsForm.role,
      licenseTypeId: 1,
      type: this.props.userDetailsForm.type,
      functionalTeam: this.props.userDetailsForm.functionalTeam,
      status: this.props.userDetailsForm.status,
      username: `${this.props.userDetailsForm.firstName} ${this.props.userDetailsForm.lastName}`,
      parentId: this.props.userDetailsForm.manager,
      restricted: this.props.userDetailsForm.restricted,
    };
    this.setState({ isLoading: true });

    try {
      if (this.state.formType === 'edit-user') {
        await updateUser(updatePayload);
        UserControlModels.deleteAll();
        this.initialLoads(updatePayload.userId);
      } else {
        const response = await signup(createPayload);
        UserControlModels.deleteAll();
        this.initialLoads(response.data.userId);
        showMessageModal('User Created Successfully', 'success');
        this.setState({ formType: 'edit-user' });
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error?.response?.data
        ? error.response.data
        : 'Something went wrong. Please try again.';
      showMessageModal(errorMessage, 'error');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleUpdatePasswordSubmit = async () => {
    const payload = {
      userId: this.props.userDetailsForm.userId,
      loginname: this.props.userDetailsForm.loginname,
      pass: this.props.userDetailsForm.password,
      currentPass: this.props.userDetailsForm.currentPass,
    };

    try {
      this.setState({ isLoading: true });
      await updateUser(payload);
      showMessageModal('Password Updated Successfully!', 'success');
      UserControlModels.deleteAll();
      this.initialLoads(payload.userId);
      hideModal();
    } catch (error) {
      const updatePasswordError = error?.response?.data
        ? error.response.data
        : 'Password does not conform to our requirements.';
      showMessageModal(updatePasswordError, 'error');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleAddUserBtn = () => {
    this.setState({ formType: 'add-user', selectedUserId: null }, () => {
      this.props.resetUserFormValues();
      this.props.setUserFormInitialValues({
        type: this.props.userTypes[0]?.enumValue,
        status: 'Active'
      });
    });
  };

  showUpdatePasswordForm = (event) => {
    event.preventDefault();
    const updatePasswordForm = (
      <UpdatePasswordForm
        handleUpdatePasswordSubmit={this.handleUpdatePasswordSubmit}
      />
    );
    showAlert('Update Password', updatePasswordForm);
  };

  onRowsSelected = (rows) => {
    const selectedIndexes = {};
    rows.forEach((r) => {
      selectedIndexes[
        `${r.row.firstName || ''} ${r.row.lastName || ''}`
      ] = true;
    });
    this.setState(
      {
        selectedIndexes,
      },
      () => {
        this.handleUserSelection(rows[0].row.id);
      }
    );
  };

  onSearchChange = (searchValue) => {
    this.setState({ searchValue });
  };

  onGridSort = (sortColumn, sortDirection) => {
    this.setState({ sortColumn, sortDirection });
  };

  render() {
    const { users, userTypes, functionalTeams, roles, licenseTypes } =
      this.props;
    const {
      isLoading,
      selectedUserId,
      formType,
      selectedIndexes,
      searchValue,
    } = this.state;

    const selectedUser = this.props.userDetailsForm;
    const filteredUsers = users
      .filter((item) =>
        `${item.firstName} ${item.lastName}`
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase())
      )
      .sort((item1, item2) => {
        const { sortDirection, sortColumn } = this.state;
        let name1 = item1.authorized ? 'GMail auth set' : 'GMail auth not set';
        let name2 = item2.authorized ? 'GMail auth set' : 'GMail auth not set';

        if (sortColumn === 'fullName') {
          name1 = `${item1.firstName || ''} ${
            item1.lastName || ''
          }`.toLocaleLowerCase();
          name2 = `${item2.firstName || ''} ${
            item2.lastName || ''
          }`.toLocaleLowerCase();
        }

        if (sortDirection === 'ASC') {
          return name1 > name2 ? 1 : -1;
        } else if (sortDirection === 'DESC') {
          return name2 > name1 ? 1 : -1;
        }
        return 0;
      });
    const indexes = [
      filteredUsers.findIndex(
        (user) => user.userId === selectedUserId
        // selectedIndexes[`${user.firstName || ''} ${user.lastName || ''}`]
      ),
    ];
    return (
      <ErrorBoundary>
        <div className="user-administration-view">
          <MainPanel
            viewName="User Administration"
            icons={[Icons.MAINMENU]}
            handleIconClick={this.handleHeaderIconClick}
            viewHeader={
              <div className="container">
                <div className="title-label row">
                  <div className="col-8">
                    <p>User Administration</p>
                  </div>
                  <div className="col-4 text-right">
                    <button
                      className="add-user-btn btn btn-primary"
                      onClick={this.handleAddUserBtn}
                    >
                      Add New User
                    </button>
                  </div>
                </div>
              </div>
            }
          >
            <div className="container">
              <div className="row user-admin-tab">
                <div className="col-7">
                  <UserDetailsForm
                    formType={formType}
                    userId={selectedUser && selectedUser.userId}
                    username={
                      selectedUser &&
                      `${selectedUser.firstName || ''} ${
                        selectedUser.lastName || ''
                      }`
                    }
                    userTypes={userTypes}
                    functionalTeams={functionalTeams}
                    status={selectedUser && `${selectedUser.status}`}
                    restricted={selectedUser && selectedUser.restricted}
                    roles={roles}
                    users={users}
                    licenseTypes={licenseTypes}
                    selectedUser={selectedUser}
                    handleUserFormSubmit={this.handleUserFormSubmit}
                    showUpdatePasswordForm={this.showUpdatePasswordForm}
                    handleUpdatePasswordSubmit={this.handleUpdatePasswordSubmit}
                    getUploadedFileName={this.getUploadedUserFileName}
                  />
                </div>
                {this.state.formType !== 'add-user' && (
                  <div className="col-5">
                    {isLoading ? (
                      <div className="users-list-section">
                        <ul className="users-list">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
                            <li key={item}>
                              <TextBlock textLines={[91]} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <React.Fragment>
                        <SearchInput
                          value={this.state.searchValue}
                          onChange={this.onSearchChange}
                        />
                        <ReactDataGrid
                          columns={this.gridColumns}
                          rows={filteredUsers}
                          rowGetter={(index) => {
                            const user = filteredUsers[index];
                            if (user) {
                              user.fullName = `${user.firstName || ''} ${
                                user.lastName || ''
                              }`;
                            }
                            return user;
                          }}
                          rowsCount={filteredUsers.length}
                          rowHeight={50}
                          rowSelection={{
                            showCheckbox: true,
                            onRowsSelected: this.onRowsSelected,
                            selectBy: {
                              // indexes: selectedIndexes
                              indexes,
                            },
                          }}
                          onGridSort={this.onGridSort}
                        />
                      </React.Fragment>
                    )}
                  </div>
                )}
              </div>
            </div>
          </MainPanel>
        </div>
      </ErrorBoundary>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: UserControlModels.list().map((item) => item.props),
    functionalTeams: FunctionalTeamModels.list().map((item) => item.props),
    userTypes: UserTypeModels.list().map((item) => item.props),
    roles: UserRoleModels.list().map((item) => item.props),
    licenseTypes: LicenseTypeModels.list().map((item) => item.props),
    userDetailsForm: state.form.userDetails,

    // accounts: AccountsListModel.list().map(item => item.props),
    // accountDetailsForm: state.form.accountDetails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUserFormInitialValues: (values) =>
        actions.change('form.userDetails', values),
      resetUserFormValues: () => actions.reset('form.userDetails'),

      // setAccountFormInitialValues: values => actions.change('form.accountDetails', values),
      // resetAccountFormValues: () => actions.reset('form.accountDetails')
    },
    dispatch
  );
}

class AuthorizationStatusFormatter extends React.Component {
  render() {
    const { value } = this.props;
    if (value) {
      return (
        <span
          className="auth-set"
          style={{ fontSize: '13px', color: 'green', paddingTop: '3px' }}
        >
          GMail auth set
        </span>
      );
    }
    return (
      <span
        className="auth-unset"
        style={{ fontSize: '13px', color: 'red', paddingTop: '3px' }}
      >
        GMail auth not set
      </span>
    );
  }
}

class LoginNameFormatter extends React.Component {
  render() {
    const { value } = this.props;
    return <span>{`@${value || 'null'}`}</span>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAdministrationImpl);
