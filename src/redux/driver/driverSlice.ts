import {createSlice} from '@reduxjs/toolkit';

const driverSlice = createSlice({
  name: 'driver',
  initialState: {
    driverProfile: {},
    isProfileVerified: false,
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
      state.driverProfile = {};
    },
  },
});

export const {setDriverProfile, setDriverProfileEmpty, setIsProfileVerified} =
  driverSlice.actions;

export default driverSlice.reducer;
