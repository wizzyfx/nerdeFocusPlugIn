import React from "react";

const History: React.FC = () => {
  return (
    <ol id="history">
      <li>
        <span className="tag">DIV</span>
        <span
          className="info reset"
          title="Focus was reset and returned to BODY"
        ></span>
        <span
          className="info hidden"
          title="May be visually hidden or out of viewport"
        ></span>
        <span
          className="info frame"
          title="Currently focused item is inside a frame"
        ></span>
        fff
      </li>
      <li className="url">Page Loaded rrr</li>
    </ol>
  );
};

export default History;
