import "../index.less";
import "./Toolbar.less";
import React, { useEffect } from "react";
import ToolbarButton from "./ToolbarButton";
import ToolbarColorPicker from "./ToolbarColorPicker";
import ToolbarToggle from "./ToolbarToggle";
import { ActionCreatorWithOptionalPayload } from "@reduxjs/toolkit";
import { setColor, setAnimation, setVisibility } from "../store/indicatorSlice";
import { setRecorder, clearHistory } from "../store/recorderSlice";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useFocus, FocusScope, useFocusManager } from "react-aria";

const Separator = () => {
  return <div className="separator"></div>;
};

const Toolbar: React.FC = () => {
  const indicatorState = useAppSelector((state) => state.indicator);
  const recordingState = useAppSelector((state) => state.recorder);
  const dispatch = useAppDispatch();

  const handleStateChange = (
    handler: ActionCreatorWithOptionalPayload<any>
  ) => {
    return (event?: React.ChangeEvent<HTMLInputElement>) => {
      if (!event) {
        dispatch(handler());
      } else {
        switch (event.target.type) {
          case "color":
            dispatch(handler(event.target.value));
            break;
          case "checkbox":
            dispatch(handler(event.target.checked));
            break;
          default:
            break;
        }
      }
    };
  };

  return (
    <div
      className={`toolbar`}
      role="toolbar"
      aria-label="NerdeFocus Controls"
      id="toolbar"
    >
      <FocusScope>
        <ToolbarToggle
          className="record"
          checked={recordingState.recording}
          onChange={handleStateChange(setRecorder)}
        >
          Record
        </ToolbarToggle>
        <ToolbarButton icon="trash" onClick={handleStateChange(clearHistory)}>
          Clear
        </ToolbarButton>
        <Separator />
        <ToolbarToggle
          checked={indicatorState.visible}
          onChange={handleStateChange(setVisibility)}
        >
          Show Indicator
        </ToolbarToggle>
        <Separator />
        <ToolbarToggle
          checked={indicatorState.animate}
          onChange={handleStateChange(setAnimation)}
        >
          Animate Indicator
        </ToolbarToggle>
        <ToolbarColorPicker
          value={indicatorState.color}
          onChange={handleStateChange(setColor)}
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
