import { Box, Button, CircularProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { saveAs } from 'file-saver';
import moment from 'moment';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { exportPlaybookCardsForMarket } from '../../../../util/promises/playbooks_promise';
import { getUserId } from '../../util';
import './Header.style.scss';

const DEFAULT_CLASSNAME = 'messaging-header';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.defaultStatus,
      searchText: '',
      isDownloading: false,
      msg: '',
      showSnackbar: false,
    };
  }

  hadleSearchChange = (searchString) => {
    this.setState({ searchText: searchString });
  };

  submitSearch = (e) => {
    e.preventDefault();
    const { onSearch } = this.props;
    const { searchText } = this.state;
    if (onSearch) onSearch(searchText);
  };

  clearSearch = () => {
    const { onSearch } = this.props;
    this.setState({ searchText: '' });
    if (onSearch) onSearch('');
  };

  downloadExcel = () => {
    const { market_id, market_name } = this.props;
    this.setState({ isDownloading: true });

    exportPlaybookCardsForMarket(market_id, market_name)
      .then((d) => {
        const blob = new Blob([d.data], {
          type: 'application/octet-stream',
        });
        let fileName =
          market_name + '-' + moment(new Date()).format('YYYY-MM-DD') + '.xlsx';

        saveAs(blob, fileName);
        this.setState({ msg: 'Download successful!' });
      })
      .catch(() => {
        this.setState({ msg: 'Download failed!' });
      })
      .finally(() => {
        this.setState({ isDownloading: false, showSnackbar: true });
      });
  };

  renderSearchAndDownload = (searchText) => {
    return (
      <Box display={'flex'}>
        <Box mr="10px">
          <Button
            onClick={this.downloadExcel}
            style={{
              background: '#0080FF',
              height: 32,
              color: 'white',
              boxShadow: 'none',
              textTransform: 'capitalize',
              fontSize: '15px',
            }}
            variant="contained"
          >
            {this.state.isDownloading ? (
              <>
                <CircularProgress
                  style={{
                    color: 'white',
                    width: '18px',
                    height: '18px',
                    marginRight: '5px',
                  }}
                />
                Downloading
              </>
            ) : (
              'Export'
            )}
          </Button>
        </Box>
        <div className={`${DEFAULT_CLASSNAME}-filter-search`}>
          <input
            className={`${DEFAULT_CLASSNAME}-filter-search-question`}
            placeholder="Search cards"
            value={searchText}
            onKeyPress={(e) => e.key === 'Enter' && this.submitSearch(e)}
            onChange={(e) => this.hadleSearchChange(e.target.value)}
          />
          <React.Fragment>
            <span
              title="Search"
              role="button"
              onClick={this.submitSearch}
              className="material-icons search-icons"
            >
              search
            </span>
            {searchText !== '' && (
              <span
                title="Clear"
                role="button"
                onClick={this.clearSearch}
                className="material-icons search-icons"
              >
                close
              </span>
            )}
          </React.Fragment>
        </div>
      </Box>
    );
  };

  renderFilters = (
    archived,
    live,
    total,
    active,
    filterStatus,
    searchText,
    test,
    myTest
  ) => {
    return (
      <div className={`${DEFAULT_CLASSNAME}-filter`}>
        <div className={`${DEFAULT_CLASSNAME}-filter-options`}>
          <div className={`${DEFAULT_CLASSNAME}-filter-options-status`}>
            <span
              className={active === 'all' ? 'active' : ''}
              onClick={() => {
                filterStatus('');
                this.setState({ active: 'all' });
              }}
              role="link"
            >
              All ({total})
            </span>
            <span
              className={active === 'test' ? 'active' : ''}
              onClick={() => {
                filterStatus('test');
                this.setState({ active: 'test' });
              }}
              role="link"
            >
              Test ({test})
            </span>
            {/* <span
              className={active === 'my_test' ? 'active' : ''}
              onClick={() => {
                filterStatus('my_test');
                this.setState({ active: 'my_test' });
              }}
              role="link"
            >
              My test ({myTest})
            </span> */}
            <span
              className={active === 'final' ? 'active' : ''}
              onClick={() => {
                filterStatus('final');
                this.setState({ active: 'final' });
              }}
              role="link"
            >
              Approved ({live})
            </span>
            <span
              className={active === 'archived' ? 'active' : ''}
              onClick={() => {
                filterStatus('archived');
                this.setState({ active: 'archived' });
              }}
              role="link"
            >
              Archived ({archived})
            </span>
          </div>
        </div>
        {this.renderSearchAndDownload(searchText)}
      </div>
    );
  };

  getTotal = (
    array,
    status,
    testValue = '',
    isEqual = true,
    predicate = undefined
  ) => {
    let filteredArray = [...array].filter((item) => item.name !== 'Partners');
    if (predicate) {
      filteredArray = filteredArray.map((t, i) => {
        return { ...t, cards: filteredArray[i].cards.filter(predicate) };
      });
    }
    if (filteredArray && filteredArray.length > 0) {
      if (status) {
        return filteredArray.reduce(
          (total, item) =>
            (total += item.cards.filter((i) => {
              if (testValue) {
                if (isEqual)
                  return i.status === status && i.isTestCard === testValue;
                else return i.status === status && i.isTestCard !== testValue;
              }

              return i.status === status;
            }).length),
          0
        );
      }
      return filteredArray.reduce(
        (total, item) =>
          (total += item.cards.filter((i) => {
            if (testValue) return i.isTestCard === testValue;
            return true;
          }).length),
        0
      );
    }
    return 0;
  };

  render() {
    const { filterStatus, topicList } = this.props;
    const { active, searchText } = this.state;

    const total = this.getTotal(topicList);
    const liveTotal = this.getTotal(topicList, 'final', 'Y', false);
    const archivedTotal = this.getTotal(topicList, 'archived');
    const test = this.getTotal(topicList, '', 'Y', true, (t) => {
      return t.status !== 'archived';
    });    

    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        <div className={`${DEFAULT_CLASSNAME}-title`}>
          <div className={`${DEFAULT_CLASSNAME}-title-heading`}>
            <Link to="/messaging">
              <span className="material-icons title-edit">
                keyboard_arrow_left
              </span>
            </Link>
            <p className="page-title">{this.props.market_name}</p>
          </div>
        </div>
        {this.renderFilters(
          archivedTotal,
          liveTotal,
          total,
          active,
          filterStatus,
          searchText,
          test
        )}

        <Snackbar
          anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
          open={this.state.showSnackbar}
          onClose={() => this.setState({ showSnackbar: false })}
          message={this.state.msg}
          autoHideDuration={4000}
          style={{ marginLeft: '550px', marginTop: '20px' }}
        >
          <Alert
            onClose={() => this.setState({ showSnackbar: false })}
            style={{
              color: 'white',
              background: this.state.msg.includes('fail')
                ? '#d32f2f'
                : '#2e7d32',
              fill: 'white',
              fontWeight: 'bold',
            }}
            severity="success"
            className="alert-snack"
          >
            {this.state.msg}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default Header;
