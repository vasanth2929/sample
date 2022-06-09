import React, { Component } from "react";
import Dock from "react-dock";
import "./SideBar.style.scss";
import { CollapsibleV2 } from "../Collapsible/Collapsible";
import Display from "./CardRow";
import CardRow from "./CardRow";

const DEFAULT_CLASSNAME = "sidebar";

const SideBar = (props) => {
  const {
    accountId,
    buyingCenter,
    isStoryDisabled,
    isVisible,
    storyId,
    onVisibleChange,
    data,
  } = props;

  const letters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const sample_data = {
    "Analytics and Business intelligence": [
      { title: "Analytics", id: 1 },
      { title: "Business intelligence", id: 2 },
      { title: "Machine learning", id: 3 },
      { title: "Enterprise search", id: 4 },
      { title: "Conversation intelligence", id: 5 },
      { title: "Data visualization", id: 6 },
      { title: "Product Analytics", id: 7 },
      { title: "AI/NLP/Deep Learning", id: 8 },
    ],

    "Data management": [
      { title: "Databases", id: 9 },
      { title: "BigData", id: 10 },
      { title: "DataWarehouse", id: 11 },
      { title: "DataLake", id: 12 },
      { title: "DataIntegration", id: 13 },
      { title: "Data visualization", id: 14 },
      { title: "DataQuality", id: 15 },
      { title: "ETL", id: 16 },
    ],
    DevOps: [
      { title: "Continuous Integration", id: 17 },
      { title: "Continuous Deployment", id: 18 },
      { title: "Application Performance Management", id: 19 },
      { title: "Network Ops", id: 20 },
      { title: "Database Monitoring", id: 21 },
      { title: "Incident Management", id: 22 },
    ],
    Security: [
      { title: "Cloud Security", id: 23 },
      { title: "Network Security", id: 24 },
      { title: "Endpoint Security", id: 25 },
      { title: "Application Security", id: 26 },
      { title: "Threat Management", id: 27 },
      { title: "Intrusion Detection", id: 28 },
    ],
    "Process automation": [
      { title: "Cloud Security", id: 29 },
      { title: "Network Security", id: 30 },
      { title: "Endpoint Security", id: 31 },
      { title: "Application Security", id: 32 },
      { title: "Threat Management", id: 33 },
      { title: "Intrusion Detection", id: 34 },
    ],
    "Collaboration and Productivity": [
      { title: "Cloud Security", id: 35 },
      { title: "Network Security", id: 36 },
      { title: "Endpoint Security", id: 37 },
      { title: "Application Security", id: 38 },
      { title: "Threat Management", id: 39 },
      { title: "Intrusion Detection", id: 40 },
    ],
    "Application Development": [
      { title: "Cloud Security", id: 41 },
      { title: "Network Security", id: 42 },
      { title: "Endpoint Security", id: 43 },
      { title: "Application Security", id: 44 },
      { title: "Threat Management", id: 45 },
      { title: "Intrusion Detection", id: 46 },
    ],
  };
  const displayBody = (title) => {
    const newdata = title ? sample_data[title] : data;
    return (
      <div>
        {newdata ? (
          newdata.map(i => <CardRow title={i.title} id={i.id} />)
        ) : (
            <div>No Data Available!!</div>
          )}
      </div>
    );
  };

  return (
    <div className={`${DEFAULT_CLASSNAME}`}>
      <Dock
        dimMode="opaque"
        dimStyle={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        isVisible={isVisible}
        onVisibleChange={onVisibleChange}
        position="right"
        defaultSize={0.26}
      >
        <div className={`${DEFAULT_CLASSNAME}-container`}>
          <div className={`${DEFAULT_CLASSNAME}-wrapper`}>
            <p className={`${DEFAULT_CLASSNAME}-select-market`}>
              Select market
            </p>
            <div className={`${DEFAULT_CLASSNAME}-group-7`}>
              {letters.map((item, index) => (
                <span className={`${DEFAULT_CLASSNAME}-letter`} key={index}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}-search-container`}>
            <i id="icon" className="material-icons">
              search
            </i>
            <input
              type="text"
              className={`${DEFAULT_CLASSNAME}-search-question`}
              placeholder="Search Questions, Polls and reports"
            />
          </div>

          <div className={`${DEFAULT_CLASSNAME}-group-3`}>
            <p className={`${DEFAULT_CLASSNAME}-group-3-heading`}>
              LIST OF MARKET
            </p>
            <div className={`${DEFAULT_CLASSNAME}-collapse`}>
              <CollapsibleV2
                title="Analytics and Business intelligence"
                body={displayBody("Analytics and Business intelligence")}
                openDefault
               />
            </div>
            <div className={`${DEFAULT_CLASSNAME}-collapse`}>
              <CollapsibleV2
                title="Data management"
                body={displayBody("Data management")}
               />{" "}
            </div>
            <div className={`${DEFAULT_CLASSNAME}-collapse`}>
              <CollapsibleV2
                title="DevOps"
                body={displayBody("DevOps")}
               />{" "}
            </div>
            <div className={`${DEFAULT_CLASSNAME}-collapse`}>
              <CollapsibleV2
                title="Security"
                body={displayBody("Security")}
               />{" "}
            </div>
            <div className={`${DEFAULT_CLASSNAME}-collapse`}>
              <CollapsibleV2
                title="Process automation"
                body={displayBody("Process automation")}
               />{" "}
            </div>
            <div className={`${DEFAULT_CLASSNAME}-collapse`}>
              <CollapsibleV2
                title="Collaboration and Productivity"
                body={displayBody("Collaboration and Productivity")}
               />{" "}
            </div>
            <div className={`${DEFAULT_CLASSNAME}-collapse`}>
              <CollapsibleV2
                title="Application Development"
                body={displayBody("Application Development")}
               />{" "}
            </div>
          </div>
        </div>
      </Dock>
    </div>
  );
};

export default SideBar;
