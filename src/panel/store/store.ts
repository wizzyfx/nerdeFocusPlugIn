import indicatorReducer from "./indicatorSlice";
import recorderReducer from "./recorderSlice";
import { configureStore } from "@reduxjs/toolkit";

export interface ContentScriptState {
  color: string;
  visible: boolean;
  animate: boolean;
  recording: boolean;
}

export const store = configureStore({
  reducer: {
    indicator: indicatorReducer,
    recorder: recorderReducer,
  },
});

let currentState: ContentScriptState;
store.subscribe(() => {
  const previousState = currentState;
  currentState = {
    ...store.getState().indicator,
    recording: store.getState().recorder.recording,
  };
  if (currentState !== previousState) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(<number>tabs[0].id, { ...currentState });
    });
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
