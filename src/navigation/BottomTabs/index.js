import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DriverTabs} from './DriverTabs';
import {ManagerTabs} from './ManagerTabs';
import {useSelector} from 'react-redux';
import {APP_ROLE} from '../../shared/exporter';
import Home from '../../screens/App/EndUser/Home';
import {EndUserTabs} from './EndUserTabs';
import AuthStack from '../stacks/authStack';

const Tab = createBottomTabNavigator();
const AppStack = () => {
  const userRole = useSelector(state => state.appRole.userRole);
  const loginUser = useSelector(state => state?.auth?.loginUser);

  return loginUser ? (
    userRole === APP_ROLE.DRIVER ? (
      <DriverTabs />
    ) : userRole === APP_ROLE.MANAGER ? (
      <ManagerTabs />
    ) : (
      APP_ROLE.END_USER && <EndUserTabs />
    )
  ) : (
    <AuthStack />
  );
};

export {AppStack};
