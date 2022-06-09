import React, { Component } from 'react';
import './IndustryMappingList.scss';
import { CheckBox } from '../../../../../basecomponents/CheckBox/CheckBox';

export class IndustryMappingList extends Component {
  searchInput = React.createRef();
  state = { searchString: null };

  handleSearchChange = (e) => {
    const searchString = e.target.value;
    this.setState({ searchString });
  };

  clearSearch = () => {
    this.setState({ searchString: null }, () => {
      this.searchInput.current.value = '';
    });
  };

  submitSearch = () => {
    console.log('submit search clicked !'); // eslint-disable-line
  };

  checkboxClicked = (industry) => {
    const { currentIndustry } = this.props;
    if (
      currentIndustry &&
      industry.qualifierRelBeans &&
      industry.qualifierRelBeans.find(
        (bean) => bean.qualifierId === currentIndustry.qualifierId
      )
    ) {
      this.handleIndustryRemoveMapping(industry);
    } else this.handleIndustryAddMapping(industry);
  };

  handleIndustryAddMapping = (industry) => {
    const { createMapping } = this.props;
    createMapping(industry);
  };

  handleIndustryRemoveMapping = (industry) => {
    const { removeMapping } = this.props;
    removeMapping(industry);
  };

  renderCRM = () =>{
    const { searchString } = this.state; 
    return (
      <div className="crm-industries-header">
      <h2>CRM Industries</h2>
      <div
        className={`searchStringWrapper ${
          searchString ? 'active-search' : ''
        }`}
      >
        <input
          ref={this.searchInput}
          className="search-transcript-text-control"
          type="search"
          placeholder="Search Industries..."
          onChange={this.handleSearchChange}
          onKeyDown={this.submitSearch}
        />
        <i
          className="material-icons searchbar-icon"
          role="button"
          onClick={this.submitSearch}
        >
          search
        </i>
        {searchString && (
          <i
            className="material-icons searchButton clear"
            role="button"
            onClick={this.clearSearch}
          >
            clear
          </i>
        )}
      </div>
    </div>
    )
  }

  renderIndustry = () =>{
    const { currentIndustry } = this.props;
    return (
      <React.Fragment>
      <h2>Mapped Industries</h2>
        <h3>
          {currentIndustry && currentIndustry.qualifierId
            ? currentIndustry.value
            : 'No Industry Selected'}
        </h3>
        <div className="mapped-crm-industries-list">
          {currentIndustry &&
            (industries.filter(
              (industry) =>
                industry.qualifierRelBeans &&
                industry.qualifierRelBeans.find(
                  (bean) => bean.qualifierId === currentIndustry.qualifierId
                )
            ).length > 0 ? (
              <ul>
                {industries
                  .filter(
                    (industry) =>
                      industry.qualifierRelBeans &&
                      industry.qualifierRelBeans.find(
                        (bean) =>
                          bean.qualifierId === currentIndustry.qualifierId
                      )
                  )
                  .map((industry, industryIdx) => {
                    return (
                      <li key={`industries-${industryIdx}`}>
                        <div className="text-display">
                          {industry.value}
                          <i
                            role="button"
                            className="material-icons grey"
                            onClick={() =>
                              this.handleIndustryRemoveMapping(industry)
                            }
                          >
                            delete
                          </i>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <span className="no-results">No mappings found</span>
            ))}
        </div> 
        </React.Fragment>
    )
  }

  render() {
    const { industries, currentIndustry } = this.props;
    const { searchString } = this.state;
    return (
      <div className="mapped-crm-industries-list-wrapper crm-mappings">
      {/* {this.renderIndustry()} */}
      {this.renderCRM()}
        <div className="all-crm-industries-list">
          <span className="list-header">Not Mapped: </span>
          <ul>
            {industries
              .filter((industry) => {
                return searchString
                  ? industry.value
                      .toLowerCase()
                      .includes(searchString.toLowerCase()) &&
                      (!industry.qualifierRelBeans ||
                        !industry.qualifierRelBeans.length > 0)
                  : !industry.qualifierRelBeans ||
                      !industry.qualifierRelBeans.length > 0;
              })
              .map((industry, industryIdx) => {
                const isMappedToThisQualifier =
                  currentIndustry &&
                  industry.qualifierRelBeans &&
                  industry.qualifierRelBeans.find(
                    (bean) => bean.qualifierId === currentIndustry.qualifierId
                  );
                const isMappedToAnotherQualifier =
                  currentIndustry &&
                  industry.qualifierRelBeans &&
                  industry.qualifierRelBeans.length > 0 &&
                  !industry.qualifierRelBeans.find(
                    (bean) => bean.qualifierId === currentIndustry.qualifierId
                  );
                return (
                  <li key={`crm-industries-list-${industryIdx}`}>
                    <div className="text-display">
                      <CheckBox
                        disabled={
                          !currentIndustry || isMappedToAnotherQualifier
                        }
                        isChecked={isMappedToThisQualifier}
                        onChange={() => this.checkboxClicked(industry)}
                      />
                      <span
                        className={`industry-value ${
                          !currentIndustry || isMappedToAnotherQualifier
                            ? 'disable'
                            : ''
                        }`}
                      >
                        {industry.value}
                      </span>
                    </div>
                  </li>
                );
              })}
          </ul>
          <span className="list-header">In-use: </span>
          <ul>
            {industries
              .filter((industry) => {
                return searchString
                  ? industry.value
                      .toLowerCase()
                      .includes(searchString.toLowerCase()) &&
                      industry.qualifierRelBeans &&
                      industry.qualifierRelBeans.length > 0
                  : industry.qualifierRelBeans &&
                      industry.qualifierRelBeans.length > 0;
              })
              .map((industry, industryIdx) => {
                const isMappedToThisQualifier =
                  currentIndustry &&
                  industry.qualifierRelBeans &&
                  industry.qualifierRelBeans.find(
                    (bean) => bean.qualifierId === currentIndustry.qualifierId
                  );
                const isMappedToAnotherQualifier =
                  currentIndustry &&
                  industry.qualifierRelBeans &&
                  industry.qualifierRelBeans.length > 0 &&
                  !industry.qualifierRelBeans.find(
                    (bean) => bean.qualifierId === currentIndustry.qualifierId
                  );
                return (
                  <li key={`industry-qualifier-${industryIdx}`}>
                    <div className="text-display">
                      <CheckBox
                        disabled={
                          !currentIndustry || isMappedToAnotherQualifier
                        }
                        isChecked={isMappedToThisQualifier}
                        onChange={() => this.checkboxClicked(industry)}
                      />
                      <span
                        className={`industry-value ${
                          !currentIndustry || isMappedToAnotherQualifier
                            ? 'disable'
                            : ''
                        }`}
                      >
                        {industry.value}
                      </span>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
}
