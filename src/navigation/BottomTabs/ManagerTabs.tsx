import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTab} from '../../components';
import {Routes} from '../../shared/exporter';
import DummyScreen from '../../screens/App/DummyScreen';
import VehicleRequest from '../../screens/App/Manager/Vehicle/RequestVehicle';
import ManagerSettings from '../../screens/App/Manager/Settings';
import CreateRoute from '../../screens/App/Manager/CreateRoute';
import CreateRouteMain from '../../screens/App/Manager/CreateRouteMain';

const Tab = createBottomTabNavigator();
const ManagerTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName={Routes.myRequest}
      screenOptions={{headerShown: false}}
      tabBar={props => <BottomTab {...props} />}>
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={VehicleRequest}
        name={'My request'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={CreateRouteMain}
        name={'Create route'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={DummyScreen}
        name={'Request History'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={ManagerSettings}
        name={'More'}
      />
    </Tab.Navigator>
  );
};

export {ManagerTabs};
