import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DriverTabs} from './DriverTabs';
import {ManagerTabs} from './ManagerTabs';
import {useDispatch, useSelector} from 'react-redux';
import {
  APP_ROLE,
  generateGeoJsonFeature,
  isIOS,
  Routes,
} from '../../shared/exporter';
import {EndUserTabs} from './EndUserTabs';
import AuthStack from '../stacks/authStack';
import {
  onDisplayNotification,
  onNotifyPress,
  setupActionHandlers,
} from '../../hooks/NotificationHook';
import {Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useUpdateCallMutation} from '../../redux/chat/chatApiSlice';
import messaging, {getMessaging} from '@react-native-firebase/messaging';
import {useGetRouteBasedIdMutation} from '../../redux/endUser/endUserApiSlice';
import useLocation from '../../hooks/getLocation';
import {setSelectedTrail} from '../../redux/endUser/endUserSlice';

const Tab = createBottomTabNavigator();
const AppStack = () => {
  const navigation = useNavigation();
  const userRole = useSelector(state => state.appRole.userRole);
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const [updateCall, {error}] = useUpdateCallMutation();
  const [getRouteBasedId, {isLoading, data}] = useGetRouteBasedIdMutation();
  const {location} = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    NotificationListener(navigation);
  }, []);

  const updateCallStatus = async (status, id, receiver_id) => {
    try {
      const obj = {
        status: status ?? '',
        id: id ?? '',
        receiver_id: receiver_id ?? '',
      };
      // console.log('updateCall obj--bottom tab notification--------->>>>>>>>>>>>>>', obj);
      const res = await updateCall(obj);

      // console.log('updateCall res------------------', res);
    } catch (error) {
      // console.log('error in update call status------------------', error);
    }
  };

  // Modified NotificationListener
  const NotificationListener = navigation => {
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
  useEffect(() => {
    if (data) {
      let formatedHikeData;
      const routeData = data?.user_routes[0];
      if (routeData?.route_type === 'hiking_trail_route') {
        formatedHikeData = generateGeoJsonFeature(routeData);
        dispatch(setSelectedTrail(formatedHikeData));

        navigation.navigate(Routes.TurnByTurnNav, {
          entranceCoords: geoJsonFeature?.geometry?.coordinates[0],
          entranceName: routeData?.name,
          originCoords: [location?.longitude, location?.latitude],
          isTrail: true,
        });
      } else {
        navigation.navigate(Routes.TurnByTurnNav, {
          entranceCoords: [
            Number(routeData?.dropoff_location?.longitude),
            Number(routeData?.dropoff_location?.latitude),
          ],
          entranceName: routeData?.name,
          originCoords: [location?.longitude, location?.latitude],
          isTrail: false,
          routeInfo: routeData,
        });
      }

      // navigation.navigate(Routes.TurnByTurnNav, {
      //   // entranceCoords: [
      //   //   Number(routeData?.dropoff_location?.longitude),
      //   //   Number(routeData?.dropoff_location?.latitude),
      //   // ],
      //   entranceCoords: geoJsonFeature?.geometry?.coordinates[0],
      //   entranceName: routeData?.name,
      //   originCoords: [location?.longitude, location?.latitude],
      //   isTrail: routeData?.route_type === 'hiking_trail_route',
      // });
    }
  }, [data]);

  const handleDeepLink = (url: string | null) => {
    if (url) {
      const {routeType, routeId} = extractParams(url);
      if (routeType) {
        if (routeType) {
          if (isIOS()) {
            if (routeId) getRouteBasedId(routeId);
          } else {
            navigation.navigate(Routes.ViewWellPathNavigation, {
              entranceCoords: [],
              routeId: routeId,
              entranceName: '',
            });
          }
        } else {
          navigation.navigate(Routes.ViewSharedRoutes, {routeType, routeId});
        }
      } else {
        navigation.navigate('AppStack');
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
