
import React from 'react';
import { SingleSelect } from '../../../../../../_tribyl/components/_base/SingleSelect/SingleSelect';
import './formatters.scss';

export class SingleSelectFormatter extends React.Component {
    getSlicedtext = (type, displayValue) => {
        switch (type) {
            case 'relevance':
                return `${Math.round(displayValue)}%`;
            default:
                return displayValue;
        }
    }
    getValue() {
        return this.props.value.displayValue;
    }

    getInputNode() {
        // If applicable, should return back the primary html input node that is used to edit the data
        // Otherwise return null
        // If value is an input node, then this node will be focussed on when the editor opens
        return null;
    }

    disableContainerStyles() {
        return true;
    }
    onSelect = (option) => {
        const { onSelect } = this.props.value;
        if (onSelect) onSelect(option);
    }
    render() {
        const {
            value,
            uniqueId,
            options
        } = this.props.value;
        return (
            <div className="single-select-cell-wrapper">
                <SingleSelect
                    uniqueId={uniqueId}
                    value={value}
                    options={options}
                    onSelect={this.onSelect} />
            </div>
        );
    }
}
