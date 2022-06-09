import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Async } from '../../basecomponents/async/async';
import { UPDATE_MARKET_PERFORMANCE_FILTERS } from '../../constants/general';
import { getConversationCountForStories } from '../../util/promises/customer_analysis';
import './StoryStats.style.scss';

const DEFAULT_CLASSNAME = 'story-stats';

function StoryStats({ storyIdList, showDeals,changeFilter }) {
  const [stats, setStats] = useState(null);
  const defaultValue = {
    totalEmailCount: 0,
    totalCallCount: 0,
    totalSurveyCount: 0,
    totalDocumentCount: 0,
  };

  const getPromise = async () => {
    const storyList =
      storyIdList &&
      storyIdList.reduce((acc, curr) => [...acc, curr.storyId], []);
    if (storyList && storyList.length)
      {
        let data = await getConversationCountForStories(storyList);
        changeFilter({isDataLoading:false});
        return data;
      }
      
    else {
      changeFilter({isDataLoading:false});
      return Promise.resolve({ data: defaultValue })
    };
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        {showDeals && (
          <span className={`${DEFAULT_CLASSNAME}-items`}>
            <span className="text">#Deals: </span>
            {storyIdList.length}
          </span>
        )}
        <span className={`${DEFAULT_CLASSNAME}-items`}>
          <span className="text">#Emails: </span> {stats?.totalEmailCount}
        </span>
        <span className={`${DEFAULT_CLASSNAME}-items`}>
          <span className="text">#Calls: </span> {stats?.totalCallCount}
        </span>
        <span className={`${DEFAULT_CLASSNAME}-items`}>
          <span className="text">#Surveys: </span> {stats?.totalSurveyCount}
        </span>
        <span className={`${DEFAULT_CLASSNAME}-items`}>
          <span className="text">#Documents: </span> {stats?.totalDocumentCount}
        </span>
        {/* <span className={`${DEFAULT_CLASSNAME}-items`}>
          <span className="text">#Notes: </span> {stats?.totalNotesCount}
        </span> */}
      </React.Fragment>
    );
  };

  const loadData = (data) => {
    setStats(data);
    changeFilter({isDataLoading:false});
  };

  return (
    <div className={`${DEFAULT_CLASSNAME}`}>
      <Async
        identifier="story-stats"
        promise={getPromise}
        content={renderContent}
        handlePromiseResponse={loadData}
        loader={<div>...loading</div>}
        error={<div>Error...</div>}
      />
    </div>
  );
}

export default connect(null,(dispatch)=>{
  return {
    changeFilter: payload => dispatch({ type: UPDATE_MARKET_PERFORMANCE_FILTERS, payload }),
  }
})(StoryStats);
