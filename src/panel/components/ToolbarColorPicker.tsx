import "../index.less";
import "./ToolbarButton.less";
import React from "react";

function ToolbarColorPicker(props: {
  value: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className="toolbarButton">
      <input
        type="color"
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      <span>{props.children}</span>
    </label>
  );
}

export default ToolbarColorPicker;
