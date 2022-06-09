import React, { PureComponent } from 'react';
import './styles/ProfileCard.style.scss';

export class ProfileCard extends PureComponent {
    render() {
        const {
            isSelected,
            profilePicture,
            onError,
            status,
            userName,
            email,
            functionTeam,
            handleProfileSelection
        } = this.props;
        return (
            <section className={isSelected ? 'profile-card-v2 text-center selected' : 'profile-card-v2 text-center'} onClick={handleProfileSelection}>
                <i className={isSelected ? 'material-icons selected' : 'material-icons'}>{isSelected ? 'check_circle' : 'panorama_fish_eye'}</i>
                <img src={profilePicture} height="96" width="96" title={userName} onError={onError} />
                <p className="status-label text-capitalize">{status}</p>
                <p className="username-label text-capitalize">{userName}</p>
                <p className="role-email-label text-capitalize">{functionTeam}</p>
                <p className="role-email-label text-lowercase">{email}</p>
            </section>
        );
    }
}
