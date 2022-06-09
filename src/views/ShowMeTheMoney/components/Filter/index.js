import React, { useEffect, useRef, useState } from 'react';
import ReactSelect from 'react-select';
import { Box, Button } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import './index.scss';
import {
  getAllMarkets,
  listAllIndustry,
  listAllMarket,
  listAllRegion,
} from '../../../../util/promises/browsestories_promise';
import {
  getOpptyTypeDropdownValues,
  getStageDropdownLabels,
} from '../../../../util/promises/customer_analysis';
import isEqual from 'lodash.isequal';
import classNames from 'classnames';
import { getCompetitorCardsList } from '../../../../util/promises/playbooks_promise';
const createQuery = (values) => {
  let params = new URLSearchParams();
  Object.keys(values).map((k) => {
    params.append(k, values[k]?.value);
  });
  return params.toString();
};
export const Filter = ({ className, onChange }) => {
  const [marketOptions, setMarketOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [segmentOptions, setSegmentOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [stageOptions, setStageOptions] = useState([]);
  const [opptyOptions, setOpptyOptions] = useState([]);
  const [compOptions, setCompOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const lastQuery = useRef('');
  const [isChanged, setChanged] = useState(false);
  const [values, setValues] = useState({
    market: null,
    segment: null,
    region: null,
    opptyType: null,
    industry: null,
    stage: null,
    competitor: null,
  });

  const init = async () => {
    setLoading(true);
    Promise.all([
      getAllMarkets('information technology'),
      listAllIndustry('information technology'),
      listAllMarket('information technology'),
      listAllRegion('information technology'),
      getStageDropdownLabels(),
      getOpptyTypeDropdownValues(),
    ]).then(async (res) => {
      const markets = res[0].data;
      const mo = markets.map((t) => ({ ...t, value: t.id, label: t.name }));
      setMarketOptions(mo);
      const industries = res[1].data;
      const io = industries.map((t) => ({
        ...t,
        value: t.qualifierId,
        label: t.value,
      }));
      setIndustryOptions([{ label: 'All Industries', value: null }, ...io]);

      const segments = res[2].data;
      const so = segments.map((t) => ({
        ...t,
        value: t.qualifierId,
        label: t.value,
      }));
      setSegmentOptions([{ label: 'All Segments', value: null }, ...so]);
      const regions = res[3].data;
      const ro = regions.map((t) => ({ ...t, value: t.id, label: t.name }));
      setRegionOptions([{ label: 'All Regions', value: null }, ...ro]);

      const stages = res[4].data;
      const sto = stages.map((t) => ({
        ...t,
        value: t.picklistLabel,
        label: t.picklistLabel,
      }));
      setStageOptions(sto);

      const opptyTypes = res[5].data;
      const oo = opptyTypes.map((t) => ({
        ...t,
        value: t.picklistLabel,
        label: t.picklistLabel,
      }));

      setOpptyOptions(oo);
      const tempValues = {
        market: mo.find((t) => t.defaultFlag) || mo[0],
        opptyType: oo.find((t) => t.defaultFlag) || oo[0],
        region: ro.find((t) => t.defaultFlag) || {
          label: 'All Regions',
          value: null,
        },
        segment: so.find((t) => t.defaultFlag) || {
          label: 'All Segments',
          value: null,
        },
        industry: io.find((t) => t.defaultFlag) || {
          label: 'All Industries',
          value: null,
        },
        stage: sto.find((t) => t.defaultFlag) || sto[0],
      };

      const compRes = await getCompetitorCardsList(tempValues.market.value);
      const comp = compRes.data?.map((t) => ({ value: t.id, label: t.name }));
      setCompOptions([{ label: 'All', value: null }, ...comp]);
      tempValues.competitor = comp?.find((t) => t.defaultFlag) || {
        label: 'All',
        value: null,
      };
      lastQuery.current = createQuery(tempValues);
      onChange(tempValues);
      setValues(tempValues);

      setLoading(false);
    });
  };
  useEffect(() => {
    init();
  }, []);
  const handleChange = (key, value) => {
    if (!isEqual(values[key], value)) setValues({ ...values, [key]: value });
  };

  useEffect(() => {
    checkForChange(values);
  }, [values]);

  const checkForChange = (values) => {
    let params = new URLSearchParams();
    Object.keys(values).map((k) => {
      params.append(k, values[k]?.value);
    });
    if (lastQuery.current !== params.toString()) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  };

  const onFilter = () => {
    lastQuery.current = createQuery(values);
    checkForChange(values);
    onChange(values);
  };

  return (
    <>
      {loading && (
        <Skeleton animation="wave" height={36} className={className} />
      )}
      {!loading && (
        <Box
          className={`filter-section ${className}`}
          display={'flex'}
          alignItems="center"
        >
          <Box display={'flex'} alignItems={'center'}>
            <label>Market:</label>
            <ReactSelect
              classNamePrefix="filter-dropdown"
              className="filter-dropdown"
              options={marketOptions}
              value={values.market}
              onChange={(v) => handleChange('market', v)}
            />
          </Box>

          <Box display={'flex'} alignItems={'center'} ml="30px">
            <label>Filter:</label>
            {/* Industry */}
            <ReactSelect
              classNamePrefix="filter-dropdown"
              className="filter-dropdown industry-field"
              placeholder="All industries"
              options={industryOptions}
              value={values.industry}
              onChange={(v) => handleChange('industry', v)}
            />

            {/* Segment */}
            <ReactSelect
              classNamePrefix="filter-dropdown"
              className="filter-dropdown segment-field"
              placeholder="All segments"
              options={segmentOptions}
              value={values.segment}
              onChange={(v) => handleChange('segment', v)}
            />

            {/* Region */}

            <ReactSelect
              classNamePrefix="filter-dropdown"
              className="filter-dropdown region-field"
              placeholder="All regions"
              options={regionOptions}
              value={values.region}
              onChange={(v) => handleChange('region', v)}
            />

            <Box className="seperator"></Box>

            {/* Stage */}
            <ReactSelect
              classNamePrefix="filter-dropdown"
              className="filter-dropdown stage-field"
              options={stageOptions}
              value={values.stage}
              onChange={(v) => handleChange('stage', v)}
            />

            {/* Oppty type */}
            <ReactSelect
              classNamePrefix="filter-dropdown"
              className="filter-dropdown oppty-field"
              options={opptyOptions}
              value={values.opptyType}
              onChange={(v) => handleChange('opptyType', v)}
            />

            {/* Competitor  */}
            <ReactSelect
              classNamePrefix="filter-dropdown"
              className="filter-dropdown competitor-field"
              value={values.competitor}
              options={compOptions}
              onChange={(v) => handleChange('competitor', v)}
            />

            <Button
              disabled={!isChanged}
              variant="contained"
              className={classNames('apply-btn', { disabled: !isChanged })}
              onClick={onFilter}
            >
              Apply
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};
