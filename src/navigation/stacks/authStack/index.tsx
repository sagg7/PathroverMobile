import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../../screens/Auth/Login';
import Walkthrough from '../../../screens/Auth/Walkthrough';
import { Routes } from '../../../shared/exporter';
import GetStarted from '../../../screens/Auth/GetStarted';
import ContinueAs from '../../../screens/Auth/ContinueAs';

type AuthStackParamList = {
  LoginScreen: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();
const AuthStack: React.FC = () => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.Walkthrough} component={Walkthrough} />
      <Stack.Screen name={Routes.LoginScreen} component={LoginScreen} />
      <Stack.Screen name={Routes.GetStarted} component={GetStarted} />
      <Stack.Screen name={Routes.ContinueAs} component={ContinueAs} />

    </Stack.Navigator>
  );
};

export default AuthStack;
