import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { store } from "./store";
import { Alert } from "react-native";
import { Routes } from "../shared/exporter";
import { setLoginUser, setSessionExpired } from "./auth/authSlice";
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { replace } from "../helpers/navigationHelper";

export const authMiddleware =
    ({ dispatch }) =>
        next =>
            action => {
                const tokenExpiration = store.getState(state => state);
                const token_expiration = tokenExpiration?.auth?.sessionExpired;
                if (!token_expiration) {
                    if (isRejectedWithValue(action)) {
                        if (
                            action.payload.status === 401 &&
                            !action.payload?.data?.hasOwnProperty('prevent_token_expiry')
                        ) {
                            store.dispatch(setLoginUser(''));
                            store.dispatch(setSessionExpired(true));
                            GoogleSignin?.signOut();
                            Alert.alert(
                                'Session Expired!',
                                'Your session has been expired. Please Signin again.',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => replace(Routes.LoginScreen),
                                    },
                                ],
                            );
                        }
                    }
                }

                return next(action);
            };
