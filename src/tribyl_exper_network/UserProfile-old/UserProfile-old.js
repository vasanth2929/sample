import React, { Component } from 'react';
import './UserProfile.style.scss';
import pencil from '../../assets/icons/pencil.svg';
import { formatCurrency, getLoggedInUser } from '../../util/utils';

const DEFAULT_CLASSNAME = 'expert-network-user-profile';

class UserProfile extends Component {
  constructor() {
    super();
    this.state = {
      userData: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const user = getLoggedInUser();
    this.setState({ userData: user, isLoading: false });
  };

  render() {
    const { userData } = this.state;
    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        <div className={`${DEFAULT_CLASSNAME}-header`}>
          <div
            role="button"
            className="sub-heading sub-heading-bold"
            onClick={this.props.history.goBack}
          >
            Back
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}-content`}>
          <div className={`${DEFAULT_CLASSNAME}-content-title`}>
            Profile
            <button>Save</button>
          </div>
          <div className="profile-info">
            <img
              onClick={this.editDetail}
              role="button"
              src={pencil}
              className="edit"
            />

            <div className="user-info">
              <div className="user-picture"></div>
              <div>
                <div className="username">
                  <span className="heading heading-bold">
                    {userData.username}
                  </span>
                  <span className="status">{userData.status}</span>
                </div>
                <div>
                  <span className="text mr-2">
                    {userData.functionalTeam} |{' '}
                    <span className="link">{userData.email || ''}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="metrics">
              <div className="text">YOUR POINTS</div>
              <div className="sub-heading sub-heading-bold">20,000</div>
            </div>
          </div>
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
          <div className={`${DEFAULT_CLASSNAME}-content-detail`}>
            <div className="d-flex justify-content-between align-items-center">
              <p className="heading heading-bold">Additional details</p>
              <img role="button" src={pencil} />
            </div>
            <div className="field">
              <p className="sub-heading">Job function</p>
              <input type="text" defaultValue="Development" />
            </div>
            <hr />
            <div className="field">
              <p className="sub-heading">Seniority level</p>
              <input type="text" defaultValue={userData.role} />
            </div>
            <hr />
            <div className="field">
              <p className="sub-heading">Industry</p>
              <input type="text" defaultValue="Information Technology" />
            </div>
            <hr />
            <div className="field">
              <p className="sub-heading">Employees</p>
              <input type="text" defaultValue="1001-5000" />
            </div>
            <hr />
            <div className="field">
              <p className="text">Expertise</p>
              <div className="pill-section">
                <div className="pill text text-bold">
                  Analytics & Business intelligence
                </div>
                <div className="pill text text-bold">Data management</div>
                <div className="pill text text-bold">
                  Collaboration and Productivity
                </div>
              </div>
            </div>
            <hr />
            <div className="field">
              <p className="text">Interest(s)</p>
              <div className="pill-section">
                <div className="pill text text-bold">
                  Analytics & Business intelligence
                </div>
                <div className="pill text text-bold">Data management</div>
                <div className="pill text text-bold">
                  Collaboration and Productivity
                </div>
              </div>
            </div>
            <hr />
            <div className="field">
              <p className="sub-heading">Email about New Survey</p>
              <input type="text" defaultValue="Weekly" />
            </div>
            <hr />
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
