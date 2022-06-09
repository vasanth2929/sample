/* eslint-disable no-nested-ternary */

import React from 'react';
import { connect } from 'react-redux';
import profileImage from '../../../../../../assets/images/dummy_account.png';

import { TearsheetCardsModel } from '../../../../../../model/tearsheetModels/TearsheetCardsModel';
import { TearsheetModel } from '../../../../../../model/tearsheetModels/TearsheetModel';
import {
  getTearsheetForStory,
  getAccountDetails,
  getCustomerProfile,
} from '../../../../../../util/promises/tearsheet_promise';
import { TearsheetTopicsModel } from '../../../../../../model/tearsheetModels/TearsheetTopicsModel';

import './styles/TearSheet.styles.scss';
import { SanitizeUrl } from '../../../../../../util/utils';
// import { Label } from '../../../../../../basecomponents/Label/Label';

export class TearSheetOptyImpl extends React.PureComponent {
  state = {
    isLoading: true,
    customerDetails: {},
    storyId: '',
    accountId: null,
  };

  componentWillMount() {
    const { storyId, accountId } = this.props;
    this.setState({ storyId, accountId });
  }

  componentDidMount() {
    TearsheetCardsModel.deleteAll();
    this.getTearsheetForStory(this.state.storyId);
    this.getAccountDetails(this.state.storyId).then(() =>
      this.getCustomerProfile(this.state.accountId)
    );
  }
  getLogo = (icon) => {
    let accountImage;
    try {
      accountImage =
        icon === '' || icon === null
          ? `${profileImage}`
          : `tribyl/api/photo?location=${SanitizeUrl(icon)}`;
    } catch (error) {
      accountImage = `${profileImage}`;
    }
    return accountImage;
  };

  async getTearsheetForStory(storyId) {
    TearsheetModel.deleteAll();

    const response = await getTearsheetForStory(storyId);
    this.setState({ isLoading: false });
    if (response.data.length !== 0) {
      this.populateTearSheet(response.data);
    }
  }
  async getAccountDetails(storyId) {
    const response = await getAccountDetails(storyId);
    this.setState({
      customerDetails: Object.assign({}, this.state.customerDetails, {
        name: response.data.name,
      }),
    });
  }
  async getCustomerProfile(accountId) {
    const response = await getCustomerProfile(accountId);
    this.setState({
      customerDetails: Object.assign(
        {},
        this.state.customerDetails,
        response.data,
        { name: this.state.customerDetails.name }
      ),
    });
  }
  populateTearSheet = (responsedata) => {
    const tearsheets = responsedata.tearSheetDetailMap;
    if (responsedata.id) {
      this.setState({ tearsheetId: responsedata.id });
    }
    Object.keys(tearsheets).map((key) =>
      new TearsheetModel({
        id: key,
        title: key,
        content: tearsheets[key],
      }).$save()
    );
  };

  renderSheetSection = ({ title, content }, key) => (
    <div key={key}>
      <header className="sheet-title">{title}</header>
      <p className="content">{content}</p>
    </div>
  );
  renderViewMode = () => {
    const {
      customerDetails: {
        custDescription,
        custQuote,
        employees,
        icon,
        industry,
        location,
        name,
      },
    } = this.state;
    return (
      <div className="profile-card-wrapper">
        <div className="customer-header">
          <div>
            <img
              width="400"
              height="400"
              className="img-wrap"
              src={this.getLogo(icon)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${profileImage}`;
              }}
            />
          </div>
          <div className="right-wrapper">
            <div className="name">{name}</div>
            <div className="">
              <span className="industry-label">Industry:</span>
              <span className="industry">{industry}</span>
            </div>
            <div className="">
              <span className="industry-label">Employees:</span>
              <span className="industry">{employees}</span>
            </div>
            <div className="">
              <span className="industry-label">Location:</span>
              <span className="industry">{location}</span>
            </div>
          </div>
        </div>
        <div className="customer-body">
          <div className="description-wrapper">
            <div className="description-label">Customer Description</div>
            <div className="description">
              {custDescription || 'Not available'}
            </div>
          </div>
          <div className="description-wrapper">
            <div className="description-label">Customer Quote</div>
            <div className="description">{custQuote || 'Not available'}</div>
          </div>
        </div>
      </div>
    );
  };
  render() {
    return (
      <div className="tear-opty-sheet-view-container">
        {!this.props.insightsModal && (
          <div className="row">
            <div className="col-4 cards-section">{this.renderViewMode()}</div>
            <div className="col-8 card-content-section">
              <div className="tear-sheets margin-right-10">
                {/* <h3>Tearsheet</h3> */}
                {!this.state.isLoading ? (
                  this.props.sheet.length > 0 ? (
                    this.props.sheet.map((item, key) =>
                      this.renderSheetSection(item, key)
                    )
                  ) : (
                    <div className="empty-label">
                      No Tearsheet Summary Found
                    </div>
                  )
                ) : (
                  <p style={{ paddingTop: '1em' }}>Loading...</p>
                )}
              </div>
            </div>
          </div>
        )}
        {this.props.insightsModal && (
          <div className="card-content-section">
            <div className="tear-sheets margin-right-10">
              {/* <h3>Tearsheet</h3> */}
              {!this.state.isLoading ? (
                this.props.sheet.length > 0 ? (
                  this.props.sheet.map((item, key) =>
                    this.renderSheetSection(item, key)
                  )
                ) : (
                  <div className="empty-label">No Tearsheet Summary Found</div>
                )
              ) : (
                <p style={{ paddingTop: '1em' }}>Loading...</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps() {
  return {
    sheet: TearsheetModel.list().map((item) => item.props),
    topics: TearsheetTopicsModel.list().map((item) => item.props),
    topicsWithCards: TearsheetCardsModel.list().map((item) => item.props),
  };
}

export const TearsheetModalTab = connect(mapStateToProps)(TearSheetOptyImpl);
