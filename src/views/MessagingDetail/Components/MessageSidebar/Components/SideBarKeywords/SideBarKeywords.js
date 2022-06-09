import { Skeleton } from '@material-ui/lab';
import React, { PureComponent } from 'react';
import { reload } from '../../../../../../action/loadingActions';
import { Async } from '../../../../../../basecomponents/async/async';
import { ToggleButton } from '../../../../../../basecomponents/ToggleButton/ToggleButton';
import { showCustomModal } from '../../../../../../components/CustomModal/CustomModal';
import Legend from '../../../../../../components/Legend/Legend';
import Keyword from '../../../../../../tribyl_components/Keyword';
import {
  createCardMatchTags,
  deleteCardMatchTags,
  getKeywordStats,
} from '../../../../../../util/promises/match_tag_promise';
import { getPlaybookCardDetails } from '../../../../../../util/promises/playbookcard_details_promise';
import { isEmpty } from '../../../../../../util/utils';
import KeywordChart from '../../../../../CustomerAnalytics/MessagingTab/components/SummaryCard/Trends/KeywordChart/KeywordChart';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import './SideBarKeywords.style.scss';
import { CircularProgress } from '@material-ui/core';
const DEFAULT_CLASSNAMES = 'sidebarmessage';

export default class SideBarKeywords extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCardModal: {},
      showKeywords: true,
      cardData: null,
      isLoading: true,
      description: null,
      disabled: true,
      keywordDisable: false,
      keywordtag: '',
      isMachineOnly: false,
      keywordsChartData: [],
      isMachine: true,
      cardTagsList: [],
      isDeleting: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.storyMetricsdata.id !== prevProps.storyMetricsdata.id) {
      this.setState({
        cardTagsList: this.props.storyMetricsdata.cardTagsList,
        keywordtag: '',
      });
    }
  }

  getPromise = async () => {
    const { sidebardata } = this.props;
    return new Promise((resolve, reject) => {
      Promise.all([getPlaybookCardDetails(sidebardata.id)])
        .then((response) => {
          resolve({ data: response });
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  loadData = (response) => {
    this.setState({
      cardData: response[0].data,
      isLoading: false,
      description: response[0].data.description,
    });
  };

  renderKeywords = (cardTags, id) => {
    const { isMachineOnly } = this.state;
    const taglist = cardTags && cardTags.length > 0 ? cardTags : [];
    const filterdtaglist =
      isMachineOnly && taglist.length > 0
        ? taglist.filter((cardTag) => cardTag.source === 'machine-generated')
        : taglist;

    return (
      filterdtaglist &&
      filterdtaglist.map((cardTag, index) => (
        <Keyword
          key={`${cardTag.text}-${index}`}
          text={cardTag.text}
          source={cardTag.source}
          isDeleting={this.state.isDeleting}
          onRemove={() => this.deleteKeyword(id, cardTag.id)}
        />
      ))
    );
  };

  saveKeyword = (event, id) => {
    event.preventDefault();
    const { keywordtag } = this.state;

    if (!keywordtag) return;

    const payload = {
      active: true,
      cardId: id,
      status: 'new',
      subType: null,
      text: keywordtag,
      type: null,
      visible: true,
    };

    createCardMatchTags(payload).then((res) =>
      this.setState(
        { keywordDisable: !this.state.keywordDisable, keywordtag: '' },
        () => {
          if (res.status === 200) {
            if (this.state.cardTagsList)
              this.setState({
                cardTagsList: [...this.state.cardTagsList, res.data],
              });
            else
              this.setState({
                cardTagsList: [res.data],
              });
            this.props.setRefetch();
          }
        }
      )
    );
  };

  deleteKeyword = (id, tagId) => {
    this.setState({ isDeleting: true });
    deleteCardMatchTags(tagId).then(() => {
      this.setState({
        keywordDisable: !this.state.keywordDisable,
        cardTagsList: this.state.cardTagsList.filter((t) => t.id !== tagId),
      });
      this.props.setRefetch();
      this.setState({ isDeleting: false });
    });
  };

  toggleMachineOnly = (state) => {
    this.setState({ isMachineOnly: state });
  };

  toggleKeywordType = (event) => {
    this.setState({ isMachine: event.target.checked }, () =>
      reload('messaging-keyword-chart')
    );
  };

  handleClick = async () => {
    const { cardData } = this.state;
    const { sidebardata } = this.props;
    this.setState({ isKeywordLoading: true });
    const response = await getKeywordStats({ cardId: sidebardata.id });
    const keywordsChartData = response.data ? response.data : [];
    if (keywordsChartData) {
      showCustomModal(
        <div className="keyword-modal-header">
          <span className="text">{this.props.storyMetricsdata.topic_name}</span>
          <h5 className="heading">{this.props.storyMetricsdata.title}</h5>
        </div>,
        <div className="card-list">
          <KeywordChart
            data={keywordsChartData}
            card={this.props.storyMetricsdata}
          />
        </div>,
        'keyword-conversation-chart'
      );
    }
    this.setState({ isKeywordLoading: false });
  };

  componentDidMount() {
    this.setState({ cardTagsList: this.props.storyMetricsdata.cardTagsList });
  }

  renderContent = () => {
    const { keywordtag, cardData, isMachineOnly, isKeywordLoading } =
      this.state;
    const id = this.props.storyMetricsdata && this.props.storyMetricsdata.id;
    return (
      <React.Fragment>
        <div className={DEFAULT_CLASSNAMES}>
          <div className="d-flex m-1 justify-content-between">
            <span className="analyze-link" onClick={this.handleClick}>
              Analyze <TrendingUpIcon fontSize="small" />
              {isKeywordLoading ? (
                <CircularProgress
                  size={15}
                  style={{ marginLeft: '10px' }}
                  color="secondary"
                />
              ) : (
                ''
              )}
            </span>
            <div className="d-flex justify-content-end">
              <span className="text bold">All</span>
              <ToggleButton
                customeClass="messaging-insight"
                value={isMachineOnly}
                handleToggle={this.toggleMachineOnly}
              />
              <span className="text bold">Machine</span>
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAMES}-keywords-create`}>
            <div style={{ width: '100%' }}>
              <form onSubmit={(event) => this.saveKeyword(event, id)}>
                <input
                  className="keywordInput"
                  placeholder="Enter Keyword"
                  type="text"
                  value={keywordtag}
                  onChange={(e) =>
                    this.setState({ keywordtag: e.target.value })
                  }
                />
                <button
                  id="sidebarmessagekeywordbtn"
                  className={`editkeywordbtn ${
                    !isEmpty(keywordtag) ? 'active' : null
                  }`}
                  type="submit"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAMES}-keyword-list`}>
          {this.props.storyMetricsdata &&
            this.renderKeywords(this.state.cardTagsList, id)}
        </div>
        <div className="legend-container">
          <React.Fragment>
            <Legend color={'#a5d24a'} text="Manually Entered" />
            <Legend color={'#a2b9c9'} text="Machine Generated" />
          </React.Fragment>
        </div>
      </React.Fragment>
    );
  };

  renderLoader = () => {
    return <Skeleton variant="react" height="100%" width="100%" />;
  };

  render() {
    return <>{this.renderContent()}</>;
  }
}
