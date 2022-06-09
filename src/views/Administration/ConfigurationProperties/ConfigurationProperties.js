import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { nanoid } from 'nanoid';
import { hideModal } from '../../../action/modalActions';
import { MainPanel } from '../../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../../components/ErrorBoundary/ErrorBoundary';
import { showCustomModal } from '../../../components/CustomModal/CustomModal';
import { FilterProps } from './containers/FilterProps/index';
import { Icons } from '../../../constants/general';
import { ConfigPropertyListModel } from '../../../model/ConfigPropertyListModel/ConfigPropertyListModel';
import {
  createConfigProperty,
  createConfigPropset,
  /* deleteConfigProperty, deleteConfigPropset, */ getAllPropset,
  getConfigPropset,
  updateConfigPropset,
} from '../../../util/promises/config_promise';
import { showAlert } from './../../../components/MessageModal/MessageModal';
import { AddPropertyForm } from './containers/AddPropertyForm/AddPropertyForm';
import { AddPropsetForm } from './containers/AddPropsetForm/AddPropsetForm';
import PropertiesGrid from './containers/PropertiesGrid/PropertiesGrid';
import { TribylButton } from '../../../tribyl_components';
import './styles/ConfigurationProperties.style.scss';
import {
  getAllMarkets,
  listAllIndustry,
  listAllMarket,
  listAllRegion,
} from '../../../util/promises/browsestories_promise';

const excludedPropsets = [
  'BatchLoader',
  'Weights',
  'Outreach',
  'Tribyl Security Event Log',
  'Salesforce Dataload Propset',
  'Slack Integration',
  'Outlook Integration',
  'LinkedIn',
  'Zoom',
];

class ConfigurationPropertiesImpl extends PureComponent {
  state = {
    loadingPropsets: true,
    loadingProperties: true,
    propsets: [],
    propsetsFound: [],
    propsetSearch: '',
    tribylAllCfgPropertyBeans: [],
    propertiesSearch: '',
    activePropsetKey: -1,
    curPropsetName: '',

    market: [],
    region: [],
    segment: [],
    industry: [],
  };

  componentDidMount() {
    this.getAllPropsetAndProperties();
  }

  componentWillUnmount() {
    hideModal();
  }

  getAllPropsetAndProperties = async (activePropsetKey) => {
    const response = await getAllPropset();
    if (response && response.data && response.data.length > 0) {
      const propsetsFound = response.data.reduce((memo, propset) => {
        if (excludedPropsets.includes(propset.propsetName)) return memo;

        return [...memo, propset];
      }, []);

      this.setState(
        {
          propsets: response.data,
          propsetsFound,
          activePropsetKey: activePropsetKey || response.data[0].propsetId,
          loadingPropsets: false,
        },
        () => this.getConfigPropset(this.state.activePropsetKey)
      );
    } else {
      this.setState({ loadingPropsets: false, loadingProperties: false });
    }
  };

  async getConfigPropset(propsetId) {
    ConfigPropertyListModel.deleteAll();
    const response = await getConfigPropset(propsetId);
    if (response && response.data) {
      this.setState({
        loadingProperties: false,
        tribylAllCfgPropertyBeans:
          response.data.tribylAllCfgPropertyBeans || [],
      });
      const configurationProperties =
        response.data.tribylAllCfgPropertyBeans &&
        response.data.tribylAllCfgPropertyBeans.map(
          (property) =>
            new ConfigPropertyListModel({
              id: property.propertyId,
              ...property,
            })
        );
      ConfigPropertyListModel.saveAll(configurationProperties);
    } else {
      this.setState({ loadingProperties: false });
    }
  }

  handlePropsetSearch = (elem) => {
    const { propsets } = this.state;
    const propsetSearch = elem.target.value;
    const propsetsItemFound = propsets.filter((item) =>
      item.propsetName
        .toLocaleLowerCase()
        .includes(propsetSearch.toLocaleLowerCase())
    );
    this.setState({ propsetsFound: propsetsItemFound, propsetSearch });
  };

  handlePropertySearch = (elem) => {
    ConfigPropertyListModel.deleteAll();
    const { tribylAllCfgPropertyBeans } = this.state;
    const propertiesSearch = elem.target.value;
    const propertiesItemFound = tribylAllCfgPropertyBeans.filter((item) =>
      item.propertyName
        .toLocaleLowerCase()
        .includes(propertiesSearch.toLocaleLowerCase())
    );
    this.setState({ propertiesSearch }, () => {
      const configurationProperties = propertiesItemFound.map(
        (property) =>
          new ConfigPropertyListModel({ id: property.propertyId, ...property })
      );
      ConfigPropertyListModel.saveAll(configurationProperties);
    });
  };

  handlePropsetAccordion = (activePropsetKey, item) => {
    this.setState(
      {
        activePropsetKey,
        loadingProperties: true,
        propertiesSearch: '',
        curPropsetName: item?.propsetName,
      },
      async () => {
        if (item?.propsetName === 'Dashboard Filter Properties') {
          Promise.all([
            getAllMarkets(),
            listAllRegion('information technology'),
            listAllIndustry('information technology'),
            listAllMarket('information technology'),
          ]).then((res) => {
            this.setState({
              market: res[0]?.data || [],
              region: res[1]?.data || [],
              industry: res[2]?.data || [],
              segment: res[3]?.data || [],
            });
          });
        }
        this.getConfigPropset(this.state.activePropsetKey);
      }
    );
  };

  // handleDeletePropset = (propsetId) => {
  //     this.setState({ loadingPropsets: true }, () => {
  //         deleteConfigPropset(propsetId).then(() => this.getAllPropsetAndProperties()).catch(() => {
  //             showAlert('Something went wrong. Please try later', 'error');
  //             this.setState({ loadingPropsets: false });
  //         });
  //     });
  // }

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

  handlePropsetSearchClear = () => {
    const { propsets } = this.state;
    this.setState({ propsetSearch: '', propsetsFound: propsets });
  };

  handlePropertiesSearchClear = () => {
    const { tribylAllCfgPropertyBeans } = this.state;
    this.setState({ propertiesSearch: '' }, () => {
      const configurationProperties = tribylAllCfgPropertyBeans.map(
        (property) =>
          new ConfigPropertyListModel({ id: property.propertyId, ...property })
      );
      ConfigPropertyListModel.saveAll(configurationProperties);
    });
  };

  handleAddNewPropset = () => {
    const header = <p>Add New Propset</p>;
    const body = <AddPropsetForm handlePropsetSave={this.handlePropsetSave} />;
    showCustomModal(header, body, 'add-propset-form-modal');
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

  handleWorkatoButtonClick = async (e) => {
    try {
      const token = await this.generateToken();
      window.open(
        `https://app.workato.com/direct_link/recipes?workato_dl_token=${token}`,
        '_blank'
      );
    } catch (error) {
      console.log(error);
    }
  };

  generateToken = async () => {
    const systemProperties = this.state.propsets.find(
      (propset) => propset.propsetName === 'SystemProperties'
    ).tribylAllCfgPropertyBeans;
    const customerId =
      'E' +
      systemProperties.find((prop) => prop.propertyName === 'CUSTOMER_NAME')
        .propsetPropvalIncontextValue;
    const subParams = [process.env.WK_APIKEY, customerId];

    // Header
    const oHeader = { alg: 'RS256', typ: 'JWT' };
    // Payload
    const oPayload = {};
    const tNow = KJUR.jws.IntDate.get('now');
    oPayload.sub = subParams.join(':');
    oPayload.iat = tNow;
    oPayload.jti = nanoid();
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);

    const sJWT = KJUR.jws.JWS.sign(
      'RS256',
      sHeader,
      sPayload,
      process.env.TR_PRKEY
    );

    return sJWT;
  };

  // deleteProperty = (propertyId) => {
  //     this.setState({ loadingProperties: true });
  //     deleteConfigProperty(propertyId).then(() => {
  //         this.getConfigPropset(this.state.activePropsetKey);
  //     }).catch(() => {
  //         showAlert('Something went wrong. Try again later.', 'error');
  //     }).finally(() => {
  //         hideModal();
  //     });
  // }

  render() {
    const {
      loadingPropsets,
      propsetsFound,
      propsetSearch,
      propertiesSearch,
      activePropsetKey,
      loadingProperties,
    } = this.state;
    const { configurationProperties } = this.props;
    return (
      <ErrorBoundary>
        <section className="configuration-properties-view">
          <MainPanel
            viewName="Tribyl Platform Configuration "
            icons={[Icons.MAINMENU]}
            viewHeader={
              <div className="container">
                <div className="title-label row">
                  <div className="col-8">
                    <p>Configuration Properties</p>
                  </div>
                  <div className="col-4 text-right">
                    <button
                      disabled
                      className="add-propset-btn btn btn-primary"
                      onClick={this.handleAddNewPropset}
                    >
                      Add New Propset
                    </button>
                  </div>
                </div>
              </div>
            }
          >
            <div className="container">
              <div className="row">
                <div className="col-9">
                  <div className="row search-properties-section">
                    <div className="col-4">
                      <label htmlFor="search-properties">
                        Search Property:{' '}
                      </label>
                      <input
                        className="form-control"
                        id="search-properties"
                        value={propertiesSearch}
                        placeholder="Property name"
                        onChange={(e) => this.handlePropertySearch(e)}
                      />
                      {propertiesSearch.length > 0 ? (
                        <i
                          className="searchbar-icon material-icons close-icon"
                          onClick={this.handlePropertiesSearchClear}
                          role="button"
                        >
                          close
                        </i>
                      ) : (
                        <i className="searchbar-icon material-icons">search</i>
                      )}
                    </div>
                    <div className="col-4 d-flex align-items-end justify-content-center">
                      <TribylButton
                        text="Workato"
                        variant="secondary"
                        onClick={this.handleWorkatoButtonClick}
                      />
                    </div>
                    <div className="col-4 text-right">
                      {this.state.curPropsetName !==
                        'Dashboard Filter Properties' && (
                        <button
                          disabled
                          className="btn add-property-btn"
                          onClick={this.handleAddNewProperty}
                        >
                          Add New Property{' '}
                          <i className="material-icons">add_circle</i>
                        </button>
                      )}
                    </div>
                  </div>
                  {loadingProperties ? (
                    <p
                      className="font-weight-bold"
                      style={{ marginTop: '1em', marginBottom: '0' }}
                    >
                      Fetching properties. Please wait...
                    </p>
                  ) : configurationProperties.length > 0 ? (
                    this.state.curPropsetName ===
                    'Dashboard Filter Properties' ? (
                      <>
                        <FilterProps
                          tribylAllCfgPropertyBeans={configurationProperties}
                          market={this.state.market}
                          region={this.state.region}
                          segment={this.state.segment}
                          industry={this.state.industry}
                        />
                      </>
                    ) : (
                      <PropertiesGrid
                        dataType="general"
                        tribylAllCfgPropertyBeans={configurationProperties}
                        /* deleteProperty={this.deleteProperty} */
                        onPropertyChange={() =>
                          this.getAllPropsetAndProperties(activePropsetKey)
                        }
                      />
                    )
                  ) : (
                    <p
                      className="font-weight-bold"
                      style={{ marginTop: '1em', marginBottom: '0' }}
                    >
                      No properties yet...
                    </p>
                  )}
                </div>
                <div className="col-3 propset-list">
                  <div className="searchbar-section">
                    <input
                      className="form-control"
                      type="text"
                      id="propset-search"
                      placeholder="Search propset"
                      value={propsetSearch}
                      disabled={loadingPropsets}
                      onChange={(e) => this.handlePropsetSearch(e)}
                    />
                    {propsetSearch.length > 0 ? (
                      <i
                        className="material-icons close-icon"
                        onClick={this.handlePropsetSearchClear}
                        role="button"
                      >
                        close
                      </i>
                    ) : (
                      <i className="material-icons">search</i>
                    )}
                  </div>
                  {loadingPropsets ? (
                    <p
                      className="font-weight-bold"
                      style={{ marginTop: '1em', marginBottom: '0' }}
                    >
                      Fetching propsets. Please wait...
                    </p>
                  ) : propsetsFound.length === 0 ? (
                    <p
                      className="font-weight-bold"
                      style={{ marginTop: '1em', marginBottom: '0' }}
                    >
                      No propsets found. Try creating some.
                    </p>
                  ) : (
                    <div className="propset-section">
                      <ul>
                        {propsetsFound.map((item) => (
                          <li
                            className={
                              activePropsetKey === item.propsetId
                                ? 'd-flex justify-content-between selected'
                                : 'd-flex justify-content-between'
                            }
                            key={item.propsetId}
                            onClick={() => {
                              if (!this.state.loadingProperties)
                                this.handlePropsetAccordion(
                                  item.propsetId,
                                  item
                                );
                            }}
                          >
                            <p className="propset-name">{item.propsetName}</p>
                            <div className="propset-actions">
                              <button
                                disabled
                                className="btn edit-btn"
                                title="Update Propset"
                                onClick={() =>
                                  this.handleUpdatePropset(
                                    item.propsetName,
                                    item.propsetId
                                  )
                                }
                              >
                                <i className="material-icons">edit</i>
                              </button>
                              {/* <button className="btn delete-btn" title="Delete Propset" onClick={() => this.handleDeletePropset(item.propsetId)}>
                                                                    <i className="material-icons">delete</i>
                                                                </button> */}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
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
    configurationProperties: ConfigPropertyListModel.list().map(
      (item) => item.props
    ),
  };
}

export default connect(mapStateToProps)(ConfigurationPropertiesImpl);
