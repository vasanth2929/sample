import React, { Component } from 'react';
import './AccountMappingList.scss';
import { CheckBox } from '../../../../../basecomponents/CheckBox/CheckBox';

export class AccountMappingList extends Component {
    checkboxClicked = (industry) => {
        const { currentIndustry } = this.props;
        if (currentIndustry && industry.qualifierRelBeans && industry.qualifierRelBeans.find(bean => bean.qualifierId === currentIndustry.qualifierId)) {
            this.handleIndustryRemoveMapping(industry);
        } else this.handleIndustryAddMapping(industry);
    }

    handleIndustryAddMapping = (industry) => {
        const { createMapping } = this.props;
        createMapping(industry);
    }

    handleIndustryRemoveMapping = (industry) => {
        const { removeMapping } = this.props;
        removeMapping(industry);
    }

    render() {
        const { industries, currentIndustry } = this.props;
        return (
            <div className="mapped-crm-industries-list-wrapper crm-mappings">
                <h2>{currentIndustry && currentIndustry.qualifierId ? currentIndustry.value : 'No Industry Selected'}</h2>
                <div className="mapped-crm-industries-list">
                    {
                        currentIndustry &&
                        (
                            industries.filter(industry => industry.qualifierRelBeans
                                && industry.qualifierRelBeans.find(bean => bean.qualifierId === currentIndustry.qualifierId)).length > 0
                                ? (
                                    <ul>
                                        {industries
                                            .filter(industry => industry.qualifierRelBeans
                                                && industry.qualifierRelBeans.find(bean => bean.qualifierId === currentIndustry.qualifierId))
                                            .map((industry) => {
                                                return (
                                                    <li>
                                                        <div className="text-display">
                                                            {industry.value}
                                                            <i
                                                                role="button"
                                                                className="material-icons grey"
                                                                onClick={() => this.handleIndustryRemoveMapping(industry)}>
                                                                delete
                                                            </i>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                ) : (
                                    <span className="no-results">No mappings found</span>
                                )
                        )

                    }
                </div>
                <h2>CRM Industries</h2>
                <div className="all-crm-industries-list">
                    <span className="list-header">Available: </span>
                    <ul>
                        {industries
                            .filter((industry) => {
                                return (!industry.qualifierRelBeans || !industry.qualifierRelBeans.length > 0);
                            })
                            .map((industry) => {
                                const isMappedToThisQualifier = (currentIndustry && industry.qualifierRelBeans
                                    && industry.qualifierRelBeans.find(bean => bean.qualifierId === currentIndustry.qualifierId));
                                const isMappedToAnotherQualifier = (currentIndustry && industry.qualifierRelBeans
                                    && industry.qualifierRelBeans.length > 0
                                    && !industry.qualifierRelBeans.find(bean => bean.qualifierId === currentIndustry.qualifierId));
                                return (
                                    <li>
                                        <div className="text-display">
                                            <CheckBox
                                                disabled={!currentIndustry || isMappedToAnotherQualifier}
                                                isChecked={isMappedToThisQualifier}
                                                onChange={() => this.checkboxClicked(industry)} />
                                            <span className={`industry-value ${(!currentIndustry || isMappedToAnotherQualifier) ? 'disable' : ''}`}>{industry.value}</span>
                                        </div>
                                    </li>
                                );
                            })}
                    </ul>
                    <span className="list-header">In-use: </span>
                    <ul>
                        {industries
                            .filter((industry) => {
                                return industry.qualifierRelBeans && industry.qualifierRelBeans.length > 0;
                            })
                            .map((industry) => {
                                const isMappedToThisQualifier = (currentIndustry && industry.qualifierRelBeans
                                    && industry.qualifierRelBeans.find(bean => bean.qualifierId === currentIndustry.qualifierId));
                                const isMappedToAnotherQualifier = (currentIndustry && industry.qualifierRelBeans
                                    && industry.qualifierRelBeans.length > 0
                                    && !industry.qualifierRelBeans.find(bean => bean.qualifierId === currentIndustry.qualifierId));
                                return (
                                    <li>
                                        <div className="text-display">
                                            <CheckBox
                                                disabled={!currentIndustry || isMappedToAnotherQualifier}
                                                isChecked={isMappedToThisQualifier}
                                                onChange={() => this.checkboxClicked(industry)} />
                                            <span className={`industry-value ${(!currentIndustry || isMappedToAnotherQualifier) ? 'disable' : ''}`}>{industry.value}</span>
                                        </div>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            </div>
        );
    }
}
