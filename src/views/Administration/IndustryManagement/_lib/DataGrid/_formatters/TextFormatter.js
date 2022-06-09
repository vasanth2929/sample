
import React from 'react';

export class TextFormatter extends React.Component {
    getSlicedtext = (type, displayValue) => {
        switch (type) {
            case 'relevance':
                return `${Math.round(displayValue)}%`;
            default:
                return displayValue;
        }
    }
    render() {
        const textStyle = {
            color: '#4D4D4D',
            fontSize: '0.875em !important',
            marginBottom: '0'
        };
        return (
            <p className="gridText" style={textStyle} title={this.props.value.displayValue}>
                {/* {this.props.value.displayValue} */}
                {this.getSlicedtext(this.props.value.type, this.props.value.displayValue)}
            </p>
        );
    }
}
