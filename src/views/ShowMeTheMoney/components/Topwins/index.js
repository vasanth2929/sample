import { DataGrid } from '@material-ui/data-grid';
import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import './index.scss';
import Launch from '@material-ui/icons/Launch';
import { ShortNumber } from '../../../../util/utils';
export const Topwins = ({ rows }) => {
  const [pageSize, setPageSize] = useState(10);
  const columns = [
    { field: 'accountName', flex: 1, headerName: 'Account' },
    {
      field: 'opptyAmount',
      flex: 1,
      headerName: 'Amount',
      renderCell: (params) => {
        return ShortNumber(params.row.opptyAmount);
      },
    },
    { field: 'opportunityStatus', flex: 1, headerName: 'Stage' },
    {
      field: 'accountId',
      flex: 1,
      headerName: 'Action',
      renderCell: (p) => (
        <Launch
          onClick={() => {
            const { opptyId, storyId } = p.row;
            window.open(
              window.origin +
                `/dealgametape/storyId/${storyId}/opptyId/${opptyId}`
            );
          }}
          style={{ width: '18px', height: '18px' }}
        />
      ),
    },
  ];

  return (
    <Box p="20px" bgcolor={'#f5f9fa'} borderRadius="10px">
      <h3 className="table-title">Top Wins</h3>
      <DataGrid
        style={{ background: 'white', height: 500 }}
        columns={columns}
        getRowId={(r) => r.storyId}
        rows={rows}
        rowsPerPageOptions={[10, 20, 50]}
        pageSize={pageSize}
        onPageSizeChange={(v) => {
          setPageSize(v);
        }}
        selectionModel={[]}
        pagination
      />
    </Box>
  );
};
