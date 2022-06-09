import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { actions, Control, Form } from 'react-redux-form';
import Select from 'react-select';
import { bindActionCreators } from 'redux';
import { MainPanel } from '../../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import { showAlert } from '../../../components/MessageModal/MessageModal';
import { getRatingQuestionByStage, listAllStages, updateSalesStageParams, upsertRatingQuestionByStage, deleteRatingQuestion } from '../../../util/promises/opptyplan_promise';
import { getLoggedInUser, isEmpty } from '../../../util/utils';
import { RatingQuestionsModel } from './../../../model/evaluationQuestModel/EvaluationQuestModel';
import './styles/EvaluationQuestionAdmin.style.scss';


class EvaluationQuestionAdminImpl extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loadingStages: true,
            stages: [],
            selectedStage: null,
            loadingRatingQuestions: true,
            addNewEnabled: false,
            newRatingQuestionInput: '',
            newRatingQuestionRank: 0,
            editModeEnabled: false
        };
    }

    componentDidMount() {
        this.listAllStages();
    }

    async getRatingQuestionByStage(stageId) {
        RatingQuestionsModel.deleteAll();
        const response = await getRatingQuestionByStage(stageId);
        this.props.setInitialRatingQuestions(response.data.sort((a, b) => a.rank - b.rank));
        this.setState({ loadingRatingQuestions: false });
    }

    async listAllStages() {
        const response = await listAllStages();
        if (response.data && !isEmpty(response.data.configuredStages)) {
            this.setState({ 
                loadingStages: false, 
                stages: response.data.configuredStages,
                selectedStage: response.data.configuredStages.find(item => item.stageName === 'Pre-opportunity')
            }, () => this.getRatingQuestionByStage(this.state.selectedStage.stageId));
        } else {
            this.setState({ 
                loadingStages: false, 
                stages: [],
                selectedStage: null
            });
        }
    }

    handleStageChange = (selectedStage) => {
        this.setState({ selectedStage, loadingRatingQuestions: true, addNewEnabled: false }, () => this.getRatingQuestionByStage(this.state.selectedStage.stageId));
    }

    createNewRatingQuestion = () => {
        const { newRatingQuestionInput, newRatingQuestionRank, selectedStage } = this.state;
        const payload = {
            questionText: newRatingQuestionInput,
            rank: newRatingQuestionRank,
            salesStageId: selectedStage.stageId
        };
        upsertRatingQuestionByStage(payload).then(() => {
            this.setState({
                loadingRatingQuestions: true,
                newRatingQuestionInput: '',
                newRatingQuestionRank: 0
            }, () => this.getRatingQuestionByStage(this.state.selectedStage.stageId));
        }).catch(() => {
            this.setState({
                newRatingQuestionInput: '',
                newRatingQuestionRank: 0
            }, () => showAlert('Something went wrong.', 'error'));
        });
    }

    handleFormCancel = () => {
        this.setState({ editModeEnabled: false, loadingRatingQuestions: true }, () => this.getRatingQuestionByStage(this.state.selectedStage.stageId));
    }

    handleUpdateSave = () => {
        const { userId } = getLoggedInUser();
        const { ratingQuestions } = this.props;
        const payload = ratingQuestions.map(item => ({
            questionText: item.value,
            rank: Number(item.rank),
            salesStageParamId: Number(item.salesStageParamId)
        }));
        updateSalesStageParams(payload, userId).then(() => {
            this.setState({
                loadingRatingQuestions: true,
                editModeEnabled: false,
            }, () => this.getRatingQuestionByStage(this.state.selectedStage.stageId));
        }).catch(() => {
            showAlert('Something went wrong.', 'error');
        });
    }

    handleRemoveGoal = (salesStageParamId) => {
        deleteRatingQuestion(salesStageParamId).then(() => {
            this.getRatingQuestionByStage(this.state.selectedStage.stageId);
        }).catch(() => {
            showAlert('Something went wrong.', 'error');
        });
    }

    render() {
        const {
            loadingStages,
            stages,
            selectedStage,
            loadingRatingQuestions,
            addNewEnabled,
            newRatingQuestionInput,
            newRatingQuestionRank,
            editModeEnabled
        } = this.state;
        const { ratingQuestions } = this.props;
        return (
            <ErrorBoundary>
                <section className="evaluation-question-admin-screen">
                    <MainPanel
                        viewName="Evaluation Question Administration"
                        icons={[]}
                        handleIconClick={() => {}}
                        viewHeader={
                            <div className="container">
                                <div className="title-label row">
                                    <div className="col-8">
                                        <p>Evaluation Question Administration</p>
                                    </div>
                                </div>
                            </div>
                        }>
                        <div className="container">
                            <div className="evaluation-question-form-section">
                                <div className="stage-section">
                                    <p className="dd-label">{loadingStages ? 'Loading stages...' : 'Stage'}</p>
                                    {stages.length > 0 &&
                                        <Select
                                            clearable={false}
                                            className="stage-selection"
                                            defaultValue={selectedStage}
                                            value={selectedStage}
                                            onChange={this.handleStageChange}
                                            options={stages}
                                            labelKey="stageName"
                                            valueKey="stageId" />
                                    }
                                </div>
                                <div className="rating-question-section">
                                    {loadingRatingQuestions ? (
                                        <p className="font-weight-bold">Loading goals...</p>
                                    ) : (
                                        ratingQuestions.length > 0 ? (
                                            <Form model="form.ratingQuestions">
                                                <table className="table rating-question-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Rank</th>
                                                            <th>Goal</th>
                                                            {!editModeEnabled && <th className="text-center">Remove</th>}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {ratingQuestions.map((item, key) => (
                                                            <tr key={key}>
                                                                <td className="rating">
                                                                    {editModeEnabled ? (
                                                                        <Control.text type="number" className="form-control" model={`.${key}.rank`} defaultValue={item.rank} />
                                                                    ) : (
                                                                        item.rank
                                                                    )}
                                                                </td>
                                                                <td className="goal-text">
                                                                    {editModeEnabled ? (
                                                                        <Control.text type="text" className="form-control" model={`.${key}.value`} defaultValue={item.value} />
                                                                    ) : (
                                                                        item.value
                                                                    )}
                                                                </td>
                                                                {!editModeEnabled && 
                                                                    <td className="text-center"><i className="material-icons" style={{ transform: 'rotate(45deg)', cursor: 'pointer' }} onClick={() => this.handleRemoveGoal(item.salesStageParamId)} role="button" title="Remove goal">add_circle</i></td>
                                                                }
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </Form>
                                        ) : (
                                            <p className="font-weight-bold">No goals set yet</p>
                                        )
                                    )}
                                </div>
                                {!editModeEnabled && !addNewEnabled && ratingQuestions.length > 0 &&
                                    <button className="edit-label" onClick={() => this.setState({ editModeEnabled: true })}>
                                        <i className="material-icons">edit</i>
                                        Edit goals
                                    </button>
                                }
                                {editModeEnabled &&
                                    <div className="d-flex justify-content-end edit-actions">
                                        <button className="btn cancel-btn" onClick={this.handleFormCancel}>Cancel</button>
                                        <button className="btn save-btn" onClick={this.handleUpdateSave}>Save</button>
                                    </div>
                                }
                                <hr />
                                <div className="add-new-rating-question-section">
                                    {!addNewEnabled && !editModeEnabled &&
                                        <button className="add-new-label" onClick={() => this.setState({ addNewEnabled: true })}>
                                            <i className="material-icons">add_circle</i>
                                            Add new
                                        </button>
                                    }
                                    {addNewEnabled &&
                                        <table className="table add-new-rating-question-table">
                                            <thead>
                                                <tr>
                                                    <th>Rank</th>
                                                    <th>Goal</th>
                                                    <th />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="rating">
                                                        <input type="number" className="form-control question-rank-input" placeholder="Rank" value={newRatingQuestionRank} onChange={elem => this.setState({ newRatingQuestionRank: elem.target.value })} />
                                                    </td>
                                                    <td className="goal-text">
                                                        <input type="text" className="form-control rating-question-input" placeholder="Goal question" value={newRatingQuestionInput} onChange={elem => this.setState({ newRatingQuestionInput: elem.target.value })} />
                                                    </td>
                                                    <td className="action-column text-center">
                                                        <i className="material-icons" onClick={this.createNewRatingQuestion} role="button">check_circle</i>
                                                        <i className="material-icons" style={{ transform: 'rotate(45deg)' }} onClick={() => this.setState({ addNewEnabled: false })} role="button">add_circle</i>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    }
                                </div>
                            </div>
                        </div>
                    </MainPanel>
                </section>
            </ErrorBoundary>
        );
    }
}

function mapStateToProps(state) {
    return { ratingQuestions: state.form.ratingQuestions };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setInitialRatingQuestions: value => actions.change('form.ratingQuestions', value),
        updateRatingQuestionValues: (model, value) => actions.change(`form.ratingQuestions.${model}`, value),
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationQuestionAdminImpl);
