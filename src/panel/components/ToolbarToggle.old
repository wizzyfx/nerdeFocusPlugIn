import React from "react";
import "../index.less";
import "./ToolbarButton.less";

function ToolbarToggle(props: {
  children?: React.ReactNode;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <label className="toolbarButton">
      <input
        type="checkbox"
        checked={props.checked}
        disabled={props.disabled}
        onChange={props.onChange}
        className={props.className}
      />
      <span>{props.children}</span>
    </label>
  );
}

export default ToolbarToggle;
