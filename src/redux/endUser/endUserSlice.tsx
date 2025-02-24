import {createSlice} from '@reduxjs/toolkit';

const endUserSlice = createSlice({
  name: 'endUser',
  initialState: {
    createRouteData: {},
  },
  reducers: {
    setCreateRouteData: (state, action) => {
      const updates = action.payload;
      state.createRouteData = {
        ...state.createRouteData,
        ...updates,
      };
    },
    setCreateRouteDataEmpty: (state, action) => {
      state.createRouteData = {};
    },
  },
});

export const {setCreateRouteData, setCreateRouteDataEmpty} =
  endUserSlice.actions;

export default endUserSlice.reducer;
