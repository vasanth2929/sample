import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { hideModal } from '../../action/modalActions';
import { showAlert } from './../../components/MessageModal/MessageModal';
import { upsertNotesForCardToCardRelForOppty } from './../../util/promises/playbookcard_details_promise';
import './AddFeedBackForm.style.scss';

export class AddFeedBackForm extends PureComponent {
  constructor(props) {
    super(props);
    const description = this.props.value ? this.props.value : '';
    const formatdescription = description
      ? description.split('\\n\\n').join('<br /><br /> ******* <br /><br />')
      : '';
    this.state = {
      description: formatdescription,
    };
  }

  handleFormCancel = () => {
    this.setState({ description: '' });
    hideModal();
  };

  handleFormSubmit = (elem) => {
    elem.preventDefault();
    const { description } = this.state;
    const { VPid, Compid, opptyId, handleFeedBackChange } = this.props;
    upsertNotesForCardToCardRelForOppty(description, opptyId, Compid, VPid)
      .then(() => {
        hideModal();
        handleFeedBackChange();
      })
      .catch(() =>
        showAlert('Something went wrong! Please try again later.', 'error')
      );
  };

  handleData = (data) => {
    this.setState({ description: data });
  };

  render() {
    const { description } = this.state;
    const { uiType, readOnly } = this.props;
    const modules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
      ],
      clipboard: { matchVisual: false },
    };
    const formats = ['bold', 'italic', 'underline', 'mark', 'list'];
    return (
      <form
        className="add-feedback-form-v2"
        onSubmit={(e) => this.handleFormSubmit(e)}
      >
        <div className="form-group">
          <label htmlFor="pb-desc">
            {uiType === 'ds' ? 'Add or Update FeedBack' : ''}
          </label>
          <ReactQuill
            theme="bubble"
            value={description}
            modules={modules}
            formats={formats}
            onChange={this.handleData}
            readOnly={uiType === 'dgt' || readOnly}
          />
        </div>
        <hr />
        <div className="form-group form-footer-actions d-flex justify-content-end">
          {uiType === 'ds' ? (
            <button className="btn cancel-btn" onClick={this.handleFormCancel}>
              Close
            </button>
          ) : (
            ''
          )}
          {uiType === 'ds' ? (
            <button type="submit" className="btn save-btn" disabled={readOnly}>
              Submit
            </button>
          ) : (
            ''
          )}
        </div>
      </form>
    );
  }
}

AddFeedBackForm.propTypes = {
  VPid: PropTypes.number,
  Compid: PropTypes.number,
  opptyId: PropTypes.number,
  value: PropTypes.string,
  handleFeedBackChange: PropTypes.func,
  uiType: PropTypes.string,
  readOnly: PropTypes.bool,
};
