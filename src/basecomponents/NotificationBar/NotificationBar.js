import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import "./styles/NotificationBar.style.scss";

const DEFAULT_CLASSNAME = 'tb-notification-bar';

export class NotificationBar extends PureComponent {

    static propTypes = {
        disableClose: PropTypes.bool,
        icon: PropTypes.string,
        message: PropTypes.string,
        onClose: PropTypes.func,
        type: PropTypes.string.isRequired,
    };

    dismiss = () => {
        const { dismissFunction, onClose } = this.props
        dismissFunction().then(() => onClose());
    }

    render() {

        const {
            disableClose,
            dismissFunction,
            message,
            onClose,
            type,
        } = this.props;

        return (
            <div className={`${DEFAULT_CLASSNAME}-${type}`} onClick={e => {e.stopPropagation()}}>
                {/* {icon && (
                    icon
                )} */}
                <div className={`${DEFAULT_CLASSNAME}-message`}>
                    {message}
                </div>
                {dismissFunction && (
                    <div className={`${DEFAULT_CLASSNAME}-close-button`}>
                        <i
                            role="button"
                            className={`material-icons ${DEFAULT_CLASSNAME}-close-button-btn`}
                            onClick={this.dismiss}>
                            hourglass_disabled
                        </i>
                    </div>
                )}
                {!disableClose && (
                    <div className={`${DEFAULT_CLASSNAME}-close-button`}>
                        <i
                            role="button"
                            className={`material-icons ${DEFAULT_CLASSNAME}-close-button-btn`}
                            onClick={onClose}>
                            close
                        </i>
                    </div>
                )}
            </div>
        );
    }
}

