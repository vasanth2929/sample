import React from 'react';
import PropTypes from 'prop-types';
import './SingleSelect.scss';
import { GroupedOptions } from './GroupedOptions/GroupedOptions';
import { DefaultOptions } from './DefaultOptions/DefaultOptions';
/**
 * Props:
 * 1. value: { id: number, value: string }
 * 2. options: { id: number, value: string }[]
 * 3. onSelect: () => void
 * 4. onReset: () => void
 * 5. idKey: string
 * 6. value: string
 */
export class SingleSelect extends React.Component {
    ref = React.createRef();
    constructor(props) {
        super(props);
        const { defaultValue } = this.props;
        this.state = {
            currentValue: defaultValue,
            optionsOpen: false
        };
    }
    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick);
    }
    handleOutsideClick = ({ target }) => {
        if (this.ref.current && !this.ref.current.contains(target)) {
            this.setState({ optionsOpen: false });
        }
    }
    toggleOptions = () => this.setState(state => ({ optionsOpen: !state.optionsOpen }))
    onSelect = (option) => {
        const { onSelect } = this.props;
        this.setState(state => ({
            optionsOpen: false,
            currentValue: state.currentValue ? option : null
        }), () => {
            // console.log('selected option: ');
            // console.log(option);
        });
        if (onSelect) onSelect(option);
    }
    onReset = (e) => {
        const { onReset } = this.props;
        e.stopPropagation();
        this.setState({ optionsOpen: false });
        if (onReset) onReset();
    }
    // renderOptions = () => {
    //     const { uniqueId, options } = this.props;
    //     const root = document.getElementById('portal-root-1');
    //     // setTimeout(() => {
    //     //     const selectElement = document.getElementById(`single-select-${uniqueId}`);
    //     //     const optionsElement = document.getElementById(`single-select-options-${uniqueId}`);
    //     //     const selectCoordinates = selectElement.getBoundingClientRect();
    //     //     optionsElement.style.height = selectElement.offsetHeight + "px";
    //     //     optionsElement.style.width = selectElement.offsetWidth + "px";
    //     //     optionsElement.style.top = -Math.abs(selectElement.offsetHeight) + 'px';
    //     //     const optionsCoordinates = optionsElement.getBoundingClientRect();
    //     //     console.log('selectElement');
    //     //     console.log({ x: selectCoordinates.left, y: selectCoordinates.top });
    //     //     console.log('optionsElement');
    //     //     console.log({ x: optionsCoordinates.left, y: optionsCoordinates.top });
    //     //     // a.appendChild(b);
    //     // }, 1000);
    //     return ReactDOM.createPortal(
    //         (
    //             <ul
    //                 className="single-select-options"
    //                 id={`${(uniqueId) ? `single-select-options-${uniqueId}` : ''}`}>
    //                 {options.map(option => <li onClick={() => this.onSelect(option)}>{option.value}</li>)}
    //             </ul>
    //         ),
    //         root
    //     );
    // }
    canReset = () => {
        const { onReset } = this.props;
        return (onReset && typeof onReset === 'function');
    }
    render() {
        const {
            uniqueId,
            value,
            options,
            groupOptions,
            disabled,
            onReset,
            idKey = 'id',
            valueKey,
            optionGroupKey,
            previousValue,
            optionRenderer
        } = this.props;
        const { currentValue, optionsOpen } = this.state;
        return (
            <div
                ref={this.ref}
                id={`${(uniqueId) ? `single-select-${uniqueId}` : ''}`}
                className={
                    "single-select-wrapper"
                    + `${(disabled) ? ' disabled' : ''}`
                    + `${(value && value[idKey]) || (currentValue && currentValue[idKey]) ? ' active' : ''}`
                    + `${(optionsOpen) ? ' open' : ''}`}>
                <button
                    className={`${onReset ? 'disable' : ''}`}
                    onClick={this.toggleOptions}>
                    {
                        optionRenderer && typeof optionRenderer === 'function'
                            ? optionRenderer((value && value[idKey]) ? value[valueKey] : (currentValue && currentValue[idKey]) ? currentValue[valueKey] : 'Select one')
                            : (value && value[idKey]) ? value[valueKey] : (currentValue && currentValue[idKey]) ? currentValue[valueKey] : 'Select one'
                    }
                    {
                        this.canReset() ? (
                            !(value && value[idKey]) && !(currentValue && currentValue[idKey])
                                ? <i className="material-icons">keyboard_arrow_down</i>
                                : <i className="material-icons reset" role="button" onClick={this.onReset}>close</i>
                        ) : <i className="material-icons">keyboard_arrow_down</i>
                    }
                </button>
                {optionsOpen && (
                    groupOptions
                        ? (
                            <GroupedOptions 
                                uniqueId={uniqueId} 
                                valueKey={valueKey} 
                                optionGroupKey={optionGroupKey} 
                                previousValue={previousValue} 
                                options={options} 
                                optionRenderer={optionRenderer}
                                onSelect={this.onSelect} />
                        ) : (
                            <DefaultOptions 
                                uniqueId={uniqueId} 
                                valueKey={valueKey} 
                                previousValue={previousValue} 
                                options={options} 
                                optionRenderer={optionRenderer}
                                onSelect={this.onSelect} />
                        )
                )}
            </div>
        );
    }
}

SingleSelect.propTypes = {
    idKey: PropTypes.string,
    valueKey: PropTypes.string,
};

SingleSelect.defaultProps = {
    idKey: 'id',
    valueKey: 'value'
};
