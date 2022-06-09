/* eslint-disable no-nested-ternary */
import React from 'react';
import signalPlus0 from '../../../../assets/iconsV2/signalPlus0.svg';
import signalPlus25 from '../../../../assets/iconsV2/signalPlus25.svg';
import signalPlus5 from '../../../../assets/iconsV2/signalPlus5.svg';
import signalPlus75 from '../../../../assets/iconsV2/signalPlus75.svg';
import signalPlus1 from '../../../../assets/iconsV2/signalPlus1.svg';
import signalMinus25 from '../../../../assets/iconsV2/signalMinus25.svg';
import signalMinus5 from '../../../../assets/iconsV2/signalMinus5.svg';
import signalMinus75 from '../../../../assets/iconsV2/signalMinus75.svg';
import signalMinus1 from '../../../../assets/iconsV2/signalMinus1.svg';

export class ThermometerIcon extends React.PureComponent {
    render() {
        const { grade } = this.props;
        switch (grade) {
            case 0:
                return <img className="thermometer" src={signalPlus0} />;
            case 0.25:
                return <img className="thermometer" src={signalPlus25} />;
            case 0.5:
                return <img className="thermometer" src={signalPlus5} />;
            case 0.75:
                return <img className="thermometer" src={signalPlus75} />;
            case 1:
                return <img className="thermometer" src={signalPlus1} />;
            case -0.25:
                return <img className="thermometer" src={signalMinus25} />;
            case -0.5:
                return <img className="thermometer" src={signalMinus5} />;
            case -0.75:
                return <img className="thermometer" src={signalMinus75} />;
            case -1:
                return <img className="thermometer" src={signalMinus1} />;
            default:
                return <img className="thermometer" src={signalPlus1} />;
        }
    }
}
