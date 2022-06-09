import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { dispatch } from '../../../../../util/utils';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../../../constants/general';
import Cards from '../Cards/Cards';
import './DecisionCriteria.style.scss';

const DEFAULT_CLASSNAME = 'decision-criteria';

class DecisionCriteria extends Component {
  // when component unmountes action is being called to reset the toggle between insights and keyword back to keywords
  componentWillUnmount() {
    const { changeFilter } = this.props;
    changeFilter({ toggleInsightsKeyowrds: 'keyword' });
  }

  componentWillMount() {
    const { cardData } = this.props;
    const toggleKey = cardData.some((card) =>
      card.data?.some((j) => j.latestCardNote && j.latestCardNote.length)
    )
      ? 'notes'
      : 'keyword';
    dispatch({
      type: UPDATE_MARKET_PERFORMANCE_FILTERS,
      payload: { toggleInsightsKeyowrds: toggleKey },
    });
  }

  render() {
    const { cardData, storyId, reload, topicList, opptyId } = this.props;
    return (
      <div className={DEFAULT_CLASSNAME}>
        {cardData &&
          cardData.map((card, index) => (
            <Cards
              opptyId={opptyId}
              key={`decision-criteria-${index}-${card.id}`}
              cardData={card}
              storyId={storyId}
              isOpen
              reload={reload}
              topicList={topicList}
            />
          ))}
      </div>
    );
  }
}
function mapDispatchToProps() {
  return bindActionCreators(
    {
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
    },
    dispatch
  );
}

export default connect(mapDispatchToProps)(DecisionCriteria);
