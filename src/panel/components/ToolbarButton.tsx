import React from "react";
import "../index.less";
import "./ToolbarButton.less";

function ToolbarButton(props: {
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: string;
  onClick?: () => void;
}) {
  const classNames = [
    "toolbarButton",
    ...(props.icon ? ["icon", props.icon] : []),
  ].join(" ");

  return (
    <button className={classNames}>
      <span>{props.children}</span>
    </button>
  );
}

export default ToolbarButton;
