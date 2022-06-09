import React, { Component } from 'react';
import { Revscorepill, MetricsBox } from '..';
import { ToggleSwitch } from '../../basecomponents/ToggleSwitch/ToggleSwitch';
import TabBar from '../../basecomponents/TabBar/TabBar';
import arrow_circle_up from '../../assets/icons/arrow_circle_up.svg';
// import arrow_circle_down from '../../assets/icons/arrow_circle_down.svg';

import './CardModalContent.style.scss';

const DEFAULT_CLASSNAME = 'card-modal-content';

class CardModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = { showCardModal: {}, keywords: false };
  }

  toggleKeywords = () => {
    this.setState({ keywords: !this.state.keywords });
  };

  render() {
    return (
      <div className={'summary-card-modal-body'}>
        <div className={'summary-card-modal-rev-score'}>
          <div className={'summary-card-modal-rev-score-label'}>
            {'Rev Score:'}
          </div>
          <Revscorepill direction={'up'} value={90} />
        </div>
        <div className={'summary-card-modal-row'}>
          <MetricsBox
            metrics={[
              {
                label: 'Amount',
                value: '$300,000',
              },
              {
                label: 'Oppty',
                value: '100',
              },
              {
                label: 'Deal Size',
                value: '2.5 M',
              },
              {
                label: 'Win Rate',
                value: (
                  <div className={'metrics-box-value'}>
                    {'50%'} <img src={arrow_circle_up} />
                  </div>
                ),
              },
              {
                label: 'Sales Cycle',
                value: '100 Days',
              },
            ]}
          />
        </div>
        <div className={'summary-card-modal-row'}>
          <TabBar
            tabComponents={[<div />, <div />]}
            defaultActiveTabIndex={0}
            tabLabels={[
              {
                name: 'Description',
                slug: 'd',
              },
              {
                name: 'Top Matches',
                slug: 'tm',
              },
            ]}
          ></TabBar>
        </div>
        <div className={'summary-card-modal-row'}>
          <ToggleSwitch
            toggleSwitchClass={'small'}
            checkValue={this.state.keywords ? 'on' : 'off'}
            handleToggleChange={this.toggleKeywords}
            inactiveText={null}
            activeText={'Keywords'}
          />
        </div>

        <div className={'summary-card-modal-row'}>
          <div className={'summary-card-modal-body-text'}>
            {this.state.keywords
              ? this.props.data.cardTags.map((cardTag) => {
                  return <p>{cardTag}</p>;
                })
              : this.props.data.description}
          </div>
        </div>
      </div>
    );
  }
}

export default CardModalContent;
