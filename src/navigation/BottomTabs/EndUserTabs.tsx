import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {BottomTab} from '../../components';
import DummyScreen from '../../screens/App/DummyScreen';
import Chat from '../../screens/App/EndUser/Chat';
import Home from '../../screens/App/EndUser/Home';
import {Routes} from '../../shared/exporter';
import WellPath from '../../screens/App/EndUser/WellPath';

const Tab = createBottomTabNavigator();
const EndUserTabs = () => {
  return (
    <Tab.Navigator
      // initialRouteName={'Chat'}
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
        component={WellPath}
        name={'WellPath'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={Chat}
        name={'Chat'}
      />
    </Tab.Navigator>
  );
};

export {EndUserTabs};
