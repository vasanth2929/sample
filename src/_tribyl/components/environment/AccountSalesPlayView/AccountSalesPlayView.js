import React from 'react';
import { CheckBox } from '../../../../basecomponents/CheckBox/CheckBox';

export class AccountSalesPlayView extends React.Component {
    render() {
        const { readOnly, salesPlays } = this.props;
        return (
            <div className="list-wrapper">
                {salesPlays.sort((a, b) => a.playbookSalesPlayId - b.playbookSalesPlayId).map((item, key) => (
                    <div className="sales-play" key={key}>
                        <CheckBox
                            id={`${item.name}_${key}`}
                            label={item.name}
                            isChecked={item.currentSalesPlay}
                            disabled={readOnly} />
                    </div>
                ))}
            </div>
        );
    }
}
