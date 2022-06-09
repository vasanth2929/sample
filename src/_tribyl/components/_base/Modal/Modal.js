
import React from 'react';

export class Modal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { hasCaughtError: false };
        this.componentModalWidthFactor = React.createRef();
    }

    componentDidMount() {
        const modal = document.getElementById('modal-body-2');
        this.dragElement(modal);
    }

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
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
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

        if (document.getElementById(elmnt.id + "-header")) {
            /* if present, the header is where you move the DIV from: */
            document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
        } 
        // else {
        //     /* otherwise, move the DIV from anywhere inside the DIV: */
        //     elmnt.onmousedown = dragMouseDown;
        // }
    }

    // to allow implementing components to hide the overlay programatically 
    close = () => {
        const { onClose } = this.props;
        return onClose && onClose();
    };

    render() {
        const { children, cssClassName } = this.props;
        return (
            <div 
                role="presentation" 
                className="show mounted-overlay detail-view-modal custom-modal"
                onMouseDown={this.close}>
                <div
                    role="dialog"
                    id="modal-body-2"
                    className={
                        'modal-body'
                        + ` ${cssClassName || ''} `
                    }
                    onClick={event => event.stopPropagation()}
                    onMouseDown={event => event.stopPropagation()}>
                    <div id="modal-content">{children}</div>
                </div>
            </div>
        );
    }
}
