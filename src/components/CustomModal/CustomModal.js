import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Grid,
  DialogTitle,
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Rnd } from 'react-rnd';
import { Provider, connect } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { hideModal, showModal } from '../../action/modalActions';
import store from '../../util/store';
import './styles/CustomModal.style.scss';

// Top level 'modal-root' div in index.html allows us to have modals encapsulated outside the application DOM
const modalRoot = document.getElementById('modal-root');
const popupRoot = document.getElementById('popup-root');

export class CustomModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasCaughtError: false,
      headerHold: false,
      resizeHold: false,
    };
    this.componentModalWidthFactor = React.createRef();
  }

  componentDidMount() {
    const modal = document.getElementById('modal-body');
    this.dragElement(modal);
    this.resizeElement(modal);
  }

  resizeElement = (elmnt) => {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    function closeExpandElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function elementExpand(e) {
      e = e || window.event; // eslint-disable-line
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.height = elmnt.offsetTop - pos2 + 'px';
      elmnt.style.width = elmnt.offsetLeft - pos1 + 'px';
    }

    function expandMouseDown(e) {
      e = e || window.event; // eslint-disable-line
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;

      document.onmouseup = closeExpandElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementExpand;
    }

    if (document.getElementById(elmnt.id + '-expand-button')) {
      /* if present, the expand button is where you move the DIV from: */
      document.getElementById(elmnt.id + '-expand-button').onmousedown =
        expandMouseDown;
    }
  };

  dragElement = (elmnt) => {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    function closeDragElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function elementDrag(e) {
      e = e || window.event; // eslint-disable-line
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
      elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }

    function dragMouseDown(e) {
      e = e || window.event; // eslint-disable-line
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    if (document.getElementById(elmnt.id + '-header')) {
      /* if present, the header is where you move the DIV from: */
      document.getElementById(elmnt.id + '-header').onmousedown = dragMouseDown;
    }
    // else {
    //     /* otherwise, move the DIV from anywhere inside the DIV: */
    //     elmnt.onmousedown = dragMouseDown;
    // }
  };

  // to allow implementing components to hide the overlay programatically
  hide = (e) => {
    ReactDOM.unmountComponentAtNode(modalRoot);
    if (typeof this.props.onHide === 'function') {
      this.props.onHide(e);
    } else {
      hideModal();
    }
  };

  hidePopup = () => {
    ReactDOM.unmountComponentAtNode(popupRoot);
  };

  handleHeaderHold = () => {
    this.setState({ headerHold: !this.state.headerHold });
  };

  handleResizeHold = () => {
    this.setState({ resizeHold: !this.state.resizeHold });
  };

  render() {
    const {
      children,
      customClass,
      extraProps,
      header,
      isLoading,
      loaderComponent,
      minWidth,
      popup,
    } = this.props;

    const { closeButton, resizable } = extraProps || {};

    const content = (
      <div
        id="modal-content"
        className={`resizable ? 'resizable' : ''`}
        ref={this.componentModalWidthFactor}
      >
        {isLoading ? (
          loaderComponent
        ) : (
          <React.Fragment>
            {header && (
              <div
                className={
                  `${
                    this.state.headerHold
                      ? 'header-section hold'
                      : 'header-section'
                  } ${closeButton ? 'header-section-close' : ''} ${
                    extraProps && extraProps.noHeaderBorder
                      ? 'no-header-border'
                      : ''
                  }` +
                  customClass +
                  '__header'
                }
                id="modal-body-header"
                onMouseDown={
                  this.state.resizable ? null : this.handleHeaderHold
                }
                onMouseUp={this.state.resizable ? null : this.handleHeaderHold}
                role="button"
              >
                {header}
                {closeButton && (
                  <button
                    className="custom-modal-close-button"
                    onClick={popup ? this.hidePopup : this.hide}
                  >
                    x
                  </button>
                )}
                {!closeButton && (
                  <div>
                    <i
                      id="close-icon"
                      className="material-icons close-modal"
                      role="button"
                      onClick={popup ? this.hidePopup : this.hide}
                    >
                      clear
                    </i>
                  </div>
                )}
              </div>
            )}
            <div className={`content-section ${resizable ? 'resizable' : ''}`}>
              {/* <Scrollbar options={{ suppressScrollX: true }}> */}
              {children}
              {/* </Scrollbar> */}
            </div>
          </React.Fragment>
        )}
      </div>
    );

    if (resizable && resizable.enabled) {
      const RndDefault = { x: 550, y: 50, width: 800, height: 690 };
      return (
        <div
          onMouseDown={popup ? this.hidePopup : this.hide}
          role="button"
          className={`${
            this.props.showModal ? 'show' : 'hide'
          } ${customClass} custom-modal`}
        >
          <Rnd
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            role="button"
            className={`modal-body ${popup ? 'popup' : ''}`}
            style={minWidth ? { minWidth } : {}}
            id="modal-body"
            default={resizable.default || RndDefault}
            minWidth={800}
            minHeight={690}
          >
            {content}
          </Rnd>
        </div>
      );
    }

    return (
      <div
        onMouseDown={popup ? this.hidePopup : this.hide}
        role="button"
        className={`${
          this.props.showModal ? 'show' : 'hide'
        } ${customClass} custom-modal`}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          role="button"
          className={`modal-body ${popup ? 'popup' : ''}`}
          style={minWidth ? { minWidth } : {}}
          id="modal-body"
        >
          {content}
        </div>
      </div>
    );
  }
}

CustomModal.propTypes = {
  customClass: PropTypes.string,
  header: PropTypes.element,
  element: PropTypes.element,
};

function mapStateToProps(state) {
  return { showModal: state.modal.showModal };
}

const Component = connect(mapStateToProps)(CustomModal);

// Takes a DOM element. Returns ref to alert, which exposes its hide() function
export function showCustomModal(
  header,
  element,
  customClass,
  callbackOnHide,
  isLoading,
  loaderComponent,
  minWidth,
  extraProps
) {
  showModal();
  const overlay = (
    <Component
      header={header}
      onHide={callbackOnHide}
      customClass={
        customClass ? `mounted-overlay ${customClass}` : 'mounted-overlay'
      }
      isLoading={isLoading}
      loaderComponent={loaderComponent}
      extraProps={extraProps}
      minWidth={minWidth}
    >
      {element}
    </Component>
  );
  ReactDOM.render(<Provider store={store}>{overlay}</Provider>, modalRoot);
  return overlay;
}

// Takes a DOM element. Returns ref to alert, which exposes its hide() function
export function showCustomTearsheetModal(
  header,
  element,
  customClass,
  callbackOnHide,
  isLoading,
  loaderComponent
) {
  // showModal();
  const overlay = (
    <Component
      header={header}
      onHide={callbackOnHide}
      customClass={
        customClass ? `mounted-overlay ${customClass}` : 'mounted-overlay'
      }
      isLoading={isLoading}
      loaderComponent={loaderComponent}
      minWidth={910}
      popup
    >
      {element}
    </Component>
  );

  ReactDOM.render(<Provider store={store}>{overlay}</Provider>, popupRoot);
  return overlay;
}

export const ModalMUI = ({
  title,
  isOpen,
  children,
  onClose,
  maxWidth,
  approved,
  showApproved,
  closeStyles,
  ...props
}) => {
  return (
    <Dialog
      open={isOpen}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="boostrap-modal-title-vcenter"
      onClose={onClose}
      {...props}
    >
      <DialogTitle onClose={onClose}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Box
            display={'flex'}
            alignItems="center"
            justifyContent={showApproved ? 'space-between' : 'start'}
            width={'90%'}
          >
            {title}
            {showApproved && (
              <Box
                bgcolor={approved === 'Y' ? '#00b257' : '#fff3d7'}
                style={{ color: approved === 'Y' ? 'white' : 'black' }}
                p="4px 16px"
                fontSize={14}
                borderRadius="20px"
                fontWeight={900}
              >
                {approved === 'Y' ? 'Approved' : 'Needs review'}
              </Box>
            )}
          </Box>

          <IconButton style={closeStyles} aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent dividers style={{ minHeight: '50vh' }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

ModalMUI.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  maxWidth: PropTypes.string,
};

ModalMUI.defaultProps = { maxWidth: 'xs' };
