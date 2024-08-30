import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../../screens/Auth/Login';
import Walkthrough from '../../../screens/Auth/Walkthrough';
import { Routes } from '../../../shared/exporter';
import GetStarted from '../../../screens/Auth/GetStarted';
import ContinueAs from '../../../screens/Auth/ContinueAs';
import SignupScreen from '../../../screens/Auth/Signup';
import SetPassword from '../../../screens/Auth/SetPassword';
import ResetPassword from '../../../screens/Auth/ResetPassword';
import ForgotPassword from '../../../screens/Auth/ForgotPassword';
import VerifyOtpScreen from '../../../screens/Auth/VerifyOtp';
import AccountCreationSuccess from '../../../screens/Auth/AccountCreationSuccess';


type AuthStackParamList = {
  LoginScreen: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();
const AuthStack: React.FC = () => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.Walkthrough} component={Walkthrough} />
      <Stack.Screen name={Routes.LoginScreen} component={LoginScreen} />
      <Stack.Screen name={Routes.VerifyOtp} component={VerifyOtpScreen} />
      <Stack.Screen name={Routes.GetStarted} component={GetStarted} />
      <Stack.Screen name={Routes.ContinueAs} component={ContinueAs} />
      <Stack.Screen name={Routes.SignupScreen} component={SignupScreen} />
      <Stack.Screen name={Routes.SetPassword} component={SetPassword} />
      <Stack.Screen name={Routes.ResetPassword} component={ResetPassword} />
      <Stack.Screen name={Routes.ForgotPassword} component={ForgotPassword} />
      <Stack.Screen name={Routes.AccountCreationSuccess} component={AccountCreationSuccess} />


    </Stack.Navigator>
  );
};

export default AuthStack;
