import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FloaterButton } from '../../basecomponents/FloaterButton/FloaterButton';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { showCustomModal } from '../../components/CustomModal/CustomModal';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { ShimmerCard } from '../../components/ShimmerCard/ShimmerCard';
import {
  Icons,
  UPDATE_MARKET_PERFORMANCE_FILTERS
} from '../../constants/general';
import { FilterMarketModel } from '../../model/GlobalFilterModels/GlobalFilterModels';
import {
  getPBCardsForMarketForPlaybook,
  listAllMarkets
} from '../../util/promises/playbooks_promise';
import {
  loadPlaybooks,
  resetPlaybook,
  selectPlaybook
} from './../../action/playbookSelectionActions';
import { AddPlaybookForm } from './containers/AddPlaybookForm/AddPlaybookForm';
import { EditMarketForm } from './containers/EditMarketFrom/EditMarketForm';
import PlaybookPanel from './containers/PlaybookPanel/PlaybookPanel';
import { PlaybooksListV2 } from './containers/PlaybooksList/PlaybooksList';
import './Messaging.style.scss';
import { getCardCount, getCardCountForCompetitor } from './messagingHelpers';

const DEFAULT_CLASSANEM = 'messaging';

const TopicsName = [
  'Pain Points',
  'Use Cases',
  'Justification',
  'Decision Criteria',
  'Competitors',
  'Partners',
];
class MessagingImpl extends Component {
  state = {
    loadingPlaybooks: true,
    playbooks: [],
    loadingTopics: true,
    playbookTopics: [],
  };

  componentWillMount() {
    const page = document.getElementById('root');
    page.classList.add('grey-root-container');
  }

  componentDidMount() {
    this.getPlaybooks();
  }

  componentWillUnmount() {
    const page = document.getElementById('root');
    page.classList.remove('grey-root-container');
  }

  async getPlaybooks() {
    this.setState({ loadingPlaybooks: true, loadingTopics: true });
    const { filter, changeFilter, marketList } = this.props;
    /* New api added --> const response = await getPlaybooks(true); */
    let markets = marketList;
    if (markets.length === 0) {
      let response = await listAllMarkets();
      markets =
        response && response.data
          ? response.data.filter((i) => i.name.toLowerCase() !== 'none')
          : [];
    }
    if (markets && markets.length > 0) {
      const playbooks = markets.sort((a, b) => a.name.localeCompare(b.name));
      markets.length > 0 &&
        markets.map((i) => new FilterMarketModel({ id: i.id, ...i }).$save());
      let selectedPlaybook = null;
      if (!filter.selectedPlaybook) {
        selectedPlaybook = markets[0];
      } else {
        // to get the previous market with new name
        selectedPlaybook = markets.find(
          (pb) => pb.id === filter.selectedPlaybook.id
        );
      }
      changeFilter({ selectedPlaybook });
      this.setState({ loadingPlaybooks: false, playbooks }, () => {
        this.getPlaybookDetailsAndStories(selectedPlaybook);
      });
    } else {
      this.setState({ loadingPlaybooks: false, loadingTopics: false });
    }
  }

  async getPlaybookDetailsAndStories(playbook) {
    const { loadPlaybooks } = this.props;
    /* Removed this service and add the new service --->await getPlaybookDetails(9), */
    Promise.all([
      await getPBCardsForMarketForPlaybook(playbook.encryptedMarketId),
    ]).then((response) => {
      if (response[0] && response[0].data) {
        let playbookTopics = response[0].data.topics;
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
        playbookTopics = playbookTopics.map((topic) =>
          topic.name === 'Competition'
            ? { ...topic, name: 'Competitors' }
            : topic
        );
        const playbookTopicsfiltered = playbookTopics.filter((topic) =>
          TopicsName.includes(topic.name)
        );
        loadPlaybooks(playbookTopicsfiltered);
        this.setState({
          loadingTopics: false,
          playbookTopics: playbookTopicsfiltered,
        });
      } else {
        this.setState({ loadingTopics: false });
      }
    });
  }

  handleAddPlaybookFloaterBtn = () => {
    const header = <p>New Market</p>;
    const body = (
      <AddPlaybookForm handleMarketNameUpdate={this.handleMarketNameUpdate} />
    );
    showCustomModal(header, body, 'story-modal');
  };

  handleMarketNameUpdate = (pb) => {
    new FilterMarketModel({ id: pb.playbookSalesPlayId, ...pb }).$save();
    this.setState({ loadingPlaybooks: true }, () => this.getPlaybooks());
  };

  handleMarketNameEdit = (marketId, marketName) => {
    const header = <p>Edit Market</p>;
    const body = (
      <EditMarketForm
        marketId={marketId}
        marketName={marketName}
        handleMarketNameUpdate={this.handleMarketNameUpdate}
      />
    );
    showCustomModal(header, body, 'story-modal');
  };

  handlePlaybookSelection = (selectedPlaybook) => {
    this.props.changeFilter({ selectedPlaybook });
    this.setState({ loadingTopics: true, selectedPlaybook }, () => {
      this.getPlaybookDetailsAndStories(selectedPlaybook);
    });
  };

  render() {
    const { loadingPlaybooks, playbooks, loadingTopics, playbookTopics } =
      this.state;
    const {
      filter: { selectedPlaybook },
    } = this.props;
    const visiblePlaybookTopics = playbookTopics.filter(
      (topic) => topic.name !== 'Partners'
    );

    return (
      <section className={`${DEFAULT_CLASSANEM}-v2-screen`}>
        <ErrorBoundary>
          <MainPanel viewName="Messaging" noSidebar icons={[Icons.MAINMENU]}>
            <section className="playbooks-v2-section">
              <Container>
                <Row>
                  <Col sm={3}>
                    <PlaybooksListV2
                      loadingPlaybooks={loadingPlaybooks}
                      loadingTopics={loadingTopics}
                      playbooks={playbooks}
                      selectedPlaybookId={
                        selectedPlaybook && selectedPlaybook.id
                      }
                      handlePlaybookSelection={(playbook) =>
                        this.handlePlaybookSelection(playbook)
                      }
                      handleMarketNameEdit={(marketId, marketName) =>
                        this.handleMarketNameEdit(marketId, marketName)
                      }
                    />
                  </Col>
                  <Col sm={9}>
                    {loadingTopics ? (
                      <div className="row">
                        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                          <div className="col-3" key={item}>
                            <ShimmerCard />
                          </div>
                        ))}
                      </div>
                    ) : visiblePlaybookTopics.length > 0 ? (
                      <React.Fragment>
                        <h1 className="heading">{selectedPlaybook.name}</h1>
                        <Row>
                          {visiblePlaybookTopics.map((item, itemIdx) => {
                            const finalCardCount =
                              item.name === 'Competitors'
                                ? getCardCountForCompetitor(item.cards, 'final')
                                : getCardCount(item.cards, 'final');
                            const testCount =
                              item.name === 'Competitors'
                                ? getCardCountForCompetitor(item.cards, 'test')
                                : getCardCount(item.cards, 'test');
                            // const myTestCount =
                            //   item.name === 'Competitors'
                            //     ? getCardCountForCompetitor(
                            //         item.cards,
                            //         'test',
                            //         true
                            //       )
                            //     : getCardCount(item.cards, 'test', true);
                            // console.log('myTEST Count', {
                            //   myTestCount,
                            //   testCount,
                            // });
                            const archivedCardCount =
                              item.name === 'Competitors'
                                ? getCardCountForCompetitor(
                                    item.cards,
                                    'archived'
                                  )
                                : getCardCount(item.cards, 'archived');
                            return (
                              <div
                                className="col-4"
                                key={`playbook-${itemIdx}`}
                              >
                                <PlaybookPanel
                                  selectedPlaybookId={
                                    selectedPlaybook &&
                                    selectedPlaybook.encryptedMarketId
                                  }
                                  id={item.id}
                                  topic={item.name}
                                  cardData={item}
                                  finalCardCount={finalCardCount}
                                  testCount={testCount}
                                  archivedCardCount={archivedCardCount}
                                  // myTestCount={myTestCount}
                                  selectedMarketName={
                                    selectedPlaybook && selectedPlaybook.name
                                  }
                                />
                              </div>
                            );
                          })}
                        </Row>
                      </React.Fragment>
                    ) : null}
                  </Col>
                </Row>
                <div className="add-pb-card-btn-container">
                  <FloaterButton
                    type="add"
                    color="blue"
                    tooltip="Add new market"
                    onClick={this.handleAddPlaybookFloaterBtn}
                  />
                </div>
              </Container>
            </section>
          </MainPanel>
        </ErrorBoundary>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    playbook: state.playbook,
    filter: state.marketPerformanceFilters,
    marketList: FilterMarketModel.list().map((item) => item.props),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectPlaybook,
      resetPlaybook,
      loadPlaybooks,
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagingImpl);
