import React, { PureComponent } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { Control, Form, actions } from 'react-redux-form';
import { bindActionCreators } from 'redux';
import dummy from '../../../../../../../../assets/images/dummy.png';
import { FloaterButton } from '../../../../../../../../basecomponents/FloaterButton/FloaterButton';
import { OpptyPlanCardModel } from '../../../../../../../../model/opptyPlanModels/OpptyPlanCardModel';
import { OptyPersonaModel } from '../../../../../../../../model/opptyPlanModels/OpptyPlanModels';
import { createContactForAccount } from '../../../../../../../../util/promises/dealcards_promise';
import {
  addOrUpdatePersonaForOpptyP,
  removeOpptyPlanPersona,
} from '../../../../../../../../util/promises/opptyplan_promise';
import './styles/ContactPanel.styles.scss';
import { getLoggedInUser } from '../../../../../../../../util/utils';
import { reload } from '../../../../../../../../action/loadingActions';

export class ContactPanelImpl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { isEditing: props.showEditMode };
  }

  componentWillUnmount() {
    this.props.setInitialValues({});
  }

  personas = [
    'Economic  Buyer',
    'Champion',
    'Influencer',
    'Procurement',
    'Legal',
    'Relationship',
  ];

  handleEditFormSubmit = async () => {
    const {
      contactDetails: {
        seniorityLevel,
        id: contactId,
        email,
        sentiment,
        role,
        ...updatedContact
      },
      cardDetails,
      opptyPlanId,
    } = this.props;
    let id = contactId;
    if (contactId) {
      if (role) {
        await removeOpptyPlanPersona(cardDetails.opptyPCardDetailContactRelId);
        await addOrUpdatePersonaForOpptyP({
          ...updatedContact,
          emailId: email,
          contactId,
          // role: cardDetails.name || cardDetails.title,
          opptyPlanId: Number(opptyPlanId),
          sentiment: sentiment === 'Unknown' ? null : sentiment,
          userId: getLoggedInUser().userId,
          role,
          opptyPCardDetailConRelId: cardDetails.opptyPCardDetailContactRelId,
        });
      } else {
        await addOrUpdatePersonaForOpptyP({
          ...updatedContact,
          emailId: email,
          contactId,
          role: cardDetails.contactBean.opptyPlanContactBean.tribylPersonaRole,
          opptyPlanId: Number(opptyPlanId),
          sentiment: sentiment === 'Unknown' ? null : sentiment,
          userId: getLoggedInUser().userId,
        });
      }
    } else {
      id = await createContactForAccount(updatedContact);
    }

    new OpptyPlanCardModel({
      ...cardDetails,
      contactId: id,
      contactName: `${updatedContact.firstName} ${updatedContact.lastName}`,
      jobTitleName: updatedContact.jobTitleName,
      contactEmail: updatedContact.email,
      contactBean: {
        ...cardDetails.contactBean,
        ...updatedContact,
        name: `${updatedContact.firstName} ${updatedContact.lastName}`,
        sentiment: sentiment === 'Unknown' ? null : sentiment,
        role,
      },
    }).$save();

    new OptyPersonaModel({
      ...cardDetails,
      contactId: id,
      contactName: `${updatedContact.firstName} ${updatedContact.lastName}`,
      jobTitleName: updatedContact.jobTitleName,
      contactEmail: updatedContact.email,
      contactBean: {
        ...cardDetails.contactBean,
        ...updatedContact,
        contactId: id,
        id,
        name: `${updatedContact.firstName} ${updatedContact.lastName}`,
        sentiment: sentiment === 'Unknown' ? null : sentiment,
        role,
      },
    }).$save();
    this.setState({ isEditing: false });
    this.props.handleBodyContentEditing(false);
    OpptyPlanCardModel.deleteAll();
    reload('opty-plan-buying-personas-card-tab');
  };

  handleEditClick = () => {
    const {
      setInitialValues,
      cardId,
      cardDetails: { contactBean },
    } = this.props;
    setInitialValues({
      ...contactBean,
      cardId,
    });
    this.props.handleBodyContentEditing(true);
    this.setState({ isEditing: true });
  };
  handleCancel = () => {
    this.setState({ isEditing: false });
    this.props.handleBodyContentEditing(false);
  };
  renderHeader = (contactName, jobTitleName, name, sentiment) => (
    <div className="row contact-header">
      <div
        className="col-4"
        style={{ display: 'flex', 'flex-direction': 'column' }}
      >
        <img src={dummy} />
        <div className="status">
          <span className={`status-wrapper ${sentiment || 'Unknown'}`}>
            {sentiment || 'Unknown'}
          </span>
        </div>
      </div>
      <div className="col-8 details" style={{ padding: '0px' }}>
        <p className="name">{contactName}</p>
        <p className="job-title">{jobTitleName}</p>
        <p className="topic-name">{name}</p>
      </div>
    </div>
  );

  renderDetail = (key, value, isLink) => (
    <div className="row detail-section">
      <p className="key col-3">{key}</p>
      <p className={isLink ? 'value col-9 link' : 'value col-9'}>
        {value || '-'}
      </p>
    </div>
  );

  renderContactDetail = ({ contactBean, title }) => {
    const {
      department,
      email,
      id,
      jobTitleName,
      mobile,
      firstName,
      lastName,
      phone,
      roleOfContact,
      source,
      status,
      statusReason,
      lastContacted,
      sentiment,
    } = contactBean || {};
    return (
      <section className="contact-section">
        {id ? (
          <div className="row contact-view" style={{ 'padding-left': '4px' }}>
            <div className="col-6">
              {this.renderHeader(
                `${firstName} ${lastName}`,
                jobTitleName,
                title,
                sentiment
              )}
              {/* <div className="row">
                                <div className="col-12" style={{ 'padding-left': '0px' }}>
                                    <div className="status">
                                        <span className={`status-wrapper ${sentiment || 'Unknown'}`}>{sentiment || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div> */}
              {this.renderDetail('Role', roleOfContact)}
              {this.renderDetail('Department', department)}
              {/* this.renderDetail('Conversations', conversationCount || '0') */}
              {this.renderDetail('Last Activity', lastContacted)}
            </div>

            {/* <div className="col-1" /> */}

            <div className="greyed-section col-6">
              {this.renderDetail('Email', email, true)}
              {this.renderDetail('Phone', phone)}
              {this.renderDetail('Mobile', mobile)}
              <br />
              {this.renderDetail('Status', status)}
              {this.renderDetail('Status Reason', statusReason)}
              {this.renderDetail('Lead Source', source)}
              {/* {
                                !this.props.hideEditButton
                                    ? this.renderDetail('Persona', 'Head of App Dev')
                                    : (

                                        <div className="row detail-section">
                                            <p className="col-3 key">Persona</p>
                                            <p className="value col-9">
                                                <Select
                                                    placeholder="Select Persona"
                                                    className="card-personas-wrapper"
                                                    classNamePrefix="card-persona-item"
                                                    defaultValue={{ value: 'Head of App Dev', label: 'Head of App Dev' }}
                                                    onChange={e => this.setState({ selectedPersona: e })}
                                                    options={[
                                                        { value: 'Enterprise Architect', label: 'Enterprise Architect' },
                                                        { value: 'Database Admin', label: 'Database Admin' },
                                                        { value: 'BI Analyst', label: 'BI Analyst' },
                                                        { value: 'Head of App Dev', label: 'Head of App Dev' },
                                                        { value: 'CISO', label: 'CISO' },
                                                    ]} />
                                            </p>
                                        </div>
                                    )
                            } */}
            </div>
          </div>
        ) : (
          <p>No Contact Added</p>
        )}
        {/* <button onClick={this.props.showContactList} className="change-contact-button"> CHANGE CONTACT</button> */}
        {!this.props.hideEditButton && (
          <section className="edit-button-container">
            <FloaterButton
              type="edit"
              colorClass="blue"
              tooltip="Edit Contact"
              onClick={this.handleEditClick}
            />
          </section>
        )}
      </section>
    );
  };

  renderEditForm = () => (
    <Form
      model="form.opptyContactDetails"
      className="contact-form"
      onSubmit={this.handleEditFormSubmit}
    >
      <section className="row contact-form-wrapper">
        <div className="col-3">
          <div className="profile-pic-container">
            <img src={dummy} />
          </div>
        </div>

        <div className="col-3">
          <div className="form-group">
            <label htmlFor="context-input">Email</label>
            <Control.input
              id="email"
              className="form-control"
              model=".email"
              disabled={this.props.contactDetails.id}
            />
          </div>
          <div className="form-group">
            <label htmlFor="context-input">Phone</label>
            <Control.input
              id="phone"
              className="form-control"
              model=".phone"
              disabled={this.props.contactDetails.id}
            />
          </div>
          <div className="form-group">
            <label htmlFor="context-input">Mobile</label>
            <Control.input
              id="mobile"
              className="form-control"
              model=".mobile"
              disabled={this.props.contactDetails.id}
            />
          </div>
        </div>
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="context-input">First Name</label>
            <Control.input
              id="first-name"
              className="form-control"
              model=".firstName"
              disabled={this.props.contactDetails.id}
            />
          </div>
          <div className="form-group">
            <label htmlFor="context-input">Job title</label>
            <Control.input
              id="job-title"
              className="form-control"
              model=".jobTitleName"
              disabled={this.props.contactDetails.id}
            />
          </div>

          <div className="form-group">
            <label htmlFor="context-input">Status</label>
            <Control.select
              placeholder="select"
              id="status"
              className="form-control"
              model=".status"
              disabled={this.props.contactDetails.id}
            />
          </div>
          <div className="form-group">
            <label htmlFor="context-input">Lead Source</label>
            <Control.select
              placeholder="select"
              id="lead-source"
              className="form-control"
              model=".source"
              disabled={this.props.contactDetails.id}
            />
          </div>
        </div>
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="context-input">Last name</label>
            <Control.input
              id="last-name"
              className="form-control"
              model=".lastName"
              required
              disabled={this.props.contactDetails.id}
            />
          </div>
          <div className="form-group">
            <label htmlFor="context-input">Department</label>
            <Control.select
              placeholder="select"
              id="department"
              className="form-control"
              model=".department"
              disabled={this.props.contactDetails.id}
            />
          </div>
          <div className="form-group">
            <label htmlFor="context-input">Role</label>
            <Control.select
              placeholder="select"
              id="role"
              className="form-control"
              model=".role"
              disabled={this.props.contactDetails.id}
            />
          </div>
          <div className="form-group">
            <label htmlFor="context-input">Status Reason</label>
            <Control.select
              placeholder="select"
              id="status-reason"
              className="form-control"
              model=".statusReason"
              disabled={this.props.contactDetails.id}
            />
          </div>
        </div>
      </section>
      <section className="form-actions d-flex justify-content-end">
        <button className="btn cancel-btn" onClick={this.handleCancel}>
          Cancel
        </button>
        <button type="submit" className="btn submit-btn">
          Save
        </button>
      </section>
    </Form>
  );

  render() {
    const { isEditing } = this.state;
    const { cardDetails } = this.props;
    return (
      <div className="contact-panel-container">
        {isEditing
          ? this.renderEditForm()
          : this.renderContactDetail(cardDetails)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { contactDetails: state.form.opptyContactDetails };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateCardInsights: (model, value) =>
        actions.change(`form.opptyContactDetails.${model}`, value),
      setInitialValues: (value) =>
        actions.change('form.opptyContactDetails', value),
    },
    dispatch
  );
}

export const ContactPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactPanelImpl);
