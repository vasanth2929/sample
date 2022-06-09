import React from 'react';
import { IndustryList } from '../_lib/IndustryList/IndustryList';
import { getCRMTribylIndustryMappings, getTribylIndustries, removeCRMIndustryMapping, updateCRMIndustry } from '../../../../util/promises/meta-data-promise';
import './CRMTribylIndustryMappingsTab.scss';
import { IndustryMappingList } from '../_lib/IndustryMappingList/IndustryMappingList';

export class CRMTribylIndustryMappingsTab extends React.Component {
    state = {
        industries: [],
        crmIndustries: []
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.getTribylIndustries();
        this.getCRMTribylIndustryMappings();
    }

    getCRMTribylIndustryMappings = () => {
        getCRMTribylIndustryMappings()
            .then((res) => {
                const crmIndustries = res.data || [];
                const sortedCRMIndustries = crmIndustries.sort((a, b) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()));
                this.setState({ crmIndustries: sortedCRMIndustries });
            });
    }

    getTribylIndustries = () => {
        getTribylIndustries()
            .then((res) => {
                const industries = res.data || [];
                const sortedIndustries = industries.sort((a, b) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()));
                this.setState({ industries: sortedIndustries });
            });
    }

    createCRMTribylIndustryMapping = (crmIndustry) => {
        const { currentIndustry } = this.state;
        const payload = {
            industryDetailValueId: crmIndustry.industryDetailValueId,
            qualifierId: currentIndustry.qualifierId
        };
        updateCRMIndustry(payload)
            .then(() => this.loadData());
    }

    removeCRMTribylIndustryMapping = (crmIndustry) => {
        const { currentIndustry } = this.state;
        removeCRMIndustryMapping(crmIndustry.industryDetailValueId, currentIndustry.qualifierId)
            .then(() => this.loadData());
    }

    handleSetCurrentIndustry = (currentIndustry) => {
        this.setState({ currentIndustry: { ...currentIndustry } });
    }

    render() {
        const { industries, crmIndustries, currentIndustry } = this.state;
        return (
            <div className="industry-list-wrapper">
                <IndustryList
                    selectable
                    industries={industries}
                    currentIndustry={currentIndustry}
                    handleSetCurrentIndustry={this.handleSetCurrentIndustry} />
                <IndustryMappingList
                    industries={crmIndustries}
                    currentIndustry={currentIndustry}
                    createMapping={this.createCRMTribylIndustryMapping}
                    removeMapping={this.removeCRMTribylIndustryMapping} />
            </div>
        );
    }
}
