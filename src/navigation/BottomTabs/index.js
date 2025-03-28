import messaging, { getMessaging } from '@react-native-firebase/messaging';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  onDisplayNotification,
  onNotifyPress,
  setupActionHandlers
} from '../../hooks/NotificationHook';
import { APP_ROLE } from '../../shared/exporter';
import AuthStack from '../stacks/authStack';
import { DriverTabs } from './DriverTabs';
import { EndUserTabs } from './EndUserTabs';
import { ManagerTabs } from './ManagerTabs';
import { useUpdateCallMutation } from '../../redux/chat/chatApiSlice';


const Tab = createBottomTabNavigator();
const AppStack = () => {
const navigation = useNavigation();
  const userRole = useSelector(state => state.appRole.userRole);
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const [updateCall, {error}] = useUpdateCallMutation();
  
  useEffect(() => {
    NotificationListener(navigation);
  }, [])

    const updateCallStatus = async (status, id) => {
      try {
        const obj = {
          status: status ?? '',
          id: id ?? '',
        };
        console.log('updateCall obj----------->>>>>>>>>>>>>>', obj);
        const res = await updateCall(obj);

        // console.log('updateCall res------------------', res);
      } catch (error) {
        console.log('error in update call status------------------', error);
      }
    };

  // Modified NotificationListener
  const NotificationListener = (navigation) => {
    // Setup action handlers first
    setupActionHandlers(navigation, updateCallStatus);

    // Firebase message handlers
    getMessaging().onNotificationOpenedApp(remoteMessage => {
      // console.log('App opened from background:', remoteMessage);
      onNotifyPress(remoteMessage, navigation);
    });

    messaging().onMessage(async remoteMessage => {
      // console.log('Foreground message received:', remoteMessage);
      // Only display, don't auto-handle
      onDisplayNotification(remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // console.log('Background message received:', remoteMessage);
      onDisplayNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // console.log('App opened from quit state:', remoteMessage);
          // onNotifyPress(remoteMessage, navigation);
        }
      });
  };

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

export { AppStack };

