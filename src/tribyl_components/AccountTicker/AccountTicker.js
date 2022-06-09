import React from 'react';
import classnames from 'classnames';
import { PropTypes } from 'prop-types';

import './AccountTicker.style.scss';
import { ShortNumber } from '../../util/utils';
import { Tooltip } from '@material-ui/core';

const DEFAULT_CLASSNAME = 'account-ticker';

class AccountTicker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { selectedAccountIndex: 0 };
  }

  handleChange = (i) => {
    return () => {
      this.setState({ selectedAccountIndex: i });
    };
  };

  goNext = () => {
    console.log("TESTSSSSSSSSSSSS")
    const { data, handleChange, selectedIndex } = this.props;
    const currentIdIndex = data?.findIndex((i) => i.id === selectedIndex);
    data[currentIdIndex + 1]?.id && handleChange(data[currentIdIndex + 1].id);
  };

  goPrevious = () => {
    const { data, handleChange, selectedIndex } = this.props;
    const currentIdIndex = data?.findIndex((i) => i.id === selectedIndex);
    data[currentIdIndex - 1]?.id && handleChange(data[currentIdIndex - 1].id);
  };

  render() {
    const data = this.props.data ? this.props.data : [];
    const { selectedIndex, handleChange } = this.props;

    // const handleChangeSelectedIndex = this.props.handleChange
    //   ? this.props.handleChange
    //   : this.handleChange;
    // const leftStep = handleChangeSelectedIndex(
    //   selectedIndex > 0 ? selectedIndex - 1 : 0
    // );
    // const rightStep = handleChangeSelectedIndex(
    //   selectedIndex < data.length - 1 ? selectedIndex + 1 : selectedIndex
    // );

    return (
      <div className={`${DEFAULT_CLASSNAME}-wrapper position-relative`}>
        <div
          className={`${DEFAULT_CLASSNAME}-button ${DEFAULT_CLASSNAME}-left-button`}
          onClick={this.goPrevious}
          role="link"
        >
          <i className="material-icons">keyboard_arrow_left</i>
        </div>
        <div className={`${DEFAULT_CLASSNAME}`}>
          {data.length > 0 &&
            data.map((datum, i) => {
              return (
                <div
                  key={`account-entry-${i}`}
                  className={classnames(`${DEFAULT_CLASSNAME}-account-entry`, {
                    active: this.props.selectedIndex === datum.id,
                  })}
                  onClick={() => handleChange(datum.id)}
                  role="link"
                >
                  <div
                    className={`${DEFAULT_CLASSNAME}-account-entry-label text-nowrap`}
                  >
                    <Tooltip title={datum.accountName}>
                      <span>
                        {`${
                          datum.accountName.length > 20
                            ? datum.accountName.slice(0, 20) + '...'
                            : datum.accountName
                        }`}
                      </span>
                    </Tooltip>
                  </div>
                  <div className={`${DEFAULT_CLASSNAME}-account-entry-value`}>
                    {datum.opportunityAmount &&
                      ShortNumber(datum.opportunityAmount)}
                  </div>
                </div>
              );
            })}
        </div>
        <div
          className={`${DEFAULT_CLASSNAME}-button ${DEFAULT_CLASSNAME}-right-button`}
          onClick={this.goNext}
          role="link"
        >
          <i className="material-icons">keyboard_arrow_right</i>
        </div>
      </div>
    );
  }
}
AccountTicker.propTypes = {
  data: PropTypes.array,
  selectedIndex: PropTypes.number,
  handleChange: PropTypes.func,
};

export default AccountTicker;
