import React from 'react';
import {
  getAccountAndIndustryDetailsForFilters,
  getIndustryExceptionAccountListBean,
  getRegions,
  getTribylIndustries,
  getTribylMarkets,
  getNeedsReviewIndustryAccountList,
  addAccountIndustryToOverrideList,
  getIndustryMappingCounts,
} from '../../../../util/promises/meta-data-promise';
import { SingleSelect } from '../../../../_tribyl/components/_base/SingleSelect/SingleSelect';
import './AccountTribylIndustryMappingsTab.scss';

export class AccountTribylIndustryMappingsTab extends React.Component {
  statusOptions = [
    { id: null, value: 'All' },
    { id: 1, value: 'Needs Review' },
    { id: 2, value: 'Manual Override' },
  ];
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      accounts: [],
      industries: [],
      markets: [],
      regions: [],
      selectedFilterId: null,
      // selectedStatus: { id: null, value: 'All' },
      selectedStatus: { id: 1, value: 'Needs Review' },
      selectedIndustry: { id: null, value: 'All' },
      selectedMarket: { id: null, value: 'All' },
      selectedRegion: { id: null, value: 'All' },
      searchKeyword: '',
      mappingCounts: null,
    };
  }

  componentWillMount() {
    this.setState({ loading: true });
  }

  componentDidMount() {
    Promise.all([
      getTribylIndustries(),
      getTribylMarkets(),
      getRegions(),
      // getAccountAndIndustryDetailsForFilters()
      getNeedsReviewIndustryAccountList(),
      getIndustryMappingCounts(),
    ]).then((response) => {
      const industries = (response[0] && response[0].data) || [];
      const markets = (response[1] && response[1].data) || [];
      const regions = (response[2] && response[2].data) || [];
      const accounts = (response[3] && response[3].data) || [];
      const mappingCounts = response[4] && response[4].data;
      const marshalledIndustries = industries
        .map(({ qualifierId, value }) => ({ id: qualifierId, value }))
        .sort((a, b) =>
          a.value.toLowerCase().localeCompare(b.value.toLowerCase())
        );

      const marshalledMarkets = markets
        .map(({ qualifierId, value }) => ({ id: qualifierId, value }))
        .sort((a, b) =>
          a.value.toLowerCase().localeCompare(b.value.toLowerCase())
        );

      const marshalledRegions = regions
        .map(({ id, name }) => ({ id, value: name }))
        .sort((a, b) =>
          a.value.toLowerCase().localeCompare(b.value.toLowerCase())
        );

      const marshalledAccounts = this.marshallNeedsReviewAccounts(
        accounts,
        marshalledIndustries
      );

      this.setState({
        loading: false,
        accounts: [...marshalledAccounts],
        industries: [{ id: null, value: 'All' }, ...marshalledIndustries],
        markets: [{ id: null, value: 'All' }, ...marshalledMarkets],
        regions: [{ id: null, value: 'All' }, ...marshalledRegions],
        mappingCounts,
      });
    });
  }

  fetchFilteredAccounts = () => {
    const {
      industries = [],
      selectedStatus,
      selectedIndustry,
      selectedMarket,
      selectedRegion,
      searchKeyword,
    } = this.state;
    switch (selectedStatus.value) {
      case 'Manual Override':
        getIndustryExceptionAccountListBean().then((response) => {
          const accounts = response.data || [];
          const marshalledAccounts = this.marshallAccountsForStatusFilter(
            accounts,
            industries
          );
          this.setState({ loading: false, accounts: [...marshalledAccounts] });
        });
        break;
      case 'Needs Review':
        getNeedsReviewIndustryAccountList().then((response) => {
          const accounts = response.data || [];
          const marshalledAccounts = this.marshallNeedsReviewAccounts(
            accounts,
            industries
          );
          this.setState({ loading: false, accounts: [...marshalledAccounts] });
        });
        break;
      default:
        getAccountAndIndustryDetailsForFilters({
          accountName: searchKeyword,
          selectedIndustry,
          selectedMarket,
          selectedRegion,
        }).then((response) => {
          const accounts = response.data || [];
          const marshalledAccounts = this.marshallAccounts(
            accounts,
            industries
          );
          this.setState({ loading: false, accounts: [...marshalledAccounts] });
        });
        break;
    }
  };

  // updateIndustryValue = (payload) => {
  //     console.log('updateIndustryValue payload: ');
  //     console.log(payload);
  //     updateIndustryExceptionAccountList(payload)
  //         then((response) => {
  //             console.log('updateIndustryValue response: ');
  //             console.log(response);
  //         });
  // }

  marshallAccountsForStatusFilter = (accounts, industries) => {
    // "industryExceptionAccountId": 3,
    // "crmAccountId": "0011U000004tqUJQAY",
    // "accountId18Char": null,
    // "accountName": "Workday",
    // "accountOwner": null,
    // "bdrName": null,
    // "tribylIndustry": "Healthcare",
    // "tribylAccountId": 30
    return accounts.map((account) => {
      return {
        accountId:
          (account.tribylAccountId && account.tribylAccountId) || account.id,
        salesforceId: {
          id: account.cRMAccountId,
          displayValue: account.cRMAccountId,
        },
        accountName: {
          displayValue: (account && account.accountName) || account.name || '',
        },
        region: (account.region && {
          id: account.region.id,
          displayValue: account.region.name || 'N/A',
        }) || { id: null, displayValue: 'N/A' },
        segment: (account.marketSegment && {
          id: account.marketSegment.id,
          displayValue: account.marketSegment.value || 'N/A',
        }) || { id: null, displayValue: 'N/A' },
        crmIndustry: { displayValue: account.cRMIndustryName || '' },
        tribylIndustry: {
          id:
            (account && account.industry && account.industry.id) ||
            (account && account.tribylAccountId) ||
            null,
          displayValue:
            (account && account.industry && account.industry.value) ||
            (account && account.tribylIndustry) ||
            null,
          value: {
            id:
              (account && account.industry && account.industry.id) ||
              (account && account.tribylAccountId) ||
              null,
            value:
              (account && account.industry && account.industry.value) ||
              (account && account.tribylIndustry) ||
              null,
          },
          options: industries,
          onSelect: (option) => {
            const payload = {
              // eslint-disable-line
              accountId18Char: account.accountBean && account.accountBean.id,
              tribylAccountId: account.accountBean && account.accountBean.id,
              tribylIndustryQualifierId: option.id,
              tribylIndustry: option.value,
              crmAccountId: account.cRMIndustryId,
            };
            // this.updateIndustryValue(payload);
          },
        },
        status: { displayValue: account.accountStatus || 'N/A' },
        lastUpdated: {
          displayValue:
            (account.lastUpdateDateForAccountIndustryRel &&
              new Date(
                account.lastUpdateDateForAccountIndustryRel
              ).toLocaleDateString()) ||
            'N/A',
        },
        previousValue: {
          id: account.mappedIndustryIdManuallyOverridden,
          value: account.mappedIndustryValueManuallyOverridden,
        },
      };
    });
  };
  marshallNeedsReviewAccounts = (accounts, industries) => {
    return accounts.map((account) => {
      return {
        accountId:
          (account.tribylAccountId && account.tribylAccountId) || account.id,
        salesforceId: {
          id: account.crmAccountId,
          displayValue: account.crmAccountId,
        },
        accountName: {
          displayValue: (account && account.accountName) || account.name || '',
        },
        region: (account.region && {
          id: account.region.id,
          displayValue: account.region.name || 'N/A',
        }) || { id: null, displayValue: 'N/A' },
        segment: (account.marketSegment && {
          id: account.marketSegment.id,
          displayValue: account.marketSegment.value || 'N/A',
        }) || { id: null, displayValue: 'N/A' },
        crmIndustry: { displayValue: account.cRMIndustryName || '' },
        tribylIndustry: {
          id:
            (account && account.industry && account.industry.id) ||
            (account && account.tribylAccountId) ||
            null,
          displayValue:
            (account && account.industry && account.industry.value) ||
            (account && account.tribylIndustry) ||
            null,
          value: {
            id:
              (account && account.industry && account.industry.id) ||
              (account && account.tribylAccountId) ||
              null,
            value:
              (account && account.industry && account.industry.value) ||
              (account && account.tribylIndustry) ||
              null,
          },
          options: industries,
          onSelect: (option) => {
            const payload = {
              // eslint-disable-line
              accountId18Char: account.accountBean && account.accountBean.id,
              tribylAccountId: account.accountBean && account.accountBean.id,
              tribylIndustryQualifierId: option.id,
              tribylIndustry: option.value,
              crmAccountId: account.cRMIndustryId,
            };
            // this.updateIndustryValue(payload);
          },
        },
        status: { displayValue: account.accountStatus || 'N/A' },
        lastUpdated: {
          displayValue:
            (account.lastUpdateDateForAccountIndustryRel &&
              new Date(
                account.lastUpdateDateForAccountIndustryRel
              ).toLocaleDateString()) ||
            'N/A',
        },
        previousValue: {
          id: account.mappedIndustryIdManuallyOverridden,
          value: account.mappedIndustryValueManuallyOverridden,
        },
      };
    });
  };
  marshallAccounts = (accounts, industries) => {
    return accounts.map(
      ({
        cRMAccountId,
        cRMIndustryName,
        accountBean,
        tribylIndustrySelectionBean,
        lastUpdateDateForAccountIndustryRel,
        accountStatus,
      }) => {
        return {
          accountId: accountBean && accountBean.id,
          salesforceId: { id: cRMAccountId, displayValue: cRMAccountId },
          accountName: {
            displayValue: (accountBean && accountBean.name) || '',
          },
          region: {
            id: accountBean && accountBean.region && accountBean.region.id,
            displayValue:
              (accountBean && accountBean.region && accountBean.region.name) ||
              '',
          },
          segment: {
            id:
              accountBean &&
              accountBean.marketSegment &&
              accountBean.marketSegment.id,
            displayValue:
              (accountBean &&
                accountBean.marketSegment &&
                accountBean.marketSegment.value) ||
              '',
          },
          crmIndustry: { displayValue: cRMIndustryName || '' },
          tribylIndustry:
            accountStatus === 'manual override'
              ? {
                  id:
                    tribylIndustrySelectionBean &&
                    tribylIndustrySelectionBean.id,
                  uniqueId: accountBean && accountBean.id,
                  displayValue:
                    (tribylIndustrySelectionBean &&
                      tribylIndustrySelectionBean.value) ||
                    '',
                  value: {
                    id:
                      (tribylIndustrySelectionBean &&
                        tribylIndustrySelectionBean.id) ||
                      null,
                    value:
                      (tribylIndustrySelectionBean &&
                        tribylIndustrySelectionBean.value) ||
                      '',
                  },
                  options: industries,
                  onSelect: (option) => {
                    const payload = {
                      // eslint-disable-line
                      tribylAccountId: accountBean && accountBean.id,
                      tribylIndustryQualifierId: option.id,
                      tribylIndustry: option.value,
                    };
                    // this.updateIndustryValue(payload);
                  },
                }
              : {
                  id:
                    accountBean &&
                    accountBean.industry &&
                    accountBean.industry.id,
                  uniqueId: accountBean && accountBean.id,
                  displayValue:
                    (accountBean &&
                      accountBean.industry &&
                      accountBean.industry.value) ||
                    '',
                  value: {
                    id:
                      (accountBean &&
                        accountBean.industry &&
                        accountBean.industry.id) ||
                      null,
                    value:
                      (accountBean &&
                        accountBean.industry &&
                        accountBean.industry.value) ||
                      '',
                  },
                  options: industries,
                  onSelect: (option) => {
                    const payload = {
                      // eslint-disable-line
                      tribylAccountId: accountBean && accountBean.id,
                      tribylIndustryQualifierId: option.id,
                      tribylIndustry: option.value,
                    };
                    // this.updateIndustryValue(payload);
                  },
                },
          status: { displayValue: accountStatus || 'N/A' },
          lastUpdated: {
            displayValue:
              (lastUpdateDateForAccountIndustryRel &&
                new Date(
                  lastUpdateDateForAccountIndustryRel
                ).toLocaleDateString()) ||
              'N/A',
          },
        };
      }
    );
  };

  gridSort = (sortColumn, sortDirection) => {
    this.setState({ rows: this.alphabeticalSorter(sortColumn, sortDirection) });
  };

  alphabeticalSorter = (column, direction) => {
    const comparer = (a, b) => {
      if (direction === 'ASC') {
        return a[column].displayValue.toLowerCase() >
          b[column].displayValue.toLowerCase()
          ? 1
          : -1;
      } else if (direction === 'DESC') {
        return a[column].displayValue.toLowerCase() <
          b[column].displayValue.toLowerCase()
          ? 1
          : -1;
      }
      return 0;
    };
    return comparer;
  };

  getFilteredAccounts = (
    accounts,
    selectedStatus,
    selectedIndustry,
    selectedMarket,
    selectedRegion
  ) => {
    const filteredAccounts = accounts.filter(
      ({ planOrEditFlag, tribylIndustry = {}, segment = {}, region = {} }) => {
        let pass = true;
        if (selectedStatus && selectedStatus.id !== null) {
          if (
            selectedStatus.value === 'Needs Review' &&
            planOrEditFlag !== 'plan'
          )
            pass = false;
          if (
            selectedStatus.value === 'Manual Override' &&
            planOrEditFlag !== 'edit'
          )
            pass = false;
        }
        if (
          selectedIndustry &&
          selectedIndustry.id !== null &&
          tribylIndustry.id !== selectedIndustry.id
        )
          pass = false;
        if (
          selectedMarket &&
          selectedMarket.id !== null &&
          segment.id !== selectedMarket.id
        )
          pass = false;
        if (
          selectedRegion &&
          selectedRegion.id !== null &&
          region.id !== selectedRegion.id
        )
          pass = false;
        return pass;
      }
    );
    return filteredAccounts;
  };

  handleStatusSelect = (option) => {
    this.setState(
      {
        accounts: [],
        loading: true,
        selectedFilterId: option.id,
        selectedStatus: option,
      },
      () => this.fetchFilteredAccounts()
    );
  };

  handleIndustrySelect = (option) => {
    this.setState(
      {
        accounts: [],
        loading: true,
        selectedFilterId: option.id,
        selectedIndustry: option,
      },
      () => this.fetchFilteredAccounts()
    );
  };

  handleMarketSelect = (option) => {
    this.setState(
      {
        accounts: [],
        loading: true,
        selectedFilterId: option.id,
        selectedMarket: option,
      },
      () => this.fetchFilteredAccounts()
    );
  };

  handleRegionSelect = (option) => {
    this.setState(
      {
        accounts: [],
        loading: true,
        selectedFilterId: option.id,
        selectedRegion: option,
      },
      () => this.fetchFilteredAccounts()
    );
  };

  handleSearchInput = (value) => {
    this.setState(
      {
        accounts: [],
        loading: true,
        searchKeyword: value,
      },
      () => this.fetchFilteredAccounts()
    );
  };

  handleFilterReset = () => {
    this.setState(
      {
        accounts: [],
        loading: true,
        selectedFilterId: null,
        selectedStatus: { id: null, value: 'All' },
        selectedIndustry: { id: null, value: 'All' },
        selectedMarket: { id: null, value: 'All' },
        selectedRegion: { id: null, value: 'All' },
      },
      () => this.fetchFilteredAccounts()
    );
  };

  handleIndustryExceptionMapping = (account, option) => {
    addAccountIndustryToOverrideList(account.accountId, option.id).then(() => {
      getIndustryMappingCounts().then((res) =>
        this.setState({ mappingCounts: res.data })
      );
    });
  };

  render() {
    const {
      loading,
      accounts,
      industries,
      markets,
      regions,
      selectedFilterId,
      selectedStatus,
      selectedIndustry,
      selectedMarket,
      selectedRegion,
      searchKeyword,
      mappingCounts,
    } = this.state;
    const filteredAccounts = accounts.filter((account) =>
      (
        (account.accountBean && account.accountBean.name.displayValue) ||
        account.accountName.displayValue ||
        account.name.displayValue
      )
        .toLocaleLowerCase()
        .includes(searchKeyword.toLocaleLowerCase())
    );
    return (
      <div className="account-tribyl-industry-exception-wrapper">
        <div className="filter-toolbar">
          <div className="d-flex">
            <div className="filter-group">
              <div className="filter-wrapper">
                <label>Status</label>
                <SingleSelect
                  value={selectedStatus}
                  options={this.statusOptions}
                  disabled={selectedStatus.id !== selectedFilterId}
                  onSelect={this.handleStatusSelect}
                  onReset={this.handleFilterReset}
                />
              </div>
              <div className="filter-wrapper">
                <label>Tribyl Industry</label>
                <SingleSelect
                  value={selectedIndustry}
                  options={industries}
                  disabled={selectedIndustry.id !== selectedFilterId}
                  onSelect={this.handleIndustrySelect}
                  onReset={this.handleFilterReset}
                />
              </div>
              <div className="filter-wrapper">
                <label>Market</label>
                <SingleSelect
                  value={selectedMarket}
                  options={markets}
                  disabled={selectedMarket.id !== selectedFilterId}
                  onSelect={this.handleMarketSelect}
                  onReset={this.handleFilterReset}
                />
              </div>
              <div className="filter-wrapper">
                <label>Region</label>
                <SingleSelect
                  value={selectedRegion}
                  options={regions}
                  disabled={selectedRegion.id !== selectedFilterId}
                  onSelect={this.handleRegionSelect}
                  onReset={this.handleFilterReset}
                />
              </div>
            </div>
            <div className="mapping-count-box">
              <p>
                Total accounts:{' '}
                {mappingCounts && (mappingCounts.totalAccounts || 0)}
              </p>
              <p>
                Mapping failed accounts:{' '}
                {mappingCounts && (mappingCounts.mappingFailedAccounts || 0)}
              </p>
              <p>
                Manually overridden accounts:{' '}
                {mappingCounts &&
                  (mappingCounts.manuallyOverriddenAccounts || 0)}
              </p>
            </div>
          </div>
          <div className="searchbar-section">
            <label>Search account</label>
            <br />
            <input
              type="text"
              className="form-control"
              placeholder="Account name"
              value={searchKeyword}
              onChange={(e) => this.handleSearchInput(e.target.value)}
            />
            {searchKeyword.length < 1 ? (
              <i className="material-icons">search</i>
            ) : (
              <i
                className="material-icons close-icon"
                onClick={() => this.handleSearchInput('')}
                role="button"
              >
                close
              </i>
            )}
          </div>
        </div>
        {loading && <div className="loading">Loading accounts...</div>}
        {!loading && accounts && accounts.length === 0 && (
          <div className="no-records">No records found</div>
        )}
        <table className="account-tribyl-industry-exception-table">
          <thead>
            <tr>
              <th>Salesforce ID</th>
              <th>Account Name</th>
              <th>Region</th>
              <th>Segment</th>
              <th>CRM Industry</th>
              <th className="single-select-column">Tribyl Industry</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account, accountIdx) => {
              return (
                <tr key={`industry-${accountIdx}`}>
                  <td>
                    <div className="table-cell-text-value">
                      {account.salesforceId.displayValue}
                    </div>
                  </td>
                  <td>
                    <div className="table-cell-text-value">
                      {account.accountName.displayValue}
                    </div>
                  </td>
                  <td>
                    <div className="table-cell-text-value">
                      {account.region.displayValue}
                    </div>
                  </td>
                  <td>
                    <div className="table-cell-text-value">
                      {account.segment.displayValue}
                    </div>
                  </td>
                  <td>
                    <div className="table-cell-text-value">
                      {account.crmIndustry.displayValue}
                    </div>
                  </td>
                  <td className="single-select-column">
                    <div className="table-cell-single-select-value">
                      <SingleSelect
                        value={account.tribylIndustry.value}
                        options={industries}
                        previousValue={
                          account.previousValue !== undefined &&
                          account.previousValue
                        }
                        onSelect={(option) =>
                          this.handleIndustryExceptionMapping(account, option)
                        }
                      />
                      {/* <SingleSelectFormatter 
                                                    value={account.tribylIndustry}
                                                    onSelect={option => this.handleIndustryExceptionMapping(account, option)} /> */}
                    </div>
                  </td>
                  <td>
                    <div className="table-cell-text-value text-capitalize">
                      {account.status.displayValue}
                    </div>
                  </td>
                  <td>
                    <div className="table-cell-text-value">
                      {account.lastUpdated.displayValue}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
