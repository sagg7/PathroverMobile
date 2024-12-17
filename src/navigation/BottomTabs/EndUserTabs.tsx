import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTab} from '../../components';
import RequestList from '../../screens/App/Driver/RequestList';
import DriverWallet from '../../screens/App/Driver/DriverWallet'; 
import OrderHistory from '../../screens/App/Driver/OrderHistory';
import Settings from '../../screens/App/Driver/Settings';
import { Routes } from '../../shared/exporter';
import DummyScreen from '../../screens/App/DummyScreen';
import VehicleRequest from '../../screens/App/Manager/Vehicle/RequestVehicle';
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
