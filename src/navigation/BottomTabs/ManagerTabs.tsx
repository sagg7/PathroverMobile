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

const Tab = createBottomTabNavigator();
const ManagerTabs = () => {

  return (
    <Tab.Navigator
      initialRouteName={Routes.myRequest}
      screenOptions={{headerShown: false,}}
      tabBar={props => <BottomTab {...props} />}
      >
      
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={VehicleRequest}
        name={'My request'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={DummyScreen}
        name={'Create route'}
      />
       <Tab.Screen
        options={{unmountOnBlur: true}}
        component={DummyScreen}
        name={'Request History'}
      />
       <Tab.Screen
        options={{unmountOnBlur: true}}
        component={Settings}
        name={'More'}
      />

      
    </Tab.Navigator>
  );
};

export {ManagerTabs};
