
import React from 'react';

export class StoryTypeFormatter extends React.Component {
    formatStoryType = (type) => {
        switch (type) {
            case 'story_view': return 'View';
            case 'referenced_in_conversation': return 'Conversation';
            default: return '';
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
                {this.formatStoryType(this.props.value.displayValue)}
            </p>
        );
    }
}
