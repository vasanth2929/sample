import React, { Component } from 'react';
import Select from 'react-select';
import './CRMEntityList.scss';
import { Loader } from '../../../_tribyl/components/_base/Loader/Loader';
import { SearchInput } from '../../../_tribyl/components/_base/SearchInput/SearchInput';

export class CRMEntityList extends Component {
    state = { editMode: false }

    handleSelectChange = (tribylObject) => {
        const { handleObjectSelect } = this.props;
        if (handleObjectSelect) handleObjectSelect(tribylObject);
    }

    handleObjectFieldSelectChange = (crmObjectField) => {
        const { handleObjectFieldSelect } = this.props;
        if (handleObjectFieldSelect) handleObjectFieldSelect(crmObjectField);
    }

    render() {
        const {
            loading,
            objects = [],
            selectedObject = {},
            selectedObjectFields = [],
            selectedObjectField,
            selectedTribylObject,
            selectedTribylObjectField,
            selectable
        } = this.props;

        return (
            <div className={`tribyl-industries-list-wrapper ${selectedTribylObjectField ? '' : 'disable'}`}>
                <div className="tribyl-object-select-header-wrapper">
                    <div className="tribyl-object-select-wrapper">
                        <label>CRM Entity</label>
                        <Select
                            placeholder="Select CRM Entity"
                            className="tribyl-object-select"
                            value={selectedObject}
                            options={objects}
                            clearable={false}
                            onChange={this.handleSelectChange} />
                    </div>
                    <h2>CRM Attributes</h2>
                </div>
                <div className="crm-field-search-wrapper">
                    <SearchInput
                        value={this.state.searchValue}
                        onChange={searchValue => this.setState({ searchValue })} />
                </div>
                {!selectedTribylObject &&
                    <div className="crm-message">Please select a Tribyl Entity from the left panel</div>}
                {selectedTribylObject && !selectedObject.Id && !selectedTribylObjectField &&
                    <div className="crm-message">Please select a Tribyl field from the left panel</div>}
                {selectedTribylObjectField && !selectedObject.Id &&
                    <div className="crm-message">Please select a CRM Entity above</div>}
                <div className="overflow-auto">
                    <ul>
                        {
                            loading ? (
                                <Loader />
                            ) : (
                                    selectedObjectFields
                                        .filter(field => 
                                            !this.state.searchValue 
                                                || field.labelName.toLowerCase().includes(this.state.searchValue.toLowerCase()))
                                        .map((field) => {
                                        return (
                                            <li
                                                key={field.Id}
                                                className={
                                                    (selectable ? 'selectable' : '')
                                                    + (((selectedTribylObjectField && field.linkedField
                                                        && selectedTribylObjectField.Id === field.linkedField.Id)
                                                        ? 'current-mapped-field'
                                                        : ((selectedTribylObjectField && field.linkedField
                                                            && selectedTribylObjectField.Id !== field.linkedField.Id)
                                                            ? 'unavailable-mapped-field'
                                                            : (selectedObjectField && selectedObjectField.Id === field.Id)
                                                                ? 'selected-mapped-field ' : '')))
                                                }
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
            </div>
        );
    }
}
