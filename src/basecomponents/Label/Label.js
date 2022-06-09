import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export class Label extends PureComponent {
    render() {
        const { props } = this;
        const { labelClass, labelData } = props;
        return (
            <div className="react-label">
                <p className={labelClass}>{labelData}</p>
            </div>
        );
    }
}

Label.propTypes = {
    labelClass: PropTypes.string,
    labelData: PropTypes.node
};
