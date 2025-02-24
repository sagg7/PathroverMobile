import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  trailRoute: {
    startingPoint: [],
    endingPoint: [],
    createRouteData: {},
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
    resetTrailRoute: state => {
      state.trailRoute = initialState.trailRoute;
    },
    setCreateRouteData: (state, action) => {
      const updates = action.payload;
      state.trailRoute.createRouteData = {
        ...state.trailRoute.createRouteData,
        ...updates,
      };
    },
    setCreateRouteDataEmpty: (state, action) => {
      state.trailRoute.createRouteData = {};
    },
  },
});

export const {
  setStartingPoint,
  setEndingPoint,
  resetTrailRoute,
  setCreateRouteDataEmpty,
  setCreateRouteData,
} = endUserSlice.actions;

export default endUserSlice.reducer;
