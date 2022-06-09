import { DataGrid } from '@material-ui/data-grid';
import React, { useRef, useState } from 'react';
import ReactSelect from 'react-select';
import { Button, Menu, MenuItem, Snackbar } from '@material-ui/core';
import './index.scss';
import { ArrowDropDown } from '@material-ui/icons';
import classNames from 'classnames';
import { updateConfigPropsetPropval } from '../../../../../util/promises/config_promise';
import { Alert } from '@material-ui/lab';

export const FilterProps = ({
  tribylAllCfgPropertyBeans,
  market,
  region,
  segment,
  industry,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [type, setType] = useState('');
  const [openS, setOpen] = React.useState(false);

  const [msg, setMsg] = useState('');

  const handleCloseS = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const options = useRef([]);
  const getDefaults = (t) => {
    let val = '';
    switch (t.propertyName) {
      case 'DEFAULT_MARKET':
        if (t.propsetPropvalIncontextValue)
          return {
            defaultValue: t.propsetPropvalIncontextValue,
            order: 0,
          };
        val = market.find((t) => t.defaultFlag)?.name;
        return { defaultValue: val, order: 0 };
      case 'DEFAULT_SEGMENT':
        if (t.propsetPropvalIncontextValue)
          return {
            defaultValue: t.propsetPropvalIncontextValue,
            order: 2,
          };
        return {
          defaultValue: 'All Segments',
          order: 2,
        };

      case 'DEFAULT_REGION':
        if (t.propsetPropvalIncontextValue)
          return {
            defaultValue: t.propsetPropvalIncontextValue,
            order: 3,
          };
        return { defaultValue: 'All Regions', order: 3 };

      case 'DEFAULT_INDUSTRY':
        if (t.propsetPropvalIncontextValue)
          return {
            defaultValue: t.propsetPropvalIncontextValue,
            order: 1,
          };
        return {
          defaultValue: 'All Industries',
          order: 1,
        };
    }
  };
  const [rows, setRows] = useState([
    ...tribylAllCfgPropertyBeans.map((t) => {
      return {
        ...t,
        ...getDefaults(t),
      };
    }),
  ]);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event, prop) => {
    setType(prop);
    switch (prop) {
      case 'DEFAULT_MARKET':
        options.current = [...market.map((t) => t.name)];
        break;
      case 'DEFAULT_SEGMENT':
        options.current = ['All Segments', ...segment.map((t) => t.value)];
        break;
      case 'DEFAULT_REGION':
        options.current = ['All Regions', ...region.map((t) => t.name)];
        break;

      case 'DEFAULT_INDUSTRY':
        options.current = [
          'All Industries',
          ...industry.map((t) => t.value),
        ].filter((t) => t !== 'NotMapped');
        break;
    }
    setAnchorEl(event.currentTarget);
  };

  const select = (value) => {
    let arr = [...rows];
    let item = arr.find((t) => t.propertyName === type);
    if (item.defaultValue === value) {
      handleClose();
      return;
    }
    if (item) item.defaultValue = value;
    setRows(arr);
    const payload = {
      incontextValue: value,
      propertyId: item?.propertyId,
      propsetPropvalId: item?.propsetPropvalId,
    };
    handleClose();
    if (
      value === 'All Regions' ||
      value === 'All Segments' ||
      value === 'All Industries'
    ) {
      payload.incontextValue = '';
      payload.clearIncontextValue = true;
    }
    switch (type) {
      case 'DEFAULT_MARKET':
        setMsg('Market value successfully updated!');
        break;
      case 'DEFAULT_SEGMENT':
        setMsg('Segment value successfully updated!');
        break;
      case 'DEFAULT_REGION':
        setMsg('Region value successfully updated!');
        break;

      case 'DEFAULT_INDUSTRY':
        setMsg('Industry value successfully updated!');
        break;
    }
    setOpen(true);
    updateConfigPropsetPropval(payload);
  };

  const columns = [
    {
      field: 'propertyName',
      headerName: 'Property Name',
      width: 190,
      sortable: false,
      hideSortIcons: true,
      filterable: false,
      disableColumnMenu: true,
      cellClassName: ' prop-cell',
    },
    {
      field: 'id',
      headerName: 'Context Value',
      width: 350,
      sortable: false,
      hideSortIcons: true,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (props) => {
        return (
          // <ReactSelect
          // isDisabled={isDataLoading}
          // className="basic-single"
          // classNamePrefix="select"
          // placeholder="All Industries"
          // onChange={(value) => this.handleChange('industry', value)}
          // options={[
          //   defaultOption,
          //   ...this.optionGenerator(industryList, 'qualifierId', 'value'),
          // ]}
          // value={industry}
          // />
          <>
            <Button
              className="dropdown-btn"
              onClick={(e) => handleClick(e, props.row?.propertyName)}
              variant="outlined"
            >
              <span className="span">{props.row.defaultValue}</span>
              <ArrowDropDown className="down-icon" />
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <div>
      <DataGrid
        className="filter-table"
        style={{ height: '675px', borderRadius: 0 }}
        columns={columns}
        hideFooter
        rowHeight={65}
        rows={[...rows]?.sort((a, b) => a?.order - b?.order)}
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        classes={{ list: 'filter-menu' }}
        style={{
          marginTop: type === 'DEFAULT_INDUSTRY' ? '0px' : '50px',
          zIndex: 100000000,
          // maxHeight: '250px',
        }}
        onClose={handleClose}
      >
        {options.current?.map((t) => {
          return (
            <MenuItem
              className={classNames({
                'active-item':
                  rows.find((t) => t.propertyName === type)?.defaultValue === t,
              })}
              key={t}
              onClick={() => select(t)}
            >
              {t}
            </MenuItem>
          );
        })}
      </Menu>

      <Snackbar
        style={{ zIndex: 10000000, marginTop: '300px' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openS}
        autoHideDuration={4000}
        onClose={handleCloseS}
      >
        <Alert
          className="alert-msg"
          style={{ background: '#2e7d32' }}
          onClose={handleCloseS}
          severity="success"
          sx={{ width: '100%' }}
        >
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
};
