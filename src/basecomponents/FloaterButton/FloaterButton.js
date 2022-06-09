import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './styles/FloaterButton.style.scss';

export class FloaterButton extends PureComponent {
    childClicked = (e) => {
        e.stopPropagation();
        this.props.onClick();
    }

    render() {
        const { 
            type, 
            colorClass, 
            tooltip, 
            disabled,
            onClick 
        } = this.props;
        return (
            <button className={`floater-btn ${colorClass}`} onClick={onClick} title={tooltip} disabled={disabled}>
                <i className="material-icons" role="presentation" onClick={this.childClicked}>{type === 'add' ? 'add' : 'edit'}</i>
            </button>
        );
    }
}

FloaterButton.propTypes = {
    type: PropTypes.oneOf(['add', 'edit']),
    colorClass: PropTypes.string,
    tooltip: PropTypes.string,
    onClick: PropTypes.func
};

FloaterButton.defaultProps = {
    type: 'add',
    colorClass: 'blue',
    onClick: () => {}
};
