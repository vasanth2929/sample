import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import { MainPanel } from '../../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import { Icons } from '../../../constants/general';

import './UploadCSV.style.scss';
import { uploadAccountCsvLoader } from '../../../util/promises/account_csv_loader_promise';
import { showAlert } from '../../../components/MessageModal/MessageModal';

export default class UploadCSV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: { name: 'No file chosen' },
    };
  }

  handleHeaderIconClick = (action) => {
    switch (action) {
      default:
        break;
    }
  };

  handleFileSelection = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  uploadFile = async (e) => {
    e.preventDefault();
    try {
      const response = await uploadAccountCsvLoader(this.state.file);
      showAlert('CSV Uploaded Successfully!', 'success');
    } catch (error) {
      showAlert(error);
    }
  };

  render() {
    const { file } = this.state;
    return (
      <ErrorBoundary>
        <div className="csv-upload-view">
          <MainPanel
            viewName="CSV Account Load Administration"
            icons={[Icons.MAINMENU]}
            handleIconClick={this.handleHeaderIconClick}
            viewHeader={
              <div className="container">
                <div className="title-label row">
                  <div className="col-8">
                    <p>Upload CSV</p>
                  </div>
                </div>
              </div>
            }
          >
            <div className="upload-csv-container">
              <div className="form-group d-flex align-items-center">
                <label className="sub-label mr-4 mb-0">
                  <span className="sub-label-button">Choose a file</span>
                  <input
                    type="file"
                    className="custom-file-input"
                    onChange={(e) => this.handleFileSelection(e)}
                  />
                  <label className="file-label ml-2 mr-2 mb-0">
                    {file?.name}
                  </label>
                </label>
                <Button
                  className="btn save-btn save-file-btn"
                  disabled={file?.name === 'No file chosen'}
                  onClick={(e) => this.uploadFile(e)}
                  title="Upload file"
                >
                  <i className="material-icons">cloud_upload</i>
                </Button>
              </div>
            </div>
          </MainPanel>
        </div>
      </ErrorBoundary>
    );
  }
}
