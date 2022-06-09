import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Modal } from '../components/_base/Modal/Modal';
import { InteractiveModal } from '../components/_base/InteractiveModal/InteractiveModal';
import store from './../../util/store';

const modalRoot = document.getElementById('modal-root-2');
const interactiveModalRoot = document.getElementById('modal-root-interactive');

export class ModalService {
    onModalClose;
    onInteractiveModalClose;

    showModal(component, onClose, cssClassName) {
        this.onModalClose = () => onClose && onClose();
        ReactDOM.render(
            <Provider store={store}>
                <Modal 
                    cssClassName={cssClassName}
                    onClose={() => this.closeModal()}>
                    {component}
                </Modal>
            </Provider>,
            modalRoot
        );
    }

    showInteractiveModal(component, onClose) {
        this.onInteractiveModalClose = () => onClose && onClose();
        ReactDOM.render(
            <InteractiveModal 
                onClose={() => this.closeInteractiveModal()}>
                {component}
            </InteractiveModal>,
            interactiveModalRoot
        );
    }

    closeModal = () => {
        ReactDOM.unmountComponentAtNode(modalRoot);
        if (this.onModalClose) this.onModalClose();
    }

    closeInteractiveModal = () => {
        ReactDOM.unmountComponentAtNode(interactiveModalRoot);
        if (this.onInteractiveModalClose) this.onInteractiveModalClose();
    }
}

export const modalService = new ModalService();
