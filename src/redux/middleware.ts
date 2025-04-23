import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { Alert } from "react-native";
import { replace } from "../navigation/navigationRef";
import { APP_ROLE } from "../shared/exporter";
import { setUserRole } from "./auth/appRoleSlice";
import { resetSessionExpired, setAccessToken, setLoginUser } from "./auth/authSlice";
import { setManagerRouteEmpty } from "./manager/managerSlice";

export const authMiddleware = ({ dispatch, getState }) => next => action => {
    const result = next(action);

    const auth = getState().auth ?? {};
    const token_expiration = auth.sessionExpired;

    const SESSION_HANDLING_ACTIONS = new Set([
        'auth/setLoginUser',
        'auth/setSessionExpired',
        'auth/setAccessToken',
        'auth/setUserRole',
        'manager/setManagerRouteEmpty',
        'auth/resetSessionExpired'
    ]);

    if (SESSION_HANDLING_ACTIONS.has(action.type)) {
        return result;
    }

    if (!token_expiration || isRejectedWithValue(action)) {
        return result;
    }

    console.log('Handling session expiration');

    if (!token_expiration) {
        if (isRejectedWithValue(action)) {
            if (
                action.payload.status === 401 &&
                !action.payload?.data?.hasOwnProperty('prevent_token_expiry')
            ) {
    setTimeout(() => {
        dispatch(setLoginUser(null));
        dispatch(setAccessToken(null));
        dispatch(setUserRole(APP_ROLE.END_USER));
        dispatch(setManagerRouteEmpty({}));
        dispatch(resetSessionExpired());
    }, 0);


    // Perform sign out
    GoogleSignin?.signOut();

    // Show alert
    Alert.alert(
        'Session Expired!',
        'Your session has expired. Please sign in again.',
        [{
            text: 'Ok',
            onPress: () => replace('AuthStack'),
        }],
    );
                
            }
        }
    }

    return result;
};
