import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trailRoute: {
    startingPoint: [],
    endingPoint: [],
  },
};

const endUserSlice = createSlice({
  name: 'endUser',
  initialState,
  reducers: {
    setStartingPoint: (state, action) => {
      state.trailRoute.startingPoint = action.payload;
    },
    setEndingPoint: (state, action) => {
      state.trailRoute.endingPoint = action.payload;
    },
    resetTrailRoute: (state) => {
      state.trailRoute = initialState.trailRoute;
    },
  },
});

export const { setStartingPoint, setEndingPoint, resetTrailRoute } = endUserSlice.actions;

export default endUserSlice.reducer;
