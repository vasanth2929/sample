import React from 'react';
import PropTypes from 'prop-types';

import inProgress from '../../assets/images/ic_inprogress.png';
import external from '../../assets/images/ic_shareexternal.png';
import internal from '../../assets/images/ic_shareinternal.png';
import restricted from '../../assets/images/ic_sharerestricted.png';

export class ShareIcon extends React.Component {
    getShareIcon = (shareStatus) => {
        switch (shareStatus) {
            case 'Shared External - Restricted':
                return restricted;
            case 'Shared External - Complete':
                return external;
            case 'Shared Internal':
                return internal;
            default:
                return inProgress;
        }
    }
    
    render() {
        const { shareStatus } = this.props;
        return (
            <img src={this.getShareIcon(shareStatus)} title={shareStatus} />
        );
    }
}

ShareIcon.propTypes = { shareStatus: PropTypes.string };
