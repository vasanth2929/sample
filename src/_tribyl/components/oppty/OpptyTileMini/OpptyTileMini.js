/* eslint-disable arrow-parens */
import React, { Component } from 'react';
import './OpptyTileMini.scss';

// const DUMMY_TEXT = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";

export class OpptyTileMini extends Component {
  state = {
    collapsed: true,
  };

  getShareStatus = (shareStatus) => {
    switch (shareStatus) {
      default:
        return 'Public';
      case 'share-internal':
        return 'Internal';
      case 'share-external-restricted':
        return 'Limited';
    }
  };

  toggleCollapseText = () => {
    this.setState((state) => ({ collapsed: !state.collapsed }));
  };

  openStory = () => {
    const { story } = this.props;
    window.open(`${process.env.API_URL}/opptyPlanV3/${story.id}`);
  };

  render() {
    const { oppty } = this.props;
    const { collapsed } = this.state;
    return (
      <section className={`oppty-tile mini ${!collapsed ? 'expanded' : ''}`}>
        <div className="story-header-wrapper">
          <div className="story-information-wrapper">
            <p className="story-account-name">
              {oppty.accName}
              <i
                role="button"
                className="material-icons"
                onClick={this.openStory}
              >
                open_in_new
              </i>
            </p>
            <div className="story-status-and-amount">
              <div className="account-opp-status">
                <span className="oppStatusLabel">{oppty.status}</span>
              </div>
              {/* <p className="story-opp-amount">{`${story.opportunityAmount ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(story.opportunityAmount) : '$0'}`}</p>
                            &nbsp;|&nbsp;<p className="story-fiscal-range">{`${story.closeQtr} - ${story.closeYear}`}</p> */}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
