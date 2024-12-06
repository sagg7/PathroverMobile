import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DriverTabs} from './DriverTabs';
import {ManagerTabs} from './ManagerTabs';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();
const AppStack = () => {
  const userRole = useSelector(state=>state.auth.userRole)
  
  return (
    // userRole ==='endUser'?
    //  <DriverTabs/>
    //  :
    <ManagerTabs />
  );
};

export {AppStack};
