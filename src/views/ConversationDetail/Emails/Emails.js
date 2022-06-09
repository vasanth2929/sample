import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './Emails.style.scss';
import { getEmailStatsForOpptyTeamyP } from '../../../util/promises/conversation_promise';
import { Async } from '../../../basecomponents/async/async';
import { withRouter } from 'react-router';
import { Skeleton } from '@material-ui/lab';

const DEFAULT_CLASSNAME = 'conversation-emails';

const columns = [
  { field: 'id', headerName: 'ID', flex: 1, hide: true },
  { field: 'name', headerName: 'Oppty Team Member Name', flex: 1 },
  { field: 'mailsProcessedCount', headerName: 'Processed Emails', flex: 1 },
  { field: 'emails', headerName: 'email', flex: 1 },
];

class Emails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailList: [],
      sortOrder: [{ field: 'mailsProcessedCount', sort: 'desc' }],
    };
  }

  getPromise = () => {
    const { storyId } = this.props.match.params;
    return getEmailStatsForOpptyTeamyP(storyId);
  };

  loadData = (data) => {
    const emailList = data
      ? data
          .filter((i) => !i.userName.includes('admin'))
          .map((i, index) => ({
            ...i,
            id: index,
            name: i.userName.split('@')[0],
            emails: i.userName,
          }))
      : [];
    this.setState({ emailList });
  };

  handleSortModel = (sortModel) => {
    this.setState({ sortOrder: sortModel });
  };

  renderContent = () => {
    const { emailList, sortOrder } = this.state;
    return (
      <DataGrid
        rows={emailList}
        columns={columns}
        pageSize={50}
        sortModel={sortOrder}
        onSortModelChange={this.handleSortModel}
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
          identifier="conversation-detail-emails"
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

export default withRouter(Emails);
