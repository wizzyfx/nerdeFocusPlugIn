import React from "react";
import { useFocus, FocusScope, useFocusManager } from "react-aria";
import "../index.less";
import "./Toolbar.less";
import ToolbarButton from "./ToolbarButton";
import ToolbarToggle from "./ToolbarToggle";
import ToolbarColorPicker from "./ToolbarColorPicker";

const Toolbar: React.FC = () => {
  return (
    <div
      className={`toolbar`}
      role="toolbar"
      aria-label="NerdeFocus Controls"
      id="toolbar"
    >
      <FocusScope>
        <ToolbarToggle onIcon="record" offIcon="record">
          Record
        </ToolbarToggle>
        <ToolbarButton icon="trash">Clear</ToolbarButton>
        <ToolbarToggle onIcon="check" offIcon="record">
          Show Indicator
        </ToolbarToggle>
        <ToolbarColorPicker>Indicator Color</ToolbarColorPicker>
        <ToolbarToggle onIcon="check" offIcon="record">
          Animate Indicator
        </ToolbarToggle>
      </FocusScope>
    </div>
  );
};

export default Toolbar;
