import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

// import { connect } from 'react-redux';

import './styles/InputInline.style.scss';

/* 
    Packages an input field with an inline 'check' and 'cancel' button and handles basic
    behaivor - showing and hiding the buttons, retaining and resoring the default value.    

    REQUIRES onSubmit callback function passed to it as a prop. onSubmit callback will be 
    called with a reference to the InputInline that called it. Add values required for form 
    submission into the dataObject prop, then refer to those values in your callback fucntion. 

*/
export class InputInline extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          value: props.value ? props.value : '',
          defaultValue: props.value ? props.value : '',
          buttonsVisible: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.cancelUpdate = this.cancelUpdate.bind(this);
        this.finishUpdate = this.finishUpdate.bind(this);
        this.setDefaultValue = this.setDefaultValue.bind(this);
        this.setToDefaultValue = this.setToDefaultValue.bind(this);
        this.setStateFromProps = this.setStateFromProps.bind(this);
        this.buttons = React.createRef();
        this.input = React.createRef();
    }    

    componentDidMount() {
        if (this.props.autoFocus) {
            this.input.current.focus();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setStateFromProps();
        }
    }

    // Shows edit buttons on click of the input field. 
    onInputFocus() {
        if (!this.props.clickAway) {
            this.showButtons();
        }
        this.props.handleInputClick();
    }
    setStateFromProps() {
        this.setState({ 
            value: this.props.value,
            defaultValue: this.props.value
        });                
    }
    // Sets new input value
    setDefaultValue(value) {
        this.setState({ defaultValue: value });        
        // this.props.value = value;
    }
    // Restores most recent default value
    setToDefaultValue() {
        this.setState({ value: this.state.defaultValue });
    }
    // Blur event handler for clickAway prop which hides buttons and saves on clickaway
    handleBlur = () => {
        if (this.props.clickAway) {
            this.props.onSubmit(this);
        }
    }
    // Updates state.value on change of the input field. 
    handleChange(event) {
        this.setState({ value: event.target.value });
        this.props.handleChange(event);
    }    
    // Called on click of the 'check' button. Calls the required onSubmit callback and passes itself as a param.
    handleSubmit() {
        this.props.onSubmit(this);
        this.hideButtons();
    } 
    // Wires up the 'Enter' key to the onSubmit callback  
    handleKeyPress(event) {
        /* if (event.keyCode === 13) {
            event.target.blur();
            this.handleSubmit();  
        } else */ 
        
        if (event.keyCode === 27) {
            event.target.blur();
            this.cancelUpdate();  
        } 
    }    

    // Sets the input field to default value and hides the edit buttons
    cancelUpdate() {
        this.setToDefaultValue();
        this.hideButtons();
        this.props.handleCancelUpdate();
    }
    // Call on update success - sets new value as default value and hides buttons
    finishUpdate(newDefaultValue) {
        this.setDefaultValue(newDefaultValue);
        this.hideButtons();
    }
    // Shows the 'check' and 'cancel' buttons
    showButtons() {
        this.buttons.current.style.display = 'flex';
        this.input.current.classList.add('active');
        this.state.buttonsVisible = true;
    }
    // Hides the 'check' and 'cancel' buttons
    hideButtons() {
        if (!this.props.clickAway) {
            this.buttons.current.style.display = 'none';
            this.input.current.classList.remove('active');
            this.state.buttonsVisible = false;
        }
    }
    render() {
        return (
            <div className={`input-outer-container ${this.props.customClass}`}>
                {this.props.inputType === 'multiline' ? (
                    <div className={`input-container ${this.props.customClass}`}>
                        <textarea   
                            style={{
                                overflow: 'hidden',
                                opacity: '1'
                            }}
                            ref={this.input} 
                            rows={this.props.inputRows}
                            className={`input ${this.props.customClass}`} 
                            type={this.props.type} 
                            name={this.props.name} 
                            value={ReactHtmlParser(`${this.state.value}`)} 
                            placeholder={this.props.placeholder} 
                            // defaultValue={ReactHtmlParser(`${this.state.value}`)} 
                            onClick={this.onInputFocus} 
                            onBlur={this.handleBlur}
                            onChange={this.handleChange} 
                            contentEditable={this.props.contentEditable} 
                            onKeyDown={this.handleKeyPress}
                            maxLength={this.props.maxLength}
                            suppressContentEditableWarning
                        />
                        {!this.props.clickAway && 
                            <div ref={this.buttons} className="edit-buttons">
                                <i role="button" name="cardTitleUpdateButton" className="ion-checkmark" onMouseDown={this.handleSubmit} title="Save" />
                                <i role="button" className="ion-close" onMouseDown={this.cancelUpdate} title="Cancel" />
                            </div>
                        }
                    </div>
                    ) : (
                    <div className="input-container">
                        <input 
                            ref={this.input} 
                            className={`input ${this.props.customClass}`} 
                            type={this.props.type} 
                            name={this.props.name} 
                            value={this.state.value} 
                            placeholder={this.props.placeholder} 
                            onClick={this.onInputFocus} 
                            onChange={this.handleChange} 
                            contentEditable={this.props.contentEditable} 
                            onKeyDown={this.handleKeyPress}
                            suppressContentEditableWarning />
                        <div ref={this.buttons} className="edit-buttons">
                            <i role="button" name="cardTitleUpdateButton" className="ion-checkmark" onMouseDown={this.handleSubmit} title="Save" />
                            <i role="button" className="ion-close" onMouseDown={this.cancelUpdate} title="Cancel" />
                        </div>
                    </div>
                )}
            </div>
        );
    }      
}

InputInline.propTypes = {
    inputType: PropTypes.string,
    customClass: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    contentEditable: PropTypes.bool,
    name: PropTypes.string,
    type: PropTypes.string,
    clickAway: PropTypes.bool,
    placeholder: PropTypes.string,
    dataObject: PropTypes.object,
    inputRows: PropTypes.string,
    handleChange: PropTypes.func
    // value: PropTypes.array
};

InputInline.defaultProps = {
    clickAway: false,
    inputType: 'singleline',
    contentEditable: true,
    placeholder: '(edit)',
    inputRows: '4',
    handleChange: () => {}
};
