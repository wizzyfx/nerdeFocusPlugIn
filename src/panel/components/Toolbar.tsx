import React from "react";
import { useFocus, FocusScope, useFocusManager } from "react-aria";
import "../index.less";
import "./Toolbar.less";
import ToolbarButton from "./ToolbarButton";

const Toolbar: React.FC = () => {
  return (
    <div className={`toolbar`} role="toolbar" aria-label="NerdeFocus Controls">
      <FocusScope>
        <ToolbarButton />
        <ToolbarButton />
        <ToolbarButton />
      </FocusScope>
    </div>
  );
};

export default Toolbar;
