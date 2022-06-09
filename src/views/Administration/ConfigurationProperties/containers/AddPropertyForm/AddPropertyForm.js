import React, { PureComponent } from 'react';

export class AddPropertyForm extends PureComponent {
    state = {
        propertyName: '',
        defaultValue: ''
    }

    handlePropertyNameChange = (elem) => {
        this.setState({ propertyName: elem.target.value });
    }

    handleDefaultValueChange = (elem) => {
        this.setState({ defaultValue: elem.target.value });
    }

    handlePropertySave = (e, propertyName, defaultValue) => {
        e.preventDefault();
        this.props.handlePropertySave(propertyName, defaultValue);
    }

    render() {
        const { propertyName, defaultValue } = this.state;
        const { propset } = this.props;
        return (
            <form className="add-property-form" onSubmit={e => this.handlePropertySave(e, propertyName, defaultValue)}>
                <p className="propset-name">Propset name: {propset}</p>
                <label>Property Name *:</label>
                <input
                    className="form-control property-name-input"
                    value={propertyName}
                    required
                    onChange={e => this.handlePropertyNameChange(e)} />
                <label>Default Value:</label>
                <input
                    className="form-control default-value-input"
                    value={defaultValue}
                    onChange={e => this.handleDefaultValueChange(e)} />
                <div className="text-right">
                    <input type="submit" className="btn primary-btn save-btn" value="Save" />
                </div>
            </form>
        );
    }
}
