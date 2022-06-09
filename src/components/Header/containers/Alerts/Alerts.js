import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import notification from '../../../../assets/images/header/ic_notification.png';
import data from './mocks/alerts.data.json';
import './styles/Alerts.style.scss';
import stars from '../../../../assets/images/stars.png';
import avgSense from '../../../../assets/images/avg_sense.png';
import lowSense from '../../../../assets/images/low_sense.png';

class AlertsImpl extends PureComponent {
    state = {
        showAlerts: false,
        alertCount: this.props.alertCount
    }

    componentDidMount() {
        const outerContainer = document.querySelector('.main-panel'); 
        outerContainer.addEventListener('click', this.hideAlertsDisplay);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.alertCount !== this.props.alertCount) {
            this.setState({ alertCount: nextProps.alertCount });
        }
    }

    getIcon = (icon, topic) => {
        switch (icon) {
            default:
                return <div className={`${topic.toLowerCase().split(' ').join('-')} icon-wrapper`}><i className="material-icons">chat_bubble</i></div>;
            case ('recommended'):
                return <div className={`${topic.toLowerCase().split(' ').join('-')} icon-wrapper`}><img src={stars} /></div>;
        }
    }

    getSensitivityImage = (sensitivity) => {
        switch (sensitivity) {
            default:
                return <img src={lowSense} />;
            case ('average'):
                return <img src={avgSense} />;
        }
    }

    handleAlertsDisplay = () => {
        if (this.state.showAlerts) {
            this.setState({ showAlerts: false });
        } else {
            this.setState({ showAlerts: true });
        }
    }

    hideAlertsDisplay = () => {    
        if (this.state.showAlerts) {
            this.setState({ showAlerts: false }, () => {
                this.props.resetAlertsCount();
            });
        }
    }

    render() {
        return (
            <a className="alerts-icon-section">
                <img
                    src={notification}
                    title="Notifications"
                    onClick={this.handleAlertsDisplay} />
                {this.state.alertCount > 0 && <div className="alert-count-container"><p>{this.state.alertCount}</p></div>}
                {this.state.showAlerts &&
                    <section className="alert-box">
                        <h5>Alerts</h5>
                        {this.state.alertCount > 2 ? (
                            data.csmData.map((item, key) => (
                                <section key={key} className={item.status === 'inactive' ? 'alert-panel inactive-alert' : 'alert-panel'}>
                                    <div className="d-flex align-items-center">
                                        <div className="icon-section">
                                            {this.getIcon(item.icon, item.topic)}
                                        </div>
                                        <div className="name-section">
                                            <label><span className={item.topic.toLowerCase().split(' ').join('-')} />{item.topic}</label>
                                            <p className="card-name">{item.cardName}</p>
                                            <p className="card-subtext">{item.subText}</p>
                                        </div>
                                        <div className="sensitivity-section">
                                            {this.getSensitivityImage(item.sensitivity)}
                                        </div>
                                    </div>
                                    {item.status === 'active' && 
                                        <div className="alert-panel-footer d-flex">
                                            <div className="mr-auto">
                                                <p>Dismiss<i className="material-icons">delete</i></p>
                                            </div>
                                            <div>
                                                <p>Call plan<i className="material-icons">star_border</i></p>
                                            </div>
                                            <div>
                                                <p>Verify<i className="material-icons">check_box_outline_blank</i></p>
                                            </div>
                                        </div>
                                    }
                                </section>
                            ))
                        ) : (
                            data.adminSellerData.map((item, key) => (
                                <section key={key} className={item.status === 'inactive' ? 'alert-panel inactive-alert' : 'alert-panel'}>
                                    <div className="d-flex align-items-center">
                                        <div className="icon-section">
                                            {this.getIcon(item.icon, item.topic)}
                                        </div>
                                        <div className="name-section">
                                            <label><span className={item.topic.toLowerCase().split(' ').join('-')} />{item.topic}</label>
                                            <p className="card-name">{item.cardName}</p>
                                            <p className="card-subtext">{item.subText}</p>
                                        </div>
                                        <div className="sensitivity-section">
                                            {this.getSensitivityImage(item.sensitivity)}
                                        </div>
                                    </div>
                                    {item.status === 'active' && 
                                        <div className="alert-panel-footer d-flex">
                                            <div className="mr-auto">
                                                <p>Dismiss<i className="material-icons">delete</i></p>
                                            </div>
                                            <div>
                                                <p>Call plan<i className="material-icons">star_border</i></p>
                                            </div>
                                            <div>
                                                <p>Verify<i className="material-icons">check_box_outline_blank</i></p>
                                            </div>
                                        </div>
                                    }
                                </section>
                            ))
                        )}
                    </section>
                }
            </a>
        );
    }
}

function mapStateToProps(state) {
    return { alertCount: state.form.alertCount };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ resetAlertsCount: () => actions.change('form.alertCount', 0) }, dispatch);
}
export const Alerts = connect(mapStateToProps, mapDispatchToProps)(AlertsImpl);
