import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Scrollbar from 'perfect-scrollbar-react';
// import PropTypes from 'prop-types';
import 'perfect-scrollbar-react/dist/style.min.css';

import './styles/Modal.style.scss';

// Top level 'modal-root' div in index.html allows us to have modals encapsulated outside the application DOM 
const modalRoot = document.getElementById('modal-root');

class Overlay extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: 'show',
            hasCaughtError: false,
            errors: ''
        };
        this.modalContainer = React.createRef();
        this.hide = this.hide.bind(this);
    }

    componentDidCatch(error) { // eslint-disable-line
        this.setState({ 
            hasCaughtError: true,
            errors: error 
        });
    }

    // to allow implimenting components to hide the overlay programatically 
    hide() {
        this.setState({ show: 'hide' });
        if (typeof this.props.onHide === 'function') this.props.onHide();
        ReactDOM.unmountComponentAtNode(modalRoot);
    }   

    render () {
        const { props } = this;
        return (
            <div
                onMouseDown={() => this.hide()}
                role="button"
                ref={this.modalContainer}
                className={this.state.show + ' overlay ' + this.props.customClass}>
                <div
                    onClick={event => event.stopPropagation()}
                    onMouseDown={event => event.stopPropagation()}
                    role="button"
                    // style={{ height: this.props.modalHeight }}
                    className="modal-body">
                    <Scrollbar>
                        <div id="modal-content">
                            {true && 
                            <span>
                                <i 
                                    className="material-icons float-right close-modal" 
                                    role="button" 
                                    onClick={() => this.hide()}>
                                        clear
                                </i><br />
                            </span>}
                            {this.state.hasCaughtError ? this.state.errors : props.children}
                        </div>
                    </Scrollbar>
                </div>
            </div>
        );
    }
}

Overlay.propTypes = { modalHeight: PropTypes.string };

// Overlay.defaultProps = {
//     modalHeight: '50%'
// };

// If showAlert got a string instead of an element, this packages it in a nice centered div
function packageStringInElement(string) {
    const overlayStyle = {
        display: 'flex',
        justifyContent: 'center'
    };
    const element = (
        <div style={overlayStyle}>
            <p>{string}</p>
        </div>
    );
    return element;
}

// Takes a react or jsx element, or string as contents. Returns ref to alert, which exposes its hide() function
export function showAlert(message, callbackOnHide) {
    const overlayRef = React.createRef();
    const overlayChild = typeof message === 'string' ? packageStringInElement(message) : message;  
    const overlay = <Overlay ref={overlayRef} onHide={callbackOnHide} customClass="mounted-overlay">{overlayChild}</Overlay>; 
    ReactDOM.render(overlay, modalRoot);
    return overlayRef.current;
}
