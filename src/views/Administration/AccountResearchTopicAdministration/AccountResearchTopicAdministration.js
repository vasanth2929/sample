import React, { PureComponent } from 'react';
import { TextBlock } from 'react-placeholder-shimmer';
import { MainPanel } from '../../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import { getGenericAcctResearchTopics, upsertGenericAcctResearchTopics, removeGenericAcctResearchTopics } from '../../../util/promises/opptyplan_promise';
import { Icons } from './../../../constants/general';
import './styles/AccountResearchTopicAdministration.style.scss';


export default class AccountResearchTopicAdministration extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            genericAccountLoading: true,
            genericAccountResearches: [],
            newGenericAccountResearch: ''
        };
    }

    componentDidMount() {
        this.getGenericAcctResearchTopics();
    }

    handleHeaderIconClick = (action) => {
        switch (action) {
            default:
                break;
        }
    };

    getGenericAcctResearchTopics = () => {
        getGenericAcctResearchTopics().then((response) => {
            if (response && response.data) {
                this.setState({ genericAccountLoading: false, genericAccountResearches: response.data });
            } else {
                this.setState({ genericAccountLoading: false, genericAccountResearches: [] });
            }
        });
    }

    addGenericAccountTopic = (keyCode) => {
        if (keyCode === 13) {
            let rank = 1;
            if (this.state.genericAccountResearches.length > 0) {
                const ranks = this.state.genericAccountResearches.map(item => Number(item.rank));
                let largest = ranks[0];
                for (let i = 0; i < ranks.length; i += 1) {
                    if (largest < ranks[i]) {
                        largest = ranks[i];
                    }
                }
                rank = largest + 1;
            }
            const text = this.state.newGenericAccountResearch;
            this.setState({ newGenericAccountResearch: '', genericAccountLoading: true }, () => {
                this.upsertGenericAcctResearchTopics(rank, text);
            });
        }
    }

    upsertGenericAcctResearchTopics = (rank, text, generalMetaDataParamId) => {
        upsertGenericAcctResearchTopics(rank, text, generalMetaDataParamId).then(() => {
            this.getGenericAcctResearchTopics();
        });
    }

    updateGenericAcctResearchTopics = (generalMetaDataParamId, rank) => {
        const text = document.getElementById(`edit-topic-${generalMetaDataParamId}`).innerText;
        this.setState({ genericAccountLoading: true }, () => {
            this.upsertGenericAcctResearchTopics(rank, text, generalMetaDataParamId);
        });
    }

    removeGenericAcctResearchTopics = (generalMetadataParamId) => {
        this.setState({ genericAccountLoading: true }, () => {
            removeGenericAcctResearchTopics(generalMetadataParamId).then(() => {
                this.getGenericAcctResearchTopics();
            });
        });
    }

    render() {
        const {
            genericAccountLoading,
            genericAccountResearches,
            newGenericAccountResearch
        } = this.state;
        return (
            <ErrorBoundary>
                <section className="account-research-topic-admin">
                    <MainPanel
                        viewName="Account Research Topic Administration"
                        icons={[Icons.MAINMENU]}
                        handleIconClick={this.handleHeaderIconClick}
                        viewHeader={
                            <div className="container">
                                <div className="title-label row">
                                    <div className="col-8">
                                        <p>Generic Account Research Topic Administration</p>
                                    </div>
                                </div>
                            </div>
                        }>
                        <div className="body-container container">
                            <section className="generic-acount-research-section">
                                <div className="action-section">
                                    <div className="d-flex add-new-topic-section">
                                        <input 
                                            type="text" 
                                            className="form-control new-generic-topic" 
                                            placeholder="New account research topic" 
                                            value={newGenericAccountResearch} 
                                            onChange={e => this.setState({ newGenericAccountResearch: e.target.value })}
                                            onKeyDown={e => this.addGenericAccountTopic(e.keyCode)} />
                                        <i 
                                            title="Add" 
                                            className="material-icons create-new-account-topic" 
                                            role="button" 
                                            onClick={() => this.addGenericAccountTopic(13)}>
                                                check_circle
                                        </i>
                                    </div>
                                    <div className="generic-account-topic-list">
                                        {genericAccountLoading ? (
                                            <TextBlock textLines={[96.5, 96.5, 96.5, 96.5, 96.5, 96.5, 96.5]} />
                                        ) : (
                                            genericAccountResearches.length === 0 ? (
                                                <p className="font-weight-bold" style={{ marginBottom: '0' }}>No account research topics yet</p>
                                            ) : (
                                                <React.Fragment>
                                                    <p className="font-weight-bold">Existing account research topics</p>
                                                    {genericAccountResearches.sort((a, b) => Number(a.rank) - Number(b.rank)).map(item => (
                                                        <div className="d-flex existing-topic-section">
                                                            <p className="generic-account-research-topic" key={item.generalMetadataParamId} id={`edit-topic-${item.generalMetadataParamId}`} contentEditable>{item.text}</p>
                                                            <i title="Update" role="button" onClick={() => this.updateGenericAcctResearchTopics(item.generalMetadataParamId, item.rank)} className="material-icons edit-account-topic">check_circle</i>
                                                            <i title="Remove" className="material-icons remove-account-topic" onClick={() => this.removeGenericAcctResearchTopics(item.generalMetadataParamId)} role="button">add_circle</i>
                                                        </div>
                                                    ))}
                                                </React.Fragment>
                                            )
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </MainPanel>
                </section>
            </ErrorBoundary>
        );
    }
}
