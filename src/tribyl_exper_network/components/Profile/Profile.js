import React, { Component } from 'react';
import './Profile.style.scss';
import { Button } from '../Button/Button';
import img_avatar from '../../../assets/icons/img_avatar.png';

const DEFAULT_CLASSNAME = 'expert-network-profile';

class Profile extends Component {
  onClick = () => {
    window.open('/expert-network-user-profile', '_self');
  };
  render() {
    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        <div className={`${DEFAULT_CLASSNAME}-pic`}>
          <img src={img_avatar} />
        </div>
        <div className={`${DEFAULT_CLASSNAME}-summary`}>
          <div className={`${DEFAULT_CLASSNAME}-summary-info`}>
            <div className="sub-heading-medium">Jeffry D. Morgan</div>
            <div className="text">VP IT, Tribyl</div>
          </div>
          <div>
            <Button
              onClick={this.onClick}
              className={`${DEFAULT_CLASSNAME}-button`}
            >
              Edit Profile
            </Button>
          </div>
          <div className={`${DEFAULT_CLASSNAME}-link`}>Update strengths</div>
          <div className={`${DEFAULT_CLASSNAME}-link`}>Update Interest</div>
        </div>
      </div>
    );
  }
}

export default Profile;
