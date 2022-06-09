import React, { PureComponent } from 'react';
import phone from '../../../../../../assets/iconsV2/phone.svg';
import lightbulb from '../../../../../../assets/images/lightbulb.png';
import './KeyMoment.scss';
import { KeyMomentCommentPanel } from '../../containers/InsightsModalBody/containers/KeyMomentTimeline/KeyMomentCommentPanel/KeyMomentCommentPanel';
import { SHOW_TOOLTIP, HIDE_TOOLTIP } from '../../../../../../constants/general';
import store from '../../../../../../util/store';

export class KeyMoment extends PureComponent {
    getTypeIcon = (type) => {
        switch (type) {
            case 'call':
                return <img className="call" src={phone} />;
            case 'interview':
                return 'record_voice_over';
            case 'email':
                return 'email';
            case 'notes':
                return 'note';
            default:
                return 'description';
        }
    }
    getSubTypeIcon = (type) => {
        switch (type) {
            case 'protip':
                // return <img className="edit-icon" src={editIcon} />;
                return (
                    <i
                        className="material-icons"
                        onMouseOver={e => this.showTooltip(e, 'Protip')}
                        onMouseOut={this.hideTooltip}
                        onFocus={e => this.showTooltip(e, 'Protip')}
                        onBlur={this.hideTooltip}>
                        <img className="light-bulb-icon" src={lightbulb} />
                    </i>
                );
            case 'context':
                // return <img className="edit-icon" src={editIcon} />;
                return (
                    <i
                        className="material-icons"
                        onMouseOver={e => this.showTooltip(e, 'Insight')}
                        onMouseOut={this.hideTooltip}
                        onFocus={e => this.showTooltip(e, 'Insight')}
                        onBlur={this.hideTooltip}>speaker_notes
                    </i>
                );
            case 'machine_generated':
                // return <img className="edit-icon" src={editIcon} />;
                return (
                    <i
                        className="material-icons"
                        onMouseOver={e => this.showTooltip(e, 'Machine Generated')}
                        onMouseOut={this.hideTooltip}
                        onFocus={e => this.showTooltip(e, 'Machine Generated')}
                        onBlur={this.hideTooltip}>forum
                    </i>
                );
            default:
                return <i className="material-icons">description</i>;
        }
    }

    likeKeyMoment = () => {
        const { likeKeyMoment } = this.props;
        return likeKeyMoment && likeKeyMoment();
    }

    unlikeKeyMoment = () => {
        const { unlikeKeyMoment } = this.props;
        return unlikeKeyMoment && unlikeKeyMoment();
    }

    updateShareStatus = () => {
        const { updateShareStatus } = this.props;
        return updateShareStatus && updateShareStatus();
    }

    deleteKeyMoment = () => {
        const { deleteKeyMoment } = this.props;
        return deleteKeyMoment && deleteKeyMoment();
    }

    moveToProtips = () => {
        const { moveToProtips } = this.props;
        return moveToProtips && moveToProtips();
    }

    moveToInsights = () => {
        const { moveToInsights } = this.props;
        return moveToInsights && moveToInsights();
    }

    toggleSeeMore = () => {
        const { toggleSeeMore } = this.props;
        return toggleSeeMore && toggleSeeMore();
    }

    toggleOptions = (event) => {
        if (event && event.stopPropagation) event.stopPropagation();
        this.hideTooltip();
        const { toggleOptions } = this.props;
        return toggleOptions && toggleOptions();
    }

    toggleComments = () => {
        const { toggleComments } = this.props;
        return toggleComments && toggleComments();
    }

    // to open transcript modal
    viewTranscript = () => {
        const { viewTranscript } = this.props;
        this.hideTooltip();
        return viewTranscript && viewTranscript();
    }

    showTooltip = (e, message) => {
        e.persist();
        store.dispatch({ type: SHOW_TOOLTIP, message, jsEvent: e });
    }

    hideTooltip = () => store.dispatch({ type: HIDE_TOOLTIP })

    render() {
        const {
            id,
            text,
            title,
            tips,
            type,
            convType,
            likes,
            sharingStatus,
            username,
            timestamp,
            isLikedByUser,
            editMode,
            seeMore,
            opptyPlanId,
            // comments,
            commentsCount,
            showComments,
            minCharCount,
            optionsOpen,
            handleAddComment
        } = this.props;
        return (
            <section className="key-moment-timeline-card-opty key-moment">
                <div className="item">
                    <div className="key-moment-header d-flex justify-content-between align-items-center">
                        <div className="header-label image">
                            <i
                                className="material-icons"
                                onMouseOver={e => this.showTooltip(e, convType)}
                                onMouseOut={this.hideTooltip}
                                onFocus={e => this.showTooltip(e, convType)}
                                onBlur={this.hideTooltip}>
                                {this.getTypeIcon(convType)}
                            </i>
                            <p className="stage-number">{username}</p>
                            <p className="date">{timestamp}</p>
                        </div>
                    </div>
                    <div className="details">
                        <div className={`${!editMode ? 'detail-box' : ''}`}>
                            <div className="data-section">
                                <p className="key-moment-card-title">
                                    <div>{title}</div>
                                    <div className="d-flex">
                                        {this.getSubTypeIcon(type)}
                                        <div
                                            role="button"
                                            className="see-more-button"
                                            onClick={this.viewTranscript}
                                            onMouseOver={e => this.showTooltip(e, 'View Transcript')}
                                            onMouseOut={this.hideTooltip}
                                            onFocus={e => this.showTooltip(e, 'View Transcript')}
                                            onBlur={this.hideTooltip}>
                                            <i className="material-icons">open_in_new</i>
                                        </div>
                                    </div>
                                </p>
                                <div
                                    className="key-moment-card-content-section"
                                    style={{ height: !seeMore ? '45px' : 'unset' }}>
                                    {(seeMore ? text : `${text ? text.slice(0, minCharCount) : ''}`)}
                                    {text && text.length > minCharCount &&
                                        <button
                                            className="see-more"
                                            onClick={this.toggleSeeMore}>
                                            ...{!seeMore ? 'see more' : 'see less'}
                                        </button>
                                    }
                                </div>
                                {
                                    (tips || '').length > 0 &&
                                    tips.map(item => (
                                        <div className="coaching-key-moments">
                                            {item.commentText}
                                        </div>
                                    ))
                                }
                            </div>
                            {
                                <div className="footer-section">
                                    <div className="keymoment-actions row align-items-center">
                                        <div className="col-7 left-actions">
                                            {
                                                (type === 'machine_generated') ?
                                                    (
                                                        <div className="mkm header-actions">
                                                            <span className="option" role="button" onClick={this.moveToInsights} >
                                                                Add to Insights
                                                            </span>
                                                            <span className="option" role="button" onClick={this.moveToProtips} >
                                                                Add to Protips
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <React.Fragment>
                                                            <div style={{ paddingRight: '0' }}>
                                                                <p className="comments" onClick={this.toggleComments}>
                                                                    Comments ({commentsCount || 0})&nbsp;
                                                                    <i className="material-icons">message</i>
                                                                    {!showComments && <i className="material-icons">expand_more</i>}
                                                                    {showComments && <i className="material-icons">expand_less</i>}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                {/* {this.renderLikeUnlikeDetails(likedBy, likes, id)} */}
                                                                <p className={`like-action${isLikedByUser ? ' liked' : ''}`}>
                                                                    Likes ({likes || 0})&nbsp;
                                                                    {
                                                                        <i
                                                                            role="button"
                                                                            className="material-icons liker-unliker"
                                                                            onClick={() => (
                                                                                isLikedByUser && likes > 0
                                                                                    ? this.unlikeKeyMoment()
                                                                                    : this.likeKeyMoment()
                                                                            )}>
                                                                            thumb_up
                                                                        </i>
                                                                    }
                                                                </p>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                            }
                                        </div>
                                        <div className="col-5 right-actions">
                                            {
                                                type === 'machine_generated'
                                                    ? (
                                                        <p
                                                            className="hide-action"
                                                            onClick={this.deleteKeyMoment}>
                                                            Remove&nbsp;<i className="material-icons">delete</i>
                                                        </p>
                                                    ) : (
                                                        <div className={`keymoment-options keymoment-options-wrapper ${id} ${optionsOpen ? 'active' : ''}`}>
                                                            <div className={`keymoment-options keymoment-options-button ${id}`} role="button" onClick={this.toggleOptions}>
                                                                {
                                                                    !optionsOpen
                                                                        ? (
                                                                            <i
                                                                                className={`keymoment-options material-icons ${id}`}
                                                                                role="presentation"
                                                                                onClick={this.toggleOptions}
                                                                                onMouseOver={e => this.showTooltip(e, 'More Actions')}
                                                                                onMouseOut={this.hideTooltip}
                                                                                onFocus={e => this.showTooltip(e, 'More Actions')}
                                                                                onBlur={this.hideTooltip} >more_vert
                                                                            </i>
                                                                        )
                                                                        : (
                                                                            <React.Fragment>
                                                                                <i className={`keymoment-options active material-icons ${id}`} role="presentation" onClick={this.toggleOptions} >more_vert</i>
                                                                                <i className={`keymoment-options active-background material-icons ${id}`} role="presentation" >more_vert</i>
                                                                            </React.Fragment>
                                                                        )
                                                                }
                                                            </div>
                                                            {optionsOpen &&
                                                                <div className={`keymoment-options-menu ${id}`}>
                                                                    <ul className={`"keymoment-options ${id}`}>
                                                                        {/* {(type === 'context' || type === 'protip') && <li className={`"keymoment-options item ${id}`} onClick={() => this.handleKmSubtypeChange('context', id)}>Edit</li>}
                                                                        {(type === 'context' || type === 'protip') && <li className={`"keymoment-options item ${id}`} onClick={() => this.handleKmSubtypeChange('context', id)}>Delete</li>} */}
                                                                        {type !== 'context' &&
                                                                            <li className={`"keymoment-options item ${id}`} onClick={this.moveToInsights}>
                                                                                <span>Change to Insight</span>
                                                                            </li>
                                                                        }
                                                                        {type !== 'protip' &&
                                                                            <li className={`"keymoment-options item ${id}`} onClick={this.moveToProtips}>
                                                                                <span>Change to Protip</span>
                                                                            </li>
                                                                        }
                                                                        {/* {type !== 'protip' && <li className={`"keymoment-options item ${id}`} onClick={this.moveToInsights}>Change to Protip</li>} */}
                                                                        <li className={`"keymoment-options item ${id}`} onClick={this.updateShareStatus}>
                                                                            <span>Share Status</span>
                                                                            <i
                                                                                role="presentation"
                                                                                title={sharingStatus === 'team' ? 'Team' : 'Public'}
                                                                                className={`keymoment-options material-icons ${id} ${sharingStatus === 'team' ? 'orange' : 'green'}`}>
                                                                                {sharingStatus === 'team' ? 'group' : 'group_add'}
                                                                            </i>
                                                                        </li>
                                                                        <li className={`"keymoment-options item ${id}`} onClick={() => this.setState({ optionsOpen: false }, () => this.deleteKeyMoment(id))}>
                                                                            <span>Remove</span><i className="keymoment-options material-icons" role="presentation">delete</i>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            }
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                showComments &&
                                <div className={`key-moment-comments-panel ${showComments ? 'expanded' : 'collapsed'}`}>
                                    <KeyMomentCommentPanel opptyPlanId={opptyPlanId} keyMomentId={id} setCommentCount={handleAddComment} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
