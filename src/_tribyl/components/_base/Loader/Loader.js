/* eslint-disable react/self-closing-comp */
import React from 'react';
import './Loader.scss';

export class Loader extends React.PureComponent {
    render() {
        const { text = 'Loading' } = this.props;
        return (
            <div className="loader-wrapper">
                <div
                    className="spinner-border"
                    role="status">
                </div>
                <span>{text}</span>
            </div>
        );
    }
}
