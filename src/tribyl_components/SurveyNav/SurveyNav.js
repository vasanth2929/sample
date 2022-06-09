import classNames from 'classnames';
import React from 'react';

import "./SurveyNav.style.scss";

const DEFAULT_CLASSNAME = 'survey-nav';

const SurveyNav = ({ data = [], activeIndex = 0, onClick = null, uiType, percentComplete }) => {
  const getStatus = (index) => {
    if (index === activeIndex) return "active"; // checking if current index is equal to active index
    if(index < activeIndex) return "done"
    return "";
  };

  const handleClick = (question, index) => {
    if (onClick) onClick(question, index);
  };


  const renderTheCategoryName = (key) => {
    switch (key) {
      case "context": return "Context";
      case "customerneeds": return "Customer Needs";
      case "decisioncriteria": return "Decision Criteria";
      case "differentiation": return "Differentiation";
      default: return "Wrap-Up";
    }
  };

  return (
    <div className={`${DEFAULT_CLASSNAME}`}>
      <div className={`${DEFAULT_CLASSNAME}-status`}>
        {uiType === "dgt" ?
          <React.Fragment>
            <p>100% Complete</p>
            <div className="progress">
              <div className="progress-bar bg-success" role="progressbar" style={{ width: "100%" }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" />
            </div>
          </React.Fragment> :
          <React.Fragment>
            <p>{percentComplete}% Complete</p>
            <div className="progress">
              <div className="progress-bar bg-success" role="progressbar" style={{ width: `${percentComplete}%` }} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" />
            </div>
          </React.Fragment>
        }
      </div>
      <div className={`${DEFAULT_CLASSNAME}-options`}>
        <div className={classNames(`${DEFAULT_CLASSNAME}-options-items`, { "pe-none": uiType !== "dgt" })}>
          <div className="timeline">
            {data.length > 0 && data.map((question, index) => (
              <div key={`option-item-${index}`} className="item" onClick={() => handleClick(question, index)} role="link">
                <div>
                  <div className={`indicator ${getStatus(index)}`}>
                    {index + 1}
                  </div>
                  <div className={`progress ${getStatus(index)}`} />
                </div>
                <div className={`text ${getStatus(index)}`}>{renderTheCategoryName(question.categoryName)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyNav;
