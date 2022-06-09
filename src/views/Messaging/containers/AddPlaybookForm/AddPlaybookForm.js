import React, { PureComponent } from 'react';
import { showAlert } from './../../../../components/MessageModal/MessageModal';
import { hideModal } from '../../../../action/modalActions';
import { createNewMarket } from './../../../../util/promises/playbooks_promise';
import './styles/AddPlaybookForm.style.scss';

export class AddPlaybookForm extends PureComponent {
  state = {
    name: '',
    description: '',
  };

  handleFormCancel = () => {
    this.setState({ name: null, description: null });
    hideModal();
  };

  handleFormSubmit = (elem) => {
    elem.preventDefault();
    const { name, description } = this.state;
    if (name) {
      const payload = {
        salesPlayName: name,
        salesPlayDescription: description,
      };
      createNewMarket(payload)
        .then((res) => {
          this.props.handleMarketNameUpdate(res.data);
          hideModal();
        })
        .catch(() =>
          showAlert('Something went wrong! Please try again later.', 'error')
        );
    }
  };

  render() {
    const { name, description } = this.state;
    return (
      <form
        className="add-playbook-form-v2"
        onSubmit={(e) => this.handleFormSubmit(e)}
      >
        <div className="form-group">
          <label htmlFor="pb-name">
            Market Name <span className="required">*</span>
          </label>
          <input
            required
            type="text"
            placeholder="Type a name"
            id="pb-name"
            className="pb-name form-control"
            value={name}
            onChange={(e) => this.setState({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pb-desc">Description</label>
          <textarea
            placeholder="Enter a description for this market"
            id="pb-desc"
            className="pb-desc form-control"
            rows="6"
            value={description}
            onChange={(e) => this.setState({ description: e.target.value })}
          />
        </div>
        <hr />
        <div className="form-group form-footer-actions d-flex justify-content-end">
          <button className="btn cancel-btn" onClick={this.handleFormCancel}>
            Cancel
          </button>
          <button type="submit" className="btn save-btn">
            Create Market
          </button>
        </div>
      </form>
    );
  }
}
