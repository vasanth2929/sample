import React, { Component } from 'react';
import './Header.style.scss';
import { Button } from '../Button/Button';
import { SearchInput } from '../SearchInput/SearchInput';
import img_avatar from '../../../assets/icons/img_avatar.png';


const DEFAULT_CLASSNAME = "expert-network-header";

class Header extends Component {
    handlechange = (value) => {
        console.log(value);
    }

    render() {
        return (
            <div className={`${DEFAULT_CLASSNAME}`}>
                <div className={`${DEFAULT_CLASSNAME}-content`}>
                    <div className="d-flex align-items-center ">
                        <span className="heading-large heading-bold  mr-5">
                            Tribyl
                        </span>
                        <SearchInput onChange={this.handlechange} placeholder="Search Questions, Polls and reports" className={`${DEFAULT_CLASSNAME}-content-search`} />
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}-content-options`}>
                        <Button>Refer an expert</Button>
                        <Button className="ask-question">Ask a Question</Button>
                        <Button className="poll">Add a Poll</Button>
                        <img src={img_avatar} className={`${DEFAULT_CLASSNAME}-content-options-avatar`} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
