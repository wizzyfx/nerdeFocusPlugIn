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
  const classNames = [
    "toolbarButton",
    ...(props.onIcon ? ["icon", props.onIcon] : []),
  ].join(" ");

  return (
    <button className={classNames}>
      <span>{props.children}</span>
    </button>
  );
}

export default ToolbarToggle;
