import React from "react";
import "../index.less";
import "./ToolbarButton.less";

function ToolbarColorPicker(props: {
  children?: React.ReactNode;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <label htmlFor="colorPicker">
      <span>Color</span>
      <input type="color" value="#ff0000" id="colorPicker" />
    </label>
  );
}

export default ToolbarColorPicker;
