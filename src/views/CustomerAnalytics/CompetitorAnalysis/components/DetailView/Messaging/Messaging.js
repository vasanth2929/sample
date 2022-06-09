import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToggleButton } from '../../../../../../basecomponents/ToggleButton/ToggleButton';
import { Async } from '../../../../../../basecomponents/async/async';
import Keyword from '../../../../../../tribyl_components/Keyword';
import { getPlaybookCardDetails } from '../../../../../../util/promises/playbookcard_details_promise';
import './Messaging.style.scss';
import { reload } from '../../../../../../action/loadingActions';
import Legend from '../../../../../../components/Legend/Legend';

const DEFAULT_CLASSNAMES = 'insight-messaging-container';

class Messaging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCardModal: {},
      showKeywords: false,
      cardData: null,
      isLoading: true,
      isMachineOnly: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedNoteCard?.id !== prevProps.selectedNoteCard?.id) {
      reload('comp-messaging');
    }
  }

  getPromise = () => {
    const { selectedNoteCard } = this.props;
    return getPlaybookCardDetails(selectedNoteCard?.id);
  };

  loadData = (response) => {
    this.setState({ cardData: response, isLoading: false });
  };

  toggleKeywords = (state) => {
    this.setState({ showKeywords: state });
  };

  toggleMachineOnly = (state) => {
    this.setState({ isMachineOnly: state });
  };

  renderKeywords = (cardTags) => {
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
          isDisabled
          text={cardTag.text}
          source={cardTag.source}
        />
      ))
    );
  };

  renderContent = () => {
    const { cardData, isLoading, showKeywords } = this.state;
    return (
      <div className="summary-card-modal-row">
        {!isLoading ? (
          <div className="summary-card-modal-body-text">
            {!showKeywords
              ? this.renderKeywords(cardData.cardTagsList)
              : cardData.description}
          </div>
        ) : (
          <i>Loading data...</i>
        )}
        {!showKeywords && (
          <React.Fragment>
            <Legend color={'#638421'} text="Manually Entered" />
            <Legend color={'#a2b9c9'} text="Machine Generated" />
          </React.Fragment>
        )}
      </div>
    );
  };

  render() {
    const { showKeywords, isMachineOnly } = this.state;
    return (
      <div className={DEFAULT_CLASSNAMES}>
        <div className={`${DEFAULT_CLASSNAMES}-filter`}>
          <div>
            <span className="text bold">Keywords</span>
            <ToggleButton
              customeClass="messaging-insight"
              value={showKeywords}
              handleToggle={this.toggleKeywords}
            />
          </div>
          {!showKeywords &&  (
            <div>
              <span className="text bold">All</span>
              <ToggleButton
                customeClass="messaging-insight"
                value={isMachineOnly}
                handleToggle={this.toggleMachineOnly}
              />
              <span className="text bold">Machine</span>
            </div>
          )}
        </div>
        <Async
          identifier="comp-messaging"
          promise={this.getPromise}
          content={this.renderContent}
          handlePromiseResponse={this.loadData}
          loader={this.renderShimmer}
          error={<div>No Data Available!!</div>}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { selectedNoteCard: state.marketAnalysisReducer.selectedNoteCard };
}
export default connect(mapStateToProps)(Messaging);
