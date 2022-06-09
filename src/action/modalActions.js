import ReactDOM from 'react-dom';
import { dispatch } from '../util/utils';
import { SHOW_MODAL, HIDE_MODAL } from '../constants/general';
// Top level 'modal-root' div in index.html allows us to have modals encapsulated outside the application DOM 
const modalRoot = document.getElementById('modal-root');

export function showModal() {
    return dispatch({ type: SHOW_MODAL, });
}

export function hideModal() {
    ReactDOM.unmountComponentAtNode(modalRoot);
    return dispatch({ type: HIDE_MODAL, });
}
