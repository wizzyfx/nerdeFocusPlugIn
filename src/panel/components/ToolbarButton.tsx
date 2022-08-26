import React from "react";
import "../index.less";
import "./ToolbarButton.less";

function ToolbarButton(props: {
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const shouldShowIcon = !!props.icon;

  return (
    <button className="toolbarButton" style={props.style}>
      {shouldShowIcon && (
        <span aria-hidden className={`icon ${props.icon}`}></span>
      )}
      <span>{props.children}</span>
    </button>
  );
}

export default ToolbarButton;
