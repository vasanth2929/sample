import React from 'react';
import './GroupedOptions.scss';

export class GroupedOptions extends React.Component {
    getOptions = () => {
        const { options = [], optionGroupKey = 'group' } = this.props;
        const groupedOptions = options.reduce((map, option) => {
            const key = option[optionGroupKey] || 'All';
            if (!map[key]) map[key] = [];
            map[key].push(option);
            return map;
        }, {});
        return groupedOptions;
    }
    
    render() {
        const {
            uniqueId, valueKey, previousValue, optionRenderer, onSelect 
        } = this.props;
        const groupedOptions = this.getOptions();
        return (
            <ul
                className="single-select-options grouped-options"
                id={`${(uniqueId) ? `single-select-options-${uniqueId}` : ''}`}>
                {Object.keys(groupedOptions).map(groupKey => (
                    <div className="single-select-option-group-wrapper" data-grouped={groupKey !== 'All'}>
                        {groupKey !== 'All' && <div className="single-select-option-group-header">{groupKey}</div>}
                        {
                            groupedOptions[groupKey].map(option => (
                                <li
                                    className={previousValue && option[valueKey] === previousValue[valueKey] ? "single-defaultValue-active" : ""}
                                    title={previousValue && option[valueKey] === previousValue[valueKey] ? "Recommended Industry" : ""}
                                    onClick={() => onSelect(option)}>
                                    {
                                        optionRenderer && typeof optionRenderer === 'function'
                                            ? optionRenderer(previousValue && option[valueKey] === previousValue[valueKey] ? option[valueKey] + " *" : option[valueKey])
                                            : previousValue && option[valueKey] === previousValue[valueKey] ? option[valueKey] + " *" : option[valueKey]
                                    }
                                </li>
                            ))
                        }
                    </div>
                ))}
            </ul>
        );
    }
}
