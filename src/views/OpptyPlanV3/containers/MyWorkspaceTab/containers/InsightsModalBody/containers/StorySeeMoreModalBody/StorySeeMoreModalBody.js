import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { bindActionCreators } from 'redux';
import FileSaver from 'file-saver';

import shareLimited from '../../../../../../../../assets/iconsV2/share-limited.png';
import shareGlobal from '../../../../../../../../assets/iconsV2/share-global.png';
import shareRestricted from '../../../../../../../../assets/iconsV2/share-restricted.png';
// import { FloaterButton } from '../../../../../../../../basecomponents/FloaterButton/FloaterButton';
import { downloadFile } from '../../../../../../../../util/promises/playbooks_promise';
import profileImage from '../../../../../../../../assets/images/dummy.png';

import './styles/StorySeeMoreModalBody.style.scss';

class StorySeeMoreModalBodyImpl extends PureComponent {
  // constructor(props) {
  //     super(props);
  //     this.state = {
  //         stories: []
  //     };
  // }

  // componentDidMount() {
  //     this.getStoryForCard();
  // }

  // async getStoryForCard() {
  //     const response = await getStoryForCard(this.props.cardId);
  //     this.setState({ stories: response.data });
  // }

  // async getDealCard(dealCardId, userId) {
  //     const response = await getDealCard(dealCardId, userId);
  //     this.setState({ isDataLoading: false, cardData: response.data }, () => {
  //         this.props.updateCardInsights('description', this.state.cardData.description || '');
  //         this.props.updateCardInsights('protip', this.state.cardData.protip || '');
  //         this.props.updateCardInsights('cardDetails.File', this.state.cardData.cardDetails.File || '');
  //         this.props.updateCardInsights('cardDetails.url', this.state.cardData.cardDetails.url || '');
  //         this.props.updateCardInsights('cardDetails.product', this.state.cardData.cardDetails.product || []);
  //         this.props.updateCardInsights('cardDetails.compelling_event', this.state.cardData.cardDetails.compelling_event || 'N');
  //         this.props.updateCardInsights('cardDetails.criterion', this.state.cardData.cardDetails.criterion || 'N');
  //     });
  // }

  handleFileDownload = async (file) => {
    const strFileName = file.split('\\').pop().split('/').pop();
    const download = await downloadFile(strFileName, file);
    const blob = new Blob([download.data], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blob, strFileName);
  };

  render() {
    const { storyDetails } = this.props;
    let currentStatusIcon;
    let currentStatusLabel;
    switch (storyDetails.shareStatus) {
      case 'share-internal':
        currentStatusIcon = shareRestricted;
        currentStatusLabel = 'Restriced';
        break;
      case 'share-external-restricted':
        currentStatusIcon = shareLimited;
        currentStatusLabel = 'Limited';
        break;
      case 'share-external-complete':
        currentStatusIcon = shareGlobal;
        currentStatusLabel = 'Public';
        break;
      default:
        currentStatusIcon = shareLimited;
        currentStatusLabel = 'Limited';
        break;
    }
    return (
      <section className="stories-seemore-view-modal">
        <div className="d-flex flex-wrap">
          <div className="storyTileContainer">
            <div className="headerContainer d-flex">
              <div className="d-flex">
                <div className="dummyIcon">
                  {storyDetails.accountIcon ? (
                    <img
                      src={`tribyl/api/photo?location=${storyDetails.accountIcon}`}
                      alt="Account"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${profileImage}`;
                      }}
                    />
                  ) : (
                    <img src={profileImage} />
                  )}
                </div>
              </div>
              <div className="d-flex flex-column">
                <div className="row d-flex">
                  <div className="col-12">
                    <p className="titleLabel leftColLable">
                      {storyDetails.accountName}
                    </p>
                  </div>
                </div>
                <div className="row d-flex row">
                  <div className="col-5 d-flex flex-column justify-content-between">
                    <p className="closeQtrLabel leftColLable">{`${storyDetails.closeQtr} - ${storyDetails.closeYear}`}</p>
                    <p className="oppAmountLabel leftColLable">{`${
                      storyDetails.opportunityAmount
                        ? Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                          }).format(storyDetails.opportunityAmount)
                        : '$0'
                    }`}</p>
                    {storyDetails.oppStatus === 'closed-won' && (
                      <div className="oppStatusContainer green">
                        <p className="oppStatusLabel">Won</p>
                      </div>
                    )}
                    {storyDetails.oppStatus === 'no-decision' && (
                      <div className="oppStatusContainer orange">
                        <p className="oppStatusLabel">No Decision</p>
                      </div>
                    )}
                    {storyDetails.oppStatus === 'closed-lost' && (
                      <div className="oppStatusContainer red">
                        <p className="oppStatusLabel">Lost</p>
                      </div>
                    )}
                  </div>
                  <div className="col-7 d-flex flex-column justify-content-end">
                    <div className="d-flex shareStatusContainer">
                      <img src={currentStatusIcon} />
                      <p className="greyLabel">{currentStatusLabel}</p>
                    </div>
                    <div className="d-flex">
                      {storyDetails.decisionCriterion ? (
                        <i className="material-icons decisionCheckbox">
                          check_box
                        </i>
                      ) : (
                        <i className="material-icons decisionCheckbox">
                          check_box_outline_blank
                        </i>
                      )}
                      <p className="greyLabel">Decision criterion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bodyContainer d-flex flex-column">
              <p className="titleLabel">Context</p>
              <p className="contextBody">{storyDetails.cardContext}</p>
            </div>
            <div className="bodyContainer d-flex flex-column">
              <p className="titleLabel">Protip</p>
              <p className="contextBody">{storyDetails.cardProTip}</p>
            </div>
            {storyDetails.dealResource && storyDetails.dealResource.file && (
              <div className="bodyContainer d-flex flex-column">
                <p className="titleLabel">Files</p>
                <p
                  className="linkLabel"
                  onClick={() =>
                    this.handleFileDownload(storyDetails.dealResource.file)
                  }
                >
                  {storyDetails.dealResource.file.slice(
                    storyDetails.dealResource.file.lastIndexOf('/') + 1,
                    storyDetails.dealResource.file.length
                  )}
                </p>
              </div>
            )}
            {storyDetails.dealResource && storyDetails.dealResource.url && (
              <div className="bodyContainer d-flex flex-column">
                <p className="titleLabel">URL</p>
                <a
                  className="linkLabel"
                  href={storyDetails.dealResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {storyDetails.dealResource.url}
                </a>
              </div>
            )}
            {storyDetails.dealProducts && (
              <div className="bodyContainer d-flex flex-column">
                <p className="titleLabel">Products</p>
                <ul className="productList">
                  {storyDetails.dealProducts &&
                    Array.isArray(storyDetails.dealProducts) &&
                    storyDetails.dealProducts.map((item, key) => (
                      <li key={key}>{item}</li>
                    ))}
                  {storyDetails.dealProducts &&
                    !Array.isArray(storyDetails.dealProducts) && (
                      <li>{storyDetails.dealProducts}</li>
                    )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return { cardInsightsField: state.form.cardInsights };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateCardInsights: (model, value) =>
        actions.change(`form.cardInsights.${model}`, value),
      setInitialValues: (value) => actions.change('form.cardInsights', value),
    },
    dispatch
  );
}

export const StorySeeMoreModalBody = connect(
  mapStateToProps,
  mapDispatchToProps
)(StorySeeMoreModalBodyImpl);
