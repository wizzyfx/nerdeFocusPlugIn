import { configureStore } from "@reduxjs/toolkit";
import indicatorReducer from "./indicatorSlice";

export const store = configureStore({
  reducer: {
    indicator: indicatorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
