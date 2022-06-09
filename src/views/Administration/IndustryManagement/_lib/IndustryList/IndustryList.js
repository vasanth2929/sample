import React, { Component } from 'react';
import './IndustryList.scss';

export class IndustryList extends Component {
    state = { editMode: false }
    handleIndustryValueChange = (e) => {
        e.stopPropagation();
        const { currentIndustry } = this.props;
        const value = e.target.value;
        this.setState({ currentIndustry: { ...currentIndustry, value } });
    }

    industryClicked = (industry) => {
        const { selectable } = this.props;
        if (selectable) this.setCurrentIndustry(industry);
    }

    industryEditClicked = (industry) => {
        this.setState({ editMode: true });
        if (industry) this.setCurrentIndustry(industry);
    }

    cancelEdit = () => {
        this.setState({ editMode: false });
        this.setCurrentIndustry({ currentIndustry: null });
    }

    setCurrentIndustry = (industry) => {
        const { handleSetCurrentIndustry } = this.props;
        handleSetCurrentIndustry(industry);
    }

    handleIndustryCreate = () => {
        const { handleAddIndustry } = this.props;
        const { currentIndustry } = this.state;
        handleAddIndustry(currentIndustry);
        this.setState({ currentIndustry: null, editMode: false });
    }

    handleIndustryUpdate = () => {
        const { handleUpdateIndustry } = this.props;
        const { currentIndustry } = this.state;
        handleUpdateIndustry(currentIndustry);
        this.setState({ currentIndustry: null, editMode: false });
    }

    render() {
        const { 
            industries, 
            selectable, 
            editable, 
            currentIndustry 
        } = this.props;
        const { editMode } = this.state;
        return (
            <div className="tribyl-industries-list-wrapper">
                <h2>Tribyl Industries</h2>
                <ul>
                    {
                        editable && (
                            currentIndustry && !(currentIndustry.qualifierId) && editMode ? (
                                <li>
                                    <div className="industry-value-input-wrapper create">
                                        <input className="industry-value-input" onChange={this.handleIndustryValueChange} />
                                        <div className="industry-value-input-options">
                                            <i
                                                role="button"
                                                className="material-icons cancel"
                                                onClick={this.cancelEdit}>
                                                clear
                                            </i>
                                            <i
                                                role="button"
                                                className="material-icons done"
                                                onClick={this.handleIndustryCreate}>
                                                done
                                            </i>
                                        </div>
                                    </div>
                                </li>
                            ) : (
                                    <li className="add-industry-option">
                                        <div className="add-industry-option-button" role="button" onClick={() => this.industryEditClicked({})}>
                                            <i className="material-icons">add_circle</i>
                                            <div className="text-display">Add Industry</div>
                                        </div>
                                    </li>
                                )
                        )
                    }
                    {industries.map((industry, industryIdx) => {
                        return (
                            currentIndustry && editMode ? (
                                <li key={`current-industry-${industryIdx}`}>
                                    {currentIndustry.qualifierId !== industry.qualifierId &&
                                        <div className="text-display disable">{industry.value}</div>}
                                    {currentIndustry.qualifierId === industry.qualifierId &&
                                        <div className="industry-value-input-wrapper">
                                            <input
                                                className="industry-value-input"
                                                defaultValue={industry.value}
                                                onChange={this.handleIndustryValueChange} />
                                            <div className="industry-value-input-options">
                                                <i
                                                    role="button"
                                                    className="material-icons cancel"
                                                    onClick={this.cancelEdit}>
                                                    clear
                                                </i>
                                                <i
                                                    role="button"
                                                    className="material-icons done"
                                                    onClick={this.handleIndustryUpdate}>
                                                    done
                                                </i>
                                            </div>
                                        </div>
                                    }
                                </li>
                            ) : (
                                    <li 
                                        key={`current-industry-${industryIdx}`}
                                        className={`${selectable ? 'selectable' : ''} ${currentIndustry && currentIndustry.qualifierId === industry.qualifierId ? 'selected' : ''}`} 
                                        onClick={() => this.industryClicked(industry)}>
                                        <div
                                            role="button"
                                            className="text-display" >
                                            {industry.value}
                                            {
                                                editable &&
                                                <i
                                                    role="button"
                                                    className="material-icons"
                                                    onClick={() => this.industryEditClicked(industry)}>
                                                    edit
                                                </i>
                                            }
                                        </div>
                                    </li>
                                )
                        );
                    })}
                </ul>
            </div>
        );
    }
}
