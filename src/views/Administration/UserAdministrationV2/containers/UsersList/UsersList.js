import React from 'react';
import Scrollbar from 'perfect-scrollbar-react';
import { ErrorBoundary } from '../../../../../components/ErrorBoundary/ErrorBoundary';

export class UsersList extends React.PureComponent {
    render() {
        const {
            users,
            selectedUserId,
            handleUserSelection
        } = this.props;
        return (
            <ErrorBoundary>
                <div className="users-list-section">
                    <Scrollbar>
                        <ul className="users-list">
                            {users.map((item, key) => (
                                <li 
                                    key={key} 
                                    className={item.id === selectedUserId ? `selected-user ${item.status}` : `${item.status}`}
                                    title={item.status === 'in-active' ? 'Inactive User' : 'Active User'}
                                    onClick={() => handleUserSelection(item.id)}>
                                    <span className="login-name-label">{`@${item.loginname}`}</span>,&nbsp;
                                    <span className="user-name-label">{item.firstName ? `${item.firstName} ${item.lastName ? item.lastName : ''}` : `${item.username}`}</span>
                                    {
                                        item.authorized ? (
                                            <span className="float-right auth-set" style={{ fontSize: '13px', color: 'green', paddingTop: '3px' }}>GMail auth set</span>
                                        ) : (
                                            <span className="float-right auth-unset" style={{ fontSize: '13px', color: 'red', paddingTop: '3px' }}>GMail auth not set</span>
                                        )
                                    }
                                </li>
                            ))}
                        </ul>
                    </Scrollbar>
                </div>
            </ErrorBoundary>
        );
    }
}

