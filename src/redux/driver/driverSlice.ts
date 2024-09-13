import { createSlice } from '@reduxjs/toolkit';

const driverSlice = createSlice({
	name: 'driver',
	initialState: {
		driverProfile:{}
	},
	reducers: {
		setDriverProfile: (state, action) => {
			const updates = action.payload
			state.driverProfile = {
				...state.driverProfile,
				...updates
			};
		},
		setDriverProfileEmpty: (state, action) => {
			state.driverProfile = {};

		},
	},
});

export const {
	setDriverProfile,
	setDriverProfileEmpty
} = driverSlice.actions;

export default driverSlice.reducer;
