import React from 'react';
import './Paginator.scss';

export class Paginator extends React.PureComponent {
    increment = () => {
        const { index } = this.props;
        this.updateIndex(index + 1);
    }
    decrement = () => {
        const { index } = this.props;
        this.updateIndex(index - 1);
    }
    updateIndex = (index) => {
        const { size, incrementValue = 1, onChange } = this.props;
        if (index > -1 && index < (size / incrementValue)) {
            onChange(index);
        }
    }
    render() {
        const { index, size, incrementValue = 1 } = this.props;
        return (
            <div className="paginator-wrapper">
                <p className={`prev link ${(index + 1) < incrementValue ? "disabled" : ""}`} onClick={this.decrement}>
                    <i className="material-icons">navigate_before</i><span>Prev</span>
                </p>
                <p className="data">{Math.ceil(index + 1)}/{Math.ceil(size / incrementValue)}</p>
                <p className={`next link ${(index + 1) !== size ? "" : "disabled"}`} onClick={this.increment}>
                    <span>Next</span><i className="material-icons">navigate_next</i>
                </p>
            </div >
        );
    }
}
