import React from "react";
import ArrowUp from "../../assets/icons/arrow_circle_up.svg";
import ArrowDown from "../../assets/icons/arrow_circle_down.svg";

import "./Revscorepill.style.scss";

const DEFAULT_CLASSNAME = "revscorepill";

const Revscorepill = (props) => {
	const { direction, value } = props;
	const Icon = direction === "up" ? ArrowUp : ArrowDown;
	return (
		<div className={`${DEFAULT_CLASSNAME} ${DEFAULT_CLASSNAME}-${direction}`}>
			<img src={Icon} />
			{value}
		</div>
	);
};

export default Revscorepill;
