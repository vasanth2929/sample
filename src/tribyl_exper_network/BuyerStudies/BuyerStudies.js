import React, { Component } from 'react';
import './BuyerStudies.style.scss';
import TabSwitch from './components/TabSwitch/TabSwitch';
import Card from './components/Card/Card';
import { getMarketStudy } from '../../util/promises/expert-network';


const DEFAULT_CLASSNAME = "expert-network-buyer-studies";


class BuyerStudies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            marketStudyData: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        const { playbookId } = this.props;
        const repsonse = await getMarketStudy(playbookId);
        const marketStudyData = repsonse && repsonse.data[0].marketStudyDtoList;
        this.setState({ marketStudyData, isLoading: false })
    }

    render() {
        const { marketStudyData, isLoading } = this.state;
        return (
            <div className={`${DEFAULT_CLASSNAME}`}>
                <div className="sub-heading mb-4">
                    Tribyl studies are ‘always on’.
                    They keep getting updated as members like you contribute their insights.
                    Complete a study to unlock what your peers are saying, and earn redeemable points
                </div>
                <TabSwitch />
                {!isLoading ?
                    <div className={`${DEFAULT_CLASSNAME}-card-section`}>
                        {marketStudyData.map(data => (
                            <Card data={data} showComplete />
                        ))}
                    </div>
                    : <i>Loading Data...</i>
                }
            </div>
        );
    }
}

export default BuyerStudies;
