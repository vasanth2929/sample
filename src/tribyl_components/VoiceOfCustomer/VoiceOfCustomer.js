import { Button, ButtonGroup } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import 'bootstrap/dist/css/bootstrap.min.css';
import classnames from 'classnames';
import isEqual from 'lodash.isequal';
import moment from 'moment';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
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
import { getPlaybookCardDetails } from '../../util/promises/playbookcard_details_promise';
import AccountTicker from '../AccountTicker';
import BackPill from '../BackPill';
import KeyScoreModal from '../KeyScoreModal/KeyScoreModal';
import TranscriptBox from '../TranscriptBox/TranscriptBox';
import './VoiceOfCustomer.style.scss';
const DEFAULT_CLASSNAME = 'voice-of-customer';

const IconMap = {
  document: Document,
  email: Email,
  note: Note,
  phone: Phone,
};
const durationOptions = [
  { label: 'Entire Time Period', value: 'All' },
  { label: 'Last 3 months', value: 3 },
  { label: 'Last 6 months', value: 6 },
];

const sortStoryOptions = [
  { label: 'Confidence score  (Descending)', value: 'Confidence score' },
  { label: 'Recently Closed  (Descending)', value: 'Recently Closed' },
  { label: 'Deal Amount  (Descending)', value: 'Deal Amount' },
];

const transcriptType = [
  { label: 'All', value: 'all' },
  { label: 'Calls', value: 'call' },
  { label: 'Email', value: 'email' },
  { label: 'Documents', value: 'document' },
  // { label: 'Notes', value: 'Notes' },
];

class VoiceOfCustomer extends React.PureComponent {
  constructor(props) {
    super(props);
    const stateToSet = {
      searchQuery: '',
      communicationType: 1,
      sort: sortStoryOptions[0],
      duration: durationOptions[0],
      accountTickerSelectedIndex: 0,
      loadingAccounts: true,
      selectedPage: 1,
      currentKeymoment: null,
      keymomentList: [],
      keymomentHighlights: '',
      isLoadingTranscript: true,
      cardTagsList: [],
      conversationsToUse: [],
      convPerPage: 50,
      isOpen: false,
      accountList: [],
      selectedAccount: null,
      selectedKeyword: {
        label: 'All matched keywords',
        value: 'All',
        id: 0,
      },
      page: 0,
      cardInfo: null,
    };
    this.state = stateToSet;
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
    this.loadAccounts();
  }

  componentDidUpdate() {
    const element = document.getElementById('first-match');
    // if (element) element.scrollIntoView({ behavior: 'auto' });
  }

  loadAccounts = async () => {
    const {
      match: { params },
      location: {
        state: { storyBeanList = [] },
      },
    } = this.props;
    const { sort, selectedAccount } = this.state;
    // const response = await getMatchedStoriesForCard(params.cardId);
    const accountList = storyBeanList ? storyBeanList : [];

    if (sort) {
      if (sort.value === 'Deal Amount') {
        accountList.sort(
          (account1, account2) =>
            account2.opportunityAmount - account1.opportunityAmount
        );
      }

      if (sort.value === 'Recently Closed') {
        accountList.sort(
          (account1, account2) =>
            new Date(account2.dateClosed) - new Date(account1.dateClosed)
        );
      }

      if (sort.value === 'Confidence score') {
        accountList.sort(
          (account1, account2) =>
            account2.totalHeuristicScore - account1.totalHeuristicScore
        );
      }
    }
    if (!selectedAccount) {
      this.setState({ selectedAccount: accountList[0] });
    }
    this.setState(
      {
        accountList,
        loadingAccounts: true,
      },
      () => {
        this.loadData();
      }
    );
  };

  getCardID = () => {
    const {
      match: { params },
    } = this.props;
    const url = new URL(window.location.href);
    let cardId = params.cardId;
    if (url.searchParams.get('containSpecialCharacter') === 'true') {
      cardId = +url.searchParams.get('cardId');
    }

    return cardId;
  };

  loadData = () => {
    this.setState({ isLoadingTranscript: true });
    const { duration, selectedPage, selectedAccount, selectedKeyword } =
      this.state;
    const cardId = this.getCardID();

    const formatter = new Intl.NumberFormat({
      style: 'currency',
      currency: 'USD',
    });
    const bigNameCallOptions = {
      storyId:
        selectedAccount && selectedAccount.id ? selectedAccount.id : null,
      pageNumber: selectedPage,
    };

    if (cardId > 0) {
      bigNameCallOptions.cardId = cardId;
    }

    this.loadHeuristicData(selectedAccount, cardId);

    if (duration.value !== 'All') bigNameCallOptions.dateRange = duration.value;
    if (selectedKeyword.value !== 'All') {
      bigNameCallOptions.filterByKeywordId = selectedKeyword.id;
    }
    const promises = [
      getConvWithTextAndMatchWordsForCardForStoryOrOpptyP(bigNameCallOptions),
    ];
    if (cardId > 0) {
      promises.push(getPlaybookCardDetails(cardId));
    }

    Promise.all(promises).then(
      ([conversationsResponse, playbookCardDetails]) => {
        const data = selectedAccount;
        let conversations;

        this.setState({ cardInfo: playbookCardDetails });

        if (data) {
          const stateToSet = {
            accountName: data.accountName ? data.accountName : '',
            buyingCenter: 'Single View - Propensity to buy',
            status: data.oppStatus,
            amount: '$' + formatter.format(data.influenceAmt),
            dealLength: data.lengthOfDeal + ' days',
            closedDate: moment(data.closedDate).format('MM/DD/YYYY'),
            conversations: [],
            selectedConversation: null,
            totalConversationsCount: [],
          };

          if (
            conversationsResponse &&
            conversationsResponse.data &&
            conversationsResponse.data.convList
          ) {
            conversations = this.transformServerConversations(
              conversationsResponse.data.convList
            );
            stateToSet.conversations = conversations.sort(
              (a, b) => Number(b.score) - Number(a.score)
            );
            // const filteredConversation  = this.filterConversations();
            // stateToSet.selectedConversation = conversations[0];

            stateToSet.totalConversationsCount =
              conversationsResponse.data.convCount;
          }

          const checkCallConversation = conversations
            ? conversations.filter(
                (conversation) => conversation.type === 'call'
              )
            : [];
          if (checkCallConversation.length === 0) {
            stateToSet.communicationType = 0;
          }
          this.setState(stateToSet, () => {
            this.filterConversations();
          });
        } else {
          this.setState({ isLoadingTranscript: false });
        }
      }
    );
  };

  loadHeuristicData = async (selectedAccount, cardId) => {
    const heuristicsPayload = {
      storyId:
        selectedAccount && selectedAccount.id ? selectedAccount.id : null,
      pbCardId: cardId,
    };
    const heuristicData = await getHeuristicScoreDetailsForCardAndStory(
      heuristicsPayload
    );
    const cardTagsList = heuristicData.data;
    this.setState({ cardTagsList });
  };

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

  handleChangeOption = (key, option) => {
    this.setState({ [key]: option }, this.loadAccounts);
  };

  highlightMatchedText = () => {
    const { selectedConversation } = this.state;
    let keymomentList = [];
    let parts = [];
    const currentKeymoment =
      (selectedConversation && selectedConversation.keyMoments.length) > 0
        ? selectedConversation.keyMoments[0].keyMomentId
        : [];
    if (selectedConversation !== null) {
      keymomentList = selectedConversation.keyMoments.map((i) => i.keyMomentId);
      parts = [selectedConversation.transcript];
      selectedConversation.keyMoments.forEach((keyMoment) => {
        parts.forEach((part, jitter) => {
          if (
            typeof part === 'string' &&
            part.includes(keyMoment.keyMomentText)
          ) {
            const newParts = part.split(keyMoment.keyMomentText);
            newParts.splice(
              1,
              0,
              <span
                id={`match-${keyMoment.keyMomentId}`}
                className={`${DEFAULT_CLASSNAME}-transcript-part-highlited`}
              >
                {keyMoment.keyMomentText}
              </span>
            );
            parts.splice(jitter, 1, ...newParts);
          }
        });
      });
      // run at the begining only
      // this.scrollToKeymoment(selectedConversation.keyMoments[0].keyMomentId);
      this.setState({ keymomentList });
    }
    this.setState({
      isLoadingTranscript: false,
      keymomentHighlights: parts,
      currentKeymoment,
      keymomentList,
    });
  };

  filterConversations = () => {
    const { communicationType, conversations } = this.state;
    let newconversations = conversations;

    if (communicationType > 0) {
      if (communicationType === 1) {
        newconversations = conversations.filter(
          (conversation) => conversation.type === 'call'
        );
      } else if (communicationType === 2) {
        newconversations = conversations.filter(
          (conversation) => conversation.type === 'email'
        );
      } else if (communicationType === 3) {
        newconversations = conversations.filter(
          (conversation) => conversation.type === 'document'
        );
      } else if (communicationType === 4) {
        newconversations = conversations.filter(
          (conversation) => conversation.type === 'note'
        );
      }
    }

    this.setState(
      {
        isLoadingTranscript: false,
        selectedConversation: newconversations.length
          ? newconversations[0]
          : null,
        conversationsToUse: newconversations,
      }
      // this.highlightMatchedText
    );
  };

  handleChangeAccountTicker = (id) => {
    const selectedAccount = this.state.accountList.find((i) => i.id === id);
    this.setState(
      {
        accountTickerSelectedIndex: id,
        selectedAccount,
        communicationType: 1,
        selectedKeyword: {
          label: 'All matched keywords',
          value: 'All',
          id: 0,
        },
      },
      () => {
        this.loadData();
      }
    );
  };

  onChangeSelectedConversation = (selectedConversation) => {
    this.setState({ selectedConversation: selectedConversation.row });
  };

  toggleCommunicationType = (e) => {
    this.setState({ communicationType: Number(e.currentTarget.value) }, () =>
      this.filterConversations()
    );
  };

  goBack = () => {
    this.props.history.goBack();
  };

  goToKeymoment = (type) => {
    const { currentKeymoment, keymomentList } = this.state;
    const index = keymomentList.indexOf(currentKeymoment);
    let newkeyMomentId = currentKeymoment;
    if (type === 'next' && index < keymomentList.length) {
      newkeyMomentId = keymomentList[index + 1];
    } else if (type === 'prev' && index > 0) {
      newkeyMomentId = keymomentList[index - 1];
    }
    this.scrollToKeymoment(newkeyMomentId);
    this.setState({ currentKeymoment: newkeyMomentId });
  };

  scrollToKeymoment = (keyMomentId) => {
    const id = `match-${keyMomentId}`;
    const element = document.getElementById(id);
    if (element)
      element.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'start',
      });
  };

  handlePagination = (page) => {
    this.setState({ selectedPage: page }, () => {
      this.loadData();
    });
  };

  handleLabelFormat = ({ label, value }) => {
    const { conversations } = this.state;

    return `${label} (${
      conversations
        ? conversations.filter((i) => i.type === value || value === 'all')
            .length
        : '0'
    })`;
  };

  getConvTypeCount = (conversations, value) => {
    return conversations
      ? conversations.filter(
          (conv) => conv.type.toLowerCase() === value || value === 'all'
        ).length
      : '';
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
      accountList,
      selectedConversation,
      conversations,
      isLoadingTranscript,
      cardTagsList,
      conversationsToUse,
      selectedAccount,
      selectedKeyword,
    } = this.state;
    const gpView = this.state.accountTickerSelectedIndex === 1;
    const Icon =
      selectedConversation && IconMap[selectedConversation.icon]
        ? IconMap[selectedConversation.icon]
        : IconMap.phone;

    //select if only match count present
    const storyData = accountList.filter((i) => i.matchCount) || [];

    const url = new URL(window.location.href);
    let subtitle = params.subtitle;
    let title = params.title;
    if (url.searchParams.get('containSpecialCharacter') === 'true') {
      subtitle = url.searchParams.get('type');
      title = url.searchParams.get('cardTitle');
    }

    return (
      <MainPanel
        handleIconClick={this.handleHeaderIconClick}
        icons={[Icons.MAINMENU]}
        noSidebar
        viewName="Voice of Customer"
      >
        <div className={`${DEFAULT_CLASSNAME}`}>
          <div className={`${DEFAULT_CLASSNAME}-top-row`}>
            <div className={`${DEFAULT_CLASSNAME}-top-row-back-button`}>
              <a onClick={this.goBack} role="button">
                <div
                  className={`${DEFAULT_CLASSNAME}-top-row-back-button-icon`}
                >
                  <i className="material-icons">chevron_left</i>
                </div>
                <span
                  className={`${DEFAULT_CLASSNAME}-top-row-back-button-icon-text`}
                >
                  Go back to dashboard
                </span>
              </a>
              <BackPill
                gp={gpView}
                label={
                  subtitle
                    ? decodeURI(subtitle) === 'compelling_event'
                      ? 'Triggers'
                      : decodeURI(subtitle)
                    : 'Value Proposition'
                }
                text={decodeURI(title)}
              />
            </div>
            <div className={`${DEFAULT_CLASSNAME}-filter-row-entry`}>
              <span className="mr-2">Sort Deals:</span>
              <Select
                className="stage-select"
                onChange={(option) => this.handleChangeOption('sort', option)}
                options={sortStoryOptions}
                defaultValue={sortStoryOptions[0]}
              />
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}-stats`}>
            #Deals:
            <span className={`${DEFAULT_CLASSNAME}-stats-count`}>
              {storyData.length}
            </span>
          </div>
          <AccountTicker
            data={storyData}
            selectedIndex={this.state.selectedAccount?.id}
            handleChange={this.handleChangeAccountTicker}
          />
          <div className={`${DEFAULT_CLASSNAME}-content-filters`}>
            <div
              className={`${DEFAULT_CLASSNAME}-filter-row-entry button-entry`}
            >
              <ButtonGroup aria-label="Communication Type" className="mb-2">
                {!isLoadingTranscript &&
                  transcriptType.map(({ value, label }, i) => {
                    return (
                      <Button
                        className={classnames('tribyl-radio-button', {
                          active: this.state.communicationType === i,
                        })}
                        onClick={this.toggleCommunicationType}
                        value={i}
                        size="small"
                      >
                        {`${label} (${
                          conversations
                            ? conversations.filter(
                                (conv) =>
                                  conv.type.toLowerCase() === value ||
                                  value === 'all'
                              ).length
                            : ''
                        })`}
                      </Button>
                    );
                  })}
              </ButtonGroup>
            </div>
            <div className={`${DEFAULT_CLASSNAME}-content-filters-keywords`}>
              <KeyScoreModal
                keywords={[...cardTagsList]}
                loadHeuristicData={() =>
                  this.loadHeuristicData(
                    this.state.selectedAccount,
                    this.getCardID()
                  )
                }
                cardId={this.getCardID()}
                cardInfo={this.state.cardInfo}
              />
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}-content-section`}>
            <div
              className={`${DEFAULT_CLASSNAME}-content-section-keymomentList`}
            >
              <TranscriptList
                rows={conversationsToUse}
                onRowClick={this.onChangeSelectedConversation}
                selectedRow={selectedConversation}
                isLoading={isLoadingTranscript}
                page={this.state.page}
                onPageChange={(p) => this.setState({ page: p })}
              />
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
              usedIn="voc"
              dropdownValue={selectedKeyword}
              onDropdownChange={this.onKeywordValueChange}
            />
          </div>
        </div>
      </MainPanel>
    );
  }
}

export default withRouter(VoiceOfCustomer);
