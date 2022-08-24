import React from "react";
import "../index.less";
import "./ToolbarButton.less";

function ToolbarToggle(props: {
  children?: React.ReactNode;
  disabled?: boolean;
  onIcon?: string;
  offIcon?: string;
  onClick?: () => void;
}) {
  const shouldShowIcon = props.onIcon && props.offIcon;

  return (
    <button className="toolbarButton">
      {shouldShowIcon && (
        <span aria-hidden className={`icon ${props.onIcon}`}></span>
      )}
      <span>{props.children}</span>
    </button>
  );
}

export default ToolbarToggle;
