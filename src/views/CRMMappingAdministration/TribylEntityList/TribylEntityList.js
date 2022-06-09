import React, { Component } from 'react';
import Select from 'react-select';
import './TribylEntityList.scss';
import { Loader } from '../../../_tribyl/components/_base/Loader/Loader';

export class TribylEntityList extends Component {
    state = {
        editMode: false
    }
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

    handleSelectChange = (tribylObject) => {
        const { handleObjectSelect } = this.props;
        if (handleObjectSelect) handleObjectSelect(tribylObject);
    }

    handleObjectFieldSelectChange = (tribylObjectField) => {
        const { handleObjectFieldSelect } = this.props;
        if (handleObjectFieldSelect) handleObjectFieldSelect(tribylObjectField);
    }

    render() {
        const {
            loading,
            objects = [],
            selectedObject,
            selectedObjectFields = [],
            selectedObjectField,
            selectable,
            editable,
            currentIndustry
        } = this.props;
        const { editMode } = this.state;
        return (
            <div className="tribyl-industries-list-wrapper tribyl-entities">
                <div className="tribyl-object-select-header-wrapper">
                    <div className="tribyl-object-select-wrapper">
                        <label>Tribyl Entity</label>
                        <Select
                            className="tribyl-object-select"
                            value={selectedObject}
                            options={objects}
                            clearable={false}
                            onChange={this.handleSelectChange} />
                    </div>
                    <h2>Tribyl Attributes</h2>
                </div>
                <ul>
                    {
                        loading ? (
                            <Loader />
                        ) : (
                            selectedObjectFields.map((field) => {
                                    return (
                                        <li
                                            className={`${selectable ? 'selectable' : ''} ${selectedObjectField && selectedObjectField.Id === field.Id ? 'selected' : ''}`}
                                            onClick={() => this.handleObjectFieldSelectChange(field)}>
                                            <div
                                                role="button"
                                                className="text-display" >
                                                {field.labelName}
                                            </div>
                                        </li>
                                    );
                                })
                            )

                    }
                </ul>
            </div>
        );
    }
}
