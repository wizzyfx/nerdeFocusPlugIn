import React from "react";
import "./index.less";

const Toolbar: React.FC = () => {
  return (
    <div className="toolbar">
      <div className="group">
        <button id="captureButton" className="toolbarButton record">
          Record
        </button>
        <button id="clearButton" className="toolbarButton clear">
          Clear
        </button>
      </div>
      <div className="group">
        <button
          id="highlightButton"
          className="toolbarButton highlight"
          aria-label="Turn On Focus Indicator"
        >
          Show Indicator
        </button>
        <input
          id="colorPicker"
          type="color"
          value="#FF0000"
          title="Indicator Color"
          aria-label="Indicator Color"
          disabled
        />
      </div>
      <div className="group">
        <button
          id="animationButton"
          className="toolbarButton animation on"
          aria-label="Turn Off Animation"
          disabled
        >
          Animate Indicator
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
