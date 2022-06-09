import React, { Component } from 'react';
import { ShortNumber } from "../../../../util/utils";
import './CustomerNeedTable.style.scss';

const DEFAULT_CLASSNAME = "customerneeds-table";

class CustomerNeedTable extends Component {

    renderNeedData = (story) => {
        return story.map((data, colIdx) => (
            <tr key={`exceutive-${colIdx}`} className="content">
                <td className="title"><span>{data.industryName}</span></td>
                <td>
                    <div className="stats" style={{ width: `${data.rowWidth}%` }} />
                </td>
                <td className="amount-wrapper">
                    <div className="amount">{data.amount ? ` $ ${ShortNumber(data.amount, 1)} ` : `$ 0` }</div>
                    {/* <div className="quarter">
                        <div className="quarter-negative"> -10% Q/Q</div>
                        <div className="quarter-positive"> +20% Y/Y</div>
                    </div> */}
                </td>
                <td>
                    {data.topPerformers && data.topPerformers.map((topData, topIdx) => (
                        <div key={topIdx} className="performer">
                            <span className="performer-text">{topData.cardTitle} </span>
                            <span className="performer-amount">{"$ " + ShortNumber(topData.totalAmount, 1)} </span>
                        </div>
                    ))}
                </td>
                <td>
                    {data.bottomPerformers && data.bottomPerformers.map((bottomData, topIdx) => (
                        <div key={topIdx} className="performer">
                            <span className="performer-text">{bottomData.cardTitle} </span>
                            <span className="performer-amount">{"$ " + ShortNumber(bottomData.totalAmount, 1)} </span>
                        </div>
                    ))}
                </td>
            </tr>
        ));
    } 
    
    render() {
        const { needStory, isLoading } = this.props;
        return (
            <div className={DEFAULT_CLASSNAME} >
            <table className="table table-borderless">
            <thead>
              <tr className="heading">
                <th style={{ width: "15%" }}>INDUSTRY</th>
                <th style={{ width: "20%" }} />
                <th style={{ width: "15%" }}>AMOUNT</th>
                <th style={{ width: "25%" }}>TOP PERFORMERS</th>
                <th style={{ width: "25%" }}>BOTTOM PERFORMERS</th>
              </tr>
            </thead>
                <tbody>
                    {!isLoading ? (needStory && needStory.length > 0 ? this.renderNeedData(needStory) : <i>No Stories Found</i>) : <i className="ml-4"> Loading Data ... </i> }
                </tbody>     
            </table>
            </div>
        );
    }
}

export default CustomerNeedTable;
