import React from "react";

export default function TopBar({ title, username }) {
  return (
    <header className="topBar">
      <div className="topBarInner">
        <div className="brand">
          <span className="brandMark">◻︎</span>
          <span className="brandText">{username}</span>
        </div>
        <div className="topBarTitle">{title}</div>
        <div className="topBarActions">
          <button className="iconBtn" aria-label="Notifications">
            ⋯
          </button>
        </div>
      </div>
    </header>
  );
}
