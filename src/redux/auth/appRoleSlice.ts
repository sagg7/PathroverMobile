import { createSlice } from '@reduxjs/toolkit';
import { APP_ROLE } from '../../shared/exporter';

const appRoleSlice = createSlice({
	name: 'appRole',
	initialState: {
		userRole : APP_ROLE.END_USER
	},
	reducers: {
		setUserRole: (state, action) => {
			state.userRole = action?.payload;
		},
	},
});

export const {
	setUserRole,
} = appRoleSlice.actions;

export default appRoleSlice.reducer;
