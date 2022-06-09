import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CardContainer.style.scss';
import Card from './Card/Card';
import rightArrow from '../../../../../../assets/icons/rightArrow.svg';

const DEFAULT_CLASSNAME = 'swot-card-container';

class CardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggleShowAll = () => {
    const { toggleShowAll, type } = this.props;
    if (toggleShowAll) toggleShowAll(type);
  };

  render() {
    const { type, data, title, limit, isAllView } = this.props;
    const setlimit = limit || data.length;
    return (
      <div
        className={`${DEFAULT_CLASSNAME}-card ${
          isAllView && 'viewAll'
        } ${type}`}
      >
        <div className={`${DEFAULT_CLASSNAME}-card-header ${type}`}>
          <div className="heading">{title}</div>
          <div className="more-link">
            {isAllView ? (
              <React.Fragment>
                <span
                  role="button"
                  title="back"
                  className="material-icons"
                  onClick={this.toggleShowAll}
                >
                  keyboard_backspace
                </span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <span
                  className="sub-heading"
                  role="button"
                  onClick={this.toggleShowAll}
                >
                  View all ({data.length || 0})
                </span>
                <img src={rightArrow} />
              </React.Fragment>
            )}
          </div>
        </div>
        <div
          className={`${DEFAULT_CLASSNAME}-card-body ${isAllView && 'viewAll'}`}
        >
          {data.length > 0 ? (
            data
              .slice(0, setlimit)
              .map((card, index) => <Card key={index} cardData={card} />)
          ) : (
            <i>No survey insights yet</i>
          )}
        </div>
      </div>
    );
  }
}

CardContainer.propTypes = {
  data: PropTypes.array,
  type: PropTypes.string,
  title: PropTypes.string,
  limit: PropTypes.number,
  isAllView: PropTypes.bool,
};

export default CardContainer;
