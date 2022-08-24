import React from "react";
import "../index.less";
import "./ToolbarButton.less";

function ToolbarColorPicker(props: {
  children?: React.ReactNode;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <label htmlFor="colorPicker" className="toolbarButton">
      <input
        type="color"
        value="#ff0000"
        id="colorPicker"
        className="colorPicker"
      />
      <span>{props.children}</span>
    </label>
  );
}

export default ToolbarColorPicker;
