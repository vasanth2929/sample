import React, { Component } from 'react';
import './CompetitionTable.style.scss';

const DEFAULT_CLASSNAME = "competition-table";
class CompetitionTable extends Component {
    render() {
        const { mockData } = this.props;
        return (
            <div className={DEFAULT_CLASSNAME}>
                <table className="table table-borderless">
                    <thead>
                        <tr className="heading">
                            <th style={{ width: "15%" }}>COMPETITOR</th>
                            <th style={{ width: "20%" }} />
                            <th style={{ width: "15%" }}>WIN RATE</th>
                            <th style={{ width: "25%" }}>TOP 3 STRENGTHS</th>
                            <th style={{ width: "25%" }}>TOP 3 WEAKNESSES </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockData.map((data, colIdx) => (
                            <tr key={`competition-${colIdx}`} className="content">
                                <td className="title"><span>{data.Industry}</span></td>
                                <td>
                                    <div className="stats" style={{ width: `${data.rowWidth}%` }} />
                                </td>
                                <td className="winrate-wrapper">
                                    <div className="winrate">{data.WinRate}%</div>
                                    <div className="quarter">
                                        <div className="quarter-negative"> -10% Q/Q</div>
                                        <div className="quarter-positive"> +20% Y/Y</div>
                                    </div>
                                </td>
                                <td>
                                    {data.Strengths.map((strengthData, topIdx) => (
                                        <div key={topIdx} className="strength">
                                            <span className="strength-text">{strengthData.text} </span>
                                            <span className="strength-rating">
                                                <span className="material-icons rate">grade</span>{strengthData.rating}
                                            </span>
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {data.Weakness.map((weakData, topIdx) => (
                                        <div key={topIdx} className="strength">
                                            <span className="strength-text">{weakData.text} </span>
                                            <span className="strength-rating">
                                                <span className="material-icons rate">grade</span>{weakData.rating}
                                            </span>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default CompetitionTable;
