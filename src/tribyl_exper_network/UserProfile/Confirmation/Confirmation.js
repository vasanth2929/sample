import React, { Component } from 'react';
import './Confirmation.style.scss';
import header_logo from '../../../assets/images/header_logo.png';

const DEFAULT_CLASSNAMES = "ten-confirmation-container"

class Confirmation extends Component {
    render() {
        const { goHome } = this.props;
        return (
            <div className={`${DEFAULT_CLASSNAMES}`}>
                <img className="logo" src={header_logo} />
                <div className={`${DEFAULT_CLASSNAMES}-box`}>
                    <div className={`${DEFAULT_CLASSNAMES}-box-message`}>
                        <div><span className="material-icons verified">
                            verified
                        </span></div>
                        Thanks for your application.  We are reviewing it and shall be in touch soon.
                    <button className="button" onClick={() => goHome()}>Back to Home page</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Confirmation;
