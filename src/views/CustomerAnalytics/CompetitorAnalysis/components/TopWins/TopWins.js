import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { avatarText, ShortNumber } from '../../../../../util/utils';
import './TopWins.style.scss';
import Tooltip from '@material-ui/core/Tooltip';
const DEFAULT_CLASSNAME = 'top-wins';

const ToolTipText = ({ children, limit = 0 }) => {
  let allowedText = children;
  if (limit && children.length > limit) {
    allowedText = children?.substring(0, limit) + '...';
  }
  return (
    <Tooltip title={children}>
      <span>{allowedText}</span>
    </Tooltip>
  );
};

class TopWins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      isLoading: true,
    };
  }

  renderHeader = () => {
    return (
      <div className={`${DEFAULT_CLASSNAME}-card-header`}>
        <div className="heading">Top Deals</div>
      </div>
    );
  };

  goDealGameTape = ({ id, storyId }) => {
    const { history } = this.props;
    history.push(`/dealgametape/storyId/${storyId}/opptyId/${id}`);
  };

  renderBody = (accounts, limit) => {
    return (
      <div className={`${DEFAULT_CLASSNAME}-card-body`}>
        <div className={`${DEFAULT_CLASSNAME}-card-body-content`}>
          {accounts.length > 0 ? (
            accounts.slice(0, limit).map((acc, index) => (
              <div
                role="button"
                onClick={() => this.goDealGameTape(acc)}
                className={`${DEFAULT_CLASSNAME}-card-body-content-accounts`}
                key={index}
              >
                <div className="account-avatar">
                  <span>
                    {acc.accountName &&
                      avatarText(acc.accountName.toUpperCase())}
                  </span>
                </div>
                <div>
                  <span className="account-link">
                    <ToolTipText limit={40}>
                      {acc.accountName || ''}
                    </ToolTipText>
                  </span>
                  <div className="info">
                    {`${ShortNumber(acc.amount)} in ${acc.closeQtr || ''}-`}
                    {acc.closeYear || ''}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <i>Deals not found!</i>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { limit, accounts } = this.props;
    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        <div className={`${DEFAULT_CLASSNAME}-card`}>
          <React.Fragment>
            {this.renderHeader()}
            {this.renderBody(accounts, limit)}
          </React.Fragment>
        </div>
      </div>
    );
  }
}

TopWins.defaultProps = { limit: 15 };

TopWins.propTypes = {
  selectedComp: PropTypes.object,
  limit: PropTypes.number,
};

export default withRouter(TopWins);
