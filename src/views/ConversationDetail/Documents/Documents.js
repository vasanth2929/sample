import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './Documents.style.scss';
import { Async } from '../../../basecomponents/async/async';
import { getConvMetadataForStoryOrOpptyP } from '../../../util/promises/conversation_promise';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Skeleton } from '@material-ui/lab';

const DEFAULT_CLASSNAME = 'conversation-documents';
const columns = [
  { field: 'id', headerName: 'ID', flex: 1, hide: true },
  {
    field: 'uploadedTimestamp',
    type: 'date',
    headerName: 'Date',
    flex: 1,
    renderCell: (params) => moment(params.value).format('LL'),
  },
  {
    field: 'name',
    headerName: 'Filename',
    flex: 2,
  },
  {
    field: 'uploadedBy',
    headerName: 'Uploaded By',
    flex: 2,
  },
];

class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documentList: [],
    };
  }

  getPromise = () => {
    const storyId = this.props.match.params.storyId
      ? this.props.match.params.storyId
      : this.props.storyId;

    return getConvMetadataForStoryOrOpptyP(storyId);
  };

  loadData = (data) => {
    const documentList = data && data.documentList ? data.documentList : [];
    this.setState({ documentList });
  };

  renderContent = () => {
    const { documentList } = this.state;
    const rows = documentList.map((doc, index) => ({
      ...doc,
      id: index,
      uploadedBy: doc.userBean.name,
    }));
    return (
      <div className={DEFAULT_CLASSNAME}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={50}
          sortModel={[{ field: 'uploadedTimestamp', sort: 'desc' }]}
          autoHeight
        />
      </div>
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
      <Async
        identifier="conversation-detail-documents"
        promise={this.getPromise}
        content={this.renderContent}
        handlePromiseResponse={this.loadData}
        loader={this.renderShimmer}
        error={<div>error</div>}
      />
    );
  }
}
Documents.propTypes = {
  opptyId: PropTypes.number,
};
export default withRouter(Documents);
