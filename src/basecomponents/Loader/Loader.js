import React, { PureComponent } from 'react';
import loader from '../../assets/images/loader.gif';

export class Loader extends PureComponent {
    render() {
        const style = {
            background: 'white',
            position: 'fixed',
            opacity: 0.5,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
        };
        return (
            <div className="react-loader" style={style}>
                <img src={loader} alt="_loading" title="Loading..." />
            </div>
        );
    }
}

