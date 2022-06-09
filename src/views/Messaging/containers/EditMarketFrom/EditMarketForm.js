import React, { PureComponent } from 'react';
import './styles/EditMarketForm.style.scss';
import { showAlert } from './../../../../components/MessageModal/MessageModal';
import { hideModal } from '../../../../action/modalActions';
import { updateMarketName } from './../../../../util/promises/playbooks_promise';
import { isEmpty } from '../../../../util/utils';
import { FilterMarketModel } from '../../../../model/GlobalFilterModels/GlobalFilterModels';


export class EditMarketForm extends PureComponent {
    state ={
        oldMarketName: this.props.marketName || "No market",
        newMarketName: ''
    }

    handleFormCancel = () => {
        this.setState({ newMarketName: '' });
        hideModal();
    }

    handleFormSubmit = (elem) => {
        elem.preventDefault();
        const { oldMarketName, newMarketName } = this.state;
        const { marketId } = this.props;
        const oldMarket = FilterMarketModel.get(marketId).props;
        new FilterMarketModel({id: oldMarket.id , ...oldMarket, name : newMarketName}).$save();
        updateMarketName(marketId, newMarketName).then((response) => {
            hideModal();
            this.props.handleMarketNameUpdate({ id:marketId, marketName:newMarketName });
        }).catch((e) => showAlert('Something went wrong! Please try again later.', 'error'));
    }

    render() {
        const {
            oldMarketName,
            newMarketName
        } = this.state;
        return (
            <form className="add-playbook-form-v2" onSubmit={e => this.handleFormSubmit(e)}>
                
                <div className="form-group">
                    <label htmlFor="pb-name">Market Title</label>
                    <input
                        type="text"
                        placeholder="Type a name"
                        id="pb-name"
                        className="pb-name form-control"
                        value={oldMarketName}
                        disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="pb-desc">New Market Title</label>
                    <input
                        type="text"
                        placeholder="Enter New Market Title"
                        id="pb-desc"
                        className="pb-name form-control"
                        value={newMarketName}
                        onChange={e => this.setState({ newMarketName: e.target.value })} />
                </div>
                <hr />
                <div className="form-group form-footer-actions d-flex justify-content-end">
                    <button className="btn cancel-btn" onClick={this.handleFormCancel}>Cancel</button>
                    <button type="submit" className="btn save-btn" disabled={isEmpty(newMarketName)}>Edit Market</button>
                </div>
            </form>
        );
    }
}


