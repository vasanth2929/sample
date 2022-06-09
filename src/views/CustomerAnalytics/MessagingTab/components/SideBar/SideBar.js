import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './SideBar.style.scss';
import rightArrow from '../../../../../assets/icons/rightArrow.svg';
import dollar from '../../../../../assets/icons/dollar.svg';
import briefcase from '../../../../../assets/icons/briefcase.svg';
import clock from '../../../../../assets/icons/clock.svg';
import house from '../../../../../assets/icons/house.svg';
import house2 from '../../../../../assets/icons/house2.svg';
import { ShortNumber } from '../../../../../util/utils';

export class SideBar extends Component {
  handleClick() {
    window.open('/newstoryDealSummary/storyId/52/accountId/W8', '_self');
  }

  render() {
    const { title, data } = this.props;
    return (
      <div className="sidebar-card-container">
        <p className="heading">{title}</p>
        <div className="metrics">
          <div className="box">
            <img src={dollar} />
            <div>
              <p className="small-text">AMOUNT</p>
              <p className="sub-heading bold">
                {data ? ShortNumber(data.totalAmount) : ''} (
                {data.opptyCount || 0} Opptys)
              </p>
            </div>
          </div>
          <div className="box">
            <img src={briefcase} />
            <div>
              <p className="small-text">DEAL SIZE</p>
              <p className="sub-heading bold">
                {data ? ShortNumber(data.avgDealSize) : ''}
              </p>
            </div>
          </div>
          <div className="box">
            <img src={clock} />
            <div>
              <p className="small-text">Sales cycle</p>
              <p className="sub-heading bold">
                {data ? data.salesCycle : ''} days
              </p>
            </div>
          </div>
          <div className="box">
            <img src={house} />
            <div>
              <p className="small-text">Top Industries</p>
              <div className="sub-heading">
                {data &&
                  data.topIndustry &&
                  data.topIndustry.map(
                    (item) =>
                      item.name && <p className="link-text">{item.name}</p>
                  )}
              </div>
            </div>
          </div>
          <div className="box">
            <img src={house2} />
            <div>
              <p className="small-text">TOP WINS</p>
              <div className="sub-heading">
                {data &&
                  data.topWinAccounts &&
                  data.topWinAccounts.map(
                    (item) =>
                      item.name && (
                        <p
                          onClick={this.handleClick}
                          role="button"
                          className="link-text"
                        >
                          {item.name}
                        </p>
                      )
                  )}
              </div>
            </div>
            <div className="more-link">
              <span className="small-text bold">View all</span>
              <img src={rightArrow} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
