import React from "react";
import Select from "react-select";
import shareGlobal from '../../assets/iconsV2/share-global.png';
import shareLimited from '../../assets/iconsV2/share-limited.png';
import shareRestricted from '../../assets/iconsV2/share-restricted.png';

import "./StatusDropdown.style.scss";

const DEFAULT_CLASSNAME = "status-dropdown";

export const DefaultOptions = [
  {
    label: (
      <div>
        <img src={shareGlobal}></img> {'Public'}
      </div>
    ),
    value: 'public'
  },
  {
    label: (
      <div>
        <img src={shareLimited}></img> {'Limited'}
      </div>
    ),
    value: 'limited'
  },
  {
    label: (
      <div>
        <img src={shareRestricted}></img> {'Restricted'}
      </div>
    ),
    value: 'restricted'
  },
]

const StatusDropdown = (props) => {
	const options = props.options
		? props.options
		: DefaultOptions

  const value = props.value ? props.value : options[0];
  const onChange= props.onChange;

  const selectProps = {value, options, onChange}
	return (
		<div className={`${DEFAULT_CLASSNAME}`}>
      <Select 
        className={`${DEFAULT_CLASSNAME}-select-container`}
        classNamePrefix={`${DEFAULT_CLASSNAME}-select`}
        {...selectProps}
      />
		</div>
	);
};



export default StatusDropdown;
