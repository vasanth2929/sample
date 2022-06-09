import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateCard } from '../../../../../../util/promises/playbooks_promise';
import './SideBarMessage.style.scss';

const DEFAULT_CLASSNAMES = 'sidebarmessage';

class SideBarMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCardModal: {},
      showKeywords: false,
      cardData: null,
      isLoading: true,
      description: null,
      disabled: true,
      keywordDisable: true,
      keywordtag: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.storyMetricsdata.description !==
      prevProps.storyMetricsdata.description
    ) {
      this.loadData();
      this.setState({ disabled: true, keywordDisable: true, keywordtag: '' });
    }
  }

  loadData = () => {
    this.setState({
      cardData: this.props.storyMetricsdata,
      isLoading: false,
      description: this.props.storyMetricsdata.description,
    });
  };

  componentDidMount() {
    this.loadData();
  }

  saveDescription = async (id) => {
    const { cardData } = this.state;
    const cardDetails = {
      ...cardData.cardDetails,
      type:
        cardData.cardDetails.type && cardData.cardDetails.type.length > 0
          ? cardData.cardDetails.type[0]
          : cardData.cardDetails.type,
    };
    const repsonse = await updateCard(id, {
      ...cardData,
      cardDetails,
      description: this.state.description,
    });
    if (repsonse) {
      this.setState({ disabled: !this.state.disabled });
      this.props.reload();
      this.props.setRefetch();
    }
  };

  renderContent = () => {
    const { cardData, description, disabled } = this.state;
    const id = cardData && cardData.id;
    return (
      <div className={DEFAULT_CLASSNAMES}>
        <div className="summary-card-modal-row">
          <div className="summary-card-modal-body-text">
            <div
              className="container-message"
              onClick={() => this.setState({ disabled: false })}
              role="button"
            >
              <textarea
                id="sidebarmessage"
                className={disabled ? '' : 'active'}
                disabled={disabled}
                value={description}
                onChange={(e) => this.setState({ description: e.target.value })}
              />
              {disabled ? (
                <button
                  id="sidebarmessagebtn"
                  className="editbutton"
                  onClick={() =>
                    this.setState({ disabled: !this.state.disabled })
                  }
                >
                  <span className="material-icons">create</span>
                </button>
              ) : (
                <button
                  id="sidebarmessagebtn"
                  className="editbutton"
                  onClick={() => this.saveDescription(id)}
                >
                  <span className="material-icons">done</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return <>{this.renderContent()}</>;
  }
}

function mapStateToProps(state) {
  return { selectedNoteCard: state.marketAnalysisReducer.selectedNoteCard };
}
export default connect(mapStateToProps)(SideBarMessage);
