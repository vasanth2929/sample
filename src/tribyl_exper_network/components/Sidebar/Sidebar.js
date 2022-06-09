import React, { Component } from 'react';
import './Sidebar.style.scss';
import { getAllPlaybooks } from '../../../util/promises/expert-network';
import { SearchInput } from '../SearchInput/SearchInput';

const DEFAULT_CLASSNAME = "expert-network-sidebar";

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            pbData: [],
            activeLink: 1
        };
    }


    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        try {
            const response = await getAllPlaybooks();
            const pbData = response && response.data;
            this.setState({ isLoding: false, pbData });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { pbData, isLoding, activeLink } = this.state;
        return (
            <div className={`${DEFAULT_CLASSNAME}`}>
                <SearchInput className={`${DEFAULT_CLASSNAME}-search`} placeholder="Search Marekets and tags" />
                <div className={`${DEFAULT_CLASSNAME}-list`}>
                    <div className={`${DEFAULT_CLASSNAME}-list-item`}>
                        <div index={0} className={`sub-heading-large sub-heading-medium `}>Latest</div>
                    </div>
                    {!isLoding ? pbData.map((item, index) => (
                        <div className={`${DEFAULT_CLASSNAME}-list-item ${(index + 1) === activeLink ? "selected" : ""}`}>
                            <div className="sub-heading-large sub-heading-medium">{item.name}</div>
                        </div>
                    )) : <i>Loading Data...</i>}
                </div>
            </div>
        );
    }
}

export default Sidebar;
