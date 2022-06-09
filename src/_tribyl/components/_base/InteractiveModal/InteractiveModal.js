import React from 'react';
import './InteractiveModal.scss';

export class InteractiveModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { hasCaughtError: false };
        this.componentModalWidthFactor = React.createRef();
    }

    componentDidMount() {
        const modal = document.getElementById('interactive-modal');
        this.dragElement(modal);
    }

    dragElement = (elmnt) => {
        // console.log('dragElement');

        let startX = 0;
        let startY = 0;
        // let pos3 = 0;
        // let pos4 = 0;

        function closeDragElement() {
            /* stop moving when mouse button is released: */
            document.onmouseup = null;
            document.onmousemove = null;
        }

        function elementDrag(e) {
            e = e || window.event; // eslint-disable-line
            e.preventDefault();
            // calculate the new cursor position:
            // pos1 = pos3 - e.clientX;
            // pos2 = pos4 - e.clientY;
            // pos3 = e.clientX;
            // pos4 = e.clientY;
            const x = (elmnt.offsetLeft) + (e.pageX - startX);
            const y = (elmnt.offsetTop) + (e.pageY - startY);
            // set the element's new position:
            elmnt.style.left = x + "px";
            elmnt.style.top = y + "px";


            // console.log('elementDrag');
            // console.log(elmnt);
            // console.log(elmnt.offsetLeft + ', ' + elmnt.offsetTop);
            // console.log(x + ', ' + y);
            // console.log((e.pageX - pos3) + ', ' + (e.pageY - pos4));
            // console.log(elmnt.style.left + ', ' + elmnt.style.top);

            startX = e.pageX;
            startY = e.pageY;
        }

        function dragMouseDown(e) {
            // console.log('dragMouseDown');
            e = e || window.event; // eslint-disable-line
            e.preventDefault();
            // get the mouse cursor position at startup:
            // pos1 = elmnt.style.offsetLeft;
            // pos2 = elmnt.style.offsetTop;
            startX = e.pageX;
            startY = e.pageY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        // if (document.getElementById(elmnt.id + "-header")) {
        //     /* if present, the header is where you move the DIV from: */
        //     document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
        // } 
        // console.log(elmnt);
        elmnt.onmousedown = dragMouseDown;
        // document.getElementById('pitch-recorder-header-wrapper').onmousedown = dragMouseDown;
    }

    // to allow implementing components to hide the overlay programatically 
    close = () => {
        const { onClose } = this.props;
        return onClose && onClose();
    };

    render() {
        const { children } = this.props;
        return (
            <div 
                role="presentation" 
                className="interactive-modal"
                id="interactive-modal" 
                onMouseDown={this.close}>
                <div
                    role="dialog"
                    className="interactive-modal-body"
                    id="interactive-modal-body"
                    onClick={event => event.stopPropagation()}
                    onMouseDown={event => event.stopPropagation()}>
                    <div id="interactive-modal-content">{children}</div>
                </div>
            </div>
        );
    }
}

