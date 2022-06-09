
import React from 'react';
import checkboxBlank from '../../../../assets/iconsV2/checkbox-blank.png';
import checkboxChecked from '../../../../assets/iconsV2/checkbox-checked.png';

export class VerifyStatusLabeledIcon extends React.PureComponent {
    render() {
        const {
            enableVerify,
            verified,
            updateCardVerifyStatus
        } = this.props;
        return (
            <div className="status text-capitalize">
                {verified ? 'Verified' : 'Not Verified'} &nbsp;
                <div
                    role="button"
                    className="machineGenIconContainer">
                    <img
                        className={`material-icons ${enableVerify ? 'disabledCheckBox' : 'enabledCheckBox'}`}
                        src={verified ? checkboxChecked : checkboxBlank}
                        onClick={updateCardVerifyStatus} />
                </div>
            </div>
        );
    }
}

