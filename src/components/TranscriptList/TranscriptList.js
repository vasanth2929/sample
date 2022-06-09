import { DataGrid } from '@material-ui/data-grid';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Document from '../../assets/iconsV2/document.svg';
import Email from '../../assets/iconsV2/email.svg';
import Note from '../../assets/iconsV2/note.svg';
import Phone from '../../assets/iconsV2/phone-2.svg';
import { showCustomModal } from '../CustomModal/CustomModal';
import './TranscriptList.style.scss';
import Legend from '../Legend/Legend';
import { Tooltip } from '@material-ui/core';
import Keyword from '../../tribyl_components/Keyword';

const IconMap = {
  document: Document,
  email: Email,
  note: Note,
  call: Phone,
};
const TranscriptList = ({
  rows,
  onRowClick,
  rowsPerPageOptions,
  selectedRow,
  isLoading,
  page,
  onPageChange
}) => {
  const [isOpen, setisOpen] = useState(false);
  // const [sortkeywordscoreModel, setSortkeyScoreModel] = React.useState([
  //   {
  //     field: 'elasticScoreInConv',
  //     sort: 'desc',
  //   },
  // ]);
  // const [sortavgscore, setSortAvgScore] = React.useState([
  //   {
  //     field: 'score',
  //     sort: 'desc',
  //   },
  // ]);

  const keywordColumn = [
    {
      field: 'id',
      headerName: 'ID',
      hide: true,
    },
    {
      headerName: 'Keywords',
      field: 'keywordName',
      flex: 2,
      renderCell: (params) => formatKeywords(params),
    },
    {
      headerName: 'Score',
      field: 'elasticScoreInConv',
      align: 'left',
      flex: 1,
      type: 'number',
      headerAlign: 'left',
      renderCell: (params) => params.value.toFixed(2),
    },
  ];

  const Columns = [
    {
      field: 'id',
      headerName: 'ID',
      hide: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      disableColumnMenu: true,
      renderCell: (params) => <img src={IconMap[params.value]} />,
    },
    {
      field: 'subject',
      headerName: 'Subject',
      flex: 2,
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      flex: 1,
    },
    {
      field: 'score',
      headerName: 'Score',
      type: 'number',
      align: 'left',
      width: 100,
      headerAlign: 'left',
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="link" onClick={() => handleKeywordModal(params, true)}>
          {params.value}
        </div>
      ),
    },
  ];

  const formatKeywords = (params) => {
    console.log(params);
    if (!params.value) return '';
    return (
      <Tooltip title={`${params.value}`}>
        <Keyword
          isDisabled
          text={params.value}
          source={
            params.row.keywordType !== 'system' ? 'machine-generated' : ''
          }
        />
      </Tooltip>
    );
  };

  const handleKeywordModal = (params) => {
    setisOpen(true);
    const rows = params.row.keywords
      ?.sort((a, b) => b.elasticScoreInConv - a.elasticScoreInConv)
      .map((i) => ({ ...i, id: i.keywordId }));
    showCustomModal(
      <div className="keyword-modal-header">
        <h5 className="heading">Keywords</h5>
      </div>,
      <div className="card-list">
        <DataGrid
          rows={rows}
          columns={keywordColumn}
          autoHeight
          pageSize={10}
          pagination
          hideFooterSelectedRowCount
        />
        <div className="legends">
          <Legend color={'#638421'} text="Manually Entered" />
          <Legend color={'#a2b9c9'} text="Machine Generated" />
        </div>
      </div>,
      'conv-keyword-modal'
    );
  };
  return (
    <div className="keymomentList">
      <DataGrid
        rows={rows}
        columns={Columns}
        pagination
        rowsPerPageOptions={rowsPerPageOptions}
        pageSize={10}
        page={page}
        onRowClick={(params) => onRowClick(params)}
        hideFooterSelectedRowCount
        selectionModel={[selectedRow?.id]}
        loading={isLoading}
        onPageChange={onPageChange}
      />
    </div>
  );
};
TranscriptList.PropTypes = {
  rows: PropTypes.array,
  rowsPerPageOptions: PropTypes.array,
};

TranscriptList.defaultProps = {
  rowsPerPageOptions: [10, 20, 50],
};

export default TranscriptList;
