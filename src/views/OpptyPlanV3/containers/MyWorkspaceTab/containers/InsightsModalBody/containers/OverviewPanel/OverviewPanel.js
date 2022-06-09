import React from 'react';
import FileSaver from 'file-saver';
import { connect } from 'react-redux';
import { Control, Form, actions } from 'react-redux-form';
import Select from 'react-select';
import { bindActionCreators } from 'redux';
// import { FloaterButton } from '../../../../../../../../basecomponents/FloaterButton/FloaterButton';
import { OpptyPlanCardModel } from '../../../../../../../../model/opptyPlanModels/OpptyPlanCardModel';
import {
  getDealCard,
  getPersonaCardDetail,
} from '../../../../../../../../util/promises/dealcards_promise';
import { getPlaybookCardDetails } from '../../../../../../../../util/promises/playbookcard_details_promise';

import {
  removeFile,
  updateCard,
  uploadAndSaveFile,
  downloadFile,
  getAllSalesPersonaMasterValuesForBuyerName,
} from '../../../../../../../../util/promises/playbooks_promise';
import './styles/OveviewPanel.style.scss';
import { UtilModel } from '../../../../../../../../model/UtilModel';
import Collapsible from '../../../../../../../../basecomponents/Collapsible/Collapsible';

class OverviewPanelImpl extends React.PureComponent {
  state = {
    details: null,
    isEditing: false,
    isLoading: true,
    url: '',
    product: '',
    playbookTag: '',
  };

  componentWillMount() {
    this.loadData();
  }

  componentDidUpdate(previousProps) {
    const { isPersonaCard } = this.props;
    if (
      !isPersonaCard &&
      (previousProps.cardId !== this.props.cardId ||
        (this.props.reloadOpptySidebar && !previousProps.reloadOpptySidebar))
    ) {
      this.loadData();
      UtilModel.updateData({ reloadOpptySidebar: false });
    } else if (
      isPersonaCard &&
      (previousProps.cardDetails.opptyPCardDetailContactRelId !==
        this.props.cardDetails.opptyPCardDetailContactRelId ||
        (this.props.reloadOpptySidebar && !previousProps.reloadOpptySidebar))
    ) {
      this.loadData();
      UtilModel.updateData({ reloadOpptySidebar: false });
    }
  }

  loadData = () => {
    const { cardId, userId, isPersonaCard, cardDetails, playbookName } =
      this.props;
    let promise;
    if (isPersonaCard) {
      promise = getPersonaCardDetail(cardId).then(({ data }) => ({
        data: data.cards,
      }));
    } else if (cardDetails.isNetNewCard) {
      promise = getDealCard(cardId, userId);
    } else {
      promise = getPlaybookCardDetails(
        cardDetails.parentCardId || cardId,
        userId
      );
    }
    Promise.all([
      promise,
      getAllSalesPersonaMasterValuesForBuyerName(playbookName),
    ]).then((responses) => {
      const response = responses[0];
      const personas = (responses[1].data || []).filter(
        (p) => p.type !== 'solution'
      );
      const solutions = (responses[1].data || []).filter(
        (p) => p.type === 'solution'
      );
      if (
        !response.data.salesPersonaNames ||
        response.data.salesPersonaNames.length === 0
      ) {
        response.data.cardPersonas = personas.map((persona) => ({
          value: persona.salesPersonaName,
          label: persona.salesPersonaName,
        }));
      } else {
        response.data.cardPersonas = response.data.salesPersonaNames.map(
          (name) => ({ value: name, label: name })
        );
      }
      if (
        !response.data.salesSolutions ||
        response.data.salesSolutions.length === 0
      ) {
        response.data.cardSolutions = solutions.map((solution) => ({
          value: solution.salesPersonaName,
          label: solution.salesPersonaName,
        }));
        // response.data.cardSolutions = ["IoT", "Single View"];
      } else {
        response.data.cardSolutions = response.data.salesSolutions.map(
          (name) => ({ value: name, label: name })
        );
      }
      this.handleResponse(response);
    });
  };

  handleResponse = ({ data }) => {
    this.setState({ details: { ...data }, isLoading: false });
    this.props.updatePlaybookCardProductList(
      data.cardDetails ? data.cardDetails.product || [] : []
    );
  };

  handleUrlChange = (elem) => {
    this.setState({ url: elem.target.value });
  };

  handleAddUrl = () => {
    const details = { ...this.state.details };
    if (!details.cardDetails) {
      details.cardDetails = {};
    }
    details.cardDetails.url = this.state.url;
    this.props.updateCardOverview('cardDetails.url', this.state.url);
    this.setState({ details, url: '' });
  };

  handleRemoveUrl = () => {
    const details = { ...this.state.details };
    if (!details.cardDetails) {
      details.cardDetails = {};
    }
    details.cardDetails.url = '';
    this.props.updateCardOverview('cardDetails.url', '');
    this.setState({ details, url: '' });
  };

  handleProductChange = (elem) => {
    this.setState({ product: elem.target.value });
  };
  handlePlayBookCardTagChange = (elem) => {
    this.setState({ playbookTag: elem.target.value });
  };

  handleAddProduct = (elem) => {
    elem.preventDefault();
    this.props.updateCardOverview('cardDetails.product', [
      ...(this.state.details.cardDetails.productBeans || []),
      { id: -1, value: this.state.product },
    ]);
    const details = { ...this.state.details };
    if (!details.cardDetails) {
      details.cardDetails = {};
    }
    if (!details.cardDetails.productBeans) {
      details.cardDetails.productBeans = [];
    }
    const availableProducts = Array.from(
      this.state.details.cardDetails.productBeans
    );
    availableProducts.push({ id: -1, value: this.state.product });
    details.cardDetails.productBeans = availableProducts;
    this.setState({ details, product: '' });
  };

  handlePlayBookTagAdd = (elem) => {
    elem.preventDefault();
    this.props.updateCardOverview('cardDetails.playbook_tag', [
      ...(this.state.details.cardDetails.tagBean || []),
      { id: -1, value: this.state.playbookTag },
    ]);
    const details = { ...this.state.details };
    if (!details.cardDetails) {
      details.cardDetails = {};
    }
    if (!details.cardDetails.tagBean) {
      details.cardDetails.tagBean = [];
    }
    const availableProducts = Array.from(
      this.state.details.cardDetails.tagBean
    );
    availableProducts.push({ id: -1, value: this.state.playbookTag });
    details.cardDetails.tagBean = availableProducts;
    this.setState({ details, playbookTag: '' });
  };

  handleRemoveTag = (tag) => {
    const availableTags = Array.from(this.state.details.cardDetails.tagBean);
    const index = availableTags.indexOf(tag);
    availableTags.splice(index, 1);
    this.props.updateCardOverview('cardDetails.playbook_tag', availableTags);
    const details = { ...this.state.details };
    if (!details.cardDetails) {
      details.cardDetails = {};
    }
    details.cardDetails.tagBean = availableTags;
    this.setState({ details });
  };

  handleRemoveProduct = (product) => {
    const availableProducts = Array.from(
      this.state.details.cardDetails.productBeans
    );
    const index = availableProducts.indexOf(product);
    availableProducts.splice(index, 1);
    this.props.updateCardOverview('cardDetails.product', availableProducts);
    const details = { ...this.state.details };
    if (!details.cardDetails) {
      details.cardDetails = {};
    }
    details.cardDetails.productBeans = availableProducts;
    this.setState({ details });
  };

  handleEditClick = () => {
    this.setState({ isEditing: true });
    const { details } = this.state;
    const cardDetails = {};
    if (details.cardDetails) {
      cardDetails.product = details.cardDetails.productBeans;
      cardDetails.playbook_tag = details.cardDetails.tag_beans;
      cardDetails.File = details.cardDetails.File
        ? details.cardDetails.File[0]
        : '';
      cardDetails.url = details.cardDetails.url
        ? details.cardDetails.url[0]
        : '';
    }
    this.props.setInitialValues({
      description: details.description,
      talkingPoints: details.talkingPoints,
      id: details.id || this.props.cardId,
      cardDetails,
    });
  };

  handleFileUpload = async (e) => {
    const { data } = await uploadAndSaveFile(
      e.target.files[0],
      this.props.cardId
    );
    const details = this.state.details;
    if (!details.cardDetails) {
      details.cardDetails = {};
    }
    details.cardDetails.File = [data.location];
    this.setState({ details });
    this.props.updateCardOverview('cardDetails.File', data.location);
  };

  handleFileRemove = async () => {
    // const { id } = this.state.details;
    await removeFile({
      cardId: this.props.cardId,
      file: this.state.details.cardDetails.File[0],
    });
    const details = { ...this.state.details };
    if (!details.cardDetails) {
      details.cardDetails = {};
    }
    details.cardDetails.File = [];
    this.setState({ details });
    this.props.updateCardOverview('cardDetails.File', '');
  };

  handleFormSubmit = async () => {
    const { cardOverview } = this.props;
    const { data } = await updateCard(cardOverview.id, cardOverview);
    this.setState({
      isEditing: false,
      details: {
        ...this.state.details,
        description: cardOverview.description,
        talkingPoints: cardOverview.talkingPoints,
        cardDetails: {
          ...data.cardDetails,
          productBeans: data.cardDetails.product,
          product: (data.cardDetails.product || []).map((i) => i.value),
          tagBean: data.cardDetails.playbook_tag,
        },
      },
    });
    OpptyPlanCardModel.updateCardDetails({
      ...data,
      talkingPoints: cardOverview.talkingPoints,
    });
    UtilModel.updateData({ reloadOpptySidebar: true });
  };

  isDealCard = () => {
    const { type } = this.props.cardDetails;
    return type && type === 'deal';
  };

  handleFileDownload = async (file) => {
    const strFileName = file.split('\\').pop().split('/').pop();
    const download = await downloadFile(strFileName, file);
    const blob = new Blob([download.data], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blob, strFileName);
  };

  renderResources = (dealResource, type) => {
    const { isSideBar } = this.props;
    const noncollapsibleArray =
      dealResource.length > 0 ? [dealResource[0]] : [];
    const collapsibleArray =
      dealResource.filter((item, index) => index !== 0) || [];

    return (
      <React.Fragment>
        <div className={isSideBar ? 'col-12' : 'col-10'}>
          {type === 'file' ? (
            <Collapsible
              title={
                <p className="heading">
                  File Resources {`(${dealResource.length})`}
                </p>
              }
              noCollapsible={
                noncollapsibleArray.length > 0 ? (
                  <div className="d-flex justify-content-end pt-2">
                    <p
                      className="mr-auto description link"
                      onClick={() =>
                        this.handleFileDownload(noncollapsibleArray[0].location)
                      }
                    >
                      {noncollapsibleArray[0].name || ''}
                    </p>
                    {
                      <div className="counter-pill view-counter-pill">{`${
                        Math.floor(Math.random() * (50 - 10)) + 10
                      } Views`}</div>
                    }
                    {
                      <div className="counter-pill match-counter-pill">{`${
                        Math.floor(Math.random() * (50 - 10)) + 10
                      } Matches`}</div>
                    }
                  </div>
                ) : (
                  <div />
                )
              }
              // ANCHOR  collapsible content
              Collapsible={collapsibleArray.map((item) => (
                <div className="d-flex justify-content-end pt-2">
                  <p
                    className="mr-auto description link"
                    onClick={() => this.handleFileDownload(item.location)}
                  >
                    {item.name || ''}
                  </p>
                  {
                    <div className="counter-pill view-counter-pill">{`${
                      Math.floor(Math.random() * (50 - 10)) + 10
                    } Views`}</div>
                  }
                  {
                    <div className="counter-pill match-counter-pill">{`${
                      Math.floor(Math.random() * (50 - 10)) + 10
                    } Matches`}</div>
                  }
                </div>
              ))}
            />
          ) : (
            <Collapsible
              title={
                <p className="heading">
                  Urls Resources {` (${dealResource.length})`}
                </p>
              }
              noCollapsible={
                noncollapsibleArray.length > 0 ? (
                  <div className="d-flex justify-content-end pt-2">
                    <p className="mr-auto description link">
                      <a
                        href={
                          noncollapsibleArray.indexOf('http') > -1
                            ? noncollapsibleArray
                            : `https://${noncollapsibleArray}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {noncollapsibleArray}
                      </a>
                    </p>
                    {
                      <div className="counter-pill view-counter-pill">{`${
                        Math.floor(Math.random() * (50 - 10)) + 10
                      } Views`}</div>
                    }
                    {
                      <div className="counter-pill match-counter-pill">{`${
                        Math.floor(Math.random() * (50 - 10)) + 10
                      } Matches`}</div>
                    }
                  </div>
                ) : (
                  <div />
                )
              }
              // ANCHOR collapsible content
              Collapsible={collapsibleArray.map((item) => (
                <div className="d-flex justify-content-end pt-2">
                  <p className="mr-auto description link">
                    <a
                      href={
                        item.indexOf('http') > -1 ? item : `https://${item}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item}
                    </a>
                  </p>
                  {
                    <div className="counter-pill view-counter-pill">{`${
                      Math.floor(Math.random() * (50 - 10)) + 10
                    } Views`}</div>
                  }
                  {
                    <div className="counter-pill match-counter-pill">{`${
                      Math.floor(Math.random() * (50 - 10)) + 10
                    } Matches`}</div>
                  }
                </div>
              ))}
            />
          )}
        </div>
      </React.Fragment>
    );
  };

  renderEditForm = () => {
    const { details } = this.state;
    return (
      <section className="overview-form">
        <Form
          model="form.cardOverview"
          className="edit-form"
          onSubmit={this.handleFormSubmit}
        >
          <section className="form-body">
            <div className="form-group">
              <label htmlFor="description-input">Talking Points</label>
              <Control.textarea
                rows="3"
                id="description-input"
                className="form-control"
                model=".description"
              />
            </div>
            <div className="form-group">
              <label htmlFor="talking-points-inout">Discovery Questions</label>
              <Control.textarea
                rows="3"
                id="talking-points-input"
                className="form-control"
                model=".talkingPoints"
              />
            </div>
            <label htmlFor="talking-points-inout">Resources</label>
            <div className="form-group row">
              <div className="col-8">
                <React.Fragment>
                  <div className="d-flex capsule-input">
                    <input
                      className="form-control"
                      type="url"
                      value={this.state.url}
                      onChange={this.handleUrlChange}
                      disabled={
                        (details.cardDetails &&
                          details.cardDetails.url &&
                          details.cardDetails.url.length > 0) ||
                        (details.cardDetails &&
                          details.cardDetails.File &&
                          details.cardDetails.File.length > 0)
                      }
                    />
                    <button
                      className="btn add-url-btn blue-btn"
                      onClick={this.handleAddUrl}
                      disabled={this.state.url.length < 1}
                    >
                      Add URL
                    </button>
                  </div>
                  <div className="capsule-list d-flex">
                    {details.cardDetails &&
                      details.cardDetails.url &&
                      details.cardDetails.url.length > 0 && (
                        <p className="capsule">
                          {details.cardDetails.url}
                          <span className="remove-capsule">
                            <i
                              className="material-icons"
                              role="button"
                              onClick={() => this.handleRemoveUrl()}
                            >
                              close
                            </i>
                          </span>
                        </p>
                      )}
                  </div>
                </React.Fragment>
                {(details.topic_name === 'Competition' ||
                  details.topic_name === 'Partners') && (
                  <React.Fragment>
                    <label htmlFor="talking-points-inout">Products</label>
                    <div className="d-flex capsule-input">
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.product}
                        onChange={this.handleProductChange}
                      />
                      <button
                        className="btn add-url-btn blue-btn"
                        onClick={this.handleAddProduct}
                        disabled={this.state.product.length < 1}
                      >
                        Add Product
                      </button>
                    </div>
                    <div className="capsule-list d-flex">
                      {details.cardDetails.productBeans &&
                        details.cardDetails.productBeans.length > 0 &&
                        details.cardDetails.productBeans.map((item, key) => (
                          <p className="capsule" key={key}>
                            {item.value}
                            <span className="remove-capsule">
                              <i
                                className="material-icons"
                                role="button"
                                onClick={() => this.handleRemoveProduct(item)}
                              >
                                close
                              </i>
                            </span>
                          </p>
                        ))}
                    </div>
                  </React.Fragment>
                )}
                {details && (
                  <React.Fragment>
                    <label htmlFor="talking-points-inout">Tags</label>
                    <div className="d-flex capsule-input">
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.playbookTag}
                        onChange={this.handlePlayBookCardTagChange}
                      />
                      <button
                        className="btn add-url-btn blue-btn"
                        onClick={this.handlePlayBookTagAdd}
                        disabled={this.state.playbookTag.length < 1}
                      >
                        Add Tags
                      </button>
                    </div>
                    <div className="capsule-list d-flex">
                      {details.cardDetails &&
                        details.cardDetails.tagBean &&
                        details.cardDetails.tagBean.length > 0 &&
                        details.cardDetails.tagBean.map((item, key) => (
                          <p className="capsule" key={key}>
                            {item.value}
                            <span className="remove-capsule">
                              <i
                                className="material-icons"
                                role="button"
                                onClick={() => this.handleRemoveTag(item)}
                              >
                                close
                              </i>
                            </span>
                          </p>
                        ))}
                    </div>
                  </React.Fragment>
                )}
              </div>
              <div className="col-4 text-right">
                <label
                  className={
                    (details.cardDetails &&
                      details.cardDetails.url &&
                      details.cardDetails.url.length > 0) ||
                    (details.cardDetails &&
                      details.cardDetails.File &&
                      details.cardDetails.File.length > 0)
                      ? 'add-file-btn disabled'
                      : 'add-file-btn'
                  }
                >
                  <input
                    type="file"
                    id="context-input"
                    name="card-file"
                    onChange={this.handleFileUpload}
                    disabled={
                      (details.cardDetails &&
                        details.cardDetails.url &&
                        details.cardDetails.url.length > 0) ||
                      (details.cardDetails &&
                        details.cardDetails.File &&
                        details.cardDetails.File.length > 0)
                    }
                  />
                  Add File
                </label>
                {details.cardDetails &&
                  details.cardDetails.File &&
                  details.cardDetails.File.length > 0 && (
                    <div className="capsule-list d-flex file-capsules justify-content-end">
                      <p className="capsule">
                        {details.cardDetails.File[0].split('/').pop()}
                        <span
                          role="button"
                          onClick={this.handleFileRemove}
                          className="remove-capsule"
                        >
                          <i className="material-icons" role="button">
                            close
                          </i>
                        </span>
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </section>
          <div className="form-actions d-flex justify-content-end">
            <button
              className="btn cancel-btn"
              onClick={() => this.setState({ isEditing: false })}
            >
              Cancel
            </button>
            <input type="submit" className="btn submit-btn" value="Save" />
          </div>
        </Form>
      </section>
    );
  };

  renderOverviewContent = (details) => {
    const { cardDetails } = this.props;
    const dealResource = { url: [], file: [] };
    if (
      details &&
      details.cardDetails &&
      details.cardDetails.File &&
      details.cardDetails.File.length > 0
    ) {
      dealResource.file = details.cardDetails.File;
    }
    if (
      details &&
      details.cardDetails &&
      details.cardDetails.url &&
      details.cardDetails.url.length > 0
    ) {
      dealResource.url = details.cardDetails.url;
    }
    const talkingPoints = this.isDealCard()
      ? details.playbook_description && details.playbook_description.length > 0
        ? details.playbook_description.split('\n')
        : ''
      : details.description && details.description.length > 0
      ? details.description.split('\n')
      : '';
    const description =
      details.talkingPoints && details.talkingPoints.length > 0
        ? details.talkingPoints.split('\n')
        : '';
    return (
      <React.Fragment>
        <section>
          <p className="heading">Personas</p>
          <p className="description">
            <Select
              isMulti
              isDisabled
              className="card-personas-wrapper"
              classNamePrefix="card-persona-item"
              value={details.cardPersonas}
              options={[]}
            />
          </p>
        </section>
        <section>
          <p className="heading">Solutions</p>
          <p className="description">
            <Select
              isMulti
              isDisabled
              className="card-personas-wrapper"
              classNamePrefix="card-persona-item"
              value={details.cardSolutions}
              options={[]}
            />
          </p>
        </section>
        {cardDetails.topicName === 'Economic Drivers' && (
          <section className="compelling-kpi">
            <p className="heading">Type: </p>
            <p className="description">
              {details.cardDetails &&
                details.cardDetails.compelling_event &&
                details.cardDetails.compelling_event[0] === 'Y' &&
                'Compelling Event'}
              {details.cardDetails &&
                details.cardDetails.KPI &&
                details.cardDetails.KPI[0] === 'Y' &&
                'KPI'}
              {(!details.cardDetails ||
                (!details.cardDetails.compelling_event &&
                  !details.cardDetails.KPI)) &&
                'N/A'}
            </p>
          </section>
        )}
        <section>
          <p className="heading" style={{ marginBottom: '14px' }}>
            Description
          </p>
          <p className="description">
            {typeof talkingPoints === 'object'
              ? talkingPoints.map((item, key) => (
                  <p style={{ marginBottom: '14px' }} key={key}>
                    {item}
                  </p>
                ))
              : ''}
          </p>
        </section>
        <section>
          <p className="heading" style={{ marginBottom: '14px' }}>
            Talking Points
          </p>
          <p className="description">
            {typeof description === 'object'
              ? description.map((item, key) => (
                  <p style={{ marginBottom: '14px' }} key={key}>
                    {item}
                  </p>
                ))
              : ''}
          </p>
        </section>
        <section className="row">
          {dealResource.file.length > 0 || dealResource.url.length > 0 ? (
            <React.Fragment>
              {/* ANCHOR render url dropdown */}
              {this.renderResources(dealResource.url, 'url')}
              {/* ANCHOR render file dropdown */}
              {this.renderResources(dealResource.file, 'file')}
            </React.Fragment>
          ) : (
            <div className="col-12">
              <label className="heading">Resources</label>
              <p className="description" />
            </div>
          )}
          {details.topic_name === 'Competition' ||
          details.topic_name === 'Partners' ? ( // eslint-disable-line
            details &&
            details.cardDetails.product &&
            details.cardDetails.product.length > 0 ? (
              <div className="col-12">
                <p className="heading">Products</p>
                <ul style={{ paddingLeft: '1.2em' }}>
                  {details.cardDetails.product.map((item, key) => (
                    <li key={key}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="col-6">
                <p className="heading">Products</p>
              </div>
            )
          ) : (
            <p />
          )}
        </section>
      </React.Fragment>
    );
  };

  render() {
    const { isEditing, isLoading } = this.state;
    if (isLoading) {
      return <div>loading ...</div>;
    }
    if (isEditing) {
      return this.renderEditForm();
    }
    return this.renderOverviewContent(this.state.details);
  }
}

function mapStateToProps(state) {
  return {
    cardOverview: state.form.cardOverview,
    reloadOpptySidebar: UtilModel.getValue('reloadOpptySidebar'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateCardOverview: (model, value) =>
        actions.change(`form.cardOverview.${model}`, value),
      setInitialValues: (value) => actions.change('form.cardOverview', value),
    },
    dispatch
  );
}

export const OverviewPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(OverviewPanelImpl);
