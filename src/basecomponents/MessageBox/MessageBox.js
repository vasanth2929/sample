import React from 'react';
import './styles/MessageBox.style.scss';

export class MessageBox extends React.PureComponent {
    render() {
        const {
            messageType,
            children
        } = this.props;
        return (
            <div className="message-box">
                <div className={`alert alert-${messageType} text-center`} role="alert">
                    {children}
                </div>
            </div>
        );
    }
}
