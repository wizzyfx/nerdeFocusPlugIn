import "../index.less";
import "./ToolbarButton.less";
import React from "react";
import { setColor } from "../store/indicatorSlice";
import { useAppSelector, useAppDispatch } from "../store/hooks";

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
