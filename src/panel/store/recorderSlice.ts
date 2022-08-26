import { createSlice } from "@reduxjs/toolkit";

export const recorderSlice = createSlice({
  name: "recorder",
  initialState: { recording: false, history: [] },
  reducers: {
    setRecorder: (state, action) => {
      state.recording = action.payload;
    },
  },
});

export const { setRecorder } = recorderSlice.actions;
export default recorderSlice.reducer;
