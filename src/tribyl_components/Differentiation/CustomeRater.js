import React, { useState, useEffect } from 'react';
import Rater from 'react-rater';
import PropTypes from 'prop-types';
import 'react-rater/lib/react-rater.css';
import './CustomRater.style.scss';
import Tooltip from '@material-ui/core/Tooltip';
const CustomeRater = ({
  onRate,
  data,
  rating,
  uiType,
  readOnly,
  customeClass,
  total,
}) => {
  const [rate, setrating] = useState(rating);
  useEffect(() => {
    setrating(rating);
  }, [rating]);

  const handleRating = (value) => {
    const rating = value.rating;
    onRate(rating, data);
  };
  return (
    <div className={customeClass}>
      {!readOnly ? (
        <Rater
          total={total}
          onRate={handleRating}
          rating={rate}
        />
      ) : (
        <Tooltip title={rate?.toFixed(2)} placement="top-start">
          <div>
            <Rater interactive={false} total={total} rating={rate} />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

CustomeRater.defaultProps = { total: 5 };

CustomeRater.propTypes = {
  OnRate: PropTypes.func,
  data: PropTypes.object,
  rating: PropTypes.number,
  uiType: PropTypes.string,
  readOnly: PropTypes.bool,
  customeClass: PropTypes.string,
  total: PropTypes.number,
};

export default CustomeRater;
