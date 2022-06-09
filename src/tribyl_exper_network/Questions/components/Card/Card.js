import React, { Component } from 'react';
import './Card.style.scss';
import Options from '../../../../components/TripleDotOptions/Options';
import { throws } from 'assert';


const DEFAULT_CLASSNAME = "expert-network-cards";


class Card extends Component {
    handleSelect = (value) => {
        console.log(value);
    }
    render() {
        const { data } = this.props;
        return (
            <div className={`card ${DEFAULT_CLASSNAME}`}>
                <div className="card-header d-flex align-items-start justify-content-between">
                    <div className="card-info">
                        <div className='account-avatar'>
                            <span>{data.title.charAt(0)}</span>
                        </div>
                        <div>
                            <div className="sub-heading-bold">{data.title}</div >
                            <span className="text date">Posted on 2 Dec, 12 PM</span>
                        </div>
                    </div>
                    <Options onSelect={this.handleSelect} options={[{ id: "Option1", label: "Option1" }]} />
                </div>
                <div className="card-body">
                    <p className="sub-heading-bold sub-heading-large">
                        {data.text}
                    </p>
                    <div className="sub-text">
                        <span className="text">Only IT professionals can see this content</span>
                        <span className="text">#Architectecture and Statergy</span>
                        <span className="text link">+30 more</span>
                    </div>

                </div>
                <div className="card-footer">Footer</div>
            </div>
        );
    }
}

export default Card;
