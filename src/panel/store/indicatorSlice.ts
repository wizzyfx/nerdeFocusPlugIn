import { createSlice } from "@reduxjs/toolkit";

export const indicatorSlice = createSlice({
  name: "indicator",
  initialState: {
    color: "#ff0000",
    visible: false,
    animate: false,
  },
  reducers: {
    setColor: (state, action) => {
      state.color = action.payload;
    },
    setAnimation: (state, action) => {
      state.animate = action.payload;
    },
    setVisibility: (state, action) => {
      state.visible = action.payload;
    },
  },
});

export const { setColor, setAnimation, setVisibility } = indicatorSlice.actions;
export default indicatorSlice.reducer;
