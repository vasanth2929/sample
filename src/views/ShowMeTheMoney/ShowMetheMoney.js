import React, {
  Component,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { MainPanel } from '../../basecomponents/MainPanel/MainPanel';
import { Icons } from '../../constants/general';

import ReactHighcharts from 'react-highcharts';
import {
  Box,
  CircularProgress,
  debounce,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Slider,
  Switch,
  Tab,
  Tabs,
} from '@material-ui/core';
import './index.scss';
import { SubtopicCard } from './components/SubtopicCard/SubtopicCard';
import { kpis, painPoints, triggers, cases } from './mocks';
import { Topwins } from './components/Topwins';
import KeywordChart from '../CustomerAnalytics/MessagingTab/components/SummaryCard/Trends/KeywordChart/KeywordChart';
import {
  getConversationAnalysisForStory,
  getKeywordStats,
} from '../../util/promises/match_tag_promise';
import TribylDealCards from '../../tribyl_components/TribylDealCards';
import { getMatchedCardsSummaryForSolution } from '../../util/promises/customer_analysis';
import { ArrowBackIos, Clear } from '@material-ui/icons';
import classNames from 'classnames';
import { Filter } from './components/Filter';
import ReactSelect from 'react-select';
import TimelineChart from '../CustomerAnalytics/MessagingTab/components/SummaryCard/Trends/TimelineChart/TimelineChart';
import {
  getGrowNewLogsSummary,
  getOpptyListDetailsForSolution,
  getClosePeriodDropdownValues,
} from '../../util/promises/show_me_the_money_promises';

const config = {
  chart: {
    zoomType: 'xy',
    backgroundColor: '#F6F8F9',
    height: 384,
  },
  title: {
    text: '',
  },
  xAxis: [
    {
      categories: [
        `Jan'22`,
        `Feb'22`,
        `Mar'22`,
        `Apr'22`,
        `May'22`,
        `Jun'22`,
        `Jul'22`,
        `Aug'22`,
        `Sep'22`,
        `Oct'22`,
        `Nov'22`,
        `Dec'22`,
      ],
      crosshair: true,
    },
  ],
  yAxis: [
    {
      // Primary yAxis
      labels: {
        // format: '{value}°C',
        style: {
          // color: Highcharts.getOptions().colors[1],
        },
      },
      title: {
        text: 'Amount',
        style: {
          // color: Highcharts.getOptions().colors[1],
        },
      },
    },
    {
      // Secondary yAxis
      title: {
        text: 'Deals',
        style: {
          // color: Highcharts.getOptions().colors[0],
        },
      },
      labels: {
        // format: '{value} mm',
        style: {
          // color: Highcharts.getOptions().colors[0],
        },
      },
      opposite: true,
    },
  ],
  tooltip: {
    shared: true,
  },

  legend: {
    enabled: false,
  },
  series: [
    {
      name: 'Amount',
      type: 'column',
      color: '#016AC7',
      borderRadius: 4,
      data: [
        7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6,
      ],
      tooltip: {
        // valueSuffix: '°C',
      },
      custom: [
        'January 2022',
        'Feburary 2022',
        'March 2022',
        'April 2022',
        'May 2022',
        'June 2022',
        'July 2022',
        'August 2022',
        'September 2022',
        'October 2022',
        'November 2022',
        'December 2022',
      ],
    },
    {
      name: 'Deals',
      type: 'line',
      yAxis: 1,
      color: 'black',
      marker: {
        // fillColor: 'white',
      },
      data: [
        49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
        95.6, 54.4,
      ],
      tooltip: {
        // valueSuffix: ' mm',
      },
    },
  ],
};
const Chart = memo(({ onLoad, config }) => {
  return <ReactHighcharts config={config} callback={onLoad} />;
});
const MemoChart = ({ onChange, onDropdownChange }) => {
  const [padding, setPadding] = useState(0);
  const [closePeriodOptions, setClosePeriodOptions] = useState([]);
  const [closePeriods, setClosePeriods] = useState(null);
  const [value, setValue] = React.useState([0, 37]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [step, setStep] = useState();
  const [marks, setMarks] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange({
      startDate: getV(newValue[0])?.label,
      endDate: getV(newValue[1])?.label,
    });
  };
  const onLoad = useCallback((c) => {
    // set the start and end pos of the slider
    const barData = c?.pointer?.chart?.series[0]?.data;
    const labels = c?.pointer?.chart?.series[0]?.userOptions?.custom;
    const length = barData?.length - 1;
    const firstBar = barData[0];
    setPadding(
      +document.querySelector('rect.highcharts-plot-border').getAttribute('x') +
        firstBar.shapeArgs?.x +
        firstBar.shapeArgs.width / 2
    );
    setStep(firstBar.series.closestPointRangePx);
    setValue([0, firstBar.series.closestPointRangePx * length]);
    setMin(0);
    setMax(firstBar.series.closestPointRangePx * length);
    const marks = barData.map((t, i) => {
      return {
        label: labels[i],
        value: i * firstBar.series.closestPointRangePx,
      };
    });
    setMarks(marks);
  }, []);

  const getV = (v) => {
    return marks.find((t) => t.value === v);
  };

  useEffect(() => {
    getClosePeriodDropdownValues().then((res) => {
      const opts = res.data.map((t) => ({
        ...t,
        label: t.picklistLabel,
        value: t.picklistValue,
      }));

      setClosePeriodOptions(opts);
      setClosePeriods(opts?.find((t) => t.defaultFlag) || opts[0]);
    });
  }, []);

  const switchChange = (e) => {
    if (e.target.checked) {
      document
        .querySelector('.highcharts-container')
        .classList.remove('height-for-chart');
      document
        .querySelector('.slider-wrapper')
        .classList.remove('height-for-chart');
      document
        .querySelector('.legend-container')
        .classList.remove('hide-section');
      document.querySelector('.range-value').classList.add('hide-section');
      document
        .querySelector('#closePeriodComp')
        .classList.remove('hide-section');
    } else {
      document
        .querySelector('.highcharts-container')
        .classList.add('height-for-chart');
      document
        .querySelector('.slider-wrapper')
        .classList.add('height-for-chart');
      document.querySelector('.legend-container').classList.add('hide-section');
      document.querySelector('.range-value').classList.remove('hide-section');
      document.querySelector('#closePeriodComp').classList.add('hide-section');
    }
  };
  return (
    <Box bgcolor={'#F6F8F9'}>
      <Box
        className="chart-container max-wrapper"
        pt="24px"
        bgcolor={'#F6F8F9'}
      >
        <Box
          display={'flex'}
          justifyContent="center"
          className="legend-container"
        >
          <Box display={'flex'} alignItems="center" mr="36px">
            <Box
              width={'12px'}
              height={'12px'}
              borderRadius="2px"
              bgcolor={'#016AC7'}
              mr="16px"
            ></Box>
            <span className="legend-label">Amount</span>
          </Box>
          <Box display={'flex'} alignItems="center" mr="36px">
            <Box mr="16px">
              <Box className="legend-circle">
                <Box className="legend-line"></Box>
              </Box>
            </Box>
            <span className="legend-label">Deals</span>
          </Box>
        </Box>

        <Box
          mb="24px"
          display={'flex'}
          justifyContent="center"
          className="range-value hide-section"
          style={{ fontFamily: 'Roboto-Regular', fontSize: '18px' }}
        >
          {getV(value[0])?.label}
          <Box mx={'10px'}>to</Box>
          {getV(value[1])?.label}
        </Box>
        <ReactSelect
          id="closePeriodComp"
          className="field"
          classNamePrefix="field"
          options={closePeriodOptions}
          value={closePeriods}
          onChange={(v) => {
            setClosePeriods(v);
            onDropdownChange(v);
          }}
        />

        <Box className="chart-toggler">
          <Switch size="small" onChange={switchChange} defaultChecked />
          <span className="txt">Show graph</span>
        </Box>
        <Chart onLoad={onLoad} config={config} />

        <div
          style={{ paddingLeft: `${padding}px`, paddingRight: `${padding}px` }}
          className="slider-wrapper"
        >
          <Slider
            min={min}
            max={max}
            marks={marks}
            step={step}
            value={value}
            onChange={handleChange}
            className="slider-chart"
            classes={{ markLabel: 'mark-label' }}
          />
        </div>
      </Box>
    </Box>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
export default class ShowMeTheMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMarketid: null,
      ActiveTabIndex: 0,
      d: 0,
      tab: 0,
      keywords: [],
      modalTab: 0,
      modalOpen: false,
      deals: [],
      dealLoading: false,
      keywordLoading: false,
      activeTopic: 'use-cases',
      loadMore: false,
      conv: [],
      sortOptions: [
        {
          label: 'Amount',
          value: 'sort_by_amount',
          sortBy: 'desc',
        },
        {
          label: 'Count',
          value: 'sort_by_deals',
          sortBy: 'desc',
        },
      ],
      sort: {
        label: 'Amount',
        value: 'sort_by_amount',
        sortBy: 'desc',
      },
      filterData: null,
      useCasesData: {
        topPerformers: [],
        bottomPerformers: [],
        trending: [],
      },
      isSubTopicLoading: false,
      topDealsLoading: false,
      topDealsData: [],
      lastQueryForTopWins: '',
    };
  }

  focus = (e) => {
    e.preventDefault();

    const ele = document.getElementById(e.target.dataset.ele);

    if (e.target.classList.contains('ext')) {
      document.querySelector('.extra-content').classList.add('add-height');
      scrollTo({
        top: ele?.getBoundingClientRect().y - 100,
        behavior: 'smooth',
      });
      this.setState({ loadMore: true });
      return;
    }
    const bounds = ele?.getBoundingClientRect();
    this.setState({ activeTopic: e.target.dataset.ele });
    let offset = 0;
    switch (e.target.dataset.ele) {
      case 'use-cases':
        offset = 100;
        break;
      case 'pain-points':
        offset = 200;
        break;
      case 'kpis':
        offset = 100;
        break;
      case 'triggers':
        offset = 100;
    }
    scrollTo({ top: bounds.y - offset, behavior: 'smooth' });
    ele.parentElement.classList.add('active-container');

    setTimeout(() => {
      ele.parentElement.classList.remove('active-container');
    }, 4000);
  };

  fetchTopWinsData = (data) => {
    this.setState({ topDealsLoading: true });
    const params = new URLSearchParams();
    params.append('salesPlayId', data?.market.value);
    params.append('VerifiedCardsOnly', 'Most Relevant');
    params.append('analyze', 'closed opptys');
    params.append('crmOpptyType', data.opptyType.value);
    params.append('startDate', data?.startDate || '2022-05-01');
    params.append('endDate', data?.endDate || '2022-06-01');
    params.append('opptystatus', 'Closed Won');
    if (data?.region?.value) {
      params.append('regionList', [data?.region?.value]);
    }
    if (data?.competitor?.value) {
      params.append('competitorCardId', data?.competitor?.value);
    }
    if (data?.segment?.value) {
      params.append('segmentList', [data?.segment?.value]);
    }
    if (data?.industry?.value) {
      params.append('industryList', [data?.industry?.value]);
    }
    if (this.state.lastQueryForTopWins === params.toString()) {
      this.setState({
        topDealsLoading: false,
      });
      return;
    }
    getOpptyListDetailsForSolution(params.toString()).then((res) => {
      this.setState({
        topDealsLoading: false,
        topDealsData: res?.data || [],
        lastQueryForTopWins: params.toString(),
      });
    });
  };

  handleChange = (event, newValue) => {
    if (newValue === 1) {
      this.fetchTopWinsData(this.state.filterData);
    }
    this.setState({ tab: newValue });
  };

  handleChangeModalTab = (event, newValue) => {
    if (newValue === 1 && this.state.conv.length === 0) {
      this.getConv();
    }
    if (newValue === 2 && this.state.deals.length === 0) {
      this.getDeals();
    }
    this.setState({ modalTab: newValue });
  };

  getKeyWordData = () => {
    this.setState({ keywordLoading: true, modalOpen: true });
    getKeywordStats({
      // storyIdList: this.props.card.storyBeanList.map((i) => i.id),
      cardId: 44,
    }).then((t) => {
      this.setState({ keywords: t.data, keywordLoading: false });
    });
  };

  getConv = () => {
    this.setState({ convLoading: true, modalOpen: true });
    getConversationAnalysisForStory({
      storyIdList: [
        385, 1432, 51, 727, 418, 539, 754, 382, 1615, 1840, 297, 394, 1866, 482,
        456, 502, 1735, 761, 1320, 763, 403, 296, 495, 1805, 1859, 513, 440,
        758, 1628, 765, 514, 371, 503, 464, 1778, 1804, 1725, 1353, 543, 2430,
        1782, 2394, 459, 1763, 759, 1741, 2440,
      ],
    }).then((t) => {
      this.setState({ conv: t.data, convLoading: false });
    });
  };

  getDeals = () => {
    this.setState({ dealLoading: true });
    getMatchedCardsSummaryForSolution(
      'Use Cases',
      [],
      [
        {
          name: 'salesPlayId',
          value: 1,
        },
        {
          name: 'opptystatus',
          value: 'Closed Won',
        },
        {
          name: 'VerifiedCardsOnly',
          value: 'Most Relevant',
        },
        {
          name: 'closePeriod',
          value: 'LAST_12_MONTHS',
        },
        {
          name: 'crmOpptyType',
          value: 'All',
        },
        {
          name: 'sortCriteria',
          value: 'sort_by_amount',
        },
        {
          name: 'sortOrder',
          value: 'desc',
        },
      ]
    ).then((t) => {
      this.setState({
        deals: t.data?.playbookCards[0]?.storyBeanList,
        dealLoading: false,
      });
    });
  };

  toggleModal = (modalOpen) => {
    this.setState({ modalOpen });
  };

  onFilterChange = (data) => {
    const params = new URLSearchParams();
    params.append('salesPlayId', data?.market.value);
    params.append('subTopicList', 'Use Cases');
    params.append('VerifiedCardsOnly', 'Most Relevant');
    params.append('sortCriteria', this.state.sort.value);
    params.append('sortOrder', this.state.sort.sortBy);
    params.append('analyze', 'closed opptys');
    params.append('isTestCard', 'N');
    params.append('crmOpptyType', data.opptyType.value);
    if (data?.region?.value) {
      params.append('regionList', [data?.region?.value]);
    }
    if (data?.competitor?.value) {
      params.append('competitorCardId', data?.competitor?.value);
    }
    if (data?.segment?.value) {
      params.append('segmentList', [data?.segment?.value]);
    }
    if (data?.industry?.value) {
      params.append('industryList', [data?.industry?.value]);
    }
    params.append('closePeriod', data?.closePeriod?.value || 'LAST_12_MONTHS');
    this.setState({ filterData: { ...data, sort: this.state.sort } });
    if (this.state.tab === 0) {
      this.setState({ isSubTopicLoading: false });
      // getGrowNewLogsSummary(params.toString()).then((res) => {
      //   const data = res.data?.playbookCards;
      //   const trendingSummary = res.data?.trendingSummary;
      //   console.log(data.find((t) => t.id === trendingSummary[0].cardId));
      //   const useCasesRaw = data.filter((t) => t.topicName === 'Use Cases');
      //   const firstThree = useCasesRaw.slice(0, 3);
      //   const lastThree = useCasesRaw.slice(
      //     useCasesRaw.length - 3,
      //     useCasesRaw.length
      //   );
      //   this.setState({
      //     useCasesData: {
      //       topPerformers: firstThree.map((t) => ({
      //         cardTitle: t.name,
      //         amount: t.totalOpptyAmount,
      //         days: t.totalOpptyCountForCard,
      //       })),
      //       bottomPerformers: lastThree.map((t) => ({
      //         cardTitle: t.name,
      //         amount: t.totalOpptyAmount,
      //         days: t.totalOpptyCountForCard,
      //       })),
      //       trending: cases.trending,
      //     },
      //     isSubTopicLoading: false,
      //   });
      // });
    } else {
      this.fetchTopWinsData(data);
    }
  };

  onDateSliderChange = (v) => {
    return;
    this.fetchTopWinsData({ ...this.state.filterData, ...v });
  };

  render() {
    return (
      <div>
        <MainPanel
          noSidebar
          viewName="Show me the Money"
          icons={[Icons.MAINMENU]}
          handleIconClick={this.handleHeaderIconClick}
        >
          <Box>
            {/*Topbar*/}
            <Box
              className="top-nav max-wrapper"
              my={'16px'}
              display="flex"
              alignItems={'center'}
            >
              <Box
                width={'32px'}
                height={'32px'}
                borderRadius="50%"
                bgcolor={'#E9EBEE'}
                display="flex"
                justifyContent={'center'}
                alignItems="center"
              >
                <ArrowBackIos className="icon" />
              </Box>

              <p className="page-title">Grow New Logos</p>
            </Box>

            {/*Filter*/}
            <Filter className="max-wrapper" onChange={this.onFilterChange} />

            <Box>
              <Box mt={'20px'}>
                <MemoChart
                  onChange={debounce(this.onDateSliderChange, 800)}
                  onDropdownChange={(v) =>
                    this.onFilterChange({
                      ...this.state.filterData,
                      closePeriod: v,
                    })
                  }
                />
              </Box>

              <Box className="max-wrapper" mt="24px">
                <Tabs
                  className="modal-tab add-border "
                  value={this.state.tab}
                  onChange={this.handleChange}
                >
                  <Tab className="tab-label" label="Buyer Insights"></Tab>
                  <Tab className="tab-label" label="Top Deals"></Tab>
                </Tabs>
              </Box>

              <TabPanel value={this.state.tab} index={0}>
                {this.state.isSubTopicLoading && (
                  <Box
                    mt="24px"
                    className="max-wrapper"
                    display={'flex'}
                    justifyContent="center"
                    alignItems={'center'}
                    height={150}
                  >
                    <CircularProgress />
                  </Box>
                )}
                {!this.state.isSubTopicLoading && (
                  <Box mt="24px" className="max-wrapper">
                    <Box
                      display={'flex'}
                      justifyContent="space-between"
                      alignItems={'center'}
                      mb="24px"
                      position={'relative'}
                    >
                      <Box display={'flex'}>
                        <a
                          data-ele="use-cases"
                          href="#use-cases"
                          onClick={this.focus}
                          className={classNames('chips', {
                            active: this.state.activeTopic === 'use-cases',
                          })}
                        >
                          Use Cases
                        </a>
                        <a
                          data-ele="pain-points"
                          href="#pain-points"
                          onClick={this.focus}
                          className={classNames('chips', {
                            active: this.state.activeTopic === 'pain-points',
                          })}
                        >
                          Pain Points
                        </a>
                        <a
                          data-ele="kpis"
                          href="#kpis"
                          onClick={this.focus}
                          className={classNames('chips', {
                            active: this.state.activeTopic === 'kpis',
                          })}
                        >
                          KPIs
                        </a>
                        <a
                          data-ele="triggers"
                          href="#triggers"
                          onClick={this.focus}
                          className={classNames('chips', {
                            active: this.state.activeTopic === 'triggers',
                          })}
                        >
                          Triggers
                        </a>

                        <a
                          data-ele="product"
                          href="#product"
                          onClick={this.focus}
                          className={classNames('chips ext', {
                            active: this.state.activeTopic === 'product',
                          })}
                        >
                          Product
                        </a>

                        <a
                          data-ele="positioning"
                          href="#positioning"
                          onClick={this.focus}
                          className={classNames('chips ext', {
                            active: this.state.activeTopic === 'positioning',
                          })}
                        >
                          Positioning
                        </a>

                        <a
                          data-ele="pricing"
                          href="#pricing"
                          onClick={this.focus}
                          className={classNames('chips ext', {
                            active: this.state.activeTopic === 'pricing',
                          })}
                        >
                          Pricing
                        </a>

                        <a
                          data-ele="success"
                          href="#success"
                          onClick={this.focus}
                          className={classNames('chips ext', {
                            active: this.state.activeTopic === 'success',
                          })}
                        >
                          Success
                        </a>
                      </Box>

                      <ReactSelect
                        className="field"
                        classNamePrefix="field"
                        id="sort-field"
                        value={this.state.sort}
                        onChange={(v) => {
                          this.setState({ sort: v }, () => {
                            this.onFilterChange(this.state.filterData);
                          });
                        }}
                        options={this.state.sortOptions}
                      />
                    </Box>

                    <Box className="all-subtopic-wrapper">
                      <SubtopicCard
                        onClick={this.getKeyWordData}
                        id="use-cases"
                        title={'Use Cases'}
                        filterData={this.state.filterData}
                        topicName="Use Cases"
                      />

                      <SubtopicCard
                        id="pain-points"
                        title={'Pain Points'}
                        filterData={this.state.filterData}
                        topicName="Pain Points"
                      />

                      <SubtopicCard
                        id="kpis"
                        title={'KPIs'}
                        topicName="KPI"
                        filterData={this.state.filterData}
                      />

                      <SubtopicCard
                        id="triggers"
                        title={'Triggers'}
                        filterData={this.state.filterData}
                        topicName="compelling_event"
                      />

                      {
                        <Box
                          className={classNames('extra-content', {
                            'add-height': this.state.loadMore,
                          })}
                        >
                          <SubtopicCard
                            id="product"
                            title={'Product'}
                            topicName="product"
                            filterData={this.state.filterData}
                          />

                          <SubtopicCard
                            id="positioning"
                            title={'Positioning'}
                            data={triggers}
                            topicName="positioning"
                            filterData={this.state.filterData}
                          />

                          <SubtopicCard
                            id="pricing"
                            title={'Pricing'}
                            data={triggers}
                            topicName="pricing"
                            filterData={this.state.filterData}
                          />

                          <SubtopicCard
                            id="success"
                            title={'Success'}
                            data={triggers}
                            topicName="success"
                            filterData={this.state.filterData}
                          />
                        </Box>
                      }
                      {!this.state.loadMore && (
                        <p
                          onClick={() => this.setState({ loadMore: true })}
                          style={{
                            marginBottom: '0px',
                            paddingLeft: '24px',
                            color: '#0080ff',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          See more
                        </p>
                      )}
                    </Box>
                  </Box>
                )}
              </TabPanel>
              <TabPanel value={this.state.tab} index={1}>
                {this.state.topDealsLoading && (
                  <Box
                    mt="24px"
                    className="max-wrapper"
                    display={'flex'}
                    justifyContent="center"
                    alignItems={'center'}
                    height={150}
                  >
                    <CircularProgress />
                  </Box>
                )}
                {!this.state.topDealsLoading && (
                  <Box p={'20px'} className="max-wrapper">
                    <Topwins rows={this.state.topDealsData} />
                  </Box>
                )}
              </TabPanel>
            </Box>

            <Dialog
              open={this.state.modalOpen}
              onClose={() => this.toggleModal(false)}
              classes={{ paper: 'card-detail-modal-content' }}
            >
              <Box
                p="8px 16px"
                display={'flex'}
                justifyContent="space-between"
                alignItems={'center'}
              >
                <h3 style={{ marginBottom: '0px', fontSize: '20px' }}>
                  Executive Dashboarding
                </h3>

                <IconButton onClick={() => this.toggleModal(false)}>
                  <Clear />
                </IconButton>
              </Box>
              <Divider />
              <DialogContent style={{ width: 1200 }}>
                <Tabs
                  value={this.state.modalTab}
                  onChange={this.handleChangeModalTab}
                  className="modal-tab"
                >
                  <Tab className="tab-label" label="Keywords"></Tab>
                  <Tab className="tab-label" label="Conversations"></Tab>
                  <Tab className="tab-label" label="Deals"></Tab>
                </Tabs>

                <TabPanel value={this.state.modalTab} index={0}>
                  {this.state.keywordLoading ? (
                    <Box
                      display={'flex'}
                      justifyContent="center"
                      alignItems={'center'}
                      height={430}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <KeywordChart data={this.state.keywords} />
                  )}
                </TabPanel>

                <TabPanel value={this.state.modalTab} index={1}>
                  {this.state.convLoading ? (
                    <Box
                      display={'flex'}
                      justifyContent="center"
                      alignItems={'center'}
                      height={430}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TimelineChart
                      data={this.state.conv}
                      visualizeAs={'Conversations'}
                      yaxisAs={'Closed amount'}
                    />
                    // <KeywordChart data={this.state.keywords} />
                  )}
                </TabPanel>

                <TabPanel value={this.state.modalTab} index={2}>
                  {this.state.dealLoading ? (
                    <Box
                      display={'flex'}
                      justifyContent="center"
                      alignItems={'center'}
                      height={430}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box mt="20px">
                      <TribylDealCards
                        isOutlined
                        gridSize={4}
                        cards={this.state.deals}
                      />
                    </Box>
                  )}
                </TabPanel>
              </DialogContent>
            </Dialog>
          </Box>
        </MainPanel>
      </div>
    );
  }
}
