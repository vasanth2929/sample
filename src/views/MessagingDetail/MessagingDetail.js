import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { Icons } from '../../constants/general';
import { getPBCardsForMarketForPlaybook } from '../../util/promises/playbooks_promise';
import { getLocalStorageData } from '../../util/utils';
import {
  loadPlaybooks,
  resetPlaybook,
  selectPlaybook,
} from './../../action/playbookSelectionActions';
import Header from './Components/Header/Header';
import MessageSidebar from './Components/MessageSidebar/MessageSidebar';
import TopicCards from './Components/TopicCards/TopicCards';
import TopicPanel from './Components/TopicPanel/TopicPanel';
import './MessagingDetail.style.scss';
import { getUserId } from './util';

const DEFAULT_CLASSNAME = 'messaging-detail';

const TopicsToShow = [
  'Pain Points',
  'Use Cases',
  'Justification',
  'Decision Criteria',
  'Competitors',
  'Partners',
];
const typeSubTypeRelation = {
  'Decision Criteria': 'product',
  Justification: 'KPI',
};
class MessagingDetailImpl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      LoadingCards: true,
      selectedTopic: null,
      status: 'final',
      filteredTopic: null,
      sidebarshow: false,
      sidebardata: {},
      loadingPlaybooks: true,
      selectedPlaybook: {},
      playbookTopics: [],
      loadingTopics: true,
      currentTopic: '',
      searchString: '',
      TypeSubType: typeSubTypeRelation,
      isFirstCardSelected: false,
      filteredCardsByStatus: [],
      isMyTest: false,
    };
  }

  componentDidMount() {
    this.getPlaybookDetailsAndStories();
  }

  componentWillUnmount() {
    const page = document.getElementById('root');
    page.classList.remove('grey-root-container');
  }

  getPlaybookDetailsAndStories() {
    const { loadPlaybooks } = this.props;
    const { searchString, status } = this.state;

    const { market_id } = this.getUrlParam();
    const selectedTopic = getLocalStorageData('Selectedplaybook');
    const currentTopic = selectedTopic.name;
    /* Removed this service and add the new service --->await getPlaybookDetails(9), */
    return new Promise((resolve, reject) => {
      getPBCardsForMarketForPlaybook(market_id, searchString).then(
        (response) => {
          if (response && response.data) {
            let playbookTopics = response.data.topics;
            playbookTopics = playbookTopics.map((topic) =>
              topic.name === 'Economic Drivers'
                ? { ...topic, name: 'Justification' }
                : topic
            );
            playbookTopics = playbookTopics.map((topic) =>
              topic.name === 'Value Proposition'
                ? { ...topic, name: 'Decision Criteria' }
                : topic
            );
            // if topic is competitor remove the Us card
            playbookTopics = playbookTopics.map((topic) =>
              topic.name === 'Competition'
                ? {
                    ...topic,
                    name: 'Competitors',
                    cards: topic.cards.filter(
                      (i) => i.title !== 'Us' && i.title !== 'None'
                    ),
                  }
                : topic
            );

            const sortedMap = [];
            // get the selected topics only
            const playbookTopicsfiltered =
              playbookTopics &&
              playbookTopics.find((topic) => topic.name === currentTopic);

            // Filter topics to show
            const AllowedPlaybookTopics = playbookTopics.filter((topic) =>
              TopicsToShow.includes(topic.name)
            );

            const filteredCardsByStatus = playbookTopicsfiltered
              ? {
                  ...playbookTopicsfiltered,
                  cards: this.filterCards(status, playbookTopicsfiltered),
                }
              : [];

            loadPlaybooks(playbookTopicsfiltered);
            this.setState({
              playbooks: AllowedPlaybookTopics,
              selectedTopic: playbookTopicsfiltered,
              filteredCardsByStatus,
              loadingTopics: false,
            });
            resolve();
          } else {
            this.setState({ loadingTopics: false });
            reject();
          }
        }
      );
    });
  }

  reload = () => {
    this.getPlaybookDetailsAndStories();
  };

  setSideBarStatus = (data) => {
    this.setState({
      sidebarshow: true,
      sidebardata: data,
    });
  };

  toggleSidebar = () => {
    this.setState({ sidebarshow: !this.state.sidebarshow });
  };

  onTopicSelect = (data) => {
    const { status } = this.state;
    selectPlaybook(data);
    let filteredCardsByStatus = data
      ? { ...data, cards: this.filterCards(status, data) }
      : [];
    this.setState({ selectedTopic: data, filteredCardsByStatus }, () =>
      this.setState({ sidebarshow: false })
    );
  };

  onStatusChange = (status) => {
    const { selectedTopic } = this.state;
    const filteredCardsByStatus = selectedTopic
      ? { ...selectedTopic, cards: this.filterCards(status, selectedTopic) }
      : [];
    this.setState({ status, filteredCardsByStatus });
  };

  filterCards = (status, data) => {
    if (status === '') {
      return data.cards;
    }
    if (status === 'test')
      return (
        data.cards &&
        data.cards.filter(
          (item) => item.status !== 'archived' && item.isTestCard === 'Y'
        )
      );
    if (status === 'my_test') {
      return (
        data.cards &&
        data.cards.filter(
          (item) => item.status !== 'archived' && item.isTestCard === 'Y'
        )
      );
    }
    if (status === 'final') {
      return (
        data.cards &&
        data.cards.filter(
          (item) => item.status === 'final' && item.isTestCard !== 'Y'
        )
      );
    }
    const filteredTopic =
      data.cards && data.cards.filter((item) => item.status === status);
    return filteredTopic;
  };

  onCardArchived = () => {
    this.getPlaybookDetailsAndStories().then(() => {
      const { filteredCardsByStatus, selectedTopic, TypeSubType } = this.state;
      if (
        filteredCardsByStatus.cards &&
        filteredCardsByStatus.cards.length > 0
      ) {
        let selectedCard = filteredCardsByStatus.cards[0];
        if (this.state.isMyTest) {
          let card = filteredCardsByStatus?.cards?.find(
            (t) => t?.createdByUserId === getUserId()
          );
          if (card) {
            this.setState({ selectedCard: card });
            this.setSideBarStatus(card);
            return;
          } else {
            this.toggleSidebar();
            return;
          }
        }
        if (
          selectedTopic.name === 'Justification' ||
          selectedTopic.name === 'Decision Criteria'
        ) {
          const subtype = TypeSubType[selectedTopic.name];
          if (
            selectedCard.cardDetails.type === subtype ||
            selectedCard.cardDetails[subtype] === 'Y'
          ) {
            this.setState({ selectedCard });
            this.setSideBarStatus(selectedCard);
          } else {
            if (Object.keys(TypeSubType).length) {
              let keyToFilter = TypeSubType[selectedTopic?.name];
              let subtopicCards = filteredCardsByStatus?.cards?.filter(
                (t) => t?.cardDetails?.type === keyToFilter
              );
              if (subtopicCards.length) {
                this.setState({ selectedCard: subtopicCards[0] });
                this.setSideBarStatus(subtopicCards[0]);
              } else {
                this.toggleSidebar();
                return;
              }
            }
          }
        } else {
          this.setState({ selectedCard });
          this.setSideBarStatus(selectedCard);
        }
      } else {
        this.toggleSidebar();
      }
    });
  };

  getUrlParam = () => {
    const query = new URLSearchParams(this.props.location.search);
    const market_id = query.get('market_id');
    let market_name = window.location.href.split('market_name=')[1];
    if (market_name) market_name = decodeURI(market_name);
    return { market_id, market_name };
  };

  handleSearch = async (searchString) => {
    this.setState({ searchString }, () => {
      this.getPlaybookDetailsAndStories(searchString).then(() => {
        this.setState({ sidebarshow: false });
      });
    });
  };

  setSubType = (type, subtype) => {
    const { TypeSubType } = this.state;
    TypeSubType[type] = subtype;
    this.setState({ TypeSubType });
  };

  renderHeader = (status, selectedTopic, market_name, playbooks, market_id) => {
    return (
      <Header
        defaultStatus={status}
        selectedTopic={selectedTopic}
        filterStatus={this.onStatusChange}
        market_name={market_name}
        onSearch={this.handleSearch}
        topicList={playbooks}
        market_id={market_id}
      />
    );
  };

  renderTopicPanel = (selectedTopic, playbooks, status) => {
    return (
      <TopicPanel
        status={status}
        selectedTopic={selectedTopic}
        topicList={playbooks}
        onSelect={this.onTopicSelect}
      />
    );
  };

  renderTopicCards = (
    filteredCards,
    TypeSubType,
    market_id,
    playbooks,
    selectedCard
  ) => {
    return (
      <TopicCards
        status={this.state.status}
        selectedTopic={filteredCards}
        topicList={playbooks}
        setSideBarStatus={this.setSideBarStatus}
        subtopicfilter={TypeSubType[filteredCards.name]}
        reload={this.reload}
        market_id={market_id}
        onSubTypeChange={this.setSubType}
        selectedCard={selectedCard}
        isMyTest={this.state.isMyTest}
        toggleMyTest={(v) => this.setState({ isMyTest: v })}
      />
    );
  };

  renderMessageSidebar = () => {
    return (
      <MessageSidebar
        reload={this.reload}
        sidebardata={this.state.sidebardata}
        toggleSidebar={this.toggleSidebar}
        onCardArchived={this.onCardArchived}
      />
    );
  };

  render() {
    const {
      playbooks,
      selectedTopic,
      status,
      loadingTopics,
      TypeSubType,
      filteredCardsByStatus,
      selectedCard,
    } = this.state;

    const { market_id, market_name } = this.getUrlParam();

    return (
      <ErrorBoundary>
        <MainPanel viewName="Messaging" noSidebar icons={[Icons.MAINMENU]}>
          <div className={DEFAULT_CLASSNAME}>
            <div className={`${DEFAULT_CLASSNAME}-container`}>
              <div className={`${DEFAULT_CLASSNAME}-container-panel`}>
                {!loadingTopics && selectedTopic ? (
                  <React.Fragment>
                    <div
                      className={`${DEFAULT_CLASSNAME}-container-panel-header`}
                    >
                      {this.renderHeader(
                        status,
                        selectedTopic,
                        market_name,
                        playbooks,
                        market_id
                      )}
                    </div>
                    <div
                      className={`${DEFAULT_CLASSNAME}-container-panel-body`}
                    >
                      {this.renderTopicPanel(selectedTopic, playbooks, status)}
                      {this.renderTopicCards(
                        filteredCardsByStatus,
                        TypeSubType,
                        market_id,
                        playbooks,
                        selectedCard
                      )}
                    </div>
                  </React.Fragment>
                ) : (
                  <i>Loading data ....</i>
                )}
              </div>
              {this.state.sidebarshow ? (
                <div
                  className={`${DEFAULT_CLASSNAME}-container-sidebar`}
                  style={{ marginRight: 120 }}
                >
                  <div style={{ position: 'fixed', top: 65 }}>
                    {this.renderMessageSidebar()}
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </MainPanel>
      </ErrorBoundary>
    );
  }
}

MessagingDetailImpl.propTypes = {
  loadPlaybooks: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  playbook: PropTypes.object,
  resetPlaybook: PropTypes.func,
  selectPlaybook: PropTypes.func,
};

function mapStateToProps(state) {
  return { playbook: state.playbook };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectPlaybook,
      resetPlaybook,
      loadPlaybooks,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingDetailImpl);
