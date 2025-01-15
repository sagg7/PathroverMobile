import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTab} from '../../components';
import RequestList from '../../screens/App/Driver/RequestList';
import DriverWallet from '../../screens/App/Driver/DriverWallet';
import OrderHistory from '../../screens/App/Driver/OrderHistory';
import Settings from '../../screens/App/Driver/Settings';

const Tab = createBottomTabNavigator();
const DriverTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="RequestList"
      screenOptions={{headerShown: false}}
      tabBar={props => <BottomTab {...props} />}>
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={RequestList}
        name={'Request List'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={DriverWallet}
        name={'Wallet'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={OrderHistory}
        name={'Order History'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={Settings}
        name={'More'}
      />
    </Tab.Navigator>
  );
};

export {DriverTabs};
