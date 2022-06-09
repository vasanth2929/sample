import React from 'react';
import Select from 'react-select';
// import 'react-select/dist/react-select.css';
import { TextBlock } from 'react-placeholder-shimmer';
import { searchAccountOwners } from '../../../../../../../../util/promises/opptyplan_promise';
import { ExpertPanelContent } from './containers/ExpertPanelContent/ExpertPanelContent';
import { getAllFunctionalTeams } from '../../../../../../../../util/promises/usercontrol_promise';

import './styles/ExpertsPanel.styles.scss';

export class ExpertsPanel extends React.Component {
    state = {
        accountList: [],
        isLoading: true,
        selectedRole: {
            displaySequence: 0,
            enumDisplayValue: 'All',
            orgId: 0
        },
        filteredData: []
    }
    
    componentDidMount() {
        this.getAllRoles().then(() => this.searchAccountOwners());
    }
    
    async getAllRoles() {
        const additionalFilters = [{
            displaySequence: 0,
            enumDisplayValue: 'All',
            orgId: 0
        }];
        const response = await getAllFunctionalTeams();
        const allFilters = additionalFilters.concat(response.data);
        return this.setState({ roles: allFilters });
    }
    async searchAccountOwners() {
        const { cardId, topicName } = this.props;
        
        const payload = {
            accNameList: ['All'],
            ecoBuyer: '',
            industryList: ['All'],
            marketList: ['All'],
            regionList: ['All'],
            sortOrder: "sort_recent",
            topicName,
            pBCardId: cardId
        };
        const response = await searchAccountOwners(payload);
        return this.setState({ accountList: response.data, filteredData: response.data, isLoading: false });
    }

    handleSelectChange = (key, value) => {
        const { accountList } = this.state;
        const filteredData = value.enumDisplayValue !== 'All' ? (accountList || []).filter(item => item.functionalTeam === value.enumDisplayValue) : accountList;
        this.setState({ [key]: value, filteredData });
    }

    renderShimmer = () => (
        <section className="experts-grid-loader">
            <TextBlock textLines={[97.5, 97.5, 97.5, 97.5, 97.5, 97.5, 97.5, 97.5, 97.5, 97.5]} />
        </section>
    );

    renderGridContent = () => {
        const { filteredData } = this.state;
        return (
            <div className="expert-grid-wrapper">
            <div className="row">
                <div className="col-3">
                    <div className="job-role-label">Job Role</div>
                    <Select
                        clearable={false}
                        className="select-list"
                        value={this.state.selectedRole}
                        onChange={val => this.handleSelectChange('selectedRole', val)}
                        options={this.state.roles}
                        placeholder="Select Roles"
                        valueKey="displaySequence"
                        labelKey="enumDisplayValue"
                        required 
                    />
                    
                </div>
            </div>
            <ExpertPanelContent expertsList={filteredData} />
            </div>
        );
    }
        
    render() {
        return (
                
                <div>
                    {!this.state.isLoading ? this.renderGridContent() : this.renderShimmer()}
                </div>
            
        );
    }
}
