import React from 'react';
import { Form, actions, Control } from 'react-redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ErrorBoundary } from '../../../../../components/ErrorBoundary/ErrorBoundary';
import { ImageSelector } from '../../../../../components/ImageSelector/ImageSelector';
import { showAlert } from '../../../../../components/MessageModal/MessageModal';
import { showAlert as showComponentModal } from '../../../../../components/ComponentModal/ComponentModal';
import profileImage from '../../../../../assets/images/dummy.png';
import overlayImage from '../../../../../assets/images/overlay-image.png';
import { handleAccountPhotoUploadAndSave } from '../../../../../util/promises/usercontrol_promise';
import { hideModal } from '../../../../../action/modalActions';
import { SanitizeUrl } from '../../../../../util/utils';

class AccountDetailsFormImpl extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedAccount: props.selectedAccount,
            profileImage: props.selectedAccount.icon ? `tribyl/api/photo?location=${SanitizeUrl(props.selectedAccount.icon)}` : profileImage
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedAccount !== this.props.selectedAccount) {
            this.setState({ 
                selectedAccount: nextProps.selectedAccount,
                profileImage: nextProps.selectedAccount.icon ? `tribyl/api/photo?location=${SanitizeUrl(nextProps.selectedAccount.icon)}` : profileImage
            });
        }
    }

    getUploadedFileName = (uploadedFile) => {
        const profileImg = `tribyl/api/photo?location=${SanitizeUrl(uploadedFile)}`;
        this.setState({ profileImage: profileImg });
        this.props.setPictureFile(uploadedFile);
    }

    resetForm = (event) => {
        event.preventDefault();
        this.props.resetFormValues();
    }

    handleChangeProfileImageClick = () => {
        const selectedAccountId = this.state.selectedAccount.id;
        const selectImage = (
            <ImageSelector handleFileUpload={(attachment, filename) => this.handleFileUpload(selectedAccountId, attachment, filename)} />
        );
        showComponentModal('Upload Profile Picture', selectImage, 'image-selector-modal');
    }

    async handleFileUpload(accountId, attachment, filename) {
        const response = await handleAccountPhotoUploadAndSave(accountId, attachment, filename);
        if (response.status === 200) {
            hideModal();
            this.getUploadedFileName(response.data.location);
        } else {
            showAlert('Unable to upload account logo. Please contact System Administrator.', 'error');
        }
    }

    renderFormHeader = () => {
        return (
            <div className="form-header">
                <h3>Edit Account</h3>
            </div>
        );
    }

    renderFormBody = (accountname) => {
        return (
            <React.Fragment>
                <div className="form-group row" style={{ width: '100%' }}>
                    <div className="col-6 text-center">
                        <label htmlFor="account-name">Account Name:</label>
                        <Control.text
                            id="account-name"
                            maxLength="25"
                            model=".name"
                            type="text"
                            className="form-control name-input"
                            placeholder="Enter Account Name" />
                    </div>
                    <div className="col-6 text-center">
                        <div className="image-box">
                            <div className="overlay-img-box"><img onClick={this.handleChangeProfileImageClick} src={overlayImage} className="overlay-image" /></div>
                            <div className="profile-img-box"><img src={this.state.profileImage} onError={(e) => { e.target.onerror = null; e.target.src = `${profileImage}`; }} title="Account Logo" className="profile-image" alt="_profile" /></div>
                        </div>
                        <h5 className="account-name-label">{accountname}</h5>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    renderFormFooter = () => {
        return (
            <div className="form-footer row">
                <div className="col-12 text-right">
                    <button
                        className="btn btn-primary btn-reset" 
                        onClick={event => this.resetForm(event)}>
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary btn-submit">
                        Submit
                    </button>
                </div>
            </div>
        );
    }

    render() {
        const { accountname } = this.props;
        return (
            <ErrorBoundary>
                <div className="account-detail-form">
                    <Form model="form.accountDetails" className="account-add-edit-form" onSubmit={() => this.props.handleAccountFormSubmit()}>
                        {this.renderFormHeader()}
                        {this.renderFormBody(accountname)}
                        {this.renderFormFooter()}
                    </Form>
                </div>
            </ErrorBoundary>
        );
    }
}

function mapStateToProps(state) {
    return { accountDetailsForm: state.form.accountDetails };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setFormInitialValues: values => actions.change('form.accountDetails', values),
        setPictureFile: value => actions.change('form.accountDetails.icon', value),
        resetFormValues: () => actions.reset('form.accountDetails')
    }, dispatch);
}

export const AccountDetailsForm = connect(mapStateToProps, mapDispatchToProps)(AccountDetailsFormImpl);
