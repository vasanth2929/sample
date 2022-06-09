import React, { useState } from "react";
import "./CardRow.style.scss";

const DEFAULT_CLASSNAME = "display";
function CardRow({ title, id }) {
  const [color, setColor] = useState(false);

  const handleClick = () => {
    setColor(!color);
  };
  const click = color ? "title-click" : "title";
  const bclick = color ? "b-click" : "b-out";

  return (
    <div className={`${DEFAULT_CLASSNAME}-container`}>
      <div className={`${DEFAULT_CLASSNAME}-wrap`}>
        <div className={`${DEFAULT_CLASSNAME}-${click}`}>{title}</div>
        {color ? (
          <span id="done" className="material-icons">
            done
          </span>
        ) : (
          ""
        )}
      </div>
      <button
        className={`${DEFAULT_CLASSNAME}-btn ${DEFAULT_CLASSNAME}-${bclick}`}
        onClick={handleClick}
      >
        {color ? "Remove" : "+ Add"}
      </button>
    </div>
  );
}

export default CardRow;
