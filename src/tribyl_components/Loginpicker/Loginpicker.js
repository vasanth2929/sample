import React from 'react';
import { Link } from 'react-router-dom';

import './Loginpicker.style.scss';

const DEFAULT_CLASSNAME = 'loginpicker';

const Loginpicker = (props) => {
  const redirectUrl = sessionStorage.getItem('redirectUrl');

  return (
    <div className={`${DEFAULT_CLASSNAME}`}>
      {/* <div className={`${DEFAULT_CLASSNAME}-section left`}>
				<div className={`${DEFAULT_CLASSNAME}-content`}>
					<div className={`${DEFAULT_CLASSNAME}-content-login`}>Login to:</div>
					<div className={`${DEFAULT_CLASSNAME}-content-title`}>Tribyl Expert Network</div>
					<Link to="/expert"><button className={`${DEFAULT_CLASSNAME}-content-button`}>Login</button></Link>
				</div>
			</div> */}
      <div className={`${DEFAULT_CLASSNAME}-section right`}>
        <div className={`${DEFAULT_CLASSNAME}-content`}>
          <div className={`${DEFAULT_CLASSNAME}-content-login`}>Login to:</div>
          <div className={`${DEFAULT_CLASSNAME}-content-title`}>
            Buyer Intelligence Cloud
          </div>
          <Link to={redirectUrl ? `/redirectUrl=${redirectUrl}` : '/'}>
            <button className={`${DEFAULT_CLASSNAME}-content-button`}>
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Loginpicker;
