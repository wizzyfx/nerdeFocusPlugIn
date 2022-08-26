import React from "react";
import { useFocus, FocusScope, useFocusManager } from "react-aria";
import "../index.less";
import "./Toolbar.less";
import ToolbarButton from "./ToolbarButton";
import ToolbarToggle from "./ToolbarToggle";
import ToolbarColorPicker from "./ToolbarColorPicker";
import { setColor, setAnimation, setVisibility } from "../store/indicatorSlice";
import { useAppSelector, useAppDispatch } from "../store/hooks";

const Separator = () => {
  return <div className="separator"></div>;
};

const Toolbar: React.FC = () => {
  const indicatorState = useAppSelector((state) => state.indicator);
  const dispatch = useAppDispatch();

  return (
    <div
      className={`toolbar`}
      role="toolbar"
      aria-label="NerdeFocus Controls"
      id="toolbar"
    >
      <FocusScope>
        <ToolbarToggle className="record">Record</ToolbarToggle>
        <ToolbarButton icon="trash">Clear</ToolbarButton>
        <Separator />
        <ToolbarToggle
          checked={indicatorState.visible}
          onChange={(event) => {
            dispatch(setVisibility(event.target.checked));
          }}
        >
          Show Indicator
        </ToolbarToggle>
        <Separator />
        <ToolbarToggle
          checked={indicatorState.animate}
          onChange={(event) => {
            dispatch(setAnimation(event.target.checked));
          }}
        >
          Animate Indicator
        </ToolbarToggle>
        <ToolbarColorPicker
          value={indicatorState.color}
          onChange={(event) => dispatch(setColor(event.target.value))}
        >
          Indicator Color
        </ToolbarColorPicker>
        <ToolbarButton icon="info" style={{ marginLeft: "auto" }}>
          <span className="visually-hidden">About</span>
        </ToolbarButton>
      </FocusScope>
    </div>
  );
};

export default Toolbar;
