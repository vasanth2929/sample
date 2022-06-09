/* eslint-disable no-underscore-dangle,no-new */
import React, { PureComponent } from 'react';
import { actions } from 'react-redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextBlock } from 'react-placeholder-shimmer';

// import sub-components
import { MainPanel } from '../../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import { AccountDetailsForm } from './containers/AccountDetailsForm/AccountDetailsForm';
import { AccountsList } from './containers/AccountsList/AccountsList';
import { Icons } from '../../../constants/general';

import '../../Playbooks/styles/Playbooks.style.scss';
import './styles/AccountAdministration.style.scss';

// import data
import {
  getAccountsList,
  getAccount,
  updateAccount,
} from '../../../util/promises/mystories_promise';
import { AccountsListModel } from '../../../model/userControlModels/UserControlModels';
import { isEmpty } from '../../../util/utils';

class AccountAdministrationImpl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      selectedAccountId: null,
    };
  }

  componentWillMount() {
    this.initialLoads();
  }

  async getAccountsList(selectedAccountId) {
    const response = await getAccountsList();

    if (response && !isEmpty(response.date)) {
      const accounts = response.data
        .sort((a, b) => a.id - b.id)
        .map(
          (account) => new AccountsListModel({ id: account.id, ...account })
        );
      AccountsListModel.saveAll(accounts);
      this.setState(
        {
          isLoading: false,
          selectedAccountId:
            selectedAccountId ||
            response.data.sort((a, b) => a.id - b.id)[0].id,
        },
        () => {
          this.getAccountDetails(this.state.selectedAccountId);
        }
      );
    } else {
      this.setState({ isLoading: false });
    }
  }

  async getAccountDetails(selectedAccountId) {
    const response = await getAccount(selectedAccountId);
    this.props.setAccountFormInitialValues({
      id: response.data.id,
      name: response.data.name,
      icon: response.data.icon,
    });
  }

  getUploadedAccountFileName = () => {
    this.getAccountDetails(this.state.selectedAccountId);
  };

  initialLoads = (selectedAccountId) => {
    this.getAccountsList(selectedAccountId);
  };

  handleHeaderIconClick = (action) => {
    switch (action) {
      default:
        break;
    }
  };

  handleAccountSelection = (selectedAccountId) => {
    this.setState({ selectedAccountId }, () =>
      this.getAccountDetails(this.state.selectedAccountId)
    );
  };

  handleAccountFormSubmit = () => {
    const payload = {
      id: this.state.selectedAccountId,
      name: this.props.accountDetailsForm.name,
      iconFile: this.props.accountDetailsForm.icon,
    };
    updateAccount(payload).then((response) => {
      this.getAccountsList(response.data.id);
    });
  };

  render() {
    const { accounts } = this.props;
    const { isLoading, selectedAccountId } = this.state;
    const selectedAccount = this.props.accountDetailsForm;
    return (
      <ErrorBoundary>
        <div className="account-administration-view">
          <MainPanel
            viewName="Account Administration"
            icons={[Icons.MAINMENU]}
            handleIconClick={this.handleHeaderIconClick}
            viewHeader={
              <div className="container">
                <div className="title-label row">
                  <div className="col-8">
                    <p>Account Administration</p>
                  </div>
                </div>
              </div>
            }
          >
            <div className="container">
              <div className="row account-admin-tab">
                <div className="col-8">
                  <AccountDetailsForm
                    accountId={selectedAccount && selectedAccount.Id}
                    accountname={
                      selectedAccount && `${selectedAccount.name || ''}`
                    }
                    selectedAccount={selectedAccount}
                    handleAccountFormSubmit={this.handleAccountFormSubmit}
                    getUploadedFileName={this.getUploadedAccountFileName}
                  />
                </div>
                <div className="col-4">
                  {isLoading ? (
                    <div className="accounts-list-section">
                      <ul className="accounts-list">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
                          <li key={item}>
                            <TextBlock textLines={[91]} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <AccountsList
                      isLoading={isLoading}
                      selectedAccountId={selectedAccountId}
                      handleAccountSelection={this.handleAccountSelection}
                      accounts={accounts}
                    />
                  )}
                </div>
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
    accounts: AccountsListModel.list().map((item) => item.props),
    accountDetailsForm: state.form.accountDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setAccountFormInitialValues: (values) =>
        actions.change('form.accountDetails', values),
      resetAccountFormValues: () => actions.reset('form.accountDetails'),
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountAdministrationImpl);
