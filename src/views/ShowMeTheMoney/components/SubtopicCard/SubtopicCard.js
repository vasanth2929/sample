import React, { useEffect, useState } from 'react';
import './index.scss';
import {
  TrendingDownRounded,
  TrendingUpRounded,
  StraightenSharp,
  ArrowDownwardSharp,
} from '@material-ui/icons';

import { Box, CircularProgress } from '@material-ui/core';
import classNames from 'classnames';
import { ShortNumber } from '../../../../util/utils';
import { getGrowNewLogsSummary } from '../../../../util/promises/show_me_the_money_promises';

const RenderIcon = ({ keyName }) => {
  switch (keyName) {
    case 'topPerformers':
      return (
        <>
          <Box className="card-icon-wrapper top">
            <span className="material-icons">north</span>
          </Box>
          <p className="card-title">Top Performers</p>
        </>
      );
    case 'bottomPerformers':
      return (
        <>
          <Box className="card-icon-wrapper bottom">
            <span className="material-icons">south</span>
          </Box>
          <p className="card-title">Bottom Performers</p>
        </>
      );
    case 'trending':
      return (
        <>
          <Box className="card-icon-wrapper trending">
            <TrendingUpRounded />
          </Box>
          <p className="card-title">Trending</p>
        </>
      );
  }
};
export const SubtopicCard = ({ title, id, onClick, filterData, topicName }) => {
  const [data, setData] = useState({
    topPerformers: [],
    bottomPerformers: [],
    trending: [],
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!filterData) return;
    setLoading(true);
    const params = new URLSearchParams();
    params.append('salesPlayId', filterData?.market.value);
    params.append('subTopicList', topicName);
    params.append('VerifiedCardsOnly', 'Most Relevant');
    params.append('sortCriteria', filterData?.sort?.value);
    params.append('sortOrder', filterData?.sort?.sortBy);
    params.append('analyze', 'closed opptys');
    params.append('isTestCard', 'N');
    params.append('crmOpptyType', filterData.opptyType.value);
    if (filterData?.region?.value) {
      params.append('regionList', [filterData?.region?.value]);
    }
    if (filterData?.competitor?.value) {
      params.append('competitorCardId', filterData?.competitor?.value);
    }
    if (filterData?.segment?.value) {
      params.append('segmentList', [filterData?.segment?.value]);
    }
    if (filterData?.industry?.value) {
      params.append('industryList', [filterData?.industry?.value]);
    }
    params.append(
      'closePeriod',
      filterData?.closePeriod?.value || 'LAST_12_MONTHS'
    );

    getGrowNewLogsSummary(params.toString()).then((res) => {
      const data = res.data?.playbookCards;
      const trendingSummary = res.data?.trendingSummary;
      const firstThree = data.slice(0, 3);
      const lastThree = data.slice(data.length - 3, data.length);
      console.log(data);
      setData({
        topPerformers: firstThree.map((t) => ({
          cardTitle: t.name,
          amount: t.totalOpptyAmount,
          days: t.totalOpptyCountForCard,
        })),
        bottomPerformers: lastThree.map((t) => ({
          cardTitle: t.name,
          amount: t.totalOpptyAmount,
          days: t.totalOpptyCountForCard,
        })),
        trending: trendingSummary.slice(0, 3)?.map((t) => {
          return {
            cardTitle: t.cardName,
            amount:
              filterData.sort?.value === 'sort_by_deals'
                ? t.previousDealsValue
                : ShortNumber(t.previousAmountValue),
            days:
              filterData.sort?.value === 'sort_by_deals'
                ? t.currentDealsValue
                : ShortNumber(t.currentAmountValue),
            percentage:
              filterData.sort?.value === 'sort_by_deals'
                ? t.changesInPercentagesForDeals
                : t.changesInPercentagesForAmount,
          };
        }),
      });
      setLoading(false);
    });
  }, [filterData]);
  return (
    <Box className="sub-wrapper" p="12px 24px" borderRadius={'10px'}>
      <h3 id={id} className="sub-topic-title">
        {title}
      </h3>

      {loading && (
        <Box
          height={350}
          display="flex"
          justifyContent={'center'}
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      )}
      {!loading && (
        <Box display={'flex'} style={{ gap: '20px' }}>
          {Object.keys(data).map((key) => {
            return (
              <Box className="card" key={key}>
                <Box display={'flex'} alignItems="center" mb="24px">
                  <RenderIcon keyName={key} />
                </Box>

                {data[key].map((t, i) => {
                  return (
                    <Box className="flx-container" key={i}>
                      <Box
                        className={classNames('card-stat', {
                          last: data[key].length - 1 === i,
                        })}
                      >
                        <p onClick={onClick}>{t.cardTitle}</p>
                        {key !== 'trending' && (
                          <p>
                            {ShortNumber(t.amount)}, {t.days} deals
                          </p>
                        )}

                        {key == 'trending' && (
                          <p>
                            Previous: ${t.amount}, <span className="sep"></span>{' '}
                            This: ${t.amount}
                          </p>
                        )}
                      </Box>

                      <Box className={'percentage-container ' + key}>
                        {t.percentage} %
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
