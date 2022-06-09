/* eslint-disable no-tabs */
import FileSaver from 'file-saver';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TearsheetCardsModel } from '../../../../model/tearsheetModels/TearsheetCardsModel';
import { TearsheetModel } from '../../../../model/tearsheetModels/TearsheetModel';
import { TearsheetTopicsModel } from '../../../../model/tearsheetModels/TearsheetTopicsModel';
import {
  createTearsheetForStory,
  downloadPdfFile,
  editCustomerProfile,
  getAccountDetails,
  getCustomerProfile,
  getTearsheetCardDetails,
  getTearsheetForStory,
  updateTearsheet,
} from '../../../../util/promises/tearsheet_promise';
import { ProfileCard } from '../Profilecard/ProfileCard';
import {
  hideStorySideNote,
  showStorySideNote,
} from './../../../../action/storyNoteActions';
import './styles/Tearsheet.styles.scss';
import { StoryNote } from '../StoryNote/StoryNote';
import notesIcons from '../../../../assets/iconsV2/notes-icon.png';
import preview from '../../../../assets/iconsV2/preview.svg';
import { showCustomModal } from '../../../../components/CustomModal/CustomModal';
import classnames from 'classnames';
import isEqual from 'lodash.isequal';
import { Loader } from '../../../../_tribyl/components/_base/Loader/Loader';

export class TearsheetImpl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      storyId: '',
      accountId: null,
      isEditing: false,
      customerDetails: {},
      updatedSheetData: [],
      isLoading: true,
    };
  }

  componentWillMount() {
    const { storyId, accountId } = this.props;
    this.setState({ storyId, accountId });
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.accountId, prevProps.accountId)) {
      this.getCustomerProfile(this.state.accountId);
    }
  }

  componentDidMount() {
    TearsheetCardsModel.deleteAll();
    this.getTearsheetForStory(this.state.storyId);
    this.getAccountDetails(this.state.storyId).then(() =>
      this.getCustomerProfile(this.state.accountId)
    );
    // this.getCustomerProfile(this.state.accountId);
  }

  onTearSheetEdit = (title, content) => {
    const payload = {
      hdgContent: content,
      hdgName: title,
      tearSheetId: this.state.tearsheetId,
    };
    updateTearsheet(payload).then((response) => {
      this.populateTearSheet(response.data);
    });
  };

  onTearSheetCancel = (e) => {
    const updatedSheetData = this.state.updatedSheetData.map((i) => ({ ...i }));
    updatedSheetData[e.target.id].content =
      this.props.sheet[e.target.id].content;
    this.setState({ updatedSheetData });
  };

  onProfileSave = (res) => {
    if (res.status === 200) {
      this.setState({ editable: null, editView: null, updateProfile: false });
      this.getAccountDetails(this.state.storyId).then(() =>
        this.getCustomerProfile(this.state.accountId)
      );
    } else {
      this.setState({
        editable: null,
        editView: null,
        updateProfile: false,
        errorMessage: 'Oops! Something went wrong.',
      });
      this.getAccountDetails(this.state.storyId).then(() =>
        this.getCustomerProfile(this.state.accountId)
      );
      // this.getCustomerProfile(this.state.accountId);
    }
  };

  async getTearsheetForStory(storyId) {
    TearsheetModel.deleteAll();
    this.setState({ isLoading: true });
    try {
      const response = await getTearsheetForStory(storyId);
      if (response.data.length !== 0) {
        this.populateTearSheet(response.data);
      } else {
        const payload = {
          storyId: `${storyId}`,
          tearSheetDetailMap: {
            'THE CHALLENGE': '',
            'THE SOLUTION': '',
            'THE IMPACT': '',
            'WHY US': '',
          },
        };
        const secondResponse = await createTearsheetForStory(payload);
        if (secondResponse.data.length !== 0) {
          const newTearSheet = await getTearsheetForStory(storyId);
          this.populateTearSheet(newTearSheet.data);
        }
      }
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
      this.setState({ isLoading: false });
    }
  }

  async getAccountDetails(storyId) {
    const response = await getAccountDetails(storyId);
    this.setState({
      customerDetails: Object.assign({}, this.state.customerDetails, {
        name: response.data.name,
      }),
    });
  }

  async getCustomerProfile(accountId) {
    const response = await getCustomerProfile(accountId);
    this.setState({
      customerDetails: Object.assign(
        {},
        this.state.customerDetails,
        response.data,
        { name: this.state.customerDetails.name }
      ),
    });
  }

  async getPdfForTearSheet(storyId) {
    // const strFileName = 'tearsheet_' + storyId + '.pdf';
    const strFileName =
      `${this.state.customerDetails.name}_${this.props.buyingCenter}_FY${this.props.fiscalYear}.pdf`
        .split(' ')
        .join('_');
    const download = await downloadPdfFile(storyId);
    const blob = new Blob([download.data], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blob, strFileName);
  }

  async getTearsheetCardDetails(userId, cardId) {
    const response = await getTearsheetCardDetails(userId, cardId);
    this.setState({ cardDetails: response.data });
  }

  populateTearSheet = (responsedata) => {
    const tearsheets = responsedata.tearSheetDetailMap;
    if (responsedata.id) {
      this.setState({ tearsheetId: responsedata.id });
    }

    if (!tearsheets) return;
    Object.keys(tearsheets).map((key) =>
      new TearsheetModel({
        id: key,
        title: key,
        content: tearsheets[key],
      }).$save()
    );
  };

  containsPermission = (permission) => {
    const AUTH = process.env.AUTH;
    if (AUTH !== null && typeof AUTH !== 'undefined' && AUTH !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const found = user.authorities.indexOf(permission) >= 0;
        return found;
      }
      window.open('/', '_self');
      return false;
    }
    return true;
  };

  handleTearsheetViewMode = () => {
    this.setState({
      isEditing: !this.state.isEditing,
      updatedSheetData: this.props.sheet,
    });
  };

  compareContentArray = () => {
    if (this.state.updatedSheetData.length < 1) {
      return false;
    }
    return this.props.sheet.find(
      (item, key) => item.content !== this.state.updatedSheetData[key].content
    );
  };

  handleUpdateCancel = (event) => {
    event.preventDefault();
    this.getTearsheetForStory(this.state.storyId);
    this.setState({ editable: null, editView: null });
  };

  handleProfileSave = async (payload) => {
    console.log('2------', { payload });
    const res = await editCustomerProfile(this.state.accountId, payload);
    this.onProfileSave(res);
    return res;
  };

  updateTearsheetData = ({ target: { id, value } }) => {
    const updatedSheetData = this.state.updatedSheetData.map((i) => ({ ...i }));
    updatedSheetData[id].content = value;
    this.setState({ updatedSheetData });
  };

  renderActionHeader = (isEditing) => {
    // const disabled = this.compareContentArray();
    const disabled = true;
    const { isStoryDisabled, variant } = this.props;
    const { storyNoteMode } = this.props.storyNote;

    return variant === 'secondary' ? null : isEditing ? (
      <div className="action-section">
        <button
          disabled={disabled}
          className={disabled ? 'wide-button' : 'primary wide-button'}
          onClick={this.handleTearsheetViewMode}
        >
          SAVE & CLOSE TEARSHEET
        </button>
      </div>
    ) : (
      <div
        className={`action-section ${
          storyNoteMode === 'show' ? 'margin-right-10' : 'margin-right-7-5'
        }`}
      >
        <button onClick={() => this.getPdfForTearSheet(this.state.storyId)}>
          EXPORT AS PDF
        </button>
        {!isStoryDisabled && (
          <button className="primary" onClick={this.handleTearsheetViewMode}>
            EDIT TEARSHEET
          </button>
        )}
      </div>
    );
  };

  renderCustomerProfileCard = (isEditing) => {
    const { customerDetails } = this.state;
    const { isStoryDisabled, variant } = this.props;
    return (
      <div className="col-4 cards-section">
        <ProfileCard
          customerDetails={customerDetails}
          handleProfileSave={this.handleProfileSave}
          isStoryDisabled={isStoryDisabled}
          style={variant}
          isEditing={isEditing}
        />
      </div>
    );
  };

  renderSheetSection = ({ title, content }, key) => {
    const { variant } = this.props;
    const secondary = variant === 'secondary';
    return (
      <div key={key}>
        <header
          className={classnames({
            'tear-sheet-secondary-content-section-header': secondary,
          })}
        >
          {title}
        </header>
        <p
          className={classnames({
            'tear-sheet-secondary-content-section-content': secondary,
          })}
        >
          {content}
        </p>
      </div>
    );
  };

  renderSheetEditSection = ({ title, content }, key) => {
    const { variant, sheet } = this.props;

    const isUpdated = content !== sheet[key].content;
    const secondary = variant === 'secondary';
    return (
      <div key={key}>
        <header
          className={classnames({
            'tear-sheet-secondary-content-section-header': secondary,
            'edit-mode': secondary,
          })}
        >
          {title}
        </header>
        <div className="edit-box">
          <textarea
            key={key}
            id={key}
            onChange={this.updateTearsheetData}
            className="form-control"
            rows={5}
            value={content}
          />
          {this.props.variant === 'secondary' ? null : (
            <div className={isUpdated ? 'buttons' : 'd-none'}>
              <i
                role="button"
                name={title}
                className="ion-checkmark"
                onMouseDown={() => this.onTearSheetEdit(title, content)}
                title="Save"
              />
              <i
                role="button"
                id={key}
                className="ion-close"
                onMouseDown={this.onTearSheetCancel}
                title="Cancel"
              />
            </div>
          )}
        </div>
        {this.props.variant === 'secondary' && (
          <div className={isUpdated ? 'buttons secondary-buttons' : 'd-none'}>
            <button
              name={title}
              className="secondary-button save-button"
              onMouseDown={() => this.onTearSheetEdit(title, content)}
              title="Save"
            >
              SAVE
            </button>
            <button
              id={key}
              className="secondary-button cancel-button"
              onMouseDown={this.onTearSheetCancel}
              title="Cancel"
            >
              CANCEL
            </button>
          </div>
        )}
      </div>
    );
  };

  renderEditView = () => {
    const { storyNoteMode } = this.props.storyNote;
    const { variant, onClose } = this.props;
    const secondary = variant === 'secondary';
    return (
      <div
        className={`${
          storyNoteMode === 'show' ? 'col-12' : 'col-7'
        } tear-sheets-edit-container`}
      >
        <div className={classnames({ 'col-8': !secondary }, 'edit-section')}>
          {secondary ? (
            <div className="tear-sheets-header">
              <div className="tear-sheets-header-title">Tearsheet</div>
              <div className="tear-sheets-header-actions">
                <button
                  onClick={this.handleTearsheetViewMode}
                  className="tear-sheets-header-actions-button"
                >
                  <img src={preview} />
                  PREVIEW
                </button>
                <i
                  className="material-icons tearsheet-close"
                  onClick={onClose}
                  role="button"
                >
                  close
                </i>
              </div>
            </div>
          ) : (
            <h3>Tearsheet</h3>
          )}

          {this.state.updatedSheetData.map((item, key) =>
            this.renderSheetEditSection(item, key)
          )}
        </div>
      </div>
    );
  };

  // toggleEditMode = () => {
  //     this.setState({isEditing: !this.state.isEditing})
  // }

  renderViewMode = () => {
    const { variant, onClose, isVisible } = this.props;
    const { storyNoteMode } = this.props.storyNote;
    const secondary = variant === 'secondary';

    return (
      <div
        className={`${
          storyNoteMode === 'show' ? 'col-12' : 'col-7'
        } card-content-section`}
      >
        <div
          className={classnames('tear-sheets', {
            'margin-right-10': !secondary,
          })}
        >
          {secondary ? (
            <div className="tear-sheets-header">
              <div className="tear-sheets-header-title">Tearsheet</div>
              <div className="tear-sheets-header-actions">
                <button
                  onClick={this.handleTearsheetViewMode}
                  className="tear-sheets-header-actions-button"
                >
                  <i className="material-icons">edit</i>EDIT
                </button>
                <i
                  className={classnames('material-icons tearsheet-close', {
                    hidden: !isVisible,
                  })}
                  onClick={onClose}
                  role="button"
                >
                  close
                </i>
              </div>
            </div>
          ) : (
            <h3>Tearsheet</h3>
          )}

          {this.props.sheet.map((item, key) =>
            this.renderSheetSection(item, key)
          )}
        </div>
      </div>
    );
  };

  handleStoryNotesPopUp = () => {
    const header = <p>Story Notes</p>;
    const body = <StoryNote storyId={this.props.storyId} />;
    showCustomModal(header, body, 'story-notes-modal');
  };

  render() {
    const { isEditing, isLoading } = this.state;
    const { variant } = this.props;
    const { storyNoteMode } = this.props.storyNote;
    return isLoading ? (
      <Loader />
    ) : (
      <div
        className={classnames('tear-sheet-view-container', 'tearsheet-tab', {
          'tear-sheet-view-container-secondary': variant === 'secondary',
        })}
      >
        <div className="row">
          <div
            className={`${
              storyNoteMode === 'show'
                ? 'col-10 show-note-content-grid'
                : 'col-12'
            }`}
          >
            <div className={`container container-${variant}`}>
              {this.renderActionHeader(isEditing)}
              <div className="row">
                {storyNoteMode !== 'show' &&
                  this.renderCustomerProfileCard(isEditing)}
                {isEditing ? this.renderEditView() : this.renderViewMode()}
              </div>
            </div>
          </div>
          {storyNoteMode === 'show' && (
            <div className="col-2 story-note-side-panel">
              <div className="story-side-note-header d-flex justify-content-between align-items-center">
                <button
                  className="note-pop-out-btn"
                  title="Open in pop up"
                  onClick={this.handleStoryNotesPopUp}
                >
                  <i className="material-icons">crop_free</i>
                </button>
                <p style={{ fontFamily: 'Roboto-Bold', marginBottom: '0px' }}>
                  Notes
                </p>
                <button
                  className="hide-story-note-btn"
                  title="Hide notes"
                  onClick={() => this.props.hideStorySideNote()}
                >
                  Hide
                  <i className="material-icons">keyboard_arrow_right</i>
                </button>
              </div>
              <StoryNote storyId={this.state.storyId} />
            </div>
          )}
          {variant !== 'secondary' && storyNoteMode === 'hide' && (
            <p
              className="show-note-btn"
              title="Show notes"
              onClick={() => this.props.showStorySideNote()}
            >
              <i className="material-icons">keyboard_arrow_left</i>
              <img src={notesIcons} />
            </p>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sheet: TearsheetModel.list().map((item) => item.props),
    topics: TearsheetTopicsModel.list().map((item) => item.props),
    topicsWithCards: TearsheetCardsModel.list().map((item) => item.props),
    storyNote: state.storyNote,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      showStorySideNote,
      hideStorySideNote,
    },
    dispatch
  );
}

export const TearsheetTab = connect(
  mapStateToProps,
  mapDispatchToProps
)(TearsheetImpl);
