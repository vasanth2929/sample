import React from 'react';
import './Select.scss';

export class SingleSelect extends React.PureComponent {
    ref = React.createRef();
    wrapperRef = React.createRef();
    state = {
        open: false
    }
    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick);
    }
    handleOutsideClick = ({ target }) => {
        if (!this.wrapperRef.current.contains(target)) {
            this.setState({ open: false });
        }
    }
    toggleOptions = () => {
        this.setState(state => ({ open: !state.open }));
    }
    updateValue = (value) => {
        const { onChange } = this.props;
        if (onChange) onChange(value);
        this.setState({ open: false });
    }
    onSelect = ({ target: { id } }) => {
        const { options = [], idKey = 'id' } = this.props;
        // eslint-disable-next-line radix
        const option = options.find(o => o[idKey] === parseInt(id));
        this.updateValue(option);
    }
    clearSelection = () => {
        this.updateValue();
    }
    render() {
        const {
            value = {},
            options = [],
            placeholder,
            idKey = 'id',
            valueKey = 'value',
            clearable
        } = this.props;
        const { open } = this.state;
        return (
            <div
                ref={this.wrapperRef}
                className={`single-select single-select-wrapper ${open ? 'open' : ''}`}>
                <button
                    className="single-select-button"
                    onClick={this.toggleOptions}>
                    <div className="selection-wrapper">
                        {value && value[valueKey]
                            // eslint-disable-next-line no-unneeded-ternary
                            ? value[valueKey] : (placeholder ? placeholder : 'Select an option')}
                        {
                            clearable && value && value[valueKey] &&
                            <i
                                role="button"
                                className="clear material-icons"
                                onClick={this.clearSelection}>
                                close
                            </i>
                        }
                    </div>
                    <i
                        role="button"
                        className="material-icons"
                        onClick={this.toggleOptions}>
                        {open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                    </i>
                </button>
                {open &&
                    <ul>
                        {options.map(option => (
                            <li id={option[idKey]} onClick={this.onSelect}>{option[valueKey]}</li>
                        ))}
                    </ul>}
            </div>
        );
    }
}
