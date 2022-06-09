
import React from 'react';
import checkboxBlank from '../../../../assets/iconsV2/checkbox-blank.png';
import checkboxChecked from '../../../../assets/iconsV2/checkbox-checked.png';

export class VerifyStatusIcon extends React.PureComponent {
    render() {
        const {
            enableVerify,
            verified,
            verifyCount,
            updateVerifyStatus
        } = this.props;
        return (
            <div
                role="button"
                className="machineGenIconContainer"
                onClick={updateVerifyStatus}>
                <img
                    className={`material-icons ${enableVerify ? 'disabledCheckBox' : 'enabledCheckBox'}`}
                    src={verified ? checkboxChecked : checkboxBlank} />
                {
                    verifyCount > 0 &&
                    <div className="verifyCountContainer">
                        <p>{verifyCount}</p>
                    </div>
                }
            </div>
        );
    }
}
