import React from 'react';

export class DefaultOptions extends React.Component {
    render() {
        const { 
            uniqueId, 
            valueKey, 
            previousValue, 
            options, 
            optionRenderer,
            onSelect
        } = this.props;
        return (
            <ul
                className="single-select-options"
                id={`${(uniqueId) ? `single-select-options-${uniqueId}` : ''}`}>
                {options.map(option => (
                    <li
                        className={previousValue && option[valueKey] === previousValue[valueKey] ? "single-defaultValue-active" : ""}
                        title={previousValue && option[valueKey] === previousValue[valueKey] ? "Recommended Industry" : ""}
                        onClick={() => onSelect(option)}>
                        {
                            optionRenderer && typeof optionRenderer === 'function'
                                ? optionRenderer(previousValue && option[valueKey] === previousValue[valueKey] ? option[valueKey] + " *" : option[valueKey])
                                : previousValue && option[valueKey] === previousValue[valueKey] ? option[valueKey] + " *" : option[valueKey]
                        }
                    </li>))}
            </ul>
        );
    }
}
