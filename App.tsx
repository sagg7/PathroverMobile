import React, {useEffect} from 'react';
import AppNavigation from './src/navigation';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import MapboxGL from '@rnmapbox/maps';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {firebase} from '@react-native-firebase/app';
import {withIAPContext} from 'react-native-iap';
import {LogBox, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
let watchID: number | null | any = null;

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
      const allGranted = Object.values(granted).every(
        status => status === 'granted',
      );
      if (allGranted) {
        // setHasPermission(true);
      } else {
        // setError('Permission denied');
      }
    }
  };

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
      <AppNavigation />
    </Provider>
  );
};

export default withIAPContext(App);
