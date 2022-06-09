/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import { connect } from 'react-redux';
import { showCustomModal } from '../../components/CustomModal/CustomModal';
import { AddFeedBackForm } from '../../tribyl_components/Differentiation/AddFeedBackForm';
import {
  createStoryNotesForMarketStudyQuestionAndOppty,
  getLatestStoryNotesForMarketStudyQuestionAndOppty,
  getStoryNotesForAllUsersForMarketStudyQuestionAndOppty,
} from '../../util/promises/survey_promise';
import { getLoggedInUser } from '../../util/utils';
import './SurveyTextArea.scss';

class SurveyTextArea extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  componentDidMount() {
    this.loadNotes();
  }

  loadNotes = async () => {
    const { question, opptyId, uiType } = this.props;
    let response = {};
    if (uiType === 'ds') {
      response = await getLatestStoryNotesForMarketStudyQuestionAndOppty(
        question.questionId,
        opptyId
      );
    } else {
      response = await getStoryNotesForAllUsersForMarketStudyQuestionAndOppty(
        question.questionId,
        opptyId
      );
    }
    const note = response ? response.data.latestNoteFromUser : '';
    this.setState({ value: note });
  };

  handleChange = (e) => {
    const { onChange, id } = this.props;
    const value = e.target.value;
    this.setState({ value });
    if (onChange) onChange(value, id);
  };

  handleSubmit = async () => {
    const user = getLoggedInUser();
    const { value } = this.state;
    const { id, opptyId } = this.props;
    const response = await createStoryNotesForMarketStudyQuestionAndOppty(
      id,
      value,
      opptyId,
      user.userId
    );
  };

  renderDealText = () => {
    const modules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
      ],
    };
    const formats = ['bold', 'italic', 'underline', 'mark', 'list'];
    return (
      <div className="dealTape_textbox">
        <ReactQuill
          id="3232"
          theme="bubble"
          value={this.renderCardNotes(this.state.value) || ''}
          modules={modules}
          formats={formats}
          readOnly
          className={`survey-quill`}
        />
        {/* <textarea value={"John Wible, 2021-03-05 11:46:46,\n\n  Targeting and Prediction has been made from here.\n\n".replace(/\\n/g,"<br />")}
                    row={2}

                 /> */}
        {this.renderShowMore(this.state.value)}
      </div>
    );
  };
  renderCardNotes = (notes) => {
    const newNotes =
      notes && notes.split('\\n\\n').join('<br /><br /> ******* <br /><br />');
    return newNotes;
  };

  renderShowMore = (notes) => {
    const numberOfNewLines =
      notes && Math.floor(notes.match(/\\n/g).length / 2);
    // console.log(numberOfNewLines);
    if (notes && (notes.length > 200 || numberOfNewLines >= 4)) {
      return (
        <span
          role="button"
          className="show-more"
          onClick={() => this.showDealTextBoxModal(notes)}
        >
          More
        </span>
      );
    }
    return '';
  };

  showDealTextBoxModal = (value) => {
    const { question } = this.props;
    showCustomModal(
      <div className="d-flex justify-content-between">
        <h6 className="modal-title"> {question.questionText} </h6>
      </div>,
      <AddFeedBackForm value={value} uiType="dgt" />,
      'dealTape-textbox',
      () => {},
      false,
      this.getLoader()
    );
  };

  getLoader = () => <div>Loading...</div>;

  render() {
    const { value } = this.state;
    const { placeholder, rows, defaultClass, uiType, surveyStatus } =
      this.props;
    return uiType !== 'dgt' ? (
      <textarea
        onBlur={this.handleSubmit}
        placeholder={placeholder}
        className={defaultClass}
        defaultValue={value}
        onChange={this.handleChange}
        rows={rows || '5'}
        disabled={uiType === 'ds' ? false : surveyStatus}
      />
    ) : (
      this.renderDealText()
    );
  }
}

const mapStateToProps = (state) => {
  return { surveyStatus: state.SurveyData.surveyStatus };
};

export default connect(mapStateToProps)(SurveyTextArea);
