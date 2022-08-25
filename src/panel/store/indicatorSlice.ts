import { createSlice } from "@reduxjs/toolkit";

export const indicatorSlice = createSlice({
  name: "indicator",
  initialState: { color: "#ff0000", visible: true, false: false },
  reducers: {
    setColor: (state, action) => {
      state.color = action.payload;
    },
  },
});

export const { setColor } = indicatorSlice.actions;
export default indicatorSlice.reducer;
