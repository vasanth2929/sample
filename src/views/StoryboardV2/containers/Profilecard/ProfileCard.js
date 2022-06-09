/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-quotes */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable no-tabs */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import profileImage from '../../../../assets/images/dummy_account.png';
import { Label } from '../../../../basecomponents/Label/Label';
import './styles/ProfileCard.styles.scss';
import classnames from 'classnames';
import { SanitizeUrl } from '../../../../util/utils';

export class ProfileCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dirty: false,
      customerUpdatedDetails: props.customerDetails,
    };
  }

  getLogo = (icon) => {
    let accountImage;
    try {
      accountImage =
        icon === '' || icon === null
          ? `${profileImage}`
          : SanitizeUrl(`tribyl/api/photo?location=${SanitizeUrl(icon)}`);
    } catch (error) {
      accountImage = `${profileImage}`;
    }
    return accountImage;
  };

  handleUpdateProfile = () => {
    const { isEditing } = this.props;
    const { customerDetails } = this.props;
    this.setState({
      dirty: false,
      isEditing: !isEditing,
      customerUpdatedDetails: customerDetails,
    });
  };

  handleValueChange = ({ target }) => {
    const { customerUpdatedDetails } = this.state;
    this.setState({
      dirty: true,
      customerUpdatedDetails: {
        ...customerUpdatedDetails,
        [target.id]: target.value,
      },
    });
  };

  handleProfileCancel = () => {
    this.setState({ isEditing: false, customerUpdatedDetails: {} });
  };

  handleProfileSave = async () => {
    await this.props.handleProfileSave(this.state.customerUpdatedDetails);
    this.setState({
      dirty: false,
      isEditing: false,
      customerUpdatedDetails: {},
    });
  };

  renderEditMode = () => {
    const {
      customerDetails: {
        custDescription,
        custQuote,
        employees,
        icon,
        industry,
        location,
        name,
      },
    } = this.props;
    const { dirty } = this.state;
    const secondary = this.props.style === 'secondary';
    return secondary ? (
      <div className={'profile-card-component-secondary'}>
        <div className={'profile-card-component-secondary-header'}>
          <div className={'profile-card-component-secondary-header-title'}>
            CUSTOMER PROFILE
          </div>
          <div
            className={'profile-card-component-secondary-header-actions'}
          ></div>
        </div>
        <div className={'profile-card-component-secondary-account-info'}>
          <div
            className={`profile-card-component-secondary-account-info-letter edit-mode letter-background-${
              ('abcdefghijklmnopqrstuvwxyz'.indexOf(
                name ? name.slice(1, 2) : 'b'
              ) %
                4) +
              1
            }`}
          >
            {'A'}
          </div>
          <div
            className={
              'profile-card-component-secondary-account-info-labels edit-mode'
            }
          >
            <div
              className={
                'profile-card-component-secondary-account-info-labels-label'
              }
            >
              Name:
            </div>
            <div
              className={
                'profile-card-component-secondary-account-info-labels-label'
              }
            >
              Industry:
            </div>
            <div
              className={
                'profile-card-component-secondary-account-info-labels-label'
              }
            >
              Location:
            </div>
          </div>
          <div className={'profile-card-component-secondary-account-info-data'}>
            <input
              className={classnames(
                'profile-card-component-secondary-account-info-data-input',
                'form-control',
                'name-field'
              )}
              id={'name'}
              type={'text'}
              defaultValue={name}
              onChange={this.handleValueChange}
            />
            <input
              className={classnames(
                'profile-card-component-secondary-account-info-data-input',
                'form-control',
                'industry-field'
              )}
              id={'industry'}
              type={'text'}
              defaultValue={industry}
              onChange={this.handleValueChange}
            />
            <input
              className={classnames(
                'profile-card-component-secondary-account-info-data-input',
                'form-control',
                'location-field'
              )}
              id={'location'}
              type={'text'}
              defaultValue={location}
              onChange={this.handleValueChange}
            />
          </div>
        </div>
        <div className={'profile-card-component-secondary-divider'}></div>
        <div className={'profile-card-component-secondary-profile-content'}>
          <div
            className={'profile-card-component-secondary-profile-content-label'}
          >
            Customer Description:
          </div>
          <textarea
            id="custDescription"
            rows="4"
            className="form-control description-field"
            defaultValue={custDescription}
            onChange={this.handleValueChange}
          />
        </div>
        <div className={'profile-card-component-secondary-profile-content'}>
          <div
            className={'profile-card-component-secondary-profile-content-label'}
          >
            Customer Quote:
          </div>
          <textarea
            id="custQuote"
            rows="4"
            className="form-control quote-field"
            defaultValue={custQuote}
            onChange={this.handleValueChange}
          />
        </div>
        {dirty && (
          <div className={'secondary-save-button-wrapper'}>
            <button
              className="submit-btn btn secondary-cancel-button"
              onClick={this.handleProfileCancel}
            >
              Cancel
            </button>
            <button
              className="submit-btn btn secondary-save-button primary"
              onClick={this.handleProfileSave}
            >
              Save
            </button>
          </div>
        )}
      </div>
    ) : (
      <div className="profile-card-component profile-update-form">
        <div className="header">
          CUSTOMER PROFILE
          <i
            role="button"
            onClick={this.handleUpdateProfile}
            className="material-icons"
          >
            close
          </i>
        </div>
        <div className="card-container">
          <div className="row">
            <div
              className={classnames('col-7', {
                'profile-card-section': secondary,
              })}
            >
              <div
                className={classnames({
                  'profile-card-section-label': secondary,
                })}
              >
                <b
                  className={classnames({
                    'profile-card-section-label': secondary,
                  })}
                >
                  Name:
                </b>{' '}
                {name}
              </div>
              <div>
                <b
                  className={classnames({
                    'profile-card-section-label': secondary,
                  })}
                >
                  Industry:
                </b>
                <input
                  id="industry"
                  type="text"
                  className="form-control industry-field"
                  defaultValue={industry}
                  onChange={this.handleValueChange}
                />
              </div>
              <div>
                <b>Employees:</b>
                <input
                  id="employees"
                  type="text"
                  className="form-control employees-field"
                  defaultValue={employees}
                  onChange={this.handleValueChange}
                />
              </div>
              <div>
                <b>Location:</b>
                <input
                  id="location"
                  type="text"
                  className="form-control location-field"
                  defaultValue={location}
                  onChange={this.handleValueChange}
                />
              </div>
            </div>
            <div className="col-5">
              <img
                width="100"
                height="100"
                className="img-wrap"
                src={this.getLogo(icon)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${profileImage}`;
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Label labelData="Customer Description:" labelClass="heading" />
              <textarea
                id="custDescription"
                rows="4"
                className="form-control description-field"
                defaultValue={custDescription}
                onChange={this.handleValueChange}
              />
              <div className="quotation">
                <Label labelData="Customer Quote:" labelClass="heading" />
                <textarea
                  id="custQuote"
                  rows="3"
                  className="form-control quote-field"
                  defaultValue={custQuote}
                  onChange={this.handleValueChange}
                />
              </div>
            </div>
          </div>
          {this.props.errorMessage && (
            <div className="alert alert-danger" role="alert">
              {this.props.errorMessage}
            </div>
          )}
          <button
            className="submit-btn btn float-right primary"
            onClick={this.handleProfileSave}
          >
            Save
          </button>
          <button
            className="submit-btn btn float-right"
            onClick={this.handleProfileCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  renderViewMode = () => {
    const {
      customerDetails: {
        custDescription,
        custQuote,
        employees,
        icon,
        industry,
        location,
        name,
      },
      isStoryDisabled,
      style,
    } = this.props;

    return style === 'secondary' ? (
      <div className={'profile-card-component-secondary'}>
        <div className={'profile-card-component-secondary-header'}>
          <div className={'profile-card-component-secondary-header-title'}>
            CUSTOMER PROFILE
          </div>
          <div
            className={'profile-card-component-secondary-header-actions'}
          ></div>
        </div>
        <div className={'profile-card-component-secondary-account-info'}>
          <div
            className={`profile-card-component-secondary-account-info-letter letter-background-${
              ('abcdefghijklmnopqrstuvwxyz'.indexOf(
                name ? name.slice(1, 2) : 'b'
              ) %
                4) +
              1
            }`}
          >
            {'A'}
          </div>
          <div
            className={'profile-card-component-secondary-account-info-labels'}
          >
            <div
              className={
                'profile-card-component-secondary-account-info-labels-label'
              }
            >
              Name:
            </div>
            <div
              className={
                'profile-card-component-secondary-account-info-labels-label'
              }
            >
              Industry:
            </div>
            <div
              className={
                'profile-card-component-secondary-account-info-labels-label'
              }
            >
              Employees:
            </div>
            <div
              className={
                'profile-card-component-secondary-account-info-labels-label'
              }
            >
              Location:
            </div>
          </div>
          <div className={'profile-card-component-secondary-account-info-data'}>
            <div
              className={
                'profile-card-component-secondary-account-info-data-value'
              }
            >
              {name}
            </div>
            <div
              className={
                'profile-card-component-secondary-account-info-data-value'
              }
            >
              {industry}
            </div>
            <div
              className={
                'profile-card-component-secondary-account-info-data-value'
              }
            >
              {employees}
            </div>
            <div
              className={
                'profile-card-component-secondary-account-info-data-value'
              }
            >
              {location}
            </div>
          </div>
        </div>
        <div className={'profile-card-component-secondary-divider'}></div>
        <div className={'profile-card-component-secondary-profile-content'}>
          <div
            className={'profile-card-component-secondary-profile-content-label'}
          >
            Customer Description:
          </div>
          <div
            className={'profile-card-component-secondary-profile-content-text'}
          >
            {custDescription}
          </div>
        </div>
        <div className={'profile-card-component-secondary-profile-content'}>
          <div
            className={'profile-card-component-secondary-profile-content-label'}
          >
            Customer Quote:
          </div>
          <div
            className={'profile-card-component-secondary-profile-content-text'}
          >
            {custQuote}
          </div>
        </div>
      </div>
    ) : (
      <div className="profile-card-component">
        <div className="header">
          CUSTOMER PROFILE
          {!isStoryDisabled && (
            <i
              role="button"
              onClick={this.handleUpdateProfile}
              className="material-icons"
            >
              mode_edit
            </i>
          )}
        </div>
        <div className="card-container">
          <div className="row">
            <div className="col-7">
              <div>
                <b>Name:</b> {name}
              </div>
              <div>
                <b>Industry:</b> {industry}
              </div>
              <div>
                <b>Employees:</b> {employees}
              </div>
              <div>
                <b>Location:</b> {location}
              </div>
            </div>
            <div className="col-5">
              <img
                width="400"
                height="400"
                className="img-wrap"
                src={this.getLogo(icon)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${profileImage}`;
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Label labelData="Customer Description:" labelClass="heading" />
              <p className="description">{custDescription}</p>
              <div className="quotation">
                <Label labelData="Customer Quote:" labelClass="heading" />
                <Label labelData={custQuote} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { isEditing } = this.props;
    if (isEditing) {
      return this.renderEditMode();
    }
    return this.renderViewMode();
  }
}

ProfileCard.propTypes = { header: PropTypes.string };
