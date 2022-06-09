/* eslint-disable no-unused-vars */
/* eslint-disable arrow-parens */
import React, { RefObject } from 'react';
import './SearchInput.scss';

export class SearchInput extends React.PureComponent {
    ref = React.createRef();
    state = { active: false, open: false };
    componentDidMount() {
        this.handleAutoPopulatedValues();
    }
    componentDidUpdate(prevProps) {
        const { active } = this.state;
        const { value, options = [], valueKey = 'value' } = this.props;
        if (value !== prevProps.value) {
            const match = options.find((item) => item[valueKey] === value);
            if (!match) {
                this.setState({ open: true });
            }
        }
        if (!value && !active
            && prevProps.value && prevProps.active) {
            this.onSubmit();
        }
    }
    toggleOptions = () => {
        this.setState((state) => ({ open: !state.open }));
    }
    updateValue = (value) => {
        const { onChange } = this.props;
        if (onChange) onChange(value);
    }
    handleAutoPopulatedValues = () => {
        this.updateValue(this.ref.current.value || '');
    }
    onClear = () => {
        const { active } = this.state;
        this.ref.current.value = '';
        this.updateValue('');
        this.onSubmit();
        this.setState({ active: false });
    }
    onChange = ({ target: { value, innerText } }) => {
        const { options = [], valueKey = 'value' } = this.props;
        const val = value || innerText;
        const option = options.find((opt) => (opt[valueKey] === val)) || { [valueKey]: val };
        this.updateValue(options.length > 0 ? option : val);
        if (!value && innerText) this.setState({ open: false });
    }
    onSubmit = () => {
        const { value, onSubmit } = this.props;
        this.setState({ active: true });
        if (onSubmit) onSubmit(value);
    }
    onKeyUp = (event) => {
        const { value, onSubmit } = this.props;
        // eslint-disable-next-line eqeqeq
        if (event.keyCode == 13) {
            this.onSubmit();
        }
    }
    render() {
        const { 
            value, 
            placeholder = 'Search', 
            options = [], 
            valueKey = 'value' 
        } = this.props;
        const { active, open } = this.state;
        const filteredOptions = options.filter((item) =>
            item[valueKey].toLowerCase().includes(value.toLowerCase()));
        return (
            <div className={`search-input-wrapper ${open ? 'open' : ''}`}>
                <input
                    ref={this.ref}
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={this.onChange}
                    onKeyUp={this.onKeyUp} />
                {/* {!active && <MaterialIcon icon="search" onClick={this.onSubmit} />}
                {active && <MaterialIcon icon="close" onClick={this.onClear} />} */}
                    <i
                        role="button"
                        className="material-icons"
                        onClick={active ? this.onClear : this.onSubmit}>
                        {active ? "close" : "search"}
                    </i>
                {
                    open && options.length > 0 && (
                        <div className="text-input-suggestions">
                            <ul>
                                {
                                    filteredOptions.length > 0
                                        ? filteredOptions.map((item) => <li onClick={this.onChange}>{item[valueKey]}</li>)
                                        : options.map((item) => <li onClick={this.onChange}>{item[valueKey]}</li>)
                                }
                            </ul>
                        </div>
                    )
                }
            </div>
        );
    }
}
