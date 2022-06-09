import React, { Component } from 'react';
import QuestionRow from './QuestionRow';
import { getSurveyQuestionsAndCardsWithVerifyAndMatchCounts } from '../../util/promises/playbookcard_details_promise';
import { Loader } from '../../_tribyl/components/_base/Loader/Loader';

class QuestionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      isLoading: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.questionId !== prevProps.questionId) {
      this.loadCard();
    }
  }

  componentDidMount() {
    this.loadCard();
  }

  loadCard = async () => {
    const { questionId, opptyId } = this.props;
    this.setState({ isLoading: true });
    const response = await getSurveyQuestionsAndCardsWithVerifyAndMatchCounts(
      opptyId,
      questionId
    );
    const options = response.data
      ? this.sortData(response.data.relatedCardList)
      : [];
    this.setState({ options, isLoading: false });
  };

  sortData = (data) => {
    // sorting criteria as per priority highest vote count > highest match count > alphabetical
    const sortByVotesMatchAlphabet = data.sort((a, b) => {
      if (a.cardMetrics.verifyCount < b.cardMetrics.verifyCount) {
        return 1;
      } else if (a.cardMetrics.verifyCount === b.cardMetrics.verifyCount) {
        if (a.cardMetrics.matchCount < b.cardMetrics.matchCount) {
          return 1;
        } else if (a.cardMetrics.matchCount === b.cardMetrics.matchCount) {
          return a.title.localeCompare(b.title);
        }
      }
      return -1;
    });
    return sortByVotesMatchAlphabet;
  };

  reload = () => {
    this.loadCard();
  };

  renderOptions = (data) => {
    const { opptyId, storyId, uiType } = this.props;
    return data.map((i) => (
      <QuestionRow
        key={i.id}
        data={i}
        opptyId={opptyId}
        storyId={storyId}
        reload={this.reload}
        uiType={uiType}
      />
    ));
  };

  render() {
    const { isLoading, options } = this.state;
    return (
      <div className="question-container">
        {!isLoading ? (
          options.length > 0 ? (
            this.renderOptions(options)
          ) : (
            <i>Data not found</i>
          )
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

export default QuestionContainer;
