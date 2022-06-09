
import React from 'react';
import editIcon from '../../../../../assets/iconsV2/edit.svg';

export class CardFooter extends React.PureComponent {
    render() {
        const { 
            enableCallPlan,
            includeInCallPlan,
            enableDelete,
            enableAddInsight,
            updateCallPlanStatus,
            removeCard,
            insightClick
         } = this.props;
        return (
            <div className="footer">
                {enableCallPlan &&
                    <div className="footerLabelContainer" onClick={updateCallPlanStatus} role="button">
                        <p className={includeInCallPlan ? 'call-plan-label yellow' : 'call-plan-label'}>Call Plan</p>
                        <i className={includeInCallPlan ? 'material-icons yellow' : 'material-icons'} >{includeInCallPlan ? 'star' : 'star_border'}</i>
                    </div>
                }
                {enableDelete &&
                    <div className="footerLabelContainer" onClick={removeCard} role="button">
                        <i className="material-icons" style={{ cursor: 'pointer' }}>delete</i>
                    </div>
                }
                {enableAddInsight &&
                    <div className="footerLabelContainer" onClick={insightClick} role="button">
                        <p>Add insight</p>
                        <img className="edit-icon" src={editIcon} />
                        {/* <i className="material-icons">verified_user</i> */}
                    </div>
                }
            </div>
        );
    }
}
