import FileSaver from 'file-saver';
import React from 'react';
import { showCustomModal } from '../../../../../components/CustomModal/CustomModal';
import { downloadPdfFile } from '../../../../../util/promises/tearsheet_promise';
import { TearsheetModalTab } from '../../../../OpptyPlanV3/containers/StoriesTab/containers/TearSheetModal/TearSheet';

export class StoryActionsFormatter extends React.Component {
  async downloadPdfFile(storyId, accountName, closeYear) {
    // const storyId = value;
    // const strFileName = 'tearsheet_' + storyId + '.pdf';
    const buyingCenter =
      document.getElementsByClassName('opptyTitleLabel')[0].innerText;
    const strFileName = `${accountName}_${buyingCenter}_FY${closeYear}.pdf`
      .split(' ')
      .join('_');
    const download = await downloadPdfFile(storyId);
    const blob = new Blob([download.data], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blob, strFileName);
  }

  handleViewTearSheet = () => {
    const header = (
      <div className="stories-tearsheet-header">
        <div className="stories-header">Case Study</div>
        <div
          className="primary"
          role="button"
          onClick={() =>
            this.downloadPdfFile(
              this.props.value.storyId,
              this.props.value.accountName,
              this.props.value.closeYear
            )
          }
        >
          <i className="material-icons">get_app</i>
          <div>Download</div>
        </div>
      </div>
    );
    const body = (
      <TearsheetModalTab
        storyId={this.props.value.storyId}
        accountId={this.props.value.accountId}
      />
    );
    return showCustomModal(header, body, 'tearsheet-modal-stories-tab');
  };
  render() {
    const buttonStyle = {
      color: '#FFF',
      marginBottom: '0',
      borderRadius: '5px',
      background: '#0080FF',
      fontSize: '14px',
      boxShadow: 'none',
      borderColor: 'transparent',
    };
    return (
      <div className="grid-actions">
        {/* <ViewButtonFormatter {...this.props} /> */}
        <button
          className="btn view-btn"
          style={buttonStyle}
          onClick={() => this.handleViewTearSheet()}
        >
          View
        </button>
      </div>
    );
  }
}
