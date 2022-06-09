import FileSaver from 'file-saver';
import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { Provider } from 'react-redux';
import { showAlert as showComponentModal } from '../../../../../../components/ComponentModal/ComponentModal';
import {
  addReferencedStoryViewCount,
  createFavouriteStoryForOpptyP,
  removeFavouriteStoryForOpptyP,
} from '../../../../../../util/promises/opptyplan_promise';
import { downloadPdfFile } from '../../../../../../util/promises/tearsheet_promise';
import store from '../../../../../../util/store';
import { getLoggedInUser, getHashValue } from '../../../../../../util/utils';
import { modalService } from '../../../../../../_tribyl/services/modal.service';
import { PitchPlayer } from '../../../../../StoryboardV2/containers/PitchPlayer/PitchPlayer';
import { TearsheetModalTab } from '../../containers/TearSheetModal/TearSheet';
import { showAlert } from './../../../../../../components/MessageModal/MessageModal';
import './styles/StoriesListDataGrid.styles.scss';

class BoldHeaderRenderer extends React.PureComponent {
  render() {
    const textStyle = {
      color: '#000',
      fontSize: '1.125em !important',
      marginBottom: '0',
    };
    return (
      <div>
        <p style={textStyle}>{this.props.value}</p>
      </div>
    );
  }
}

class AccountNameFormatter extends React.PureComponent {
  render() {
    const textStyle = {
      color: '#4D4D4D',
      fontSize: '0.875em !important',
      marginBottom: '0',
      fontFamily: 'Roboto-Bold',
    };
    const displayValue = this.props.value.displayValue || '';
    return (
      <p className="gridText" style={textStyle} title={displayValue}>
        {/* {`${displayValue.slice(0, 11)} ${displayValue.length > 11 ? '...' : ''}`} */}
        {displayValue}
      </p>
    );
  }
}

class TextFormatter extends React.PureComponent {
  getSlicedtext = (type, displayValue) => {
    switch (type) {
      case 'relevance':
        return `${Math.round(displayValue)}%`;
      default:
        return displayValue;
    }
  };
  render() {
    const textStyle = {
      color: '#4D4D4D',
      fontSize: '0.875em !important',
      marginBottom: '0',
    };
    return (
      <p
        className="gridText"
        style={textStyle}
        title={this.props.value.displayValue}
      >
        {/* {this.props.value.displayValue} */}
        {this.getSlicedtext(
          this.props.value.type,
          this.props.value.displayValue
        )}
      </p>
    );
  }
}

class StatusFormatter extends React.PureComponent {
  render() {
    const wonStyle = {
      color: '#29C827',
      fontSize: '0.875em !important',
      marginBottom: '0',
    };
    const lossStyle = {
      color: '#EB5757',
      fontSize: '0.875em !important',
      marginBottom: '0',
    };
    const noDecStyle = {
      color: 'rgb(107, 119, 140)',
      fontSize: '0.875em !important',
      marginBottom: '0',
    };
    if (this.props.value.displayValue === 'Won') {
      return (
        <p className="gridText" style={wonStyle}>
          {this.props.value.displayValue}
        </p>
      );
    } else if (this.props.value.displayValue === 'Loss') {
      return (
        <p className="gridText" style={lossStyle}>
          {this.props.value.displayValue}
        </p>
      );
    }
    return (
      <p className="gridText" style={noDecStyle}>
        {this.props.value.displayValue}
      </p>
    );
  }
}

class FavFormatter extends React.PureComponent {
  createFavouriteStoryForOpptyP = (favouritesCount, opptyPlanId, storyId) => {
    if (favouritesCount < 2) {
      createFavouriteStoryForOpptyP(opptyPlanId, storyId)
        .then(() => {
          this.props.refreshGrid();
        })
        .catch(() => {
          showAlert('Something went wrong!', 'error');
        });
    }
  };

  removeFavouriteStoryForOpptyP = (opptyPlanId, storyId) => {
    removeFavouriteStoryForOpptyP(opptyPlanId, storyId)
      .then(() => {
        this.props.refreshGrid();
      })
      .catch(() => {
        showAlert('Something went wrong!', 'error');
      });
  };

  render() {
    const { rawValue, storyId, opptyPlanId } = this.props.value;
    const enabledStarStyle = {
      color: 'goldenrod',
      cursor: 'pointer',
    };
    const disabledStarStyle = {
      color: 'goldenrod',
      cursor: 'default',
      opacity: '0.5',
    };
    return (
      <div className="text-align-center d-flex">
        {rawValue ? (
          <i
            className="material-icons"
            title="Remove from Favorites"
            style={enabledStarStyle}
            onClick={() =>
              this.removeFavouriteStoryForOpptyP(opptyPlanId, storyId)
            }
            role="button"
          >
            star
          </i>
        ) : (
          <i
            className="material-icons"
            title="Add to Favorites"
            style={
              this.props.value.favouritesCount < 2
                ? enabledStarStyle
                : disabledStarStyle
            }
            onClick={() =>
              this.createFavouriteStoryForOpptyP(
                this.props.value.favouritesCount,
                opptyPlanId,
                storyId
              )
            }
            role="button"
          >
            star_border
          </i>
        )}
      </div>
    );
  }
}

class ViewButtonFormatter extends React.PureComponent {
  state = {
    openModal: false,
  };

  async downloadPdfFile(storyId, accountName, closeYear) {
    // const storyId = value;
    // const strFileName = 'tearsheet_' + storyId + '.pdf';
    const buyingCenter =
      document.getElementsByClassName('sub-view-name')[0].innerText;
    const strFileName = `${accountName}_${buyingCenter}_FY${closeYear}.pdf`
      .split(' ')
      .join('_');
    const download = await downloadPdfFile(storyId);
    const blob = new Blob([download.data], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blob, strFileName);
  }

  handleViewTearSheet = () => {
    const { userId } = getLoggedInUser();
    addReferencedStoryViewCount(
      this.props.value.opptyPlanId,
      this.props.value.storyId,
      userId
    )
      .then()
      .catch(() => {
        showAlert('Unable to add bus stat', 'error');
      })
      .finally(() => {
        const header = (
          <div
            className="header-section"
            id="modal-body-2-header"
            role="button"
          >
            <div className="stories-tearsheet-header">
              <div className="stories-header">Case Study</div>
              <div
                className="primary"
                role="button"
                onClick={() =>
                  this.downloadPdfFile(
                    this.props.value.storyId,
                    this.props.value.accountName,
                    this.props.value.closeYear
                  )
                }
              >
                <i className="material-icons">get_app</i>
                <div>Download</div>
              </div>
            </div>
            <div>
              <i
                id="close-icon"
                className="material-icons close-modal"
                role="button"
                onClick={() => modalService.closeModal()}
              >
                clear
              </i>
            </div>
          </div>
        );
        const body = (
          <TearsheetModalTab
            storyId={this.props.value.storyId}
            accountId={this.props.value.accountId}
          />
        );
        modalService.showModal(
          <Provider store={store}>
            <div className="tearsheet-modal-stories-tab">
              {header}
              {body}
            </div>
          </Provider>,
          () => {}
        );
      });
  };

  navToStory = (storyId) => {
    const { accountId } = this.props.value;
    window.open(
      `/storyDealSummary/storyId/${storyId}/accountId/${getHashValue(
        accountId
      )}`
    );
  };

  render() {
    const { modalView, handleStoryView } = this.props;
    const actionsStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    };
    const buttonStyle = {
      color: '#FFF',
      marginBottom: '0',
      borderRadius: '5px',
      background: '#0080FF',
      fontSize: '14px',
      boxShadow: 'none',
      borderColor: 'transparent',
      height: '32px',
    };
    if (modalView) buttonStyle.marginLeft = '-5px';
    return (
      <div className="grid-actions" style={actionsStyle}>
        {
          <button
            className="btn view-tearsheet-btn"
            style={buttonStyle}
            onClick={this.handleViewTearSheet}
          >
            View
          </button>
        }
        {
          <ViewStoryButton
            story={this.props.value.story}
            modalView={modalView}
            handleStoryView={handleStoryView}
            value={{
              storyId: this.props.value.storyId,
              accountId: this.props.value.accountId,
            }}
          />
        }
        {!modalView && (
          <PlayButtonFormatter
            value={{ videoFile: this.props.value.videoFile }}
          />
        )}
      </div>
    );
  }
}

class ViewStoryButton extends React.PureComponent {
  navToStory = (storyId) => {
    const { accountId } = this.props.value;
    window.open(
      `/storyDealSummary/storyId/${storyId}/accountId/${getHashValue(
        accountId
      )}`
    );
  };
  render() {
    const buttonStyle = {
      background: 'transparent',
      boxShadow: 'none',
      borderRadius: '4px',
      border: 'thin solid #5F6C72',
      cursor: 'pointer',
      height: '32px',
    };
    const iconStyle = {
      marginRight: '0px',
      position: 'relative',
      fontSize: '21px',
      top: '4px',
      left: '0px',
      color: '#5F6C72',
      cursor: 'pointer',
    };
    return (
      <button
        className="view-story-btn"
        title="View Story"
        style={buttonStyle}
        role="link"
        onClick={() => this.navToStory(this.props.value.storyId)}
      >
        <svg
          style={iconStyle}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.2222 14.2222H1.77778V1.77778H8V0H1.77778C0.795556 0 0 0.795556 0 1.77778V14.2222C0 15.2044 0.795556 16 1.77778 16H14.2222C15.2044 16 16 15.2044 16 14.2222V8H14.2222V14.2222ZM9.77778 0V1.77778H12.9644L4.22667 10.5156L5.48444 11.7733L14.2222 3.03556V6.22222H16V0H9.77778Z"
            fill="#B0BEC5"
          />
        </svg>
      </button>
    );
  }
}

class PlayButtonFormatter extends React.PureComponent {
  showPitchVideo = (videoFile) => {
    const pitchPlayerModal = (
      <PitchPlayer
        onLoadStart={(event) => (event.target.style.display = 'none')} // eslint-disable-line
        onCanPlay={(event) => (event.target.style.display = 'inline')} // eslint-disable-line
        pitchVideo={'tribyl/api/video?location=' + videoFile}
        onHide={() => {}}
      />
    );
    showComponentModal(
      'Elevator Pitch',
      pitchPlayerModal,
      'pitch-player-modal',
      () => {
        this.showDetailModal(false);
      }
    );
  };

  render() {
    const buttonStyle = {
      background: 'transparent',
      boxShadow: 'none',
      borderRadius: '4px',
      border: 'thin solid #5F6C72',
      cursor: 'pointer',
      height: '32px',
    };
    const iconStyle = {
      marginRight: '0',
      position: 'relative',
      top: '3px',
      color: '#27AE60',
      cursor: 'pointer',
    };
    const inActive = {
      marginRight: '0',
      position: 'relative',
      top: '3px',
      color: '#5F6C72',
      cursor: 'default',
    };
    return (
      <button
        className="play-video-btn"
        title="Play Video"
        style={buttonStyle}
        role="link"
        onClick={
          this.props.value.videoFile
            ? () => this.showPitchVideo(this.props.value.videoFile)
            : () => {}
        }
      >
        <i
          className="material-icons"
          style={this.props.value.videoFile ? iconStyle : inActive}
        >
          play_circle_filled
        </i>
      </button>
    );
  }
}

export class StoriesListDataGrid extends React.PureComponent {
  constructor(props) {
    super(props);
    const { modalView, refreshGrid } = this.props;
    this.gridColumns = !modalView
      ? [
          {
            key: 'accountName',
            name: 'Account',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Account" />,
            formatter: AccountNameFormatter,
            // width: 120
          },
          {
            key: 'accountIndustry',
            name: 'Industry',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Industry" />,
            formatter: TextFormatter,
            width: 140,
          },
          {
            key: 'oppStatus',
            name: 'Status',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Status" />,
            formatter: StatusFormatter,
            width: 80,
          },
          {
            key: 'fsYearQuarter',
            name: 'Period',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Period" />,
            formatter: TextFormatter,
            width: 85,
          },
          {
            key: 'opportunityAmount',
            name: 'Amount',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Amount" />,
            formatter: TextFormatter,
            width: 110,
          },
          {
            key: 'solution',
            name: 'Solution',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Solution" />,
            formatter: TextFormatter,
            width: 120,
          },
          {
            key: 'accountOwner',
            name: 'Owner',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Owner" />,
            formatter: TextFormatter,
            width: 120,
          },
          {
            key: 'shareStatus',
            name: 'Share Status',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Share Status" />,
            formatter: StatusFormatter,
            width: 110,
          },
          {
            key: 'relevance',
            name: 'Relavance',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Relevance" />,
            formatter: TextFormatter,
            width: 100,
          },
          {
            key: 'favourite',
            name: 'Fav',
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Fav" />,
            formatter: <FavFormatter refreshGrid={refreshGrid} />,
            width: 60,
          },
          {
            key: 'viewButton',
            name: '',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="" />,
            formatter: (
              <ViewButtonFormatter
                modalView={this.props.modalView}
                handleStoryView={this.props.handleStoryView}
              />
            ),
            width: 160,
          },
        ]
      : [
          {
            key: 'accountName',
            name: 'Account',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Account" />,
            formatter: AccountNameFormatter,
            width: 180,
          },
          {
            key: 'accountIndustry',
            name: 'Industry',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Industry" />,
            formatter: TextFormatter,
            width: 180,
          },
          {
            key: 'oppStatus',
            name: 'Status',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Status" />,
            formatter: StatusFormatter,
            width: 90,
          },
          {
            key: 'fsYearQuarter',
            name: 'Period',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Period" />,
            formatter: TextFormatter,
            width: 90,
          },
          {
            key: 'opportunityAmount',
            name: 'Amount',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Amount" />,
            formatter: TextFormatter,
            width: 100,
          },
          {
            key: 'shareStatus',
            name: 'Share Status',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="Share Status" />,
            formatter: TextFormatter,
            width: 105,
          },
          {
            key: 'viewButton',
            name: '',
            sortable: true,
            resizable: true,
            headerRenderer: <BoldHeaderRenderer value="" />,
            formatter: (
              <ViewButtonFormatter
                modalView={this.props.modalView}
                handleStoryView={this.props.handleStoryView}
              />
            ),
            width: 120,
          },
        ];
    const originalRows = this.props.stories.map((item) => {
      let shareStatusLabel = '';
      if (item.shareStatus === 'share-external-complete') {
        shareStatusLabel = 'External';
      } else if (item.shareStatus === 'share-internal') {
        shareStatusLabel = 'Internal';
      } else if (item.shareStatus === 'share-external-restricted') {
        shareStatusLabel = 'Limited';
      }
      let oppStatusLabel = '';
      if (item.oppStatus === 'closed-won') {
        oppStatusLabel = 'Won';
      } else if (item.oppStatus === 'closed-lost') {
        oppStatusLabel = 'Loss';
      } else if (item.oppStatus === 'no-decision') {
        oppStatusLabel = 'No Decision';
      }
      return {
        accountName: {
          displayValue: item.accountName,
          type: 'accountName',
        },
        name: {
          displayValue: item.name,
          type: 'name',
        },
        accountIndustry: {
          displayValue: item.accountIndustry,
          type: 'accountindustry',
        },
        oppStatus: {
          displayValue: oppStatusLabel,
          type: 'oppStatus',
        },
        fsYearQuarter: {
          displayValue: `${item.closeQtr || ''} ${item.closeYear || ''}`,
          year: item.closeYear || '',
          quarter: item.closeQtr || '',
          quarternum: item.quarternum,
          type: 'fsYearQuarter',
        },
        opportunityAmount: {
          displayValue: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          })
            .format(item.opportunityAmount || 0)
            .slice(0, -3),
          rawValue: item.opportunityAmount,
          type: 'opportunityAmount',
        },
        salesPlay: {
          displayValue:
            item.salesPlays && item.salesPlays.length > 0
              ? item.salesPlays[0]
              : '',
          type: 'salesPlay',
        },
        accountOwner: {
          displayValue: item.accountOwner,
          type: 'accountOwner',
        },
        shareStatus: {
          displayValue: shareStatusLabel,
          type: 'shareStatus',
        },
        relevance: {
          displayValue: item.scoreForOpptyPlan,
          rawValue: item.scoreForOpptyPlan,
          type: 'relevance',
        },
        favourite: {
          rawValue: item.favouriteStory,
          storyId: item.id,
          opptyPlanId: this.props.opptyPlanId,
          favouritesCount: this.props.stories.filter(
            (story) => story.favouriteStory
          ).length,
        },
        viewButton: {
          story: item,
          storyId: item.id,
          storyName: item.name,
          amount: item.opportunityAmount,
          status: oppStatusLabel,
          closePeriod: item.fsYearQuater,
          videoFile: item.videoFile,
          accountId: item.accountId,
          accountName: item.accountName,
          closeYear: item.closeYear,
          opptyPlanId: this.props.opptyPlanId,
          rawValue: item.favouriteStory,
          favouritesCount: this.props.stories.filter(
            (story) => story.favouriteStory
          ).length,
        },
        downloadTearsheet: { storyId: item.id, videoFile: item.videoFile },
        playButton: { videoFile: item.videoFile },
      };
    });
    const rows = originalRows.slice(0);
    this.state = {
      originalRows,
      rows,
    };
    this.gridSort = this.gridSort.bind(this);
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.stories !== this.props.stories) {
      const originalRows = this.props.stories.map((item) => {
        let shareStatusLabel = '';
        if (item.shareStatus === 'share-external-complete') {
          shareStatusLabel = 'External';
        } else if (item.shareStatus === 'share-internal') {
          shareStatusLabel = 'Internal';
        } else if (item.shareStatus === 'share-external-restricted') {
          shareStatusLabel = 'Limited';
        }
        let oppStatusLabel = '';
        if (item.oppStatus === 'closed-won') {
          oppStatusLabel = 'Won';
        } else if (item.oppStatus === 'closed-lost') {
          oppStatusLabel = 'Loss';
        } else if (item.oppStatus === 'no-decision') {
          oppStatusLabel = 'No Decision';
        }
        return {
          accountName: {
            displayValue: item.accountName,
            type: 'accountName',
          },
          accountIndustry: {
            displayValue: item.accountIndustry,
            type: 'accountIndustry',
          },
          oppStatus: {
            displayValue: oppStatusLabel,
            type: 'oppStatus',
          },
          fsYearQuarter: {
            displayValue: `${item.closeQtr || ''} ${item.closeYear || ''}`,
            year: item.closeYear || '',
            quarter: item.closeQtr || '',
            quarternum: item.quarternum,
            type: 'fsYearQuarter',
          },
          opportunityAmount: {
            displayValue: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            })
              .format(item.opportunityAmount || 0)
              .slice(0, -3),
            rawValue: item.opportunityAmount,
            type: 'opportunityAmount',
          },
          salesPlay: {
            displayValue:
              item.salesPlays && item.salesPlays.length > 0
                ? item.salesPlays[0]
                : '',
            type: 'salesPlay',
          },
          accountOwner: {
            displayValue: item.accountOwner,
            type: 'accountOwner',
          },
          shareStatus: {
            displayValue: shareStatusLabel,
            type: 'shareStatus',
          },
          relevance: {
            displayValue: item.scoreForOpptyPlan,
            rawValue: item.scoreForOpptyPlan,
            type: 'relevance',
          },
          favourite: {
            rawValue: item.favouriteStory,
            storyId: item.id,
            opptyPlanId: this.props.opptyPlanId,
            favouritesCount: this.props.stories.filter(
              (story) => story.favouriteStory
            ).length,
          },
          viewButton: {
            story: item,
            storyId: item.id,
            storyName: item.accountIndustry,
            amount: item.opportunityAmount,
            status: oppStatusLabel,
            closePeriod: item.fsYearQuater,
            videoFile: item.videoFile,
            accountId: item.accountId,
            accountName: item.accountName,
            closeYear: item.closeYear,
            opptyPlanId: this.props.opptyPlanId,
            rawValue: item.favouriteStory,
            favouritesCount: this.props.stories.filter(
              (story) => story.favouriteStory
            ).length,
          },
          downloadTearsheet: { storyId: item.id, videoFile: item.videoFile },
          playButton: { videoFile: item.videoFile },
        };
      });
      const rows = originalRows.slice(0);
      this.setState({ originalRows, rows });
    }
  };

  rowGetter = (index) => {
    return this.state.rows[index];
  };

  gridSort = (sortColumn, sortDirection) => {
    let sortFunction;
    switch (sortColumn) {
      case 'accountName':
      case 'name':
      case 'accountIndustry':
      case 'accountOwner':
      case 'shareStatus':
      case 'oppStatus':
      case 'salesPlay':
        sortFunction = this.alphabeticalSorter(sortColumn, sortDirection);
        break;
      case 'opportunityAmount':
      case 'relevance':
        sortFunction = this.numberSorter(sortColumn, sortDirection);
        break;
      case 'fsYearQuarter':
        sortFunction = this.fiscalDateSorter(sortColumn, sortDirection);
        break;
      default:
        break;
    }
    const rows =
      sortDirection === 'NONE'
        ? this.state.originalRows.concat()
        : this.state.rows.concat().sort(sortFunction);
    this.setState({ rows });
  };

  alphabeticalSorter = (column, direction) => {
    const comparer = (a, b) => {
      if (direction === 'ASC') {
        return a[column].displayValue.toLowerCase() >
          b[column].displayValue.toLowerCase()
          ? 1
          : -1;
      } else if (direction === 'DESC') {
        return a[column].displayValue.toLowerCase() <
          b[column].displayValue.toLowerCase()
          ? 1
          : -1;
      }
      return 0;
    };
    return comparer;
  };

  numberSorter = (column, direction) => {
    const comparer = (a, b) => {
      if (direction === 'ASC') {
        return a[column].rawValue - b[column].rawValue;
      } else if (direction === 'DESC') {
        return b[column].rawValue - a[column].rawValue;
      }
      return 0;
    };
    return comparer;
  };

  fiscalDateSorter = (column, direction) => {
    const comparer = (a, b) => {
      if (direction === 'ASC') {
        return a[column].quarternum - b[column].quarternum;
      } else if (direction === 'DESC') {
        return b[column].quarternum - a[column].quarternum;
      }
      return 0;
    };
    return comparer;
  };

  render() {
    return (
      <section className="stories-data-grid">
        <ReactDataGrid
          columns={this.gridColumns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={
            this.state.rows.length * 60 + 60 < 662
              ? this.state.rows.length * 60 + 60
              : 662
          }
          // minWidth={this.props.minWidth || 1160}
          rowHeight={60}
          onGridSort={this.gridSort}
          rows={this.state.rows}
        />
      </section>
    );
  }
}
