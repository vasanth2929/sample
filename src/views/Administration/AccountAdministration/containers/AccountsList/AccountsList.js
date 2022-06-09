import React from 'react';
import Scrollbar from 'perfect-scrollbar-react';
import { ErrorBoundary } from '../../../../../components/ErrorBoundary/ErrorBoundary';
import { isEmpty } from '../../../../../util/utils';

export class AccountsList extends React.PureComponent {
    render() {
        const {
            accounts,
            selectedAccountId,
            handleAccountSelection
        } = this.props;

        return !isEmpty(accounts) ?
            <ErrorBoundary>
                <div className="accounts-list-section">
                    <Scrollbar>
                        <ul className="accounts-list">
                            {accounts.map((item, key) => (
                                <li 
                                    key={key} 
                                    className={item.id === selectedAccountId ? 'selected-account' : ''}
                                    title={`Account: ${item.name}`}
                                    onClick={() => handleAccountSelection(item.id)}>
                                    <span className="account-name-label">{item.name}</span>
                                    {item.id === selectedAccountId && <i className="material-icons green">check_circle</i>}
                                </li>
                            ))}
                        </ul>
                    </Scrollbar>
                </div>
            </ErrorBoundary>
            : null;
    }
}

