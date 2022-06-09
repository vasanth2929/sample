import React, { Component } from 'react';
import { showCustomModal } from '../../../components/CustomModal/CustomModal';
import './ShareModal.style.scss';

export default class ShareModal extends Component {
  showShareLink = (copyValue) => {
    showCustomModal(
      <h4>Sharable Link</h4>,
      <div className="mt-3 form-group d-flex justify-content-between">
        <input
          className="form-control"
          style={{ width: '550px' }}
          type="text"
          value={copyValue}
          id="dealSummartLink"
        />
        <button onClick={this.copyLink} id="copy" className="button ml-3">
          Copy
        </button>
      </div>,
      'share-modal'
    );
  };

  copyLink() {
    const copyText = document.getElementById('dealSummartLink');
    document.getElementById('copy').innerHTML = 'Copied';
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
  }

  render() {
    const { isOpen, copyValue } = this.props;
    return <div>{isOpen ? this.showShareLink(copyValue) : ''}</div>;
  }
}
