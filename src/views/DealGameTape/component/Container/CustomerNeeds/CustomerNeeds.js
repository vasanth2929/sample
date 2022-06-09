import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { dispatch } from '../../../../../util/utils';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../../../../constants/general';
import Cards from '../Cards/Cards';
import './CustomerNeeds.style.scss';

const DEFAULT_CLASSNAME = 'customer-needs';

class CustomerNeeds extends Component {
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
              key={`${index}-${card.id}`}
              opptyId={opptyId}
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

CustomerNeeds.propTypes = {
  cardData: PropTypes.array,
  storyId: PropTypes.number,
  reload: PropTypes.func,
  topicList: PropTypes.array,
  opptyId: PropTypes.number,
};

function mapDispatchToProps() {
  return bindActionCreators(
    {
      changeFilter: (payload) =>
        dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
    },
    dispatch
  );
}

export default connect(mapDispatchToProps)(CustomerNeeds);
