import React, {useEffect} from 'react';
import AppNavigation from './src/navigation';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import MapboxGL from '@rnmapbox/maps';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {firebase} from '@react-native-firebase/app';
import {withIAPContext} from 'react-native-iap';
import {LogBox, PermissionsAndroid, Platform, Linking} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {createNavigationContainerRef} from '@react-navigation/native';

const navigationRef = createNavigationContainerRef();

const navigate = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    console.log('HERE NAVIGATION');

    navigationRef.navigate(name, params);
  }
};

let watchID: number | null = null;

const App = () => {
  MapboxGL.setAccessToken(
    'pk.eyJ1IjoibWF0YW9zbWFuIiwiYSI6ImNseXowMmk5bDJoejEyaXB5Nm43ZzN4OTMifQ.uiO6BX51I9umZzjAK2Ox6g',
  );

  LogBox.ignoreAllLogs();

  const askForPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      Object.values(granted).every(status => status === 'granted');
    }
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

  const handleDeepLink = (url: string | null) => {
    if (url) {
      console.log('\n\n\nDeep link received:', url);
      const {routeType, routeId} = extractParams(url);
      console.log('=====11======', routeId);
      console.log('=====22======', routeType);
      // if (routeType) {
      //   // navigate('ViewSharedRoute', {routeType, routeId});
      //   setTimeout(() => {
      //     if (navigationRef.isReady()) {
      //       console.log('HERE NAVIGATION');
      //       navigationRef.navigate('ViewSharedRoute', {routeType, routeId});
      //     } else {
      //       console.warn('Navigation is not ready yet');
      //     }
      //   }, 500); // Delay to ensure navigation is ready
      // }
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

  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('always');
        // setHasPermission(true);
      } else {
        await askForPermissions();
      }
    };

    checkPermissions();

    return () => {
      if (watchID) {
        Geolocation.clearWatch(watchID);
      }
    };
  }, []);

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp();
    }
    GoogleSignin.configure({
      webClientId:
        '123757988773-m693cnqd674b9nvd3kat3bdp6eh1226j.apps.googleusercontent.com',
      iosClientId:
        '123757988773-c0sece94e2pm7eqj1g48b3b15b2avm46.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  return (
    <Provider store={store}>
      {/* Directly render AppNavigation, since it already contains NavigationContainer */}
      <AppNavigation />
    </Provider>
  );
};

export default withIAPContext(App);
