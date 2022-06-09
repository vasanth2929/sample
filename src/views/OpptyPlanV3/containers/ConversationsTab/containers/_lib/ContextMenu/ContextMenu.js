import React, { createRef } from 'react';

export class ContextMenu extends React.PureComponent {
    contextMenuRef = createRef();
    constructor(props) {
        super(props);
        const { showMenu } = props;        
        this.state = { showMenu };
    }

    componentDidUpdate(prevProps, prevState) {
        const { showMenu } = prevState;
        if (this.props.showMenu !== showMenu) {
            this.setState({ showMenu: this.props.showMenu }, () => this.setPosition());
        }
    }

    componentWillMount() {
        document.body.addEventListener('click', this.outsideClick);
    }

    componentDidMount() {
        this.setPosition();
    }

    componentWillUnmount() {
        const { onClose } = this.props;
        document.body.removeEventListener('click', this.outsideClick);
        if (onClose) onClose();
    }

    outsideClick = (e) => {
        const { onClose } = this.props;
        if (!(this.contextMenuRef.current 
                && this.contextMenuRef.current.contains(e.target))) {
            this.setState({ showMenu: false }, () => {
                if (onClose) onClose();
            });
        }
    }

    getPosition = () => {
        const { contextMenuEvent } = this.props;
        const x = (contextMenuEvent.clientX + document.body.scrollLeft);
        const y = (contextMenuEvent.clientY + document.body.scrollTop);
        return { x, y };
    }

    setPosition = () => {
        const { getPosition, contextMenuEvent } = this.props;
        if (getPosition) {
            const position = getPosition(contextMenuEvent);
            this.contextMenuRef.current.style.top = `${position.y}px`;
            this.contextMenuRef.current.style.left = `${position.x}px`;
        } else if (this.contextMenuRef.current) {
            const position = this.getPosition(contextMenuEvent);
            this.contextMenuRef.current.style.top = `${position.y - 100}px`;
            this.contextMenuRef.current.style.left = `${position.x - 560}px`;
        }
    }

    render() {
        const { children } = this.props;
        const { showMenu } = this.state;
        return showMenu && (
            <div
                role="button"
                className="context-menu active"
                ref={this.contextMenuRef}>
                <ul className="context-menu-options">
                    {children}
                </ul>
            </div>
        );
    }
}
