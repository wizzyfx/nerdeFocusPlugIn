import React from "react";
import { useFocus, FocusScope, useFocusManager } from "react-aria";
import "../index.less";
import "./Toolbar.less";
import ToolbarButton from "./ToolbarButton";
import ToolbarToggle from "./ToolbarToggle";
import ToolbarColorPicker from "./ToolbarColorPicker";

const Separator = () => {
  return <div className="separator"></div>;
};

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
        <Separator />
        <ToolbarToggle onIcon="check" offIcon="record">
          Show Indicator
        </ToolbarToggle>
        <Separator />
        <ToolbarToggle onIcon="check" offIcon="record">
          Animate Indicator
        </ToolbarToggle>
        <ToolbarColorPicker>Indicator Color</ToolbarColorPicker>
      </FocusScope>
    </div>
  );
};

export default Toolbar;
