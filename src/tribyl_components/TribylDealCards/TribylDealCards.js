import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardContent,
  Paper,
  Grid,
  Button,
  Typography,
  Tooltip,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import TribylCheckbox from '../TribylCheckbox';
import Match from '../../components/Match';
import { ShortNumber } from '../../util/utils';
import './TribylDealCards.scss';
import { connect } from 'react-redux';
import { ToolTipText } from '../../components/ToolTipText/ToolTipText';

const TribylDealCardsImpl = ({
  cards,
  isOutlined,
  gridSize,
  openNewTab,
  isVerifiedCards,
  tabData,
}) => {
  let history = useHistory();

  const redirect = (storyId) => {
    history.push(`/conversation-analysis/${storyId}/${cards.id}`);
  };

  const handleClick = (storyId, opptyId) => {
    const { tabId } = tabData;
    if (openNewTab) {
      window.open(
        `/dealgametape/storyId/${storyId}/opptyId/${opptyId}?confidence=${isVerifiedCards}`
      );
    } else {
      history.push(
        `/dealgametape/storyId/${storyId}/opptyId/${opptyId}?confidence=${isVerifiedCards}`,
        {
          tabIndex: tabId,
        }
      );
    }
  };

  const renderStatus = (status, isWon, isClosed) => {
    const statusToShow = status
      ? status.length >= 20
        ? status.substring(1, 15) + '...'
        : status
      : null;

    if (statusToShow) {
      if (isWon !== 'Y' && isClosed === 'Y') {
        return (
          <Tooltip title={status}>
            <span className="status mr-1 lost">{statusToShow}</span>
          </Tooltip>
        );
      }
      return (
        <Tooltip title={status}>
          <span className="status mr-1">{statusToShow}</span>
        </Tooltip>
      );
    }
    return '';
  };

  const renderValue = (value) => {
    return value && value.toLowerCase() === 'notmapped' ? '' : value;
  };

  const renderCards = (data) => {
    return data && data.length > 0 ? (
      data.map((card) => (
        <Grid item key={card.id} xs={gridSize}>
          <Card
            elevation={0}
            square
            className="tribyl-deals-card"
            variant={isOutlined ? 'outlined' : 'elevation'}
          >
            <CardContent className="tribyl-deals-card-body">
              <Grid item>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid
                    item
                    xs={8}
                    className="sub-heading bold large text-truncate"
                  >
                    <ToolTipText limit={35}>
                      {card.accountName || ''}
                    </ToolTipText>
                  </Grid>
                  <Grid item xs={4} className="p-2">
                    <Grid
                      container
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <Grid item>
                        <TribylCheckbox
                          isDisabled
                          isChecked={card.isVerifiedAgainstCard === 'Y'}
                        />
                      </Grid>
                      <Grid item>
                        <Match count={card.matchCount || 0} isDisabled />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <div className="metrics mb-3 d-flex justify-content-between align-items-center">
                <span className="value">
                  $ {ShortNumber(card.opportunityAmount)}
                </span>
                |
                <span className="sub-heading large bold">
                  {card.closeQtr}-{card.closeYear}
                </span>
                {renderStatus(card.oppStatus, card.isWon, card.isClosed)}
              </div>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item xs={8}>
                  <Grid item xs={12}>
                    <Typography paragraph className="mb-0 text-truncate">
                      {renderValue(card.accountSegment)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography paragraph className="mb-1 text-truncate">
                      {renderValue(card.accountIndustry)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid container justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => handleClick(card.id, card.opportunityId)}
                    >
                      OPEN
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))
    ) : (
      <div style={{ minHeight: '200px' }}>
        <i className="p-2"> No story found!</i>
      </div>
    );
  };

  return (
    <Paper elevation={0} square className="tribyl-deals">
      <Grid container>{cards && renderCards(cards)}</Grid>
    </Paper>
  );
};

TribylDealCardsImpl.propTypes = {
  cards: PropTypes.array,
  isOutlined: PropTypes.bool,
  gridSize: PropTypes.number,
  openNewTab: PropTypes.bool,
};

TribylDealCardsImpl.defaultProps = {
  isOutlined: false,
  openNewTab: false,
  gridSize: 12,
};

const mapStateToProps = (state) => {
  return { tabData: state.marketAnalysisReducer.tabData };
};

export default connect(mapStateToProps)(TribylDealCardsImpl);
