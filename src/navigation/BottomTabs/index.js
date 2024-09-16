import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTab} from '../../components';
import RequestList from '../../screens/App/Driver/RequestList';
import DummyScreen3 from '../../screens/App/DummyScreen';
import DummyScreen4 from '../../screens/App/DummyScreen';
import DummyScreen5 from '../../screens/App/DummyScreen';
import DriverWallet from '../../screens/App/Driver/DriverWallet'; 
import OrderHistory from '../../screens/App/Driver/OrderHistory';

const Tab = createBottomTabNavigator();
const AppStack = () => {

  return (
    <Tab.Navigator
      initialRouteName="RequestList"
      screenOptions={{headerShown: false}}
      tabBar={props => <BottomTab {...props} />}>
      
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={RequestList}
        name={'Request Life'}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        component={DummyScreen4}
        name={'Wallet'}
      />
       <Tab.Screen
        options={{unmountOnBlur: true}}
        component={DummyScreen5}
        name={'Order History'}
      />
       <Tab.Screen
        options={{unmountOnBlur: true}}
        component={DummyScreen3}
        name={'More'}
      />

      
    </Tab.Navigator>
  );
};

export {AppStack};
