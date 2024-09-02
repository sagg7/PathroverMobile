import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './stacks/authStack';
// import Splash from '../screens/Splash';
import { Routes } from '../shared/exporter';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Routes.Splash}
        screenOptions={{ headerShown: false, }}>
        {/* <Stack.Screen name={Routes.Splash} component={Splash} /> */}
        <Stack.Screen name="AuthStack" component={AuthStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
