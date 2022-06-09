import React, { PureComponent } from 'react';
import { TextBlock } from 'react-placeholder-shimmer';

import './styles/ShimmerCard.styles.scss';

export class ShimmerCard extends PureComponent {
    render() {
        return (
            <div role="button" className="shimmer-card">
                <div className="card front-card">
                    <div className="shimmer-section">
                        <div className="shimmer-header ">
                            <TextBlock centered textLines={[70, 90]} style={{ textSize: '5px' }} />
                        </div>
                    </div>
                    <div className="shimmer-card-info-area">
                        <div className="shimmer-card-content-section">
                            <TextBlock textLines={[50]} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
