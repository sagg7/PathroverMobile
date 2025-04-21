import { createSlice } from '@reduxjs/toolkit';
import { APP_ROLE } from '../../shared/exporter';

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		loginUser: null,
		accessToken: null,
		refreshToken: {},
		isTokenValid: false,
		isWalkthrough: false,
		sessionExpired: false,
	},
	reducers: {
		setRefreshToken: (state, action) => {
			state.refreshToken = action?.payload;
		},
		setAccessToken: (state, action) => {
			state.accessToken = action?.payload;
			state.sessionExpired = false;
		},
		setLoginUser: (state, action) => {
			state.loginUser = action?.payload;
			state.sessionExpired = false;
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
		setSessionExpired: (state, action) => {
			state.sessionExpired = action.payload;
		},
		resetSessionExpired: (state) => {
			state.sessionExpired = false;
		},
	},
});

export const {
	setRefreshToken,
	logOut,
	setAccessToken,
	setLoginUser,
	setIsTokenValid,
	setIswalkthrough,
	setSessionExpired,
	resetSessionExpired,
} = authSlice.actions;

export default authSlice.reducer;
