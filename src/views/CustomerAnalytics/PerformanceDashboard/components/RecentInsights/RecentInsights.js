import React, { Component } from 'react';
import './RecentInsights.style.scss';
import { CustomeCarousels } from '../CustomeCarousels/CustomeCarousels';
import { getRecentCardNotes } from '../../../../../util/promises/customer_analysis';

const DEFUALT_CLASSNAME = "recent-insights-container";

class RecentInsights extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            isLoading: true,
            insights: []
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        const { selectedNoteCard } = this.props;
        const respsone = await getRecentCardNotes();
        this.setState({ isLoading: false, insights: respsone.data });
    }


    handleSelect = (selectedIndex, e) => {
        this.setState({ activeIndex: selectedIndex });
    };

    renderContent = (data) => {
        return data && data.map((i, index) => (
            <div key={`insights-content-${index}`} className="insights">
                <div className="insights-content">
                    <div className="heading">{i.cardTitle ? i.cardTitle : ""}</div>
                    <div className="description">{i.notes} </div>
                </div>
                <div className="insights-info">
                    <div className="sub-heading large"> {i.noteUsers ? i.noteUsers[0].userName : ""}</div>
                    {/* <div className="text green">Win | {i.totalOpptyAmount} | FY20Q1</div> */}
                </div>
            </div>
        ));
    }

    render() {
        const { insights, isLoading } = this.state;
        // const { selectedNoteCard } = this.props;
        return (
            <div className={DEFUALT_CLASSNAME}>
                <div className={`${DEFUALT_CLASSNAME}-title`}>Recent Insights</div>
                <div className={`${DEFUALT_CLASSNAME}-slider`}>
                    {!isLoading ?
                        (insights.length > 0 ?
                            <CustomeCarousels>{this.renderContent(insights)}</CustomeCarousels> :
                            <i>No insights found...</i>) :
                        <i>Loading insights...</i>}
                </div>
            </div>
        );
    }
}

// const mapStateToProps = (state) => {
//     return {
//         selectedNoteCard: state.marketAnalysisReducer.selectedNoteCard
//     }
// }

// export default connect(mapStateToProps)(RecentInsights);
export default RecentInsights;
