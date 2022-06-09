import React, { Component } from "react";
import { ShortNumber } from "../../../../util/utils";
import "./StoryMetrics.style.scss";

const DEFAULT_CLASSNAME = "story-metrics";

class StoryMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderHeading = (type) => {
    const { stats } = this.props;
    switch (type) {
      case "Amount":
        return (
          <React.Fragment>
            <div>{`$${ShortNumber(stats)}`}</div>
            <div className="highlighter green" />
          </React.Fragment>
        );
      case "Opptys":
        return (
          <React.Fragment>
            <div>{`${stats}`}</div>
            <div className="highlighter green" />
          </React.Fragment>
        );
      case "Deal Size":
        return (
          <React.Fragment>
            <div>{`$${ShortNumber(stats)}`}</div>
            <div className="highlighter orange" />
          </React.Fragment>
        );
      case "Sales Cycle":
        return (
          <React.Fragment>
            <div>{`${stats} days`}</div>
            <div className="highlighter purple" />
          </React.Fragment>
        );

      case "Win Rate":
        return (
          <React.Fragment>
            <div>{`${stats} %`}</div>
            <div className="highlighter red" />
          </React.Fragment>
        );

      default:
    }
  };

  render() {
    const { type } = this.props;
    return (
      <div className={`${DEFAULT_CLASSNAME}`}>
        <div className={`${DEFAULT_CLASSNAME}-heading`}>
          <div className={`${DEFAULT_CLASSNAME}-heading-title`}>{this.renderHeading(type)}</div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}-body`}>
          <p className={`${DEFAULT_CLASSNAME}-body-type`}>{type}</p>
          <div className={`${DEFAULT_CLASSNAME}-body-metrics`}>
            {/* <div className="status">+{data["Q/Q"]}% Q/Q</div>
            <div className="status">+{data["Y/Y"]}% Y/Y</div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default StoryMetrics;
