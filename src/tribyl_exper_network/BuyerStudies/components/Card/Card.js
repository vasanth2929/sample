import React, { Component } from 'react';
import './Card.style.scss';
import { Button } from '../../../components/Button/Button';
import share from '../../../../assets/icons/share.svg';
import yellow_circle from '../../../../assets/icons/yellow_circle.svg';
import image_placeholder from '../../../../assets/icons/image_placeholder.png';

const DEFAULT_CLASSNAME = "expert-buyerStudies-cards";


class Card extends Component {
    render() {
        const { showComplete, data } = this.props;
        return (
            <div className={`${DEFAULT_CLASSNAME}`}>
                <div className={`${DEFAULT_CLASSNAME}-cover`} >
                    <img src={image_placeholder} />
                </div>
                <div className={`${DEFAULT_CLASSNAME}-body`}>
                    <p className="sub-heading sub-heading-bold">{data.marketStudyName || ""}</p>
                    <p className="text">Tribyl studies are ‘always on’.They keep getting updated as members like you contribute their insights.</p>
                    <div className={`${DEFAULT_CLASSNAME}-metrics`}>
                        <div className="text">
                            14 participants
                        </div>
                        <div className="text d-flex align-items-center">
                            <img src={yellow_circle} />
                            100 points
                        </div>
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}-footer`}>
                        <Button className={`${DEFAULT_CLASSNAME}-button`}>Continue</Button>
                        {showComplete && <div className="text text-medium"><img src={share} className="mr-1" />Share</div>}
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
