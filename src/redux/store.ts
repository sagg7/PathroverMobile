import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiSlice} from './api/apiSlice';
import authReducer from './auth/authSlice';
import endUserReducer from './endUser/endUserSlice';
import driverSlice from './driver/driverSlice';
import appRoleReduces from './auth/appRoleSlice';
import managerSlice from './manager/managerSlice';
import chatSlice from './chat/chatSlice';

const rootReduer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  endUser: endUserReducer,
  driver: driverSlice,
  appRole: appRoleReduces,
  manager: managerSlice,
  chat: chatSlice,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'driver', 'chat', 'manager'],
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
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});
export const persistor = persistStore(store);
