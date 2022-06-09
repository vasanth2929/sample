import React from 'react';
import './StoryDetail.style.scss';
import Table from '@material-ui/core/Table';
import {
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import { formatDate } from '../../../../util/utils';

// const propertyToShow = [
//   {
//     label: 'Oppty type',
//     value: 'crmOpptyType',
//   },
//   {
//     label: 'Create date',
//     value: 'createOn',
//   },
//   {
//     label: 'close date ',
//     value: 'close date ',
//   },
//   {
//     label: 'sales cycle',
//     value: 'sales cycle',
//   },
//   {
//     label: 'Account',
//     value: accountName,
//   },
//   {
//     label: 'Opportunity Name',
//     value: storyName,
//   },
//   {
//     label: 'Industry',
//     value: industryName,
//   },
//   {
//     label: 'Market',
//     value: market,
//   },
//   {
//     label: 'Close Status',
//     value: stage,
//   },
//   {
//     label: 'Close Period',
//     value: `${closingQuarter}-${closingYear}`,
//   },
//   {
//     label: 'Deal Size',
//     value: `influenceAmt`,
//   },
//   {
//     label: 'Opportunity Owner',
//     value: 'opportunityOwnerName',
//   },
// ];

export default function StoryDetail({ detail }) {
  const renderCells = () => {
    return (
      <TableBody>
        <TableRow>
          <TableCell width={'40%'} component="th" scope="row">
            Account
          </TableCell>
          <TableCell>{detail.accountName || ''}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Opportunity Name
          </TableCell>
          <TableCell>{detail.storyName || ''}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            CRM industry
          </TableCell>
          <TableCell>{detail.crmIndustry || '-'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Tribyl industry
          </TableCell>
          <TableCell>
            {detail.industryName
              ? detail.industryName === 'NotMapped'
                ? '-'
                : detail.industryName
              : '-'}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Market
          </TableCell>
          <TableCell>{detail.market || ''}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Stage
          </TableCell>
          <TableCell>{detail.stage || ''}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Close Period
          </TableCell>
          <TableCell>{`${detail.closingQuarter}-${detail.closingYear}`}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Deal Size
          </TableCell>
          <TableCell>{`${
            detail.influenceAmt
              ? detail.influenceAmt.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })
              : ''
          }`}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Opportunity Owner
          </TableCell>
          <TableCell>
            {detail.crmOpportunities[0]?.opportunityOwnerName || ''}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Oppty type
          </TableCell>
          <TableCell>{detail.crmOpptyType || ''}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Close date
          </TableCell>
          <TableCell>{formatDate(detail.closedDate) || ''}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Create date
          </TableCell>
          <TableCell>{formatDate(detail.createdDate) || ''}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            Sales cycle
          </TableCell>
          <TableCell>{detail.salesCycle || ''}</TableCell>
        </TableRow>
      </TableBody>
    );
  };

  return (
    <TableContainer>
      <Table size="small" aria-label="simple dense table">
        {detail && renderCells()}
      </Table>
    </TableContainer>
  );
}
