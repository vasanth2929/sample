import React, { PureComponent } from 'react';
import ReactDataGrid from 'react-data-grid';
import { connect } from 'react-redux';
import { ConfigPropertyListModel } from './../../../../../model/ConfigPropertyListModel/ConfigPropertyListModel';
import {
  OutreachProspectPropertyListModel,
  OutreachSequencePropertyListModel,
  OutreachSetupPropertyListModel,
} from './../../../../../model/OutreachPropertyListModel/OutreachPropertyListModel';
import {
  updateConfigProperty,
  createConfigPropsetPropval,
  updateConfigPropsetPropval,
} from '../../../../../util/promises/config_promise';

const excludedProperties = [
  'search_string_limit',
  'deal_summary_server_url',
  'mail_server_address',
  'sf_kloudless_sync',
  'gmail_redirect_uri',
  'transcript_folder',
  'rev_api_key',
  'rev_url',
  'job_title_match_levenshtein_distance',
  'mail_server_port',
  'bus_stat_duration',
  'mail_server_password',
  'initialBalance',
  'bidStoryEscrowPeriodinMinutes',
  'maxQuerySize',
  'storySubmitPoints',
  'Keyset File',
  'kloudless_account_id',
  'kloudless_api_token',
  'MediaUploadDir',
  'company_logo_path',
  'ENABLE_SENTRY',
  'PDF Image Folder',
  'kloudless_url_name',
  'USE_CASSANDRA_FOR_CR_SCORES',
  'logger.url',
  'SENTRY_DSN',
  'TOKEN_EXPIRY_DAY',
  'DEFAULT_LOG_LEVEL_VALUE',
  'mail_server_host',
  'ConvMigrationPageSize',
  'gmail_credentials.json',
  'environment',
];
class BoldHeaderRenderer extends React.Component {
  render() {
    const textStyle = {
      color: '#5F6C72',
      fontSize: '1.125em !important',
      marginBottom: '0',
    };
    return (
      <div>
        <p style={textStyle}>{this.props.value}</p>
      </div>
    );
  }
}

class TextFormatter extends React.Component {
  render() {
    const textStyle = {
      fontFamily: 'Roboto-Regular',
      color: '#5F6C72',
      fontSize: '14px !important',
      marginBottom: '0',
    };
    return (
      <p
        className="gridText"
        title={this.props.value.displayValue}
        style={textStyle}
      >
        {this.props.value.displayValue &&
        this.props.value.displayValue.length > 40
          ? `${this.props.value.displayValue.slice(0, 40)}...`
          : this.props.value.displayValue || ''}
      </p>
    );
  }
}

class ValueFormatter extends React.Component {
  render() {
    const textStyle = {
      fontFamily: 'Roboto-Regular',
      color: '#5F6C72',
      fontSize: '14px !important',
      marginBottom: '0',
    };
    return (
      <p className="gridText" title={this.props.value} style={textStyle}>
        {this.props.value}
      </p>
    );
  }
}

class ClearContextFormatter extends React.Component {
  handleClearContext = (propertyId, propsetPropvalId) => {
    const payload = {
      clearIncontextValue: true,
      incontextValue: '',
      propertyId,
      propsetPropvalId,
    };
    updateConfigPropsetPropval(payload).then((response) => {
      if (response.status === 200) {
        if (this.props.value.dataType === 'outreach') {
          if (this.props.value.outreachType === 'prospects') {
            new OutreachProspectPropertyListModel({
              id: response.data.propertyId,
              propsetPropvalIncontextValue: response.data.incontextValue,
              ...response.data,
            }).$save();
          } else if (this.props.value.outreachType === 'sequence') {
            new OutreachSequencePropertyListModel({
              id: response.data.propertyId,
              propsetPropvalIncontextValue: response.data.incontextValue,
              ...response.data,
            }).$save();
          } else if (this.props.value.outreachType === 'setup') {
            new OutreachSetupPropertyListModel({
              id: response.data.propertyId,
              propsetPropvalIncontextValue: response.data.incontextValue,
              ...response.data,
            }).$save();
          }
          // new OutreachPropertyListModel({ id: response.data.propertyId, ...response.data }).$save();
        } else {
          new ConfigPropertyListModel({
            id: response.data.propertyId,
            propsetPropvalIncontextValue: response.data.incontextValue,
            ...response.data,
          }).$save();
        }
        this.props.onPropertyChange();
      }
    });
  };

  render() {
    const delStyle = {
      color: '#3b99fc',
      cursor: 'pointer',
    };
    const { propertyId, propsetPropvalId } = this.props.value;
    return (
      <div className="text-center">
        <span
          style={delStyle}
          onClick={() => this.handleClearContext(propertyId, propsetPropvalId)}
          role="button"
        >
          Clear value
        </span>
      </div>
    );
  }
}

class PropertiesGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.gridColumns =
      props.dataType === 'outreach'
        ? [
            {
              key: 'description',
              name: 'Tribyl Field Name',
              resizable: true,
              editable: true,
              headerRenderer: <BoldHeaderRenderer value="Tribyl Field Name" />,
              formatter: ValueFormatter,
            },
            {
              key: 'propsetPropvalIncontextValue',
              name: 'Context Value',
              sortable: true,
              resizable: true,
              editable: true,
              headerRenderer: (
                <BoldHeaderRenderer value="Outreach Field Name" />
              ),
              formatter: ValueFormatter,
            },
            // {
            //     key: 'deleteProperty',
            //     name: 'Remove',
            //     resizable: true,
            //     width: 110,
            //     headerRenderer: <BoldHeaderRenderer value="Remove" />,
            //     formatter: <DeleteButtonFormatter handleDelete={this.props.deleteProperty} />
            // },
            {
              key: 'clearContext',
              name: 'clearContext',
              resizable: true,
              width: 185,
              headerRenderer: <BoldHeaderRenderer value="" />,
              formatter: (
                <ClearContextFormatter
                  handleClearContext={this.props.handleClearContext}
                />
              ),
            },
          ]
        : [
            {
              key: 'propertyName',
              name: 'Property Name',
              sortable: true,
              resizable: true,
              width: 300,
              sortDescendingFirst: true,
              headerRenderer: <BoldHeaderRenderer value="Property Name" />,
              formatter: TextFormatter,
            },
            {
              key: 'defaultValue',
              name: 'Default Value',
              resizable: true,
              // editable: true,
              headerRenderer: <BoldHeaderRenderer value="Default Value" />,
              formatter: ValueFormatter,
            },
            {
              key: 'propsetPropvalIncontextValue',
              name: 'Context Value',
              resizable: true,
              editable: true,
              headerRenderer: <BoldHeaderRenderer value="Context Value" />,
              formatter: ValueFormatter,
            },
            // {
            //     key: 'deleteProperty',
            //     name: 'Remove',
            //     resizable: true,
            //     width: 110,
            //     headerRenderer: <BoldHeaderRenderer value="Remove" />,
            //     formatter: <DeleteButtonFormatter handleDelete={this.props.deleteProperty} />
            // },
            {
              key: 'clearContext',
              name: 'clearContext',
              resizable: true,
              width: 185,
              headerRenderer: <BoldHeaderRenderer value="" />,
              formatter: (
                <ClearContextFormatter
                  handleClearContext={this.props.handleClearContext}
                  onPropertyChange={this.props.onPropertyChange}
                />
              ),
            },
          ];
    const {
      dataType,
      outreachType,
      tribylAllCfgPropertyBeans,
      tribylOutreachCfgPropertyBeans,
    } = this.props;
    const configProperties =
      dataType === 'outreach'
        ? tribylOutreachCfgPropertyBeans.sort((a, b) =>
            b.propertyName.localeCompare(a.propertyName)
          )
        : tribylAllCfgPropertyBeans;
    const originalRows = configProperties.map((item) => {
      return {
        propertyName: {
          displayValue: String(item.propertyName || ''),
          propertyId: item.propertyId,
          propsetId: item.propsetId,
          propsetPropvalId: item.propsetPropvalId,
        },
        defaultValue: String(item.defaultValue || ''),
        propsetPropvalIncontextValue: String(
          item.propsetPropvalIncontextValue || ''
        ),
        // propsetPropvalIncontextValue: {
        //     isVisible: item.isVisible,
        //     contextValue: String(item.propsetPropvalIncontextValue || '')
        // },
        // deleteProperty: {
        //     propertyId: item.propertyId
        // },
        description: item.description || '',
        clearContext: {
          propertyId: item.propertyId,
          propsetPropvalId: item.propsetPropvalId,
          dataType,
          outreachType,
        },
      };
    });
    const rows = this.formatRows(originalRows);
    this.state = {
      originalRows,
      rows,
      selectedIndexes: [],
    };
    this.gridSort = this.gridSort.bind(this);
  }

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.tribylAllCfgPropertyBeans !==
        this.props.tribylAllCfgPropertyBeans ||
      prevProps.tribylOutreachCfgPropertyBeans !==
        this.props.tribylOutreachCfgPropertyBeans ||
      prevProps.dataType !== this.props.dataType
    ) {
      const {
        dataType,
        outreachType,
        tribylAllCfgPropertyBeans,
        tribylOutreachCfgPropertyBeans,
      } = this.props;
      const configProperties =
        dataType === 'outreach'
          ? tribylOutreachCfgPropertyBeans.sort((a, b) =>
              b.propertyName.localeCompare(a.propertyName)
            )
          : tribylAllCfgPropertyBeans;
      const originalRows = configProperties.map((item) => {
        return {
          propertyName: {
            displayValue: String(item.propertyName || ''),
            propertyId: item.propertyId,
            propsetId: item.propsetId,
            propsetPropvalId: item.propsetPropvalId,
          },
          defaultValue: String(item.defaultValue || ''),
          propsetPropvalIncontextValue: String(
            item.propsetPropvalIncontextValue || ''
          ),
          // propsetPropvalIncontextValue: {
          //     isVisible: item.isVisible,
          //     contextValue: String(item.propsetPropvalIncontextValue || '')
          // },
          // deleteProperty: {
          //     propertyId: item.propertyId
          // },
          description: item.description || '',
          clearContext: {
            propertyId: item.propertyId,
            propsetPropvalId: item.propsetPropvalId,
            dataType,
            outreachType,
          },
        };
      });
      const rows = this.formatRows(originalRows);
      this.setState({ originalRows, rows });
    }
  };

  formatRows = (rows) => {
    if (!rows.length) return [];
    const user = JSON.parse(localStorage.getItem('user'));

    return user?.email === 'cs@tribyl.com'
      ? rows
          .slice(0)
          .sort((a, b) =>
            a.propertyName.displayValue.localeCompare(
              b.propertyName.displayValue
            )
          )
      : rows
          .slice(0)
          .filter(
            (row) => !excludedProperties.includes(row.propertyName.displayValue)
          )
          .sort((a, b) =>
            a.propertyName.displayValue.localeCompare(
              b.propertyName.displayValue
            )
          );
  };

  rowGetter = (index) => {
    return this.state.rows[index];
  };

  gridSort = (sortColumn, sortDirection) => {
    let sortFunction;
    switch (sortColumn) {
      case 'propertyName':
        sortFunction = this.alphabeticalSorter(sortColumn, sortDirection);
        break;
      case 'defaultValue':
      case 'propsetPropvalIncontextValue':
        sortFunction = this.alphabeticalSorter(sortColumn, sortDirection);
        break;

      default:
        break;
    }
    // the .concat() is crucial here so as not to mutate the original array, and to make the grid update properly
    const rows =
      sortDirection === 'NONE'
        ? this.state.originalRows.concat()
        : this.state.rows.concat().sort(sortFunction);
    this.setState({ rows });
  };

  alphabeticalSorter = (column, direction) => {
    const comparer = (a, b) => {
      if (direction === 'ASC') {
        return a[column].displayValue.toLowerCase() >
          b[column].displayValue.toLowerCase()
          ? 1
          : -1;
      } else if (direction === 'DESC') {
        return a[column].displayValue.toLowerCase() <
          b[column].displayValue.toLowerCase()
          ? 1
          : -1;
      }
      return 0;
    };
    return comparer;
  };

  handleContextValueUpdate = ({ fromRow, toRow, updated }) => {
    const { dataType, outreachType } = this.props;
    const rows = this.state.rows.concat();
    const row = fromRow === toRow ? fromRow : toRow;
    rows[row].displayValue = Object.values(updated)[0];
    this.setState({ rows });
    const originalVal = Object.assign({}, rows[row]);

    const key = Object.keys(updated)[0];
    let payload;
    switch (key) {
      default:
        break;
      case 'description':
        payload = {
          description: updated.description,
          propertyId: rows[row].propertyName.propertyId,
          propertyName: rows[row].propertyName.displayValue,
          propsetId: rows[row].propertyName.propsetId,
        };
        updateConfigProperty(payload).then((response) => {
          if (response.status === 200) {
            if (dataType === 'outreach') {
              if (outreachType === 'prospects') {
                new OutreachProspectPropertyListModel({
                  id: response.data.propertyId,
                  ...response.data,
                }).$save();
              } else if (outreachType === 'sequence') {
                new OutreachSequencePropertyListModel({
                  id: response.data.propertyId,
                  ...response.data,
                }).$save();
              } else if (outreachType === 'setup') {
                new OutreachSetupPropertyListModel({
                  id: response.data.propertyId,
                  ...response.data,
                }).$save();
              }
              // new OutreachPropertyListModel({ id: response.data.propertyId, ...response.data }).$save();
            } else {
              new ConfigPropertyListModel({
                id: response.data.propertyId,
                ...response.data,
              }).$save();
            }
          } else {
            rows[row] = originalVal;
            this.setState({ rows });
          }
        });
        break;
      case 'propsetPropvalIncontextValue':
        if (rows[row].propertyName.propsetPropvalId) {
          payload = {
            incontextValue: updated.propsetPropvalIncontextValue,
            propertyId: rows[row].propertyName.propertyId,
            propsetPropvalId: rows[row].propertyName.propsetPropvalId,
          };
          updateConfigPropsetPropval(payload).then((response) => {
            if (response.status === 200) {
              if (dataType === 'outreach') {
                if (outreachType === 'prospects') {
                  new OutreachProspectPropertyListModel({
                    id: response.data.propertyId,
                    propsetPropvalIncontextValue: response.data.incontextValue,
                    ...response.data,
                  }).$save();
                } else if (outreachType === 'sequence') {
                  new OutreachSequencePropertyListModel({
                    id: response.data.propertyId,
                    propsetPropvalIncontextValue: response.data.incontextValue,
                    ...response.data,
                  }).$save();
                } else if (outreachType === 'setup') {
                  new OutreachSetupPropertyListModel({
                    id: response.data.propertyId,
                    propsetPropvalIncontextValue: response.data.incontextValue,
                    ...response.data,
                  }).$save();
                }
                // new OutreachPropertyListModel({ id: response.data.propertyId, ...response.data }).$save();
              } else {
                new ConfigPropertyListModel({
                  id: response.data.propertyId,
                  propsetPropvalIncontextValue: response.data.incontextValue,
                  ...response.data,
                }).$save();
              }
              this.props.onPropertyChange();
            } else {
              rows[row] = originalVal;
              this.setState({ rows });
            }
          });
        } else {
          payload = {
            incontextValue: updated.propsetPropvalIncontextValue,
            propertyId: rows[row].propertyName.propertyId,
          };
          createConfigPropsetPropval(payload).then((response) => {
            if (response.status === 200) {
              if (dataType === 'outreach') {
                if (outreachType === 'prospects') {
                  new OutreachProspectPropertyListModel({
                    id: response.data.propertyId,
                    propsetPropvalIncontextValue: response.data.incontextValue,
                    ...response.data,
                  }).$save();
                } else if (outreachType === 'sequence') {
                  new OutreachSequencePropertyListModel({
                    id: response.data.propertyId,
                    propsetPropvalIncontextValue: response.data.incontextValue,
                    ...response.data,
                  }).$save();
                } else if (outreachType === 'setup') {
                  new OutreachSetupPropertyListModel({
                    id: response.data.propertyId,
                    propsetPropvalIncontextValue: response.data.incontextValue,
                    ...response.data,
                  }).$save();
                }
                // new OutreachPropertyListModel({ id: response.data.propertyId, ...response.data }).$save();
              } else {
                new ConfigPropertyListModel({
                  id: response.data.propertyId,
                  propsetPropvalIncontextValue: response.data.incontextValue,
                  ...response.data,
                }).$save();
              }
            } else {
              rows[row] = originalVal;
              this.setState({ rows });
            }
          });
        }
        break;
    }
  };

  render() {
    const { dataType } = this.props;
    return (
      <section
        className={
          dataType === 'outreach'
            ? 'propset-properties-data-grid outreach-propset-properties-data-grid'
            : 'propset-properties-data-grid'
        }
      >
        <ReactDataGrid
          columns={this.gridColumns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={
            dataType === 'outreach'
              ? this.state.rows.length * 40 + 40 < 500
                ? this.state.rows.length * 40 + 40
                : 500
              : this.state.rows.length * 45 + 45 < 500
              ? this.state.rows.length * 45 + 45
              : 500
          }
          rowHeight={45}
          onGridSort={this.gridSort}
          enableCellSelect
          onGridRowsUpdated={(fromRow, toRow, updated) =>
            this.handleContextValueUpdate(fromRow, toRow, updated)
          }
          rows={this.state.rows}
        />
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    userNonSSO: state.form.login.usernmae,
    userSSO: state.oidc.user,
  };
}

export default connect(mapStateToProps)(PropertiesGrid);
