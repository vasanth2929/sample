import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import './styles/Tooltip.styles.scss';

export class TooltipImpl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { active: false };
    this.ref = React.createRef();
  }

  render() {
    const { active, message, jsEvent } = this.props;
    const style = {
      left: jsEvent ? jsEvent.clientX + 20 + 'px' : '0px',
      top: jsEvent ? jsEvent.clientY + 10 + 'px' : '0px',
    };
    return active ? (
      <div className="tooltip-component" style={style}>
        {message}
      </div>
    ) : null;
  }
}

function mapStateToProps(state) {
  return {
    active: state.tooltip.active,
    message: state.tooltip.message,
    jsEvent: state.tooltip.jsEvent,
  };
}

export const Tooltip = connect(mapStateToProps, null)(TooltipImpl);
