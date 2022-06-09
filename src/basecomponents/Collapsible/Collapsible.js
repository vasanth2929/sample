import React from 'react';
import './Collapsible.style.scss';


export default class Collapsible extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        const { open } = this.state;
        const { disalbeIndicator, height, className } = this.props;
        return (
            <div className={`collapsible-panel-wrapper ${className}`}>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div role="button" onClick={() => this.setState({ open: !open })} className="panel-header">
                            <span className="panel-title">{this.props.title}</span>
                            {this.props.Collapsible.length && !disalbeIndicator > 0 &&
                                <span role="button" className="trigger" >
                                    {
                                        open
                                            ? (<i title="collapse" className="material-icons collaps">keyboard_arrow_up</i>)
                                            : (<i title="expand" className="material-icons collaps">keyboard_arrow_down</i>)
                                    }
                                </span>
                            }
                        </div>
                    </div>
                    {this.props.noCollapsible &&
                        <div className="nonCollapsible">
                            {this.props.noCollapsible}
                        </div>}
                    {this.props.Collapsible &&
                        <div className={open ? "panel-collapse" : "panel-collapse panel-close"} >
                            {this.props.Collapsible}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

