import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DriverTabs} from './DriverTabs';
import {ManagerTabs} from './ManagerTabs';
import {useSelector} from 'react-redux';
import {APP_ROLE} from '../../shared/exporter';
import {EndUserTabs} from './EndUserTabs';
import AuthStack from '../stacks/authStack';
import {notificationListener} from '../../hooks/NotificationHook';
import PushNotification from 'react-native-push-notification';

const Tab = createBottomTabNavigator();
const AppStack = () => {
  const userRole = useSelector(state => state.appRole.userRole);
  const loginUser = useSelector(state => state?.auth?.loginUser);

  useEffect(() => {
    const unsubscribeNotificationListener: any = notificationListener();
    return () => {
      // Cleanup notification listeners
      unsubscribeNotificationListener();

      // Clear all delivered and local notifications
      PushNotification.getDeliveredNotifications((all: any) => {
        PushNotification.removeAllDeliveredNotifications();
        PushNotification.cancelAllLocalNotifications();
      });
    };
  }, []);

  return loginUser ? (
    userRole === APP_ROLE.DRIVER ? (
      <DriverTabs />
    ) : userRole === APP_ROLE.MANAGER ? (
      <ManagerTabs />
    ) : (
      <EndUserTabs />
    )
  ) : (
    <AuthStack />
  );
};

export {AppStack};
