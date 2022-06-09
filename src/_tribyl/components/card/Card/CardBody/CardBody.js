
import React from 'react';

export class CardBody extends React.PureComponent {
    render() {
        const { 
            title, 
            description, 
            className, 
            customCardBody 
        } = this.props;
        return (
            customCardBody || 
            <div className="card-body">
                <p className="card-title">{title}</p>
                <p className={`${className || ''} card-content`}>
                    {`${description ? description.slice(0, 165) : ''} ${description && description.length > 165 ? '[...]' : ''}`}
                </p>
                <div className="card-spacer" />
            </div>
        );
    }
}
