import React, { Component } from 'react';
import { PropTypes } from "prop-types";
import checkbox from '../../assets/icons/checkbox.svg';
import check_box_gray from '../../assets/icons/check_box_gray.svg';
import emptyCheckbox from '../../assets/icons/emptyCheckbox.svg';

class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: this.props.isChecked || false
        };
    }

    handleClick(status) {
        const { oncheck, id } = this.props;
        this.setState({ isChecked: status });
        if (oncheck && id) oncheck(status, id);
        else if (oncheck) oncheck(status);
    }

    render() {
        const { isChecked } = this.state;
        const {
            className, color, readOnly
        } = this.props;
        return (
            /* to disable div added disabled property and to make event call disabled pass empty function */
            <div className={`${className} ${readOnly && "disabled"}`} style={{ cursor: "pointer" }} aria-checked role="checkbox" onClick={readOnly ? () => { } : () => this.handleClick(!isChecked)} disabled={readOnly} >
                {isChecked ?
                    color === "gray" ?
                        <img src={check_box_gray} /> :
                        <img src={checkbox} />
                    :
                    <img src={emptyCheckbox} />
                }
            </div>
        );
    }
}

Checkbox.propTypes = {
    onCheck: PropTypes.func,
    id: PropTypes.any
};

export default Checkbox;
