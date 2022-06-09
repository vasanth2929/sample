import React, { Component } from 'react';
import Dock from 'react-dock';
import { TearsheetTab } from '../../views/StoryboardV2/containers/TearsheetTab/TearsheetTab';

import './TearsheetDock.style.scss';

const DEFAULT_CLASSNAME = 'tearsheet-dock';
const TearsheetDock = (props) => {
  const {
    accountId,
    buyingCenter,
    isStoryDisabled,
    isVisible,
    storyId,
    onVisibleChange,
  } = props;

  return (
    <div className={`${DEFAULT_CLASSNAME}`}>
      <Dock
        dimMode="opaque"
        dimStyle={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        isVisible={isVisible}
        onVisibleChange={onVisibleChange}
        position="right"
        size={0.9}
      >
        <TearsheetTab
          accountId={accountId}
          buyingCenter={buyingCenter}
          isStoryDisabled={isStoryDisabled}
          onClose={onVisibleChange}
          storyId={storyId}
          variant="secondary"
          isVisible={isVisible}
        />
      </Dock>
    </div>
  );
};

export default TearsheetDock;
