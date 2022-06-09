import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hideModal } from '../../../action/modalActions';
import { MainPanel } from '../../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import { showCustomModal } from '../../../components/CustomModal/CustomModal';
import { Icons } from '../../../constants/general';
import {
  OutreachProspectPropertyListModel,
  OutreachSequencePropertyListModel,
  OutreachSetupPropertyListModel,
} from '../../../model/OutreachPropertyListModel/OutreachPropertyListModel';
import {
  createConfigProperty,
  createConfigPropset,
  /* deleteConfigProperty, deleteConfigPropset, */ getAllPropset,
  getConfigPropset,
  updateConfigPropset,
} from '../../../util/promises/config_promise';
import { showAlert } from './../../../components/MessageModal/MessageModal';
import { AddPropertyForm } from '../ConfigurationProperties/containers/AddPropertyForm/AddPropertyForm';
import { AddPropsetForm } from '../ConfigurationProperties/containers/AddPropsetForm/AddPropsetForm';
import PropertiesGrid from '../ConfigurationProperties/containers/PropertiesGrid/PropertiesGrid';
import '../ConfigurationProperties/styles/ConfigurationProperties.style.scss';
import './OutreachAdministration.scss';
// import { OutreachSequenceGrid } from './containers/OutreachSequenceGrid/OutreachSequenceGrid';

class OutreachAdministrationImpl extends PureComponent {
  state = {
    loadingPropsets: false,
    loadingProperties: true,
    propsets: [{ propsetId: 13, propsetName: 'Outreach' }],
    tribylAllCfgPropertyBeans: [],
    // propertiesSearch: '',
    activePropsetKey: 13,
  };

  componentDidMount() {
    this.getAllPropsetAndProperties();
  }

  componentWillUnmount() {
    hideModal();
  }

  async getAllPropsetAndProperties(activePropsetKey) {
    const response = await getAllPropset();
    if (response && response.data && response.data.length > 0) {
      const outreach = response.data.filter(
        (item) => item.propsetName.toLocaleLowerCase() === 'outreach'
      );
      this.setState(
        {
          propsets: outreach,
          activePropsetKey: activePropsetKey || outreach[0].propsetId,
          loadingPropsets: false,
        },
        () => this.getConfigPropset(this.state.activePropsetKey)
      );
    } else {
      this.setState({ loadingPropsets: false, loadingProperties: false });
    }
  }

  async getConfigPropset(propsetId) {
    OutreachProspectPropertyListModel.deleteAll();
    OutreachSequencePropertyListModel.deleteAll();
    OutreachSetupPropertyListModel.deleteAll();
    const response = await getConfigPropset(propsetId);
    if (response && response.data) {
      this.setState({
        loadingProperties: false,
        tribylAllCfgPropertyBeans:
          response.data.tribylAllCfgPropertyBeans || [],
      });
      // const outreachProperties = response.data.tribylAllCfgPropertyBeans && response.data.tribylAllCfgPropertyBeans.map(property => new OutreachPropertyListModel({ id: property.propertyId, ...property }));
      const prospectProperties =
        response.data.tribylAllCfgPropertyBeans &&
        response.data.tribylAllCfgPropertyBeans
          .filter((item) => item.description.split(' ')[0].includes('Prospect'))
          .map(
            (property) =>
              new OutreachProspectPropertyListModel({
                id: property.propertyId,
                ...property,
              })
          );
      const sequenceProperties =
        response.data.tribylAllCfgPropertyBeans &&
        response.data.tribylAllCfgPropertyBeans
          .filter((item) => item.description.split(' ')[0].includes('Sequence'))
          .map(
            (property) =>
              new OutreachSequencePropertyListModel({
                id: property.propertyId,
                ...property,
              })
          );
      const setupProperties =
        response.data.tribylAllCfgPropertyBeans &&
        response.data.tribylAllCfgPropertyBeans
          .filter((item) => item.description.split(' ')[0].includes('Setup'))
          .map(
            (property) =>
              new OutreachSetupPropertyListModel({
                id: property.propertyId,
                ...property,
              })
          );
      // OutreachPropertyListModel.saveAll(outreachProperties);
      OutreachProspectPropertyListModel.saveAll(prospectProperties);
      OutreachSequencePropertyListModel.saveAll(sequenceProperties);
      OutreachSetupPropertyListModel.saveAll(setupProperties);
    } else {
      this.setState({ loadingProperties: false });
    }
  }

  handleUpdatePropset = (propsetName, propsetId) => {
    const header = <p>Add New Propset</p>;
    const body = (
      <AddPropsetForm
        propsetName={propsetName}
        propsetId={propsetId}
        handlePropsetUpdate={this.handlePropsetUpdate}
      />
    );
    showCustomModal(header, body, 'edit-propset-form-modal');
  };

  handleAddNewProperty = () => {
    const { propsets, activePropsetKey } = this.state;
    const propset = propsets.find(
      (item) => item.propsetId === activePropsetKey
    ).propsetName;
    const header = <p>Add New Property</p>;
    const body = (
      <AddPropertyForm
        propset={propset}
        handlePropertySave={this.handlePropertySave}
      />
    );
    showCustomModal(header, body, 'add-property-form-modal');
  };

  handlePropsetSave = (propsetName) => {
    const payload = {
      propsetName,
    };
    this.setState({ loadingProperties: true, loadingPropsets: true });
    createConfigPropset(payload)
      .then((response) => {
        this.getAllPropsetAndProperties(response.data.propsetId);
      })
      .catch(() => {
        showAlert('Something went wrong. Try again later.', 'error');
      })
      .finally(() => {
        hideModal();
      });
  };

  handlePropsetUpdate = (payload) => {
    this.setState({ loadingProperties: true, loadingPropsets: true });
    updateConfigPropset(payload)
      .then((response) => {
        this.getAllPropsetAndProperties(response.data.propsetId);
      })
      .catch(() => {
        showAlert('Something went wrong. Try again later.', 'error');
      })
      .finally(() => {
        hideModal();
      });
  };

  handlePropertySave = (propertyName, defaultValue) => {
    const payload = {
      propertyName,
      defaultValue,
      propsetId: Number(this.state.activePropsetKey),
    };
    this.setState({ loadingProperties: true });
    createConfigProperty(payload)
      .then(() => {
        this.getConfigPropset(this.state.activePropsetKey);
      })
      .catch(() => {
        showAlert('Something went wrong. Try again later.', 'error');
      })
      .finally(() => {
        hideModal();
      });
  };

  render() {
    const {
      // propertiesSearch,
      loadingProperties,
    } = this.state;
    const {
      // outreachProperties
      outreachProspectProperties,
      outreachSequenceProperties,
      outreachSetupProperties,
    } = this.props;
    return (
      <ErrorBoundary>
        <section className="outreach-properties-view">
          <MainPanel
            viewName="Tribyl Platform Configuration"
            icons={[Icons.MAINMENU]}
            viewHeader={
              <div className="container">
                <div className="title-label row">
                  <div className="col-8">
                    <p>Outreach Integration Configuration</p>
                  </div>
                </div>
              </div>
            }
          >
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="row search-properties-section">
                    <div className="col-4" />
                    <div className="col-8 text-right">
                      {/* <button disabled className="btn add-property-btn" onClick={this.handleAddNewProperty}>Add New Property <i className="material-icons">add_circle</i></button> */}
                    </div>
                  </div>
                  {loadingProperties ? (
                    <p
                      className="font-weight-bold"
                      style={{ marginTop: '1em', marginBottom: '0' }}
                    >
                      Fetching properties. Please wait...
                    </p>
                  ) : (
                    <React.Fragment>
                      {outreachProspectProperties.length > 0 && (
                        <div className="grid-group">
                          <label>Prospects</label>
                          <PropertiesGrid
                            dataType="outreach"
                            outreachType="prospects"
                            tribylOutreachCfgPropertyBeans={
                              outreachProspectProperties
                            } /* deleteProperty={this.deleteProperty} */
                          />
                        </div>
                      )}
                      {outreachSequenceProperties.length > 0 && (
                        <div className="sequence grid-group">
                          <label>Sequence</label>
                          <PropertiesGrid
                            dataType="outreach"
                            outreachType="sequence"
                            tribylOutreachCfgPropertyBeans={
                              outreachSequenceProperties
                            }
                          />
                          {/* <OutreachSequenceGrid /> */}
                        </div>
                      )}
                      {outreachSetupProperties.length > 0 && (
                        <div className="grid-group">
                          <label>Setup</label>
                          <PropertiesGrid
                            dataType="outreach"
                            outreachType="setup"
                            tribylOutreachCfgPropertyBeans={
                              outreachSetupProperties
                            } /* deleteProperty={this.deleteProperty} */
                          />
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </MainPanel>
        </section>
      </ErrorBoundary>
    );
  }
}

function mapStateToProps() {
  return {
    // outreachProperties: OutreachPropertyListModel.list().map(item => item.props)
    outreachProspectProperties: OutreachProspectPropertyListModel.list().map(
      (item) => item.props
    ),
    outreachSequenceProperties: OutreachSequencePropertyListModel.list().map(
      (item) => item.props
    ),
    outreachSetupProperties: OutreachSetupPropertyListModel.list().map(
      (item) => item.props
    ),
  };
}

export default connect(mapStateToProps)(OutreachAdministrationImpl);
