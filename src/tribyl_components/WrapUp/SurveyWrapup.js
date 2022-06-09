import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showAlert } from '../../components/MessageModal/MessageModal';
import { getUsersForStoryWithSurveyLinks } from '../../util/promises/storyboard_promise';
import {
  addUsersToOpptyTeam,
  getSurveyQuestionsAndCardsByCategory,
  surveyLinkSend,
  upsertUser,
} from '../../util/promises/survey_promise';
import { Loader } from '../../_tribyl/components/_base/Loader/Loader';
import InviteMember from '../FieldGenerator/InviteMember/InviteMember';
import SurveyMultiSelect from '../FieldGenerator/SurveyMultiSelect/SurveyMultiSelect';
import SurveyTextArea from '../FieldGenerator/SurveyTextArea';
import { Button } from '@material-ui/core';
import './WrapUp.style.scss';
import {
  addConversation,
  handleConversationFileUploadAndSave,
} from '../../util/promises/conversation_promise';
import { createConvMeetingMetadata } from '../../util/promises/transcript_promise';
import Documents from '../../views/ConversationDetail/Documents/Documents';
import { reload } from '../../action/loadingActions';

const DEFAULT_CLASSNAME = 'wrapup';

class SurveyWrapup extends Component {
  constructor(props) {
    super(props);
    this.regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.defaultInviteList = [
      {
        index: Math.random(),
        firstName: '',
        lastName: '',
        email: '',
        disabled: false,
      },
      {
        index: Math.random(),
        firstName: '',
        lastName: '',
        email: '',
        disabled: false,
      },
    ];
    this.state = {
      file: { name: 'No file chosen' },
      wrapup: [],
      isLoading: true,
      emailStories: [],
      firstName1: '',
      lastName1: '',
      email1: '',
      firstName2: '',
      lastName2: '',
      email2: '',
      inviteList: JSON.parse(JSON.stringify(this.defaultInviteList)),
      linkSend: false,
      memberEmailList: [],
      showSpinner: false,
      hasValidInviteValues: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadData();
  }

  loadData = async () => {
    const { opptyId, storyId } = this.props;

    const repsonse = await getSurveyQuestionsAndCardsByCategory(
      'wrapup',
      opptyId
    );
    // const repsonse2 = await getStoryForTeam(storyId || 22);
    const repsonse2 = await getUsersForStoryWithSurveyLinks(storyId);
    const emailStories = repsonse2.data ? repsonse2.data : [];
    const wrapup = repsonse.data ? repsonse.data : [];
    this.setState({ wrapup, isLoading: false, emailStories });
  };

  onReload = () => {
    this.loadData();
  };

  handleInviteChange = (e) => {
    if (['firstName', 'lastName', 'email'].includes(e.target.name)) {
      const stateCopy = Object.assign({}, this.state);
      const inviteList = Array.from(stateCopy.inviteList);
      inviteList[e.target.dataset.id][e.target.name] = e.target.value;
      this.setState({
        hasValidInviteValues: this.validateInviteList(inviteList),
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  addNewRow = () => {
    this.setState((prevState) => ({
      inviteList: [
        ...prevState.inviteList,
        { index: Math.random(), firstName: '', lastName: '', email: '' },
      ],
    }));
  };

  deleteRow = (record) => {
    const updatedInviteList = this.state.inviteList.filter((r) => r !== record);
    const hasValidInviteValues = this.validateInviteList(updatedInviteList);
    this.setState({
      inviteList: updatedInviteList,
      hasValidInviteValues,
    });
  };

  onInviteSubmit = (e) => {
    e.preventDefault();
    this.setState({ showSpinner: true });
    const { storyId, opptyId, onReload } = this.props;
    const { inviteList } = this.state;
    const newinviteList = inviteList.filter(
      (invite) =>
        invite.firstName &&
        invite.lastName &&
        invite.email &&
        this.regex.test(invite.email)
    );
    const memberEmail = [];

    const upsertUserArray = [];
    const linkSendArray = [];
    newinviteList.map((member) => {
      const payload = {
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        loginname: member.email,
        role: 'SELLER',
        username: `${member.firstName} ${member.lastName}`,
      };
      memberEmail.push(member.email);
      upsertUserArray.push(
        upsertUser(payload)
          .then((response) => {
            const userId = response && response.data.userId;
            const surveyLink = `survey?storyId=${storyId}&OpptyId=${opptyId}&userId=${userId}`;
            const link = encodeURIComponent(surveyLink);
            linkSendArray.push(surveyLinkSend(storyId, link, userId));
            /* surveyLinkSend(storyId, link, userId).then(() => {
                    onReload();
                    this.setState({ linkSend: true });

                }) */
          })
          .catch((e) => {
            console.log(e);
            showAlert(`Duplicate Email Address:-${member.email}`, 'error');
            this.setState({ linkSend: false });
          })
      );
    });
    Promise.all(linkSendArray).then(() => this.setState({ linkSend: true }));
    Promise.all(upsertUserArray).then(() =>
      addUsersToOpptyTeam(opptyId, memberEmail).then(() => {
        this.setState({
          memberEmailList: memberEmail,
          showSpinner: false,
          inviteList: JSON.parse(JSON.stringify(this.defaultInviteList)),
        });
        this.onReload();
      })
    );
  };

  validateInviteList = (inviteList = []) => {
    return inviteList.some(
      (invite) =>
        invite.firstName &&
        invite.lastName &&
        invite.email &&
        this.regex.test(invite.email)
    );
  };

  renderAddButton = () => {
    return (
      <button
        title="Add"
        onClick={this.addNewRow}
        type="button"
        className="invite_add"
      >
        <span className="material-icons add">add</span>
      </button>
    );
  };

  renderField = (type, data) => {
    const {
      storyId,
      opptyId,
      markets,
      handledisableNext,
      targetMarket,
      surveyStatus,
      stage,
      subUiType,
    } = this.props;
    const {
      inviteList,
      linkSend,
      memberEmailList,
      showSpinner,
      hasValidInviteValues,
      emailStories,
    } = this.state;
    const isReadOnly = false;
    switch (type) {
      case 'market':
        return (
          <div>
            <SurveyMultiSelect
              onChange={this.handleMerketSelection}
              options={this.OptionMarket(markets)}
              placeholder="Select market(s)"
              opptyId={opptyId}
              type={data.subType}
              storyId={storyId}
              isSingleSelectMarket
              handledisableNext={handledisableNext}
              uiType={'ds'}
              stage={stage}
            />
          </div>
        );
      case 'multichoice':
        if (data.subType === 'winner' || data.subType === 'incumbent') {
          return (
            <SurveyMultiSelect
              onChange={this.handleSelect}
              options={this.OptionsGenerator(data.relatedCardList)}
              placeholder="Select multiple"
              opptyId={opptyId}
              type={data.subType}
              storyId={storyId}
              targetMarket={targetMarket}
              isSingleSelect
              uiType={'ds'}
              stage={stage}
            />
          );
        } else {
          const filterUs = data.relatedCardList.filter((i) => i.title !== 'Us');
          return (
            <SurveyMultiSelect
              targetMarket={targetMarket}
              onChange={this.handleChange}
              options={this.OptionsGenerator(filterUs)}
              placeholder="Select multiple"
              opptyId={opptyId}
              type={data.subType}
              storyId={storyId}
              limit={3}
              uiType={'ds'}
              stage={stage}
            />
          );
        }

      case 'invitelinks':
        const isInviteButtonDisabled = isReadOnly || !hasValidInviteValues;

        return (
          <div className="last-question">
            <div className="option-group">
              <form
                onSubmit={this.onInviteSubmit}
                onChange={this.handleInviteChange}
              >
                <table>
                  <thead />
                  <tbody>
                    <InviteMember
                      deleteRow={this.deleteRow}
                      inviteList={inviteList ? inviteList : []}
                    />
                  </tbody>
                </table>
                <div className="invite_member">
                  <button
                    className="btn invite-button"
                    type="submit"
                    disabled={isInviteButtonDisabled}
                  >
                    Invite New members
                  </button>
                  {linkSend ? (
                    showSpinner ? (
                      <span className="spinner-border spinner-border-sm ml-4" />
                    ) : (
                      <span className="send_invite">
                        {memberEmailList.length} user's added
                      </span>
                    )
                  ) : null}
                </div>
              </form>
            </div>

            <div className="email-table">
              <p className="email-heading">Previously Invited members</p>
              <table className="table table-borderless">
                <thead>
                  <tr className="heading">
                    <th style={{ width: '50%' }}>NAME</th>
                    <th style={{ width: '50%' }}>EMAIL</th>
                    {/* <th style={{ width: "20%" }}>
                                        STATUS
                            </th> */}
                  </tr>
                </thead>
                <tbody>
                  {emailStories.length > 0 &&
                    emailStories.map((story, storyIdx) => (
                      <tr key={`field-generator-${storyIdx}`}>
                        <td>{story.name}</td>
                        <td>{story.email}</td>
                        {/* <td><div className={`pill ${this.getStatus(story.status)}`}>In Progress</div></td> */}
                        {/* <td><div className={`pill green`}>Completed</div></td> */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <SurveyTextArea
            subUiType={subUiType}
            uiType={'ds'}
            opptyId={opptyId}
            id={data.questionId}
            question={data}
            storyId={storyId}
            onChange={this.handleTextChange}
            placeholder="Start typing"
            rows="5"
          />
        );
    }
  };

  handleFileUploadSelect = async (elem) => {
    // elem.preventDefault();
    elem.persist()
    const transcriptFile = elem.target.files[0];
    const meetingDate = new Date().toISOString().slice(0, -1);
    const payload = { storyId: Number(this.props.storyId), type: 'Document' };
    let conversationId = null;
    const metadataPayload = [
      {
        subject: '',
        attendees: [],
        activityType: null,
        meetingDate,
      },
    ];
    try {
      const response = await addConversation(payload);
      conversationId = response.data.conversationId;
      metadataPayload[0].conversationId = conversationId;
      await createConvMeetingMetadata(metadataPayload);
      await handleConversationFileUploadAndSave(conversationId, transcriptFile);
      showAlert('Document uploaded successfully.', 'success');
      reload("conversation-detail-documents");
    } catch (error) {
      console.log(error)
      showAlert(
        'Could not upload document. Please contact Administrator',
        'error'
      );
    } 
    finally {
      elem.target.value = null;
    }
  };

  renderUpload = () => {
    const { file } = this.state;
    const { storyId } = this.props;

    return (
      <React.Fragment>
        <div className={`${DEFAULT_CLASSNAME}-fields`} key={0}>
          <p className={`${DEFAULT_CLASSNAME}-question`}>
            Please upload any deal-specific documents. They will be
            machine-analyzed to surface additional deal insights. Examples
            include customized presentations, proposals, RFP responses, customer
            stories, win-loss debriefs. Previously uploaded documents, if any,
            are listed below.
          </p>
          <input
            id="contained-button-file"
            multiple
            accept=".txt, .doc, .docx, .pdf"
            type="file"
            style={{ display: 'none' }}
            onChange={this.handleFileUploadSelect}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="secondary" component="span">
              Upload
            </Button>
          </label>
        </div>
        <Documents storyId={storyId} />
      </React.Fragment>
    );
  };

  render() {
    const { wrapup, isLoading } = this.state;
    const { goPrevious, onComplete, surveyStatus } = this.props;

    return (
      <div className={DEFAULT_CLASSNAME}>
        <p className="page-title">Wrap-up</p>
        <p className="sub-title">Nearly done! </p>
        {this.renderUpload()}
        {!isLoading ? (
          wrapup.map((question, index) => {
            return (
              <div className={`${DEFAULT_CLASSNAME}-fields`} key={index + 1}>
                <p className={`${DEFAULT_CLASSNAME}-question`}>
                  {question.questionText}
                  {question.type === 'invitelinks'
                    ? this.renderAddButton()
                    : null}
                </p>
                {this.renderField(question.type, question)}
              </div>
            );
          })
        ) : (
          <Loader />
        )}
        <div className={`${DEFAULT_CLASSNAME}-footer`}>
          <button className="previous" onClick={() => goPrevious()}>
            Previous
          </button>
          <button
            className={`button`}
            onClick={() => onComplete()}
          >
            {surveyStatus ? 'ReSubmit survey' : 'Submit survey'}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { surveyStatus: state.SurveyData.surveyStatus };
};

SurveyWrapup.propTypes = {
  goPrevious: PropTypes.func,
  storyId: PropTypes.number,
  opptyId: PropTypes.number,
  viewType: PropTypes.string,
  onComplete: PropTypes.func,
  surveyStatus: PropTypes.bool,
};
export default connect(mapStateToProps)(SurveyWrapup);
