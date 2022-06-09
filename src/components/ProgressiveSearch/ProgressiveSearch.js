import React, { Component } from 'react';
import { getPBCardUsingText } from '../../util/promises/playbooks_promise';
import AsyncSelect from 'react-select/async';

const DEFAULT_CLASSNAMES = "progressive-search-box"


class StorySearch extends Component {
    state = {};

    loadOptions = (inputValue, callback) => {
        getPBCardUsingText(inputValue)
            .then((response) => {
                const accounts = response.data || [];
                callback(accounts);
                this.setState({
                    accounts,
                    loadingAccounts: false
                });
            });
    };

    onChange = (targetAccount) => {
        const { onChange } = this.props;
        if (onChange) onChange(targetAccount);
    }

    render() {
        const { defaultValue, isDisabled, placeholder, otherAction, className, classNamePrefix } = this.props;
        return (
            <div className={`${DEFAULT_CLASSNAMES}-container`}>
                <AsyncSelect
                    isDisabled={isDisabled}
                    classNamePrefix={classNamePrefix || ""}
                    placeholder={placeholder || "Search..."}
                    className={className || DEFAULT_CLASSNAMES}
                    cacheOptions
                    defaultOptions={[]}
                    value={defaultValue}
                    getOptionLabel={option => option.name}
                    loadOptions={this.loadOptions}
                    onChange={this.onChange}
                    {...otherAction}
                />

            </div>
        );
    }
}

export default StorySearch;
