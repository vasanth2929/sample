import { Button, CircularProgress, Tooltip } from '@material-ui/core';
import React, { useState } from 'react';
import { loadCardToOpptyMatchedRel } from '../../util/promises/playbooks_promise';
import { showAlert } from '../MessageModal/MessageModal';
import ReplayIcon from '@material-ui/icons/Replay';
import PropTypes from 'prop-types';
function RerunMatches({ text, endEvent, color }) {
  const [isLoading, setisLoading] = useState(false);
  const RerunMatched = async () => {
    setisLoading(true);
    try {
      const respsonse = await loadCardToOpptyMatchedRel();
      if (respsonse) {
        endEvent && endEvent(respsonse);
        showAlert('suggest success message!.', 'success');
      }
    } catch (err) {
      showAlert('Something went wrong! Please try again later.', 'error');
    } finally {
      setisLoading(false);
    }
  };
  return (
    <div className="rerun-mateches">
      <Tooltip placement="right-end" interactive={!isLoading} title="Rerun Matches" aria-label="reload">
        <Button
          onClick={RerunMatched}
          disableElevation
          color={color}
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={15} /> : <ReplayIcon />
          }
        >
          {text}
        </Button>
      </Tooltip>
    </div>
  );
}

RerunMatches.prototype = {
  varient: PropTypes.string,
  text: PropTypes.string,
  color: PropTypes.string,
};

RerunMatches.defaultProps = {
  color: 'secondary',
};

export default RerunMatches;
