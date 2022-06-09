import React, { Component } from 'react';
import classNames from 'classnames';
import './Match.styles.scss';
import match from '../../assets/icons/match.svg';

const DEFAULT_CLASSNAME = "match";

class Match extends Component {
    handleClick() {
        const { onClick, isDisabled } = this.props;
        if (!isDisabled) if (onClick) onClick();
    }

    render() {
        const { count, isDisabled } = this.props;
        return (
            <div role="button" className={`${DEFAULT_CLASSNAME}`} onClick={() => this.handleClick()}>
                <div href="#">
                    <div className={classNames("match-card", { "pe-none": isDisabled })}>
                        {count ?

                            <React.Fragment>
                                <span><img src={match} /></span>
                                <span className="count">{count}</span>
                            </React.Fragment>
                            :
                            <span><img src={match} /></span>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Match;
