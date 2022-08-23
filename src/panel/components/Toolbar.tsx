import React from "react";
import { useFocus, FocusScope, useFocusManager } from "react-aria";
import "../index.less";
import "./Toolbar.less";
import ToolbarButton from "./ToolbarButton";

const Toolbar: React.FC = () => {
  return (
    <div
      className={`toolbar`}
      role="toolbar"
      aria-label="NerdeFocus Controls"
      id="toolbar"
    >
      <FocusScope>
        <ToolbarButton icon="record">Record</ToolbarButton>
        <ToolbarButton icon="trash">Clear</ToolbarButton>
        <ToolbarButton icon="check">Show Indicator</ToolbarButton>
        <ToolbarButton icon="color">Pick Color</ToolbarButton>
        <ToolbarButton icon="check">Animate Indicator</ToolbarButton>
      </FocusScope>
    </div>
  );
};

export default Toolbar;
