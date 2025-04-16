import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  trailRoute: {
    startingPoint: [],
    endingPoint: [],
    createRouteData: {},
    downloadMap: {},
    routeData: {},
    routeType: null,
  },
};

const endUserSlice = createSlice({
  name: 'endUser',
  initialState,
  reducers: {
    setStartingPoint: (state, action) => {
      state.trailRoute.startingPoint = action.payload;
    },
    setRouteType: (state, action) => {
      state.trailRoute.routeType = action.payload;
    },
    setEndingPoint: (state, action) => {
      state.trailRoute.endingPoint = action.payload;
    },
    setRouteData: (state, action) => {
      state.trailRoute.routeData = action.payload;
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
    setdownloadMap: (state, action) => {
      console.log('action in reducer', state);
      state.trailRoute.downloadMap = action.payload;
    },
    setdownloadMapEmpty: (state, action) => {
      state.trailRoute.downloadMap = {};
    },
  },
});

export const {
  setStartingPoint,
  setEndingPoint,
  setRouteData,
  resetTrailRoute,
  setCreateRouteDataEmpty,
  setCreateRouteData,
  setdownloadMap,
  setdownloadMapEmpty,
  setRouteType,
} = endUserSlice.actions;

export default endUserSlice.reducer;
