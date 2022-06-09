import React, { PureComponent } from 'react';

export class AddPropsetForm extends PureComponent {
    state = {
        propsetName: this.props.propsetName || ''
    }

    handlepropsetNameChange = (elem) => {
        this.setState({ propsetName: elem.target.value });
    }

    handlePropsetSave = (e, propsetName) => {
        e.preventDefault();
        const { propsetId } = this.props;
        if (propsetId) {
            const payload = {
                propsetId,
                propsetName
            };
            this.props.handlePropsetUpdate(payload);
        } else {
            this.props.handlePropsetSave(propsetName);
        }
    }

    render() {
        const { propsetName } = this.state;
        return (
            <form className="add-propset-form" onSubmit={e => this.handlePropsetSave(e, propsetName)}>
                <label>Propset Name *:</label>
                <input
                    className="form-control new-propset-name-input"
                    value={propsetName}
                    required
                    onChange={e => this.handlepropsetNameChange(e)} />
                <div className="text-right">
                    <input type="submit" className="btn primary-btn save-btn" value="Save" />
                </div>
            </form>
        );
    }
}
