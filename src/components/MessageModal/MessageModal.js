import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './styles/MessageModal.style.scss';
import { hideModal } from '../../action/modalActions';

// Top level 'modal-root' div in index.html allows us to have modals encapsulated outside the application DOM 
const modalRoot = document.getElementById('modal-root');

class MessageModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: 'show',
            hasCaughtError: false
        };
        this.modalContainer = React.createRef();
    }

    // to allow implementing components to hide the overlay programatically 
    hide = () => {
        // this.setState({ show: 'hide' });
        hideModal();
        if (typeof this.props.onHide === 'function') {
            this.props.onHide();
        } else {
            ReactDOM.unmountComponentAtNode(modalRoot);
        }
    }   

    render () {
        const { 
            customClass,
            messageType,
            message
        } = this.props;
        return (
            <div
                onMouseDown={() => this.hide()}
                role="button"
                ref={this.modalContainer}
                className={`${this.state.show} ${customClass} ${messageType} message-modal`}>
                <div
                    onClick={event => event.stopPropagation()}
                    onMouseDown={event => event.stopPropagation()}
                    role="button"
                    className="modal-body">
                    <div id="modal-content">
                        <div className="header-section">
                            <div className="close-icon-section text-right">
                                <i className="material-icons close-modal" role="button" onClick={() => this.hide()}>
                                    clear
                                </i>
                            </div>
                            <div className="message-indicator text-center">
                                <i className="indicator-icon material-icons">
                                    {messageType === 'success' ? 'check_circle_outline' : 'error_outline'}
                                </i>
                                <p>
                                    {messageType === 'success' ? 'Success!' : 'Oops!'}
                                </p>
                            </div>
                        </div>
                        <div className="footer-section">
                            <p>{message}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

MessageModal.propTypes = {
    customClass: PropTypes.string,
    messageType: PropTypes.string,
    message: PropTypes.string
};

// Takes a string message. Returns ref to alert, which exposes its hide() function
export function showAlert(message, messageType, callbackOnHide) {
    const overlayRef = React.createRef(); 
    const overlay = (
        <MessageModal 
            ref={overlayRef} 
            messageType={messageType} 
            onHide={callbackOnHide} 
            customClass="mounted-overlay"
            message={message} />
    ); 
    ReactDOM.render(overlay, modalRoot);
    return overlayRef.current;
}
