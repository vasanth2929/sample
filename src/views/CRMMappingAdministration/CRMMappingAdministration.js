
/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import './CRMMappingAdministration.scss';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { Icons } from '../../constants/general';
import { TribylEntityList } from './TribylEntityList/TribylEntityList';
import { getAllTribylObj, getAllCRMObj, getTribylObjectDetails, getCRMObjectDetails, setTribylFieldMetadataToCrmFieldMetadataRel } from '../../util/promises/crm-mapping-promise';
import { CRMEntityList } from './CRMEntityList/CRMEntityList';

export default class CRMMappingAdministration extends React.Component {
    state = { loadingTribylObjectFields: true }

    componentDidMount() {
        Promise.all([
            getAllTribylObj(),
            getAllCRMObj()
        ]).then((response) => {
            const tribylObjects = (response[0].data || [])
                .map(tribylObject => ({
                    ...tribylObject,
                    value: tribylObject.Id,
                    label: tribylObject.objectName
                }));
            const crmObjects = (response[1].data || [])
                .map(crmObject => ({
                    ...crmObject,
                    value: crmObject.Id,
                    label: crmObject.objectName
                }));
            this.setState({
                tribylObjects,
                crmObjects,
                selectedTribylObject: tribylObjects[0]
            }, () => {
                this.getTribylObjectFields();
            });
        });
    }

    getTribylObjectFields = () => {
        const { selectedTribylObject } = this.state;
        this.setState({ loadingTribylObjectFields: true });

        if (selectedTribylObject) {
            getTribylObjectDetails(selectedTribylObject.objectName)
                .then((response) => {
                    const selectedTribylObjectFields = (response.data.fieldNamesList || [])
                        .sort((a, b) => a.labelName.localeCompare(b.labelName));
                    this.setState({ selectedTribylObjectFields });
                });
        }

        this.setState({ loadingTribylObjectFields: false });
    }

    getCRMObjectFields = () => {
        const { selectedCRMObject } = this.state;
        this.setState({ loadingCRMObjectFields: true });
        getCRMObjectDetails(selectedCRMObject.Id)
            .then((response) => {
                const selectedCRMObjectFields = (response.data.fieldNamesList || [])
                    .sort((a, b) => a.labelName.localeCompare(b.labelName));
                this.setState({ loadingCRMObjectFields: false, selectedCRMObjectFields });
            });
    }

    handleTribylObjectSelect = (selectedTribylObject) => {
        this.setState({
            selectedTribylObject,
            selectedTribylObjectField: undefined,
            selectedCRMObjectFields: undefined,
            selectedCRMObjectField: undefined
        }, () => this.getTribylObjectFields());
    }

    handleTribylObjectFieldSelect = (selectedTribylObjectField) => {
        this.setState({
            selectedTribylObjectField,
            selectedCRMObjectField: undefined
        });
    }

    handleCRMObjectSelect = (selectedCRMObject) => {
        this.setState({
            selectedCRMObject,
            selectedCRMObjectField: undefined
        }, () => this.getCRMObjectFields());
    }

    handleCRMObjectFieldSelect = (selectedCRMObjectField) => {
        this.setState({ selectedCRMObjectField });
    }

    handleSaveMapping = () => {
        const { selectedTribylObjectField, selectedCRMObjectField } = this.state;
        setTribylFieldMetadataToCrmFieldMetadataRel(
            selectedTribylObjectField.Id,
            selectedCRMObjectField.Id
        ).then(() => {
            this.setState({ selectedCRMObjectField: undefined }, () => {
                this.getTribylObjectFields();
                this.getCRMObjectFields();
            });
        });
    }

    render() {
        const {
            tribylObjects = [],
            selectedTribylObject = {},
            selectedTribylObjectFields = [],
            selectedTribylObjectField,
            crmObjects = [],
            selectedCRMObject,
            selectedCRMObjectFields = [],
            selectedCRMObjectField,
            loadingTribylObjectFields,
            loadingCRMObjectFields
        } = this.state;
        return (
            <ErrorBoundary>
                <section className="outreach-properties-view">
                    <MainPanel
                        viewName="CRM Mapping Administration"
                        icons={[Icons.MAINMENU]}
                        viewHeader={
                            <div className="container">
                                <div className="title-label row">
                                    <div className="col-8">
                                        <p>CRM Mapping Administration</p>
                                    </div>
                                </div>
                            </div>
                        }>
                        <div className="container crm-mapping-administration-wrapper">
                            <TribylEntityList
                                loading={loadingTribylObjectFields}
                                objects={tribylObjects}
                                selectedObject={selectedTribylObject}
                                selectedObjectFields={selectedTribylObjectFields}
                                selectedObjectField={selectedTribylObjectField}
                                handleObjectSelect={this.handleTribylObjectSelect}
                                handleObjectFieldSelect={this.handleTribylObjectFieldSelect} />
                            <CRMEntityList
                                loading={loadingCRMObjectFields}
                                objects={crmObjects}
                                selectedObject={selectedCRMObject}
                                selectedObjectFields={selectedCRMObjectFields}
                                selectedObjectField={selectedCRMObjectField}
                                selectedTribylObject={selectedTribylObject}
                                selectedTribylObjectField={selectedTribylObjectField}
                                handleObjectSelect={this.handleCRMObjectSelect}
                                handleObjectFieldSelect={this.handleCRMObjectFieldSelect} />
                        </div>
                        <div className="crm-mapping-footer">
                            <div className="actions-wrapper">
                                <button onClick={this.handleCRMObjectFieldSelect}>Cancel</button>
                                <button className="save-btn" onClick={this.handleSaveMapping}>Save</button>
                            </div>
                        </div>
                    </MainPanel>
                </section>
            </ErrorBoundary>
        );
    }
}
