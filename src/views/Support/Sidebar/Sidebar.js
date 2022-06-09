import React from 'react';
// import { useHistory } from "react-router-dom";
import './styles/Sidebar.styles.scss';

export function Sidebar(props) {
  return (
    <div className="support-sidebar-wrapper">
      <div className="sidebar-content">
        <div
          className="nav flex-column nav-pills"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          {props.menu.map((item, i) => {
            if (item.disabled) {
              return (
                <div className="nav-link nav-link-disabled">{item.label}</div>
              );
            } else if (props.onChange) {
              return (
                <div
                  className="nav-link"
                  onClick={() => {
                    props.onChange(item.target);
                  }}
                >
                  {item.label}
                </div>
              );
            }
            return (
              <a
                className={`nav-link ${
                  props.selected === item.label ? 'active' : ''
                }`}
                id="v-pills-home-tab"
                data-toggle="pill"
                href={`/${item.target}`}
                role="tab"
                aria-controls="v-pills-home"
                aria-selected="true"
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
