import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTab} from '../../components';
import {Routes} from '../../shared/exporter';
import DummyScreen from '../../screens/App/DummyScreen';
import Home from '../../screens/App/EndUser/Home';

const Tab = createBottomTabNavigator();
const EndUserTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName={Routes.myRequest}
      screenOptions={{headerShown: false}}
      tabBar={props => <BottomTab {...props} />}>
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={Home}
        name={'Home'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={DummyScreen}
        name={'Hiking'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={DummyScreen}
        name={'WellPath'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={DummyScreen}
        name={'Chat'}
      />
    </Tab.Navigator>
  );
};

export {EndUserTabs};
