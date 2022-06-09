import React, { PureComponent } from 'react';
import { TextBlock, Button } from 'react-placeholder-shimmer';

import './styles/ShimmerForm.styles.scss';

export class ShimmerForm extends PureComponent {
    render() {
        return (
            <div role="button" className="shimmer-form">
                    <div className="shimmer-header ">
                        <TextBlock centered textLines={[25]} />
                    </div>
                    <div className="shimmer-card-content-section">
                        <div className="row">
                            <div className="col-2">
                                <TextBlock textLines={[100]} />
                            </div>

                            <div className="col-10">
                                <TextBlock textLines={[80]} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <TextBlock textLines={[100]} />
                            </div>

                            <div className="col-10">
                                <TextBlock textLines={[80]} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <TextBlock textLines={[100]} />
                            </div>

                            <div className="col-10">
                                <TextBlock textLines={[80]} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <TextBlock textLines={[100]} />
                            </div>

                            <div className="col-10">
                                <TextBlock textLines={[80]} />
                            </div>
                        </div>

                        <div className="row ">
                            <div className="col-6 " />
                            <div className="col-6 ">
                                <div className="row button">
                                    <Button width="35" />
                                    <Button width="35" />
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}
