import indicatorReducer from "./indicatorSlice";
import recorderReducer from "./recorderSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    indicator: indicatorReducer,
    recorder: recorderReducer,
  },
});

store.subscribe(() => {
  console.log(store.getState().indicator);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
