import React from "react";
import Select from "react-select";
import { getColorCodeFromName } from "../../util/utils";

import "./IconDropdown.style.scss";

const DEFAULT_CLASSNAME = "icon-dropdown";



const IconDropdown = (props) => {
	const { selectProps, mapIcons } = props;

	const options = mapIcons
		? selectProps.options.map((option) => {
      console.log({option})
				return {
          value: option.value,
					label: (
						<div className={`${DEFAULT_CLASSNAME}-select-option`}>
							<div className={`${DEFAULT_CLASSNAME}-select-option-icon color-class-${getColorCodeFromName(option.label)}`}>
								{option.label
									.split(" ")
									.map((option) => option.slice(0, 1))
									.join("")}
							</div>
							<div className={`${DEFAULT_CLASSNAME}-select-option-label`}>{option.label}</div>
						</div>
					),
				};
		  })
		: selectProps.options;

	return <Select {...selectProps} options={options} />;
};

export default IconDropdown;
