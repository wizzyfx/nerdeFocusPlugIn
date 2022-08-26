import { createSlice } from "@reduxjs/toolkit";

export const recorderSlice = createSlice({
  name: "recorder",
  initialState: { recording: false, history: [] },
  reducers: {
    setRecorder: (state, action) => {
      state.recording = action.payload;
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const { setRecorder, clearHistory } = recorderSlice.actions;
export default recorderSlice.reducer;
