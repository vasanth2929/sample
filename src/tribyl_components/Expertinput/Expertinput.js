import React from "react";
import { Form, Control } from "react-redux-form";


import "./Expertinput.style.scss";

const DEFAULT_CLASSNAME = "expert-form-input";

const Expertinput = (props) => {
  const { model, id, placeholder } = props;
  const inputProps = { id, placeholder, model };
	return (
		<div className={`${DEFAULT_CLASSNAME}`}>
			<Control.text {...inputProps} />
			<i className='prompt-icon ion-person' />
     
		</div>
	);
};

export default Expertinput;
