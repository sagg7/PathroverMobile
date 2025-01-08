import {createSlice} from '@reduxjs/toolkit';

const driverSlice = createSlice({
  name: 'driver',
  initialState: {
    driverProfile: {},
    isProfileVerified: false,
    isDriverAvailable: false,
  },
  reducers: {
    setDriverProfile: (state, action) => {
      const updates = action.payload;
      state.driverProfile = {
        ...state.driverProfile,
        ...updates,
      };
    },
    setDriverProfileEmpty: (state, action) => {
      state.driverProfile = {};
    },
    setIsProfileVerified: (state, action) => {
      state.isProfileVerified = action.payload;
    },
    setIsDriverAvailable: (state, action) => {
      console.log('DRIVER AVAILABLE==>', action.payload);

      state.isDriverAvailable = action.payload;
    },
  },
});

export const {
  setDriverProfile,
  setDriverProfileEmpty,
  setIsProfileVerified,
  setIsDriverAvailable,
} = driverSlice.actions;

export default driverSlice.reducer;
