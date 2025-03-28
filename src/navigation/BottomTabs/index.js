import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DriverTabs} from './DriverTabs';
import {ManagerTabs} from './ManagerTabs';
import {useSelector} from 'react-redux';
import {APP_ROLE, Routes} from '../../shared/exporter';
import {EndUserTabs} from './EndUserTabs';
import AuthStack from '../stacks/authStack';
import {
  NotificationListener,
  notificationListener,
  onNotifyPress,
} from '../../hooks/NotificationHook';
import PushNotification from 'react-native-push-notification';
import notifee, {EventType} from '@notifee/react-native';
import {Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const AppStack = () => {
  const userRole = useSelector(state => state.appRole.userRole);
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const navigation = useNavigation();

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

  const extractParams = (url: string) => {
    const fixedUrl = url.replace(/\?(?=.*\?)/, '&');

    const queryString = fixedUrl.split('?')[1];

    if (!queryString) return {};
    const params: Record<string, string> = {};
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });

    return {routeType: params['route_type'], routeId: params['route_id']};
  };

  const handleDeepLink = (url: string | null) => {
    if (url) {
      console.log('\n\n\nDeep link received:', url);
      const {routeType, routeId} = extractParams(url);
      console.log('BOTTOTAB=====11======', routeId);
      console.log('=BOTTOTAB====22======', routeType);
      if (
        routeType === 'hiking_waypoint' ||
        routeType === 'waypoint_route' ||
        'maps_location_pins'
      ) {
        navigation.navigate(Routes.ViewWellPathNavigation, {
          entranceCoords: [],
          routeId: routeId,
          entranceName: '',
        });
      } else {
        navigation.navigate(Routes.ViewSharedRoutes, {routeType, routeId});
      }
    }
  };

  useEffect(() => {
    // Handle deep link on app launch
    const fetchInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        handleDeepLink(initialUrl);
      } catch (error) {
        console.warn('Error fetching initial URL', error);
      }
    };
    fetchInitialUrl();

    // Listen for deep links while the app is running
    const subscription = Linking.addEventListener('url', event =>
      handleDeepLink(event.url),
    );

    return () => {
      subscription.remove();
    };
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
