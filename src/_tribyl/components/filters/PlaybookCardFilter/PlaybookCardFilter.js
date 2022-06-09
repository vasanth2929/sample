import React from 'react';
import { PLAYBOOK_FILTER_NAMES, PLAYBOOK_FILTER_OPTIONS } from '../_constants/PlaybookCardFilter.constants';
import './PlaybookCardFilter.scss';

export class PlaybookCardFilter extends React.Component {
    defaultFilter = PLAYBOOK_FILTER_NAMES.LIVE;
    constructor(props) {
        super(props);
        const { value } = this.props;
        this.state = { currentValue: value || {} };
    } 
    componentDidUpdate() {
        const { value } = this.props;
        const { currentValue } = this.state;
        if (value !== currentValue) {
            this.setState({ currentValue: value });
        }
    }
    onSelect = (option) => {
        const { onSelect } = this.props;
        if (onSelect && typeof onSelect === 'function') onSelect(option);
    }
    render() {
        const { filterCounts = {}, userRole } = this.props;
        const { currentValue = {} } = this.state;
        return (
            <div className="playbook-filters-wrapper">
                {
                    PLAYBOOK_FILTER_OPTIONS.map((option) => {
                        return (
                            <PlaybookCardFilterOption
                                option={option}
                                resultsCount={filterCounts[option.id] || 0}
                                isDisabled={option.allowedRoles.length > 0 && !option.allowedRoles.includes(userRole)}
                                isSelected={option.name === (currentValue.name || this.defaultFilter)}
                                onSelect={this.onSelect} />
                        );
                    })
                }
            </div>
        );
    }
}

class PlaybookCardFilterOption extends React.Component {
    onSelect = () => {
        const { option, onSelect } = this.props;
        if (onSelect && typeof onSelect === 'function') onSelect(option);
    }
    render() {
        const { 
            option, 
            resultsCount, 
            isDisabled, 
            isSelected 
        } = this.props;
        return (
            <div
                id={option}
                role="button"
                className={
                    'playbook-filter'
                    + `${isSelected ? ' active' : ''}`
                    + `${isDisabled ? ' disabled' : ''}`}
                onClick={this.onSelect}>
                {`${option.name} (${resultsCount})`}
            </div>
        );
    }
}

