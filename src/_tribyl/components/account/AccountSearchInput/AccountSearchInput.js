/* eslint-disable no-new */
import React from 'react';
import AsyncSelect from 'react-select/async';
import { TextInput } from '../../_base/TextInput/TextInput';
import { listAllAccountForBDR } from '../../../../util/promises/leads_prospects_promise';

export class AccountSearchInput extends React.Component {

    state = {};

    loadOptions = (inputValue, callback) => {
        listAllAccountForBDR(inputValue)
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
        const { defaultValue, isDisabled } = this.props;
        return (
            <div className="account-search-input-wrapper">
                <AsyncSelect 
                    isDisabled={isDisabled}
                    cacheOptions 
                    defaultOptions={[]}
                    value={defaultValue}
                    getOptionLabel={option => option.name}
                    loadOptions={this.loadOptions}
                    onChange={this.onChange} />
            </div>
        );
    }
}