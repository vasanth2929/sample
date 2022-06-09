import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { getGongCallMetadataForStory } from '../../../util/promises/conversation_promise';
import { Async } from '../../../basecomponents/async/async';
import { withRouter } from 'react-router';
import { Skeleton } from '@material-ui/lab';
import './Calls.style.scss';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import moment from 'moment';
import { Button } from '@material-ui/core';

const DEFAULT_CLASSNAME = 'conversation-calls';
const columns = [
  { field: 'id', headerName: 'ID', flex: 1, hide: true },
  {
    field: 'meetingDate',
    type: 'date',
    headerName: 'Date',
    flex: 1,
    renderCell: (params) => moment(params.value).format('LL'),
  },
  { field: 'title', headerName: 'Call Subject', flex: 2 },
  { field: 'Attendeelist', headerName: 'Attendee List', flex: 2 },
  {
    field: 'callUrl',
    headerName: 'Call recording',
    flex: 1,
    renderCell: (params) => {
      return (
        <Button
          color="secondary"
          className="play-button"
          size="small"
          variant="contained"
          onClick={() => handlePlay(params.value)}
          endIcon={<PlayArrowIcon />}
        >
          Play
        </Button>
      );
    },
  },
];

const handlePlay = (url) => {
  window.open(`${url}`, '_blank');
};

class Calls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callList: [],
    };
  }

  getPromise = () => {
    const { storyId } = this.props.match.params;
    return getGongCallMetadataForStory(storyId);
  };

  loadData = (data) => {
    const callList = data
      ? data.map((i, index) => ({
          ...i,
          id: index,
          Attendeelist: i.attendeeList.join(','),
        }))
      : [];
    this.setState({ callList });
  };

  renderContent = () => {
    const { callList } = this.state;
    return (
      <DataGrid
        rows={callList}
        columns={columns}
        pageSize={50}
        sortModel={[{ field: 'meetingDate', sort: 'desc' }]}
      />
    );
  };

  renderShimmer = () => {
    return (
      <React.Fragment>
        <Skeleton variant="rect" width={'100%'} height={400} />
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className={DEFAULT_CLASSNAME}>
        <Async
          identifier="conversation-detail-calls"
          promise={this.getPromise}
          content={this.renderContent}
          handlePromiseResponse={this.loadData}
          loader={this.renderShimmer}
          error={(e) => console.log(e)}
        />
      </div>
    );
  }
}

export default withRouter(Calls);
