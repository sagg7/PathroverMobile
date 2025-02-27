import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DriverTabs} from './DriverTabs';
import {ManagerTabs} from './ManagerTabs';
import {useSelector} from 'react-redux';
import {APP_ROLE} from '../../shared/exporter';
import {EndUserTabs} from './EndUserTabs';
import AuthStack from '../stacks/authStack';
import {
  NotificationListener,
  notificationListener,
  onNotifyPress,
} from '../../hooks/NotificationHook';
import PushNotification from 'react-native-push-notification';
import notifee, {EventType} from '@notifee/react-native';

const Tab = createBottomTabNavigator();
const AppStack = () => {
  const userRole = useSelector(state => state.appRole.userRole);
  const loginUser = useSelector(state => state?.auth?.loginUser);

  useEffect(() => {
    NotificationListener(onNotifyPress);
  }, []);

  useEffect(() => {
    return notifee.onBackgroundEvent(async ({type, detail}) => {
      const {notification} = detail;
      onNotifyPress(notification, type);
    });
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(async ({type, detail}) => {
      const {notification} = detail;
      onNotifyPress(notification, type);
    });
  }, []);
  // useEffect(() => {
  //   const unsubscribeNotificationListener: any = notificationListener();
  //   return () => {
  //     // Cleanup notification listeners
  //     unsubscribeNotificationListener();

  //     // Clear all delivered and local notifications
  //     PushNotification.getDeliveredNotifications((all: any) => {
  //       PushNotification.removeAllDeliveredNotifications();
  //       PushNotification.cancelAllLocalNotifications();
  //     });
  //   };
  // }, []);

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
