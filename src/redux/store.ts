import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiSlice } from './api/apiSlice';
import authReducer from './auth/authSlice';
import driverSlice from './driver/driverSlice';
import appRoleReduces from './auth/appRoleSlice';

const rootReduer = combineReducers({
	[apiSlice.reducerPath]: apiSlice.reducer,
	auth: authReducer,
	driver:driverSlice,
	appRole:appRoleReduces,

});

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	whitelist: ['auth', 'driver'],
	blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReduer);

const root = (state, action) => {
	if (action.type === 'auth/logOut') {
		return persistedReducer(state, action);
	} else {
		return persistedReducer(state, action);
	}
};
export const store = configureStore({
	reducer: root,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}).concat(apiSlice.middleware),

	// devTools: true
});
export const persistor = persistStore(store);
