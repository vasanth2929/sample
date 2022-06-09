import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { Tooltip } from '@material-ui/core';
import Select from 'react-select';
import {
  listAllMarkets,
  updateDomain,
} from '../../util/promises/playbooks_promise';
import { getSurveyQuestionsAndCardsByCategory } from '../../util/promises/survey_promise';
import { Loader } from '../../_tribyl/components/_base/Loader/Loader';
import SurveyMultiSelect from '../FieldGenerator/SurveyMultiSelect/SurveyMultiSelect';
import SurveyTextArea from '../FieldGenerator/SurveyTextArea';
import './Context.style.scss';
import { filterContextQuestion } from './contextDataHelper';
import { listAllIndustry } from '../../util/promises/browsestories_promise';
import { addAccountIndustryToOverrideList } from '../../util/promises/meta-data-promise';
import { SingleAccountModel } from '../../model/AccountModel/AccountModel';
import { isValidDomain } from '../../util/utils';
import { showAlert } from '../../components/MessageModal/MessageModal';

const DEFAULT_CLASSNAME = 'context';

class SurveyContext extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contextQuestion: [],
      isLoading: true,
      answerArray: [],
      markets: [],
      disableNext: true,
      selectedMarket: null,
      industryList: [],
      isNullMarket: false,
      isDomainValid: true,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { opptyId } = this.props;
    const response = await getSurveyQuestionsAndCardsByCategory(
      'Context',
      opptyId
    );
    const playbookName = 'information technology';
    const response2 = await listAllMarkets();
    const response3 = await listAllIndustry(playbookName);
    const industryList = response3
      ? response3.data.filter((i) => i.qualifierId !== 21)
      : [];
    let contextQuestion = response.data
      ? filterContextQuestion(response.data)
      : [];
    // contextQuestion.push(contextQuestion.shift());
    
    const markets =
      response2 && response2.data && response2.data.length > 0
        ? response2.data
        : [];
    this.setState({ contextQuestion, isLoading: false, markets, industryList });
  };

  handledisableNext = () => {
    this.setState({ disableNext: false });
  };

  handleMarketSelection = (marketId, marketName) => {
    if (marketName.toLowerCase() === 'none') {
      this.setState({ isNullMarket: true });
    } else {
      this.setState({ isNullMarket: false });
    }
    this.setState({ selectedMarket: marketId }, () => {
      this.loadData();
    });
  };

  OptionMarket = (markets) => {
    return markets ? markets.map((i) => ({ value: i.id, label: i.name })) : [];
  };

  OptionsGenerator = (data, label = 'title', value = 'id') => {
    const { stage } = this.props;

    if (stage?.toLowerCase().includes('lost')) {
      // if stage is close lost then remove us card from list for winner
      return data
        ? data
            .map((i) => ({ value: i[value], label: i[label] }))
            .filter(
              (j) =>
                stage?.toLowerCase().includes('lost') &&
                !j.label.toLowerCase().includes('us')
            )
        : [];
    }
    return data ? data.map((i) => ({ value: i[value], label: i[label] })) : [];
  };

  setSelectedMarket = (selectedMarket) => {
    if (selectedMarket === 379) {
      this.setState({ isNullMarket: true });
    }
    this.setState({ selectedMarket });
  };

  renderField = (type, data) => {
    const { markets, selectedMarket } = this.state;
    const { storyId, opptyId, stage } = this.props;
    switch (type) {
      case 'market':
        return (
          <div>
            <SurveyMultiSelect
              onChange={this.handleMarketSelection}
              setSelectedMarket={this.setSelectedMarket}
              options={this.OptionMarket(markets)}
              placeholder="Select market(s)"
              opptyId={opptyId}
              type={data.subType}
              storyId={storyId}
              isSingleSelectMarket
              handledisableNext={this.handledisableNext}
              uiType={'ds'}
              stage={stage}
            />
          </div>
        );
      case 'multichoice':
        if (data.subType === 'winner' || data.subType === 'incumbent') {
          return (
            <SurveyMultiSelect
              onChange={this.handleSelect}
              options={this.OptionsGenerator(data.relatedCardList)}
              placeholder="Select multiple"
              opptyId={opptyId}
              type={data.subType}
              storyId={storyId}
              targetMarket={selectedMarket}
              isSingleSelect
              uiType={'ds'}
              stage={stage}
            />
          );
        }
        return (
          <SurveyMultiSelect
            targetMarket={selectedMarket}
            onChange={this.handleChange}
            options={this.OptionsGenerator(data.relatedCardList)}
            placeholder="Select multiple"
            opptyId={opptyId}
            type={data.subType}
            storyId={storyId}
            limit={3}
            uiType={'ds'}
            stage={stage}
          />
        );
      default:
        return (
          <SurveyTextArea
            uiType={'ds'}
            opptyId={opptyId}
            id={data.questionId}
            question={data}
            storyId={storyId}
            onChange={this.handleTextChange}
            placeholder="Start typing"
            rows="5"
          />
        );
    }
  };

  submitDomain = async (e) => {
    const domainNames = e.target.value;
    const { accountId } = this.props;
    const acc = SingleAccountModel.last().props;
    new SingleAccountModel({ ...acc, domainNames }).$save();
    const payload = { accountId, domainNames };

    let isDomainValid = true;
    domainNames.split(',').forEach((dom) => {
      // check domain name validity
      if (!isValidDomain(dom)) {
        isDomainValid = false;
        this.setState({ isDomainValid });
        showAlert(`One or more domain names entered is not valid`, 'error');
      }
    });
    if (isDomainValid) {
      this.setState({ isDomainValid });
      try {
        await updateDomain(payload);
      } catch (e) {
        console.log(e);
      }
    }
  };

  handleIndustryChange = async (value) => {
    const { accountId } = this.props;
    const industryId = value.value;
    const industryName = value.label;
    const acc = SingleAccountModel.last().props;
    new SingleAccountModel({ ...acc, industryId, industryName }).$save();
    await addAccountIndustryToOverrideList(accountId, industryId);
  };

  handleNullMarket = async () => {
    const { history, storyId, opptyId } = this.props;
    history.push(`dealgametape/storyId/${storyId}/opptyId/${opptyId}`);
  };

  render() {
    const {
      contextQuestion,
      isLoading,
      markets,
      disableNext,
      selectedMarket,
      industryList,
      isNullMarket,
      isDomainValid,
    } = this.state;
    const {
      storyId,
      opptyId,
      onComplete,
      stage,
      isLoadingQuestion,
      surveyStatus,
    } = this.props;
    const { industryId, domainNames } = this.props.accountInfo;
    let selectedInd = null;
    let options = [];

    if (industryList && industryId) {
      options = this.OptionsGenerator(industryList, 'value', 'qualifierId');
      selectedInd = options.find((i) => i.value === industryId);
    }
    return (
      <div className={DEFAULT_CLASSNAME}>
        <p className="page-title">Context</p>
        <p className="sub-title">
          Please provide some color behind this opportunity. Note: the goal of
          this survey is to provide constructive and objective feedback to the
          rest of the organization on why we’re winning or losing, from the
          Buyer’s perspective. Help us, help you!
        </p>
        <div className="row">
          <div className="col-6">
            <div className={`${DEFAULT_CLASSNAME}-fields`}>
              <label className={`${DEFAULT_CLASSNAME}-question`}>
                * Customer Email Domain name
                <Tooltip title="We'll analyze emails exchanged with this customer domain.  If multiple domains, use a comma separator">
                  <HelpOutlineIcon fontSize="small" />
                </Tooltip>
              </label>
              <label className="form-label"></label>
              <input
                className={`form-control domains ${
                  !isDomainValid ? 'error' : ''
                } `}
                defaultValue={domainNames}
                placeholder="Enter (,) seperated domains eg. google.com,yahoo.com"
                type="text"
                onBlur={this.submitDomain}
              />
            </div>
          </div>
          <div className="col-6">
            <div className={`${DEFAULT_CLASSNAME}-fields`}>
              <label className={`${DEFAULT_CLASSNAME}-question`}>
                * Industry
                <Tooltip title="Select the closest Industry">
                  <HelpOutlineIcon fontSize="small" />
                </Tooltip>
              </label>
              {industryList.length > 0 && industryId && (
                <Select
                  className="card-select"
                  classNamePrefix="multi-select"
                  placeholder="select industry"
                  onChange={this.handleIndustryChange}
                  options={options}
                  defaultValue={selectedInd}
                />
              )}
            </div>
          </div>
        </div>

        {!isLoading ? (
          contextQuestion.map((question, questionIdx) => {
            const questionLabel =
              question.type === 'market'
                ? `* ${question.questionText}`
                : question.questionText;

            return (
              <div className={`${DEFAULT_CLASSNAME}-fields`} key={questionIdx}>
                <p className={`${DEFAULT_CLASSNAME}-question`}>
                  {questionLabel}
                </p>
                {this.renderField(question.type, question)}
              </div>
            );
          })
        ) : (
          <Loader />
        )}
        <div className={`${DEFAULT_CLASSNAME}-footer`}>
          {!isLoadingQuestion && (
            <button
              disabled={disableNext}
              className={`save ${
                disableNext || (!domainNames && isDomainValid) || !industryId
                  ? 'disabled'
                  : ''
              }`}
              onClick={() =>
                isNullMarket ? this.handleNullMarket() : onComplete()
              }
            >
              {surveyStatus
                ? 'Proceed'
                : isNullMarket
                ? 'Save and Exit'
                : 'Save and proceed'}
            </button>
          )}
        </div>
      </div>
    );
  }
}
SurveyContext.propTypes = {
  storyId: PropTypes.number,
  opptyId: PropTypes.number,
  onComplete: PropTypes.func,
  surveyStatus: PropTypes.bool,
  stage: PropTypes.string,
  isLoadingQuestion: PropTypes.bool,
  accoundId: PropTypes.number,
  accountInfo: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    surveyStatus: state.SurveyData.surveyStatus,
    accountInfo: SingleAccountModel.last()?.props,
  };
};

export default withRouter(connect(mapStateToProps)(SurveyContext));
