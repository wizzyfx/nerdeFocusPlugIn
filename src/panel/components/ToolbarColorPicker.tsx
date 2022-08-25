import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setColor } from "../store/indicatorSlice";
import "../index.less";
import "./ToolbarButton.less";

function ToolbarColorPicker(props: {
  children?: React.ReactNode;
  disabled?: boolean;
  onChange?: () => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setColor(e.target.value));
  };

  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.indicator);

  return (
    <label htmlFor="colorPicker" className="toolbarButton">
      <input
        type="color"
        value={todos.color}
        id="colorPicker"
        className="colorPicker"
        onChange={handleChange}
      />
      <span>{props.children}</span>
    </label>
  );
}

export default ToolbarColorPicker;
