import {createSlice} from '@reduxjs/toolkit';

const driverSlice = createSlice({
  name: 'driver',
  initialState: {
    driverProfile: {},
    isProfileVerified: false,
    isDriverAvailable: false,
    userPickedOffer: {},
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
      state.isDriverAvailable = action.payload;
    },
    setUserPickerOffer: (state, action) => {
      state.userPickedOffer = action.payload;
    },
  },
});

export const {
  setDriverProfile,
  setDriverProfileEmpty,
  setIsProfileVerified,
  setIsDriverAvailable,
  setUserPickerOffer,
} = driverSlice.actions;

export default driverSlice.reducer;
