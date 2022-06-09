import React, { Component } from 'react';
import share from '../../assets/icons/share.svg';
import bell from '../../assets/icons/bell.svg';
import chat from '../../assets/icons/chat.svg';
import './SharePanel.style.scss';
import ShareModal from './ShareModal/ShareModal';

export class SharePanel extends Component {
    constructor(props) {
        super(props);
        this.state = { openShare: false };
    }
    render() {
        const { openShare } = this.state;
        const { shareLink, location } = this.props;
        return (
            <div>
                <div className={`share-section floater ${location ? location : "right bottom"}`}>
                    <div className="center pointer"> <img src={bell} /></div>
                    <div className="center pointer" role="button" onClick={() => this.setState({ openShare: true })}> <img src={share} /></div>
                    <div className="center pointer chat"> <img src={chat} /></div>
                </div>
                {
                    openShare &&
                    <ShareModal isOpen copyValue={shareLink} />
                }
            </div>
        );
    }
}
