import React from 'react';
import { IndustryList } from '../_lib/IndustryList/IndustryList';
import { getTribylIndustries, createTribylIndustry, updateTribylIndustry } from '../../../../util/promises/meta-data-promise';
import './TribylIndustriesTab.scss';

export class TribylIndustriesTab extends React.Component {
    state = {
        industries: [],
        currentIndustry: null
    }

    componentDidMount() {
        this.getTribylIndustries();
    }

    getTribylIndustries = () => {
        getTribylIndustries()
            .then((res) => {
                const industries = res.data || [];
                const sortedIndustries = industries.sort((a, b) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()));
                this.setState({ industries: sortedIndustries });
            });
    }

    handleSetCurrentIndustry = (currentIndustry) => {
        this.setState({ currentIndustry });
    }

    handleAddIndustry = (industry) => {
        createTribylIndustry(industry.value)
            .then(() => this.getTribylIndustries());
    }

    handleUpdateIndustry = (industry) => {
        this.setState(state => ({ industries: state.industries.map(item => (item.qualifierId === industry.qualifierId ? industry : item)) }));
        updateTribylIndustry(industry.qualifierId, industry.value)
            .then(() => this.getTribylIndustries());
    }

    render() {
        const { industries, currentIndustry } = this.state;
        return (
            <div className="industry-list-wrapper">
                <IndustryList
                    editable
                    industries={industries}
                    currentIndustry={currentIndustry}
                    handleSetCurrentIndustry={this.handleSetCurrentIndustry}
                    handleAddIndustry={this.handleAddIndustry}
                    handleUpdateIndustry={this.handleUpdateIndustry} />
            </div>
        );
    }
}
