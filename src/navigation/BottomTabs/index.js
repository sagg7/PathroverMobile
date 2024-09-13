import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTab} from '../../components';
import RequestList from '../../screens/App/Driver/RequestList';
import DummyScreen2 from '../../screens/App/DummyScreen';
import DummyScreen3 from '../../screens/App/DummyScreen';
import DummyScreen4 from '../../screens/App/DummyScreen';



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
        component={DummyScreen2}
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
