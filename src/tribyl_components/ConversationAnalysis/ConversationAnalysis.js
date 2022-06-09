/* eslint no-tabs: */
import { Button, ButtonGroup } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import Select from 'react-select';
import classnames from 'classnames';
import moment from 'moment';
import isEqual from 'lodash.isequal';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Document from '../../assets/iconsV2/document.svg';
import Email from '../../assets/iconsV2/email.svg';
import Note from '../../assets/iconsV2/note.svg';
import Phone from '../../assets/iconsV2/phone-2.svg';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { showCustomModal } from '../../components/CustomModal/CustomModal';
import TranscriptList from '../../components/TranscriptList/TranscriptList';
import { Icons } from '../../constants/general';
import {
  getConvWithTextAndMatchWordsForCardForStoryOrOpptyP,
  getHeuristicScoreDetailsForCardAndStory,
} from '../../util/promises/conversation_promise';
import { getStoryTitle } from '../../util/promises/edittitle_promise';
import { getPlaybookCardDetails } from '../../util/promises/playbookcard_details_promise';
import BackPill from '../BackPill';
import Breadcrumbs from '../Breadcrumbs';
import KeyScoreModal from '../KeyScoreModal/KeyScoreModal';
import { DefaultOptions as StatusOptions } from '../StatusDropdown/StatusDropdown';
import TearsheetDock from '../TearsheetDock';
import TranscriptBox from '../TranscriptBox/TranscriptBox';
import TribylButton from '../TribylButton/TribylButton';
import './ConversationAnalysis.style.scss';

const DEFAULT_CLASSNAME = 'conversation-analysis';

const IconMap = {
  document: Document,
  email: Email,
  note: Note,
  phone: Phone,
};

const stageOptions = [{ label: 'Stages', value: 'stages' }];
const durationOptions = [
  { label: 'Last 3 months', value: 3 },
  { label: 'Last 6 months', value: 6 },
  { label: 'All', value: -1 },
];
const transcriptType = [
  { label: 'All', value: 'All' },
  { label: 'Calls', value: 'call' },
  { label: 'Emails', value: 'email' },
  { label: 'Documents', value: 'document' },
];

const keywordColumn = [
  {
    field: 'id',
    headerName: 'ID',
    flex: 1,
    hide: true,
  },
  {
    headerName: 'Keywords',
    field: 'keywordName',
    flex: 1,
  },
  {
    headerName: 'Overall Score',
    field: 'elasticScoreInConv',
    align: 'center',
    flex: 1,
    renderCell: (params) => params.value.toFixed(2),
  },
];

class ConversationAnalysis extends React.PureComponent {
  constructor(props) {
    super(props);
    const stateToBe = {
      searchQuery: '',
      cardInfo: null,
      communicationType: 1,
      sort: { label: 'All', value: 'all' },
      duration: durationOptions[0],
      stage: stageOptions[0],
      statusDropdownValue: StatusOptions[0],
      selectedPage: 1,
      currentKeymoment: null,
      keymomentList: [],
      keymomentHighlights: '',
      isLoadingTranscript: true,
      cardTagsList: [],
      conversationsToUse: [],
      convPerPage: 50,
      selectedAccount: null,
      selectedKeyword: {
        label: 'All matched keywords',
        value: 'All',
        id: 0,
      },
      page: 0,
      Columns: [
        {
          field: 'id',
          headerName: 'ID',
          flex: 1,
          hide: true,
        },
        {
          field: 'type',
          headerName: 'Type',
          renderCell: (params) => (
            <img
              src={IconMap[params.value]}
              onClick={() => this.onChangeSelectedConversation(params)}
            />
          ),
          flex: 1,
        },
        {
          field: 'subject',
          renderCell: (params) => (
            <span onClick={() => this.onChangeSelectedConversation(params)}>
              {params.value}
            </span>
          ),
          headerName: 'Subject',
          flex: 1,
        },
        {
          field: 'date',
          headerName: 'Date',
          renderCell: (params) => (
            <span onClick={() => this.onChangeSelectedConversation(params)}>
              {params.value}
            </span>
          ),
          flex: 1,
        },
        {
          field: 'score',
          headerName: 'Score',
          renderCell: (params) => (
            <div
              className="link"
              onClick={() => this.handleKeywordModal(params, true)}
            >
              {params.value}
            </div>
          ),
          flex: 1,
        },
      ],
    };

    this.state = stateToBe;
  }

  handleKeywordModal = (params, isOpen = false) => {
    this.setState({ isOpen: true });
    const rows = params.row.keywords?.map((i) => ({ ...i, id: i.keywordId }));
    showCustomModal(
      <div className="keyword-modal-header">
        <h5 className="heading">Keywords</h5>
      </div>,
      <div className="card-list">
        <DataGrid
          rows={rows}
          columns={keywordColumn}
          autoHeight
          pageSize={10}
          pagination
          hideFooterSelectedRowCount
        />
      </div>,
      'conv-keyword-modal'
    );
  };

  componentDidMount() {
    this.loadData();
  }

  // componentDidUpdate() {
  //   const element = document.getElementById('first-match');
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'auto', block: 'center' });
  //   }
  // }

  transformServerConversations = (conversationsFromServer) => {
    return (
      conversationsFromServer &&
      conversationsFromServer.map((conversationFromServer) => {
        const {
          attendee1Name,
          attendee2Name,
          attendee3Name,
          attendee4Name,
          attendee5Name,
          attendee6Name,
          convId,
          convType,
          keyMomentsForConv,
          transcript,
          subject,
          createDate,
          gongUrl,
          convToCardScoreDetails,
        } = conversationFromServer;
        return {
          names: [
            attendee1Name,
            attendee2Name,
            attendee3Name,
            attendee4Name,
            attendee5Name,
            attendee6Name,
          ].filter((name) => name && name.length > 0),
          id: convId,
          type: convType?.toLowerCase(),
          keyMoments: keyMomentsForConv,
          transcript,
          subject,
          date: createDate,
          gongUrl,
          score: convToCardScoreDetails.convCardScore.toFixed(2),
          keywords: convToCardScoreDetails.keywordScoreBeans,
        };
      })
    );
  };

  filterConversations = () => {
    const { sort, communicationType, conversations } = this.state;
    let newconversations = conversations;
    if (sort && sort.value !== 'all') {
      newconversations = newconversations.filter((conversation) =>
        conversation.names.includes(sort.value)
      );
    }
    if (communicationType !== 0) {
      if (communicationType === 1) {
        newconversations = newconversations.filter(
          (conversation) => conversation.type.toLowerCase() === 'call'
        );
      } else if (communicationType === 2) {
        newconversations = newconversations.filter(
          (conversation) => conversation.type.toLowerCase() === 'email'
        );
      } else if (communicationType === 3) {
        newconversations = newconversations.filter(
          (conversation) => conversation.type.toLowerCase() === 'document'
        );
      } else if (communicationType === 4) {
        newconversations = newconversations.filter(
          (conversation) => conversation.type.toLowerCase() === 'note'
        );
      }
    }

    this.setState({
      isLoadingTranscript: false,
      conversationsToUse: newconversations,
      selectedConversation: newconversations?.[0],
    });
  };

  loadData = async () => {
    this.setState({ isLoadingTranscript: true });
    const { duration, selectedPage, selectedKeyword } = this.state;
    const {
      match: {
        params: { storyId, cardId },
      },
    } = this.props;
    const formatter = new Intl.NumberFormat({
      style: 'currency',
      currency: 'USD',
    });
    const bigNameCallOptions = {
      storyId: storyId ? Number(storyId) : null,
      pageNumber: selectedPage,
    };

    if (cardId > 0) {
      bigNameCallOptions.cardId = cardId;
    }

    if (selectedKeyword.value !== 'All') {
      bigNameCallOptions.filterByKeywordId = selectedKeyword.id;
    }
    // bigNameCallOptions.dateRange = duration.value;

    this.loadHeuristicData(storyId, cardId); // calling heuristic api seperately

    // All below apis are interdepedent on each other cant seperate them out.
    const promises = [
      getStoryTitle(storyId),
      getConvWithTextAndMatchWordsForCardForStoryOrOpptyP(bigNameCallOptions),
    ];
    if (cardId > 0) {
      promises.push(getPlaybookCardDetails(cardId));
    }

    Promise.all(promises).then(
      ([storyTitle, conversationsResponse, playbookCardDetails]) => {
        const { data } = storyTitle;
        let conversations;
        let stateToSet = {
          accountName: data.accountName,
          buyingCenter: 'Single View - Propensity to buy',
          status: data.oppStatus,
          amount: '$' + formatter.format(data.influenceAmt || 0),
          dealLength: data.lengthOfDeal + ' days',
          closedDate: moment(data.closedDate).format('MM/DD/YYYY'),
          selectedAccount: data,
        };

        this.setState({ cardInfo: playbookCardDetails });

        if (playbookCardDetails) {
          stateToSet = {
            ...stateToSet,
            cardTitle: playbookCardDetails.data.title,
            cardTopic:
              Object.keys(playbookCardDetails.data?.cardDetails).length > 0
                ? playbookCardDetails.data.cardDetails.type[0] ===
                  'compelling_event'
                  ? 'Trigger'
                  : playbookCardDetails.data.cardDetails.type[0]
                : playbookCardDetails.data.topic_name,
          };
        }

        if (
          conversationsResponse &&
          conversationsResponse.data &&
          conversationsResponse.data.convList
        ) {
          conversations = this.transformServerConversations(
            conversationsResponse.data.convList
          );
          stateToSet.conversations = conversations;
          const conversationsToUse = conversations.sort(
            (a, b) => Number(b.score) - Number(a.score)
          );
          stateToSet.conversationsToUse = conversationsToUse;
          // stateToSet.selectedConversation = conversationsToUse[0];
          stateToSet.totalConversationsCount =
            conversationsResponse.data.convCount;
        }
        const checkCallConversation = conversations
          ? conversations.filter((conversation) => conversation.type === 'call')
          : [];
        if (checkCallConversation.length === 0) {
          stateToSet.communicationType = 0;
        }
        this.setState(stateToSet, () => {
          this.filterConversations();
        });
      }
    );
  };

  onChangeStatus = (statusDropdownValue) => {
    this.setState({ statusDropdownValue });
  };

  loadHeuristicData = async (storyId, cardId) => {
    const heuristicsPayload = {
      storyId,
      pbCardId: cardId,
    };
    const heuristicData = await getHeuristicScoreDetailsForCardAndStory(
      heuristicsPayload
    );
    const cardTagsList = heuristicData.data;
    this.setState({ cardTagsList });
  };

  getBreadcrumbParts = () => {
    const {
      accountName,
      buyingCenter,
      status,
      amount,
      dealLength,
      closedDate,
    } = this.state;
    return [
      accountName,
      buyingCenter,
      status,
      amount,
      dealLength,
      closedDate,
    ].map((part) => {
      return { text: part && part.toString() };
    });
  };

  handleChangeOption = (key) => {
    return (value) => {
      this.setState({ [key]: value }, () => {
        this.loadData();
      });
    };
  };

  onChangeSelectedConversation = (selectedConversation) => {
    this.setState({ selectedConversation: selectedConversation.row });
  };
  toggleTearsheet = () => {
    this.setState({ showTearsheet: !this.state.showTearsheet });
  };

  toggleCommunicationType = (type) => {
    this.setState({ communicationType: type }, () =>
      this.filterConversations()
    );
  };

  getCardID = () => {
    const {
      match: { params },
    } = this.props;
    let cardId = params.cardId;
    return cardId;
  };

  handleTranscriptDateChange = (selecetedTranscriptDate) => {
    this.setState({ selecetedTranscriptDate });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  handlePagination = (page) => {
    this.setState({ selectedPage: page }, () => {
      this.loadData();
    });
  };

  onKeywordValueChange = (value) => {
    if (!isEqual(value, this.state.selectedKeyword))
      this.setState({ selectedKeyword: value, page: 0 }, () => {
        this.loadData();
      });
  };

  render() {
    const {
      match: { params },
    } = this.props;
    const {
      cardTopic,
      cardTitle,
      cardTagsList = [],
      selectedConversation,
      conversations,
      isLoadingTranscript,
      conversationsToUse = [],
      selectedAccount,
      selectedKeyword,
    } = this.state;

    const already = 'value';
    const before = 'label';
    const gpView = !!params.opptyId;
    const displayBackPill =
      (params.cardId && params.cardId !== '0') ||
      (params.opptyId && params.opptyId !== '0');
    const Icon =
      selectedConversation && IconMap[selectedConversation.icon]
        ? IconMap[selectedConversation.icon]
        : IconMap.phone;

    const allNames =
      conversations &&
      conversations.reduce((currentNames, conversation) => {
        return (conversation.names || []).concat(currentNames);
      }, []);
    // const sortOptions = [...new Set(allNames)].sort().map((jingle) => {
    //   return { [already]: jingle, [before]: jingle };
    // });

    return (
      <MainPanel
        handleIconClick={this.handleHeaderIconClick}
        icons={[Icons.MAINMENU]}
        noSidebar
        viewName="Voice of Customer"
      >
        <div className={`${DEFAULT_CLASSNAME}`}>
          <div className={`${DEFAULT_CLASSNAME}-top-row`}>
            {/* <div className={`${DEFAULT_CLASSNAME}-top-row-back-button`}>
              <a role="button" onClick={this.goBack}>
                <div
                  className={`${DEFAULT_CLASSNAME}-top-row-back-button-icon`}
                >
                  <i className="material-icons">chevron_left</i>
                </div>
                <span
                  className={`${DEFAULT_CLASSNAME}-top-row-back-button-icon-text`}
                >
                  Go back to Deal Game Tape
                </span>
              </a>
            </div> */}
            <div className={`${DEFAULT_CLASSNAME}-top-row-breadcrumb-wrapper`}>
              {selectedAccount && this.state.showTearsheet && (
                <TearsheetDock
                  isVisible={this.state.showTearsheet}
                  onVisibleChange={this.toggleTearsheet}
                  storyId={params.storyId}
                  buyingCenter="Information Technology"
                  accountId={selectedAccount?.accountId}
                  isStoryDisabled={false}
                />
              )}
              <Breadcrumbs
                parts={gpView ? dummyBreadcrumbs : this.getBreadcrumbParts()}
              />
            </div>
            <div className={`${DEFAULT_CLASSNAME}-top-row-dummy`}>
              <div className="storydeal-header-top-row-submit-group">
                {/* <button className={"button"} onClick={this.toggleTearsheet}>
									{"VIEW TEARSHEET"}
								</button> */}
                <TribylButton
                  text="View Tearsheet"
                  variant="secondary"
                  onClick={this.toggleTearsheet}
                />
              </div>
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}-middle-row`}>
            {displayBackPill && (
              <BackPill
                label={cardTopic ? cardTopic : ''}
                text={cardTitle ? cardTitle : ''}
              />
            )}

            {/* <PillRow keywords={cardTagsList} /> */}
          </div>
          <div className={`${DEFAULT_CLASSNAME}-filter-row`}>
            <div className={`${DEFAULT_CLASSNAME}-filter-row-section`}>
              <div
                className={`${DEFAULT_CLASSNAME}-filter-row-entry button-entry`}
              >
                <ButtonGroup aria-label="Basic example" className="mb-2">
                  {!isLoadingTranscript &&
                    transcriptType.map(({ value, label }, i) => {
                      return (
                        <Button
                          className={classnames('tribyl-radio-button', {
                            active: this.state.communicationType === i,
                          })}
                          onClick={() => this.toggleCommunicationType(i)}
                          size="small"
                        >
                          {`${label} (${
                            conversations
                              ? conversations.filter(
                                  (conv) =>
                                    conv.type.toLowerCase() === value ||
                                    value === 'All'
                                ).length
                              : ''
                          })`}
                        </Button>
                      );
                    })}
                </ButtonGroup>
              </div>
            </div>
            <KeyScoreModal
              keywords={[...cardTagsList]}
              loadHeuristicData={() => {
                this.loadHeuristicData(
                  this.props?.match?.params?.storyId,
                  this.getCardID()
                );
              }}
              cardId={this.getCardID()}
              cardInfo={this.state.cardInfo}
            />
          </div>
          <div className={`${DEFAULT_CLASSNAME}-content-section`}>
            <div
              className={`${DEFAULT_CLASSNAME}-content-section-all-conversations`}
            >
              <div
                className={`${DEFAULT_CLASSNAME}-content-section-all-conversations-list`}
              >
                <TranscriptList
                  rows={[...conversationsToUse]?.sort(
                    (a, b) => Number(b.score) - Number(a.score)
                  )}
                  onRowClick={this.onChangeSelectedConversation}
                  selectedRow={selectedConversation}
                  isLoading={isLoadingTranscript}
                  page={this.state.page}
                  onPageChange={(p) => this.setState({ page: p })}
                />
              </div>
            </div>
            <TranscriptBox
              Icon={Icon}
              isLoading={isLoadingTranscript}
              selectedConversation={selectedConversation}
              selectedAccount={selectedAccount}
              options={[
                { label: 'All matched keywords', value: 'All', id: 0 },
                ...cardTagsList
                  .sort((a, b) => b.convoCount - a.convoCount)
                  .map((card) => ({
                    label: `${card.text} (${card?.convoCount})`,
                    value: card.text,
                    id: card.id,
                  })),
              ]}
              dropdownValue={selectedKeyword}
              onDropdownChange={this.onKeywordValueChange}
              usedIn="ca"
            />
          </div>
        </div>
      </MainPanel>
    );
  }
}

export default withRouter(ConversationAnalysis);
