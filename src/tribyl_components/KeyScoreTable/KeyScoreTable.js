import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import {
  CircularProgress,
  IconButton,
  Popover,
  TextField,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
  Snackbar,
} from '@material-ui/core';
import { Link } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useParams } from 'react-router-dom';
import { Clear, DeleteOutline, Done } from '@material-ui/icons';
import classNames from 'classnames';
import Legend from '../../components/Legend/Legend';
import { getPlaybookCardDetails } from '../../util/promises/playbookcard_details_promise';
import { keywordTooltip } from '../../util/utils';
import Keyword from '../Keyword';
import './KeyScoreTable.style.scss';
import {
  createCardMatchTags,
  deleteCardMatchTags,
} from '../../util/promises/match_tag_promise';
import { isEmpty } from 'lodash';

const DEFAULT_CLASSNAME = 'key-score';

export default function KeyScoreTable({
  keywords: _keywords,
  loadHeuristicData,
  cardId,
  cardInfo,
}) {
  const [isAllKeywordPageOpen, setIsAllKeywordPageOpen] = useState(false);
  const [keywords, setKeyWords] = useState([
    ..._keywords.map((t) => {
      return {
        ...t,
        genertatedBy: cardInfo?.data?.cardTagsList?.find((i) => t.id === i.id)
          ?.source,
      };
    }),
  ]);
  const [keywordSubmitting, setKeywordSubmitting] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(0);
  const [openDelete, setDeletePopup] = useState(false);
  let ref = useRef(null);
  const [id, setIdToDelete] = useState(null);
  const [type, setType] = useState('');
  const label = type === 'del' ? 'Delete' : 'Add new';

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    // setAnchorEl(event.currentTarget);
    setType('add');
    setDeletePopup(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [progress, setProgress] = useState(false);

  const [keywordsList, setKeywordsList] = useState([]);
  const params = useParams();
  const cardScore = keywords.length
    ? keywords[0].heuristicScore?.toFixed(2)
    : '';
  const cardPercentileValue = keywords.length
    ? keywords[0].cardPercentileValue?.toFixed(0)
    : '';

  const formatValue = (params) => {
    return params.value?.toFixed(2);
  };

  const formatKeywords = (params) => {
    if (!params.value) return '';
    return (
      <Tooltip title={`${params.value}`}>
        <Keyword
          isDisabled
          text={params.value}
          source={params.row.genertatedBy}
        />
      </Tooltip>
    );
  };

  const [keywordValue, setKeywordValue] = useState('');

  const onChange = (e) => setKeywordValue(e.target.value);

  const deleteKeyword = (params) => {
    setType('del');
    setKeyword(params.row.text);
    setIdToDelete(params.row.id);
    setDeletePopup(true);
  };

  const del = () => {
    setProgress(true);
    deleteCardMatchTags(id).finally(() => {
      // if (loadHeuristicData) loadHeuristicData();
      let k = [...keywords].filter((t) => t.id !== id);
      setKeyWords(k);
      setProgress(false);
      setDeletePopup(false);
    });
  };

  const Columns = [
    {
      headerName: 'Keywords',
      field: 'text',
      flex: 2,
      renderCell: formatKeywords,
    },
    {
      headerName: 'Overall Score',
      field: 'totalKeywordScore',
      flex: 1,
      renderCell: formatValue,
      description: keywordTooltip['keyword scores'],
      align: 'center',
      headerAlign: 'center',
    },
    {
      headerName: 'Persistence',
      field: 'persistenceScore',
      flex: 1,
      renderCell: formatValue,
      description: keywordTooltip['persistenceScore'],
      align: 'center',
      headerAlign: 'center',
    },
    {
      headerName: 'Originality',
      field: 'originalityScore',
      flex: 1,
      renderCell: formatValue,
      description: keywordTooltip['originalityScore'],
      align: 'center',
      headerAlign: 'center',
    },
    {
      headerName: 'Relevance',
      field: 'relevanceScore',
      flex: 1,
      renderCell: formatValue,
      description: keywordTooltip['relevanceScore'],
      align: 'center',
      headerAlign: 'center',
    },

    {
      headerName: 'Action',
      field: 'convId',
      flex: 1,
      renderCell: (t) => (
        <IconButton
          size="small"
          onClick={() => deleteKeyword(t)}
          disabled={t.row.isDisabled}
          style={{ marginLeft: '-20px' }}
        >
          {!t.row.isLoading && (
            <Tooltip title="Delete keyword">
              <DeleteOutline fontSize="small" color="error" />
            </Tooltip>
          )}
          {t.row.isLoading && (
            <CircularProgress
              style={{ width: '14px', height: '14px' }}
              color="primary"
            />
          )}
        </IconButton>
      ),
      align: 'center',
      headerAlign: 'center',
    },
  ];

  useEffect(() => {
    const getAllKeywords = async () => {
      try {
        const response = await getPlaybookCardDetails(params.cardId);
        const keywordsList = response?.data?.cardTagsList || [];
        setKeywordsList(keywordsList);
      } catch (error) {
        console.error(error);
      }
    };

    getAllKeywords();
  }, []);

  useEffect(() => {
    setKeyWords(
      [..._keywords]
        .map((t) => {
          return {
            ...t,
            genertatedBy: cardInfo?.data?.cardTagsList?.find(
              (i) => t.id === i.id
            )?.source,
          };
        })
        .sort((a, b) => b.convoCount - a.convoCount)
    );
  }, [_keywords]);

  const handleViewAllKeywordsClick = (e) => {
    setIsAllKeywordPageOpen(!isAllKeywordPageOpen);
  };

  const renderDeleteContent = () => {
    return (
      <>
        Are you sure you want to delete the '<strong>{keyword}</strong>' keyword
        ? This will delete matches for this keyword from <strong>All</strong>{' '}
        deals. This action cannot be undone.
      </>
    );
  };

  const addContent = () => {
    return (
      <TextField
        size="small"
        variant="outlined"
        placeholder="Enter new keyword"
        value={keywordValue}
        onChange={onChange}
        focused={true}
        fullWidth
        style={{ marginTop: '10px' }}
      />
    );
  };

  const renderKeywords = () => {
    return keywordsList.map((cardTag, index) => (
      <Keyword
        key={`${cardTag.text}-${index}`}
        isDisabled
        text={cardTag.text}
        source={cardTag.source}
      />
    ));
  };

  const addnewKeyword = () => {
    setProgress(true);

    createCardMatchTags({
      active: true,
      cardId,
      status: 'new',
      subType: null,
      text: keywordValue,
      type: null,
      visible: true,
    }).then((res) => {
      setProgress(false);
      setKeywordValue('');
      const item = {
        id: res?.data?.id,
        text: res?.data?.text,
        convoCount: 1166,
        persistenceTitle: 'Keyword Persistence',
        persistenceScore: 0,
        originalityTitle: 'Keyword Originality',
        originalityScore: 0,
        relevanceScoreTitle: 'Relevance',
        relevanceScore: 0,
        heuristicScoreTitle: 'Heuristic Score',
        heuristicScore: 0,
        cardPercentileTitle: 'Percentile within the Topic',
        cardPercentileValue: 0,
        totalKeywordScoreTitle: 'Total Keyword Score',
        totalKeywordScore: 0,
      };

      const pos = page * size;
      if (pos) {
        const arr1 = keywords.slice(0, pos);
        const arr2 = keywords.slice(pos, keywords.length + 1);
        setKeyWords([...arr1, item, ...arr2]);
      } else setKeyWords([item, ...keywords]);

      setDeletePopup(false);
    });
  };

  return (
    <div className="mb-3">
      <div className={`${DEFAULT_CLASSNAME}-text`}>
        {!isAllKeywordPageOpen && (
          <>
            <strong className="mr-1">Card score: </strong>
            {cardScore || 'pending'}
            <i className="ml-1">
              {cardPercentileValue &&
                `(${moment
                  .localeData()
                  .ordinal(cardPercentileValue)} percentile)`}
            </i>
          </>
        )}
        <Link
          onClick={handleViewAllKeywordsClick}
          color="secondary"
          className={classNames(
            { 'ml-4': !isAllKeywordPageOpen },
            `${DEFAULT_CLASSNAME}-link`
          )}
        >
          {isAllKeywordPageOpen ? 'View Keyword Scores' : 'View All Keywords'}
        </Link>
        <div className="legends">
          <Legend color={'#638421'} text="Manually Entered" />
          <Legend color={'#a2b9c9'} text="Machine Generated" />
        </div>

        {!isAllKeywordPageOpen && (
          <div style={{ flex: 1, textAlign: 'end' }}>
            <Link
              onClick={handleClick}
              color="secondary"
              className={classNames(
                { 'ml-4': !isAllKeywordPageOpen },
                `${DEFAULT_CLASSNAME}-link`,
                'bright'
              )}
            >
              {'Add new Keyword'}
            </Link>
          </div>
        )}
      </div>

      {isAllKeywordPageOpen ? (
        <div>{renderKeywords()}</div>
      ) : (
        <div>
          <DataGrid
            autoHeight
            disableColumnMenu
            disableSelectionOnClick
            disableExtendRowFullflex
            rows={keywords}
            columns={Columns}
            density="compact"
            pageSize={size}
            page={page}
            onPageChange={(p) => {
              setPage(p);
            }}
            onPageSizeChange={(s) => {
              setSize(s);
            }}
            rowsPerPageOptions={[10, 20, 50]}
          />
          <Dialog open={openDelete} onClose={() => setDeletePopup(false)}>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 16px',
                paddingLeft: '24px',
              }}
            >
              <h4 style={{ marginBottom: '0px', fontSize: '20px' }}>
                {label} keyword
              </h4>
              <IconButton onClick={() => setDeletePopup(false)}>
                <Clear />
              </IconButton>
            </Box>
            <Divider />
            <DialogContent style={{ minWidth: '500px' }}>
              {type === 'del' ? renderDeleteContent() : addContent()}
            </DialogContent>
            <DialogActions
              style={{ marginRight: '10px', marginBottom: '10px' }}
            >
              <Button
                size="small"
                variant="outlined"
                onClick={() => setDeletePopup(false)}
              >
                CAncel
              </Button>
              {type === 'add' && (
                <Button
                  startIcon={
                    progress ? (
                      <CircularProgress
                        style={{
                          width: '16px',
                          height: '16px',
                          fill: 'white',
                          color: 'white',
                        }}
                      />
                    ) : (
                      <></>
                    )
                  }
                  style={{
                    backgroundColor: isEmpty(keywordValue.trim())
                      ? 'rgba(0, 0, 0, 0.12)'
                      : '#0080FF',
                    color: isEmpty(keywordValue.trim()) ? 'black' : 'white',
                    marginRight: '6px',
                  }}
                  size="small"
                  variant="contained"
                  onClick={addnewKeyword}
                  disabled={isEmpty(keywordValue.trim())}
                >
                  {progress ? 'Saving' : 'Save'}
                </Button>
              )}

              {type === 'del' && (
                <Button
                  startIcon={
                    progress ? (
                      <CircularProgress
                        style={{
                          width: '16px',
                          height: '16px',
                          fill: 'white',
                          color: 'white',
                        }}
                      />
                    ) : (
                      <></>
                    )
                  }
                  style={{
                    backgroundColor: '#0080FF',
                    color: 'white',
                  }}
                  size="small"
                  variant="contained"
                  onClick={del}
                >
                  {progress ? 'Deleting' : 'PROCEED'}
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}
