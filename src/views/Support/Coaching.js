/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { getAllMediaFiles } from '../../util/promises/tutorials-promise';
import { RecentlyAdded } from './RecentlyAdded/RecentlyAdded';

import './styles/Coaching.style.scss';

const viewComponentMap = {
    'recently-added': { component: RecentlyAdded, label: 'Recently Added' },
    prospecting: { label: 'Prospecting' },
    'call-planing': { label: 'Call Planning' },
    'call-execution': { label: 'Call Execution' },
    'ae-handoff': { label: 'AE Handoff' },
    'opportunity-execution': { label: 'Opportunity Execution' },
};


class Coaching extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar: [
                {
                    label: "Recently Added",
                    target: "recently-added",
                },
                {
                    label: "Prospecting",
                    target: "prospecting ",
                    disabled: true,
                },
                {
                    label: "Call Planing",
                    target: "call-planing",
                    disabled: true,
                },
                {
                    label: "Call Execution",
                    target: "call-execution",
                    disabled: true,
                },
                {
                    label: "AE Handoff",
                    target: "eae-handoff",
                    disabled: true,
                },
                {
                    label: "Opportunity Execution",
                    target: "opportunity-execution",
                    disabled: true,
                },
            ],
            videos: [],
            selectedTab: 'recently-added'
        };
    }

    componentDidMount() {
        this.loadVideos();
    }

    loadVideos = async () => {
        const allMediaFiles = await getAllMediaFiles();
        const videos = allMediaFiles.data || [];
        this.setState({ videos });
    }

    showTab = (tabId) => {
        document.getElementById(tabId).tab("show");
    }

    sortFunction = (firstKey, secondKey) => {
        return (a, b) => (a[firstKey] > b[firstKey] ? a[secondKey] > b[secondKey] ? 1 : -1 : -1);
    }

    onChangeTab = (selectedTab) => {
        this.setState({ selectedTab });
    }

    render() {
        const { videos, selectedTab, } = this.state;
        const displayVideos = videos.sort(this.sortFunction('subType', 'name'));
        const ViewComponent = viewComponentMap[selectedTab].component ? viewComponentMap[selectedTab].component : RecentlyAdded;

        return (
            <div className="support-wrapper">
                <div className="support-banner">
                    <div className="banner-content">
                        <p className="support-title">Tribyl Coaching</p>
                        <p className="support-sub-title">How-to Videos</p>
                    </div>
                </div>
                <div className="support-content">
                    <div className="row">
                        <div className="col-3">
                            <Sidebar
                                selected={this.state.selectedTab}
                                menu={this.state.sidebar}
                                onChange={this.onChangeTab}
                            />
                        </div>
                        <div className="col-8 coaching-wrapper">
                            <div className="row d-flex">
                                <div className="col-12">
                                    <p className="support-header">{viewComponentMap[selectedTab].label}</p>
                                </div>
                                <ViewComponent videos={displayVideos} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Coaching;
