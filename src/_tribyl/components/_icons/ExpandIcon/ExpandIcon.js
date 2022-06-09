
import React from 'react';

export class ExpandIcon extends React.PureComponent {
    onExpandClick = (e) => {
        const { onExpandClick } = this.props;
        e.stopPropagation();
        if (onExpandClick) onExpandClick();
    }
    render() {
        return <i className="material-icons white expand-icon" role="button" onClick={this.onExpandClick}>crop_free</i>;
    }
}
