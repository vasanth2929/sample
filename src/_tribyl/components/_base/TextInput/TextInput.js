import React from 'react';
import './TextInput.scss';

export class TextInput extends React.PureComponent {
    inputRef = React.createRef();
    wrapperRef = React.createRef();
    constructor(props) {
        super(props);
        const { value } = this.props;
        this.state = {
            open: false,
            clearable: !!value,
            inputValue: '',
            suggestions: []
        };
    }
    componentDidMount() {
        this.onAutoPopulate();
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
    fireSuggestions = (value) => {
        const { options = [], valueKey = 'value' } = this.props;
        if (options.length > 0) {
            const match = options.find(item => item[valueKey] === value);
            if (!match) {
                const suggestions = options.filter(item =>
                    item[valueKey].toLowerCase().includes(value.toLowerCase()));
                this.setState({ open: true, suggestions });
            } else {
                this.setState({ open: false });
            }
        }
    }
    updateValue = (value = '') => {
        const { onChange, valueKey = 'value' } = this.props;
        if (onChange) onChange(value);
        this.setState({ inputValue: typeof value[valueKey] === 'string' ? value[valueKey] : value });
    }
    onAutoPopulate = () => {
        const { value, autoPopulate } = this.props;
        if (value) {
            this.setState({ inputValue: value });
        } else if (autoPopulate) this.updateValue(this.inputRef.current.value || '');
    }
    onChange = ({ target: { value, innerText } }) => {
        const { options = [], valueKey = 'value', onSelect } = this.props;
        const val = value || innerText;
        const option = options.find(opt => (opt[valueKey] === val)) || { [valueKey]: val };
        this.updateValue(options.length > 0 ? option : val);
        this.fireSuggestions(val);
        if (option) {
            this.setState({ clearable: true }, () => onSelect && onSelect());
        } else this.setState({ clearable: false });
    }
    onClear = () => {
        const { onSelect } = this.props;
        this.updateValue();
        this.setState({ clearable: false }, () => onSelect && onSelect());
    }
    render() {
        const {
            type,
            value,
            defaultValue,
            placeholder,
            options = [],
            valueKey = 'value',
            disabled
        } = this.props;
        const { 
            open, 
            clearable, 
            inputValue, 
            suggestions 
        } = this.state;
        return (
            <div
                ref={this.wrapperRef}
                className={`text-input-wrapper ${open ? 'open' : ''}`}>
                <input
                    ref={this.inputRef}
                    type={type}
                    defaultValue={value || defaultValue}
                    value={inputValue || value}
                    placeholder={placeholder}
                    onChange={this.onChange}
                    disabled={disabled} />
                {clearable &&
                    <i
                        role="button"
                        className="material-icons"
                        onClick={this.onClear}>
                        close
                    </i>}
                {
                    open && options.length > 0 && (
                        <div className="text-input-suggestions">
                            <ul>
                                {
                                    suggestions.length > 0
                                        ? suggestions.map(item => <li onClick={this.onChange}>{item[valueKey]}</li>)
                                        : options.map(item => <li onClick={this.onChange}>{item[valueKey]}</li>)
                                }
                            </ul>
                        </div>
                    )
                }
            </div>
        );
    }
}
