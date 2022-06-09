import React, { Component } from 'react';
import './UserProfile.style.scss';
import avatar from '../../assets/icons/ten-profile/avatar.svg';
import avatar1 from '../../assets/icons/ten-profile/avatar1.svg';
import avatar2 from '../../assets/icons/ten-profile/avatar2.svg';
import avatar3 from '../../assets/icons/ten-profile/avatar3.svg';
import person from '../../assets/icons/ten-profile/person.svg';
import mail from '../../assets/icons/ten-profile/mail.svg';
import linkedin from '../../assets/icons/ten-profile/linkedin.svg';
import job from '../../assets/icons/ten-profile/job.svg';
import edit from '../../assets/icons/ten-profile/edit.svg';
import header_logo from '../../assets/images/header_logo.png';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { getLoggedInUser, formatCurrency } from '../../util/utils';
import {
  getUserDetails,
  updateUser,
} from '../../util/promises/usercontrol_promise';
import Toast from 'react-bootstrap/Toast';
import Confirmation from './Confirmation/Confirmation';

const DEFAULT_CLASSNAME = 'ten-user-profile';

const options1 = [
  { value: 'Product Marketing', label: 'CTO' },
  { value: 'Account Executive', label: 'CIO' },
  { value: 'Enterprise Sales', label: 'Head of Data Science' },
  { value: 'Account Executive', label: 'CISO' },
  { value: 'Account Executive', label: 'Chief Architect' },
  { value: 'Account Executive', label: 'VP of Engineering' },
  { value: 'Account Executive', label: 'Director of Engineering' },
];

const options2 = [
  { value: 'Product Marketing', label: 'Executive' },
  { value: 'Account Executive', label: 'Management' },
  { value: 'Account Executive', label: 'Director' },
  { value: 'Enterprise Sales', label: 'Influencer' },
];

const options3 = [
  { value: 'Product Marketing', label: 'Healthcare' },
  { value: 'Account Executive', label: 'Technology' },
  { value: 'Account Executive', label: 'Telecommunication' },
  { value: 'Account Executive', label: 'Media & Entertainment' },
  { value: 'Account Executive', label: 'Manufacturing' },
  { value: 'Account Executive', label: 'Retail & Wholesale' },
  { value: 'Enterprise Sales', label: 'Travel & Hospitality' },
];

const options4 = [
  { value: '5-10', label: '<25' },
  { value: '100-200', label: '25-500' },
  { value: '1000+', label: '500+' },
];

const options5 = [
  { value: 'Product Marketing', label: 'Analytics' },
  { value: 'Account Executive', label: 'Business Intelligence' },
  { value: 'Enterprise Sales', label: 'AI & ML' },
  { value: 'Enterprise Sales', label: 'Cyber Security' },
  { value: 'Enterprise Sales', label: 'DevOps' },
  { value: 'Enterprise Sales', label: 'iSaaS' },
];

const options6 = [
  { value: 'Product Marketing', label: 'CRM' },
  { value: 'Account Executive', label: 'Enterprise Architecture' },
  { value: 'Enterprise Sales', label: 'Application Performance Management' },
  { value: 'Enterprise Sales', label: 'Robotic Process Automation' },
  { value: 'Enterprise Sales', label: 'Enterprise Integrations' },
  { value: 'Enterprise Sales', label: 'Machine Learning/AI/NLP' },
  { value: 'Enterprise Sales', label: 'Application Development Tools' },
  { value: 'Enterprise Sales', label: 'Productivity Tools' },
];

const intervalOptions = [
  { value: 'weekly', label: 'weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Yearly', label: 'Yearly' },
];
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      isLoading: true,
      selected_avatar: '',
      userSaved: false,
      showConfirm: false,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const loggedInUser = getLoggedInUser();
    const response = await getUserDetails(loggedInUser.userId);
    const user = response.data;
    console.log({ user });
    this.setState({ formData: user, isLoading: false });
  };

  setValue = (value, type) => {
    const { formData } = this.state;
    this.setState({ formData: { ...formData, [type]: value } });
  };

  setMultiple = (value, type) => {
    const { formData } = this.state;

    this.setState({
      formData: { ...formData, [type]: value.map((item) => item.value) },
    });
  };

  renderMetrics = () => {
    return (
      <div className={`${DEFAULT_CLASSNAME}-content-metrics`}>
        <div className="metric1">
          <div className="box">
            <div className="text">studies completed</div>
            <input type="text" defaultValue={formatCurrency(20000)} />
          </div>
          <div className="box">
            <div className="text">questions asked</div>
            <input type="text" defaultValue={formatCurrency(20000)} />
          </div>
          <div className="box">
            <div className="text">questions answered </div>
            <input type="text" defaultValue={formatCurrency(20000)} />
          </div>
          <div className="box">
            <div className="text">polls created</div>
            <input type="text" defaultValue={formatCurrency(3214)} />
          </div>
        </div>
        <div className="metric1">
          <div className="box">
            <div className="text">Polls answered</div>
            <input type="text" defaultValue={formatCurrency(123)} />
          </div>
          <div className="box">
            <div className="text">Shares</div>
            <input type="text" defaultValue={formatCurrency(210)} />
          </div>
          <div className="box">
            <div className="text">referrals</div>
            <input type="text" defaultValue={formatCurrency(332)} />
          </div>
        </div>
      </div>
    );
  };

  renderOptions = (array) => {
    return array.map((item) => ({ label: item, value: item }));
  };

  submit = async () => {
    const { formData } = this.state;
    const payload = { ...formData, userType: 'ten member' };
    delete payload.password; // delete the password field from payload.
    try {
      const response = await updateUser(payload);
      this.setState({ userSaved: 'success', showConfirm: true });
    } catch (e) {
      this.setState({ userSaved: 'error' });
    }
  };

  setAvatar = (name) => {
    this.setState({ selected_avatar: name });
  };

  goHome = () => {
    this.setState({ showConfirm: false });
  };

  rendrUSerForm = () => {
    const { formData, isLoading, selected_avatar, userSaved } = this.state;
    return (
      <div className={`${DEFAULT_CLASSNAME}-content`}>
        <div className="logo">
          <img src={header_logo} />
        </div>
        <p className="page-title">Setting up your profile,</p>
        {!isLoading ? (
          <React.Fragment>
            <div className={`${DEFAULT_CLASSNAME}-content-profile`}>
              <div className="profile-info">
                {selected_avatar ? (
                  <img
                    src={require(`../../assets/icons/ten-profile/${selected_avatar}.svg`)}
                    className="user-picture"
                  />
                ) : (
                  <div className="user-picture" />
                )}
                <div>
                  <div className="username">
                    <span className="sub-heading">
                      Upload a profile picture
                    </span>
                  </div>
                  <div>
                    <span className="link"> choose a file</span>
                  </div>
                </div>
              </div>
              <div className="text text-bold">OR</div>
              <div className="avatar-select">
                <p className="sub-heading">Select an Avatar</p>
                <div className="avatar-container">
                  <img onClick={() => this.setAvatar('avatar')} src={avatar} />
                  <img
                    onClick={() => this.setAvatar('avatar1')}
                    src={avatar1}
                  />
                  <img
                    onClick={() => this.setAvatar('avatar2')}
                    src={avatar2}
                  />
                  <img
                    onClick={() => this.setAvatar('avatar3')}
                    src={avatar3}
                  />
                </div>
              </div>
              <div className={`${DEFAULT_CLASSNAME}-content-profile-form`}>
                <div className="field-group">
                  <input
                    onChange={(e) => this.setValue(e.target.value, 'firstName')}
                    defaultValue={formData.firstName || ''}
                    className="field"
                    placeholder="First name"
                  />
                  <img className="post-fix" src={person} />
                </div>
                <div className="field-group">
                  <input
                    onChange={(e) => this.setValue(e.target.value, 'lastName')}
                    defaultValue={formData.lastName || ''}
                    className="field"
                    placeholder="Last name"
                  />
                  <img className="post-fix" src={person} />
                </div>
                <div className="field-group">
                  <input
                    onChange={(e) =>
                      this.setValue(e.target.value, 'companyName')
                    }
                    defaultValue={formData.companyName || ''}
                    className="field"
                    placeholder="Company Name"
                  />
                  <img className="post-fix" src={job} />
                </div>
                <div className="field-group">
                  <input
                    onChange={(e) =>
                      this.setValue(e.target.value, 'functionalTeam')
                    }
                    defaultValue={formData.functionalTeam || ''}
                    className="field"
                    placeholder="Job Title"
                  />
                  <img className="post-fix" src={edit} />
                </div>
                <div className="field-group">
                  <input
                    onChange={(e) =>
                      this.setValue(e.target.value, 'linkedinUrl')
                    }
                    defaultValue={formData.linkedinUrl || ''}
                    className="field"
                    placeholder="Linkedin link"
                  />
                  <img className="post-fix" src={linkedin} />
                </div>
                <div className="field-group">
                  <input
                    type="email"
                    onChange={(e) => this.setValue(e.target.value, 'email')}
                    defaultValue={formData.email || ''}
                    className="field"
                    placeholder="Email"
                  />
                  <img className="post-fix" src={mail} />
                </div>
                <div className="divider">
                  <span className="sub-heading sub-heading-bold">
                    ADDITIONAL DETAILS
                  </span>{' '}
                  <hr />
                </div>
                <div className="select-field">
                  <Select
                    onChange={(value) => this.setValue(value.value, 'job')}
                    placeholder="Job Select"
                    className="single-select"
                    classNamePrefix="single-select"
                    defaultValue={
                      formData.functionalTeam !== null
                        ? { label: formData.functionalTeam }
                        : null
                    }
                    options={options1}
                  />
                </div>
                <div className="select-field">
                  <CreatableSelect
                    onChange={(value) =>
                      this.setValue(value.value, 'seniorityLevel')
                    }
                    placeholder="Seniority level"
                    className="single-select"
                    classNamePrefix="single-select"
                    defaultValue={
                      formData.seniorityLevel !== null
                        ? { label: formData.seniorityLevel }
                        : null
                    }
                    options={options2}
                  />
                </div>
                <div className="select-field">
                  <Select
                    onChange={(value) => this.setValue(value.value, 'industry')}
                    placeholder="Industry"
                    className="single-select"
                    classNamePrefix="single-select"
                    defaultValue={
                      formData.industryList !== null
                        ? { label: formData.industryList }
                        : null
                    }
                    options={options3}
                  />
                </div>
                <div className="select-field">
                  <Select
                    onChange={(value) =>
                      this.setValue(value.value, 'currentEmployerEmployeeCount')
                    }
                    placeholder="Employees"
                    className="single-select"
                    classNamePrefix="single-select"
                    defaultValue={
                      formData.currentEmployerEmployeeCount !== null
                        ? { label: formData.currentEmployerEmployeeCount }
                        : null
                    }
                    options={options4}
                  />
                </div>
                <div className="select-field">
                  <Select
                    onChange={(value) =>
                      this.setMultiple(value, 'areasOfExpertise')
                    }
                    placeholder="Expertise"
                    className="single-select"
                    classNamePrefix="single-select"
                    defaultValue={
                      formData.areasOfExpertise !== null
                        ? this.renderOptions(formData.areasOfExpertise)
                        : null
                    }
                    options={options5}
                    isMulti
                  />
                </div>
                <div className="select-field">
                  <Select
                    onChange={(value) =>
                      this.setMultiple(value, 'areasOfInterest')
                    }
                    placeholder="Interest(s)"
                    className="single-select"
                    classNamePrefix="single-select"
                    options={options6}
                    isMulti
                    defaultValue={
                      formData.areasOfInterest !== null
                        ? this.renderOptions(formData.areasOfInterest)
                        : null
                    }
                  />
                </div>
                <div className="sub-heading sub-heading-bold">
                  How frequently would you like to receive relevant
                  notifications from us via email?
                </div>
                <div className="select-field fluid">
                  <Select
                    className="single-select"
                    classNamePrefix="single-select"
                    defaultValue={{ value: 'Weekly', label: 'Weekly' }}
                    options={intervalOptions}
                  />
                </div>
                <hr />
                <div className={`${DEFAULT_CLASSNAME}-content-footer`}>
                  <button onClick={this.submit} className="submit">
                    Save
                  </button>
                </div>

                {/* <Collapsible
                                        title="Metrics"
                                        Collapsible={
                                            this.renderMetrics()
                                        }
                                    /> */}
              </div>
            </div>
          </React.Fragment>
        ) : (
          <i>Loading Data...</i>
        )}
        <Toast
          delay={3000}
          autohide
          style={{
            position: 'absolute',
            bottom: 40,
            left: 0,
          }}
          show={userSaved === 'success'}
          onClose={() => this.setState({ userSaved: '' })}
        >
          <Toast.Body>
            <span className="text-success">User Saved Successfully</span>
          </Toast.Body>
        </Toast>
      </div>
    );
  };

  render() {
    const { showConfirm } = this.state;
    return (
      <React.Fragment>
        {!showConfirm ? (
          <div className={`${DEFAULT_CLASSNAME}`}>{this.rendrUSerForm()}</div>
        ) : (
          <Confirmation goHome={this.goHome} />
        )}
      </React.Fragment>
    );
  }
}

export default UserProfile;
