import React, { PureComponent } from 'react';
import { getPlaybooks } from '../../../../../util/promises/playbooks_promise';
import './styles/OutreachSequenceGrid.style.scss';
import { SingleSelect } from '../../../../../_tribyl/components/_base/SingleSelect/SingleSelect';
import { getPBSequenceMapping, relatePBAndOutreachSequence } from '../../../../../util/promises/config_promise';
import { showAlert } from './../../../../../components/MessageModal/MessageModal';

export class OutreachSequenceGrid extends PureComponent {
    state = {
        loadingPlaybooks: true,
        publishedPlaybooks: [],
        pbSequences: []
    }

    componentDidMount() {
        this.getPlaybooks();
    }

    async getPlaybooks() {
        const response = await getPlaybooks(true);
        if (response && response.data && response.data.filter(item => item.isActive === 'Y').length > 0) {
            this.setState({ loadingPlaybooks: false, publishedPlaybooks: response.data.filter(item => item.isActive === 'Y') }, () => this.getPBSequenceMapping());
        } else {
            this.setState({ loadingPlaybooks: false });
        }
    }

    async getPBSequenceMapping() {
        const response = await getPBSequenceMapping();
        if (response && response.data && response.data.length > 0) {
            const { publishedPlaybooks } = this.state;
            const pbSequences = response.data.filter(item => publishedPlaybooks.map(i => i.id).includes(item.playbookBean.id));
            this.setState({ pbSequences });
        }
    }

    render() {
        const { loadingPlaybooks, publishedPlaybooks, pbSequences } = this.state;
        return (
            <section className="outreach-sequence-section">
                {loadingPlaybooks ? (
                    <p className="font-weight-bold">Fetching active playbooks. Please wait...</p>
                ) : (
                    publishedPlaybooks.length === 0 ? (
                        <p className="font-weight-bold">No published playbooks found</p>
                    ) : (
                        <table className="table outreach-sequence-table">
                            <thead>
                                <tr>
                                    <th scope="col">Playbook Name</th>
                                    <th scope="col">Outreach Sequence Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pbSequences.map(item => (
                                    <RowComponent 
                                        playbook={item.playbookBean} 
                                        playbooks={publishedPlaybooks}
                                        pbSequence={item}
                                        handleAfterRelate={() => this.getPlaybooks()} />
                                ))}
                                {publishedPlaybooks.map(item => (
                                    <EmptyOutreachRowComponent 
                                        playbook={item} 
                                        playbooks={publishedPlaybooks}
                                        handleAfterRelate={() => this.getPlaybooks()} />
                                        // pbSequence={item} />
                                ))}
                            </tbody>
                        </table>
                    )
                )}
            </section>
        );
    }
}

class RowComponent extends PureComponent {
    state = {
        playbook: this.props.playbook,
        pbSequence: this.props.pbSequence,
        sequenceName: '',
        editMode: false
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.playbook.id !== nextProps.playbook.id || this.props.pbSequence.id !== nextProps.pbSequence.id) {
            this.setState({ playbook: nextProps.playbook, pbSequence: nextProps.pbSequence });
        }
    }

    async getPBSequenceMapping() {
        const response = await getPBSequenceMapping();
        if (response && response.data && response.data.length > 0 && response.data.find(item => item.playbookBean.id === this.state.playbook.id)) {
            this.setState({ pbSequence: response.data.find(item => item.playbookBean.id === this.state.playbook.id) });
        } else {
            this.setState({ pbSequence: {} });
        }
    }

    handlePlaybookSelect = (playbook) => {
        this.setState({ playbook }, () => this.getPBSequenceMapping());
    }

    enableSequenceEdit = (sequenceName) => {
        this.setState({ sequenceName, editMode: true });
    }

    relatePBAndOutreachSequence = (elem) => {
        if (elem.keyCode === 13) {
            const { playbook, sequenceName } = this.state;
            relatePBAndOutreachSequence(playbook.id, sequenceName).then(() => {
                // this.setState({ sequenceName: '', editMode: false }, () => this.getPBSequenceMapping());
                this.setState({ sequenceName: '', editMode: false }, () => this.props.handleAfterRelate());
            }).catch(() => {
                showAlert('Something went wrong.', 'error');
            });
        }
    }

    render() {
        const { playbook, pbSequence, editMode } = this.state;
        const { playbooks } = this.props;
        const sequenceName = Object.keys(pbSequence).length > 0 ? pbSequence.name : '';
        return (
            <tr>
                <td>
                    <SingleSelect
                        uniqueId={`playbook-${playbook.id}`}
                        idkey="id"
                        valueKey="name"
                        value={playbook}
                        options={playbooks}
                        disabled
                        onSelect={this.handlePlaybookSelect} />
                </td>
                <td className={editMode ? 'edit-mode' : 'display-mode'} onDoubleClick={() => this.enableSequenceEdit(sequenceName)}>
                    {editMode ? (
                        <input 
                            autoFocus // eslint-disable-line
                            className="form-control"
                            id={`edit-sequence-${pbSequence.id}`} 
                            type="text" 
                            value={this.state.sequenceName} 
                            onChange={e => this.setState({ sequenceName: e.target.value })}
                            onKeyDown={e => this.relatePBAndOutreachSequence(e)}
                            onBlur={() => this.setState({ editMode: false })} /> 
                    ) : (
                        <p>{sequenceName}</p>
                    )}
                </td>
            </tr>
        );
    }
}

class EmptyOutreachRowComponent extends PureComponent {
    state = {
        playbook: this.props.playbook,
        pbSequence: this.props.pbSequence,
        sequenceName: '',
        editMode: false
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.playbook.id !== nextProps.playbook.id /* || this.props.pbSequence.id !== nextProps.pbSequence.id */) {
            this.setState({ 
                playbook: nextProps.playbook, 
                // pbSequence: nextProps.pbSequence 
            });
        }
    }

    async getPBSequenceMapping() {
        const response = await getPBSequenceMapping();
        if (response && response.data && response.data.length > 0 && response.data.find(item => item.playbookBean.id === this.state.playbook.id)) {
            this.setState({ pbSequence: response.data.find(item => item.playbookBean.id === this.state.playbook.id) });
        } else {
            this.setState({ pbSequence: {} });
        }
    }

    handlePlaybookSelect = (playbook) => {
        // this.setState({ playbook }, () => this.getPBSequenceMapping());
        this.setState({ playbook });
    }

    enableSequenceEdit = (sequenceName) => {
        this.setState({ sequenceName, editMode: true });
    }

    relatePBAndOutreachSequence = (elem) => {
        if (elem.keyCode === 13) {
            const { playbook, sequenceName } = this.state;
            relatePBAndOutreachSequence(playbook.id, sequenceName).then(() => {
                this.setState({ 
                    sequenceName: '', 
                    editMode: false 
                // }, () => this.getPBSequenceMapping());
                }, () => this.props.handleAfterRelate());
            }).catch(() => {
                showAlert('Something went wrong.', 'error');
            });
        }
    }

    render() {
        const { 
            playbook, 
            // pbSequence, 
            editMode,
            sequenceName
        } = this.state;
        const { playbooks } = this.props;
        // const sequenceName = Object.keys(pbSequence).length > 0 ? pbSequence.name : '';
        return (
            <tr>
                <td>
                    <SingleSelect
                        uniqueId={`playbook-${playbook.id}`}
                        idkey="id"
                        valueKey="name"
                        value={playbook}
                        options={playbooks}
                        onSelect={this.handlePlaybookSelect} />
                </td>
                <td className={editMode ? 'edit-mode' : 'display-mode'} onDoubleClick={() => this.enableSequenceEdit(sequenceName)}>
                    {editMode ? (
                        <input 
                            autoFocus // eslint-disable-line
                            className="form-control"
                            // id={`edit-sequence-${pbSequence.id}`} 
                            type="text" 
                            value={this.state.sequenceName} 
                            onChange={e => this.setState({ sequenceName: e.target.value })}
                            onKeyDown={e => this.relatePBAndOutreachSequence(e)}
                            onBlur={() => this.setState({ editMode: false })} /> 
                    ) : (
                        <p>{sequenceName}</p>
                    )}
                </td>
            </tr>
        );
    }
}
