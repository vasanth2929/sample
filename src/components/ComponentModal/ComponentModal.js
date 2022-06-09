import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import Scrollbar from 'perfect-scrollbar-react';
import 'perfect-scrollbar-react/dist/style.min.css';
import store from '../../util/store';
import { showModal, hideModal } from '../../action/modalActions';

import './styles/ComponentModal.style.scss';

// Top level 'modal-root' div in index.html allows us to have modals encapsulated outside the application DOM 
const modalRoot = document.getElementById('modal-root');

export class ComponentModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { hasCaughtError: false };
        this.componentModalWidthFactor = React.createRef();
    }

    // to allow implementing components to hide the overlay programatically 
    hide = () => {
        hideModal();
        ReactDOM.unmountComponentAtNode(modalRoot);
        if (typeof this.props.onHide === 'function') this.props.onHide();
    }   

    render() {
        const { 
            customClass,
            title,
            children,
        } = this.props;
        return (
            <div
                onMouseDown={() => this.hide()}
                role="button"
                className={`${this.props.showModal ? 'show' : 'hide'} ${customClass} component-modal`}>
                <div
                    onClick={event => event.stopPropagation()}
                    onMouseDown={event => event.stopPropagation()}
                    role="button"
                    className="modal-body"
                    id="modal-body">
                    <div id="modal-content" ref={this.componentModalWidthFactor}>
                        <div className="header-section ">
                            <p>{title}</p>
                            <div>
                                <i className="material-icons close-modal" role="button" onClick={() => this.hide()}>
                                    clear
                                </i>
                            </div>
                        </div>
                        <div className="content-section">
                            <Scrollbar options={{ suppressScrollX: true }}>
                                {children}
                            </Scrollbar>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ComponentModal.propTypes = {
    customClass: PropTypes.string,
    title: PropTypes.string,
    element: PropTypes.element
};

function mapStateToProps(state) {
    return { showModal: state.modal.showModal };
}

const Component = connect(mapStateToProps)(ComponentModal);

// Takes a DOM element. Returns ref to alert, which exposes its hide() function
export function showAlert(title, element, customClass, callbackOnHide) {
    showModal();
    const overlay = (
        <Component 
            title={title} 
            onHide={callbackOnHide} 
            customClass={customClass ? `mounted-overlay ${customClass}` : 'mounted-overlay'}>
            {element}
        </Component>
    ); 
    ReactDOM.render(
        <Provider store={store}>
                {overlay}
        </Provider>,
        modalRoot
    );
    return overlay;
}
