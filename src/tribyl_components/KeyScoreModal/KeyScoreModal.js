import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { ModalMUI } from '../../components/CustomModal/CustomModal';
import KeyScoreTable from '../KeyScoreTable/KeyScoreTable';
import './KeyScoreModal.style.scss';

const DEFAULT_CLASSNAME = 'keyword-score';

export default function KeyScoreModal({
  keywords,
  loadHeuristicData,
  cardId,
  cardInfo,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Button
        onClick={() => keywords && keywords.length > 0 && setIsOpen(true)}
        variant="contained"
        style={{ background: '#F27E4C', color: 'white' }}
        disableElevation
        id="keyword-score-button"
      >
        Keyword Analysis
      </Button>
      <ModalMUI
        title="Keyword Scores"
        isOpen={isOpen}
        onClose={handleClose}
        maxWidth="lg"
      >
        <KeyScoreTable
          keywords={keywords}
          loadHeuristicData={loadHeuristicData}
          cardId={cardId}
          cardInfo={cardInfo}
        />
      </ModalMUI>
    </div>
  );
}
