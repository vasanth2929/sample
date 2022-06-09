
import React from 'react';

export class BoldHeaderRenderer extends React.Component {
    render() {
        const textStyle = {
            color: '#000',
            fontSize: '1.125em !important',
            marginBottom: '0'
        };
        return (
            <div>
                <p style={textStyle}>{this.props.value}</p>
            </div>
        );
    }
}
