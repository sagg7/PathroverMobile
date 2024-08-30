import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		loginUser: null,
		accessToken: null,
		refreshToken: {},
		isTokenValid: false,
		isWalkthrough:false
	},
	reducers: {
		setRefreshToken: (state, action) => {
			state.refreshToken = action?.payload;
		},
		setAccessToken: (state, action) => {
			state.accessToken = action?.payload;
		},
		setLoginUser: (state, action) => {
			state.loginUser = action?.payload;
		},
		setIsTokenValid: (state, action) => {
			state.isTokenValid = action?.payload;
		},
		setIswalkthrough: (state) => {
			state.isWalkthrough = true;
		},
		
		logOut: (state) => {
			state.accessToken = null;
			state.loginUser = null;
			state.refreshToken = {};
		},
	},
});

export const {
	setRefreshToken,
	logOut,
	setAccessToken,
	setLoginUser,
	setIsTokenValid,
	setIswalkthrough
} = authSlice.actions;

export default authSlice.reducer;
