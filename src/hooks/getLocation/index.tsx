import {useState, useEffect, useCallback} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const useLocation = () => {
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  let watchID: number | null | any = null;

  const getLocation = useCallback(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
    watchID = Geolocation.getCurrentPosition(
      position => {
        const {longitude, latitude} = position.coords;
        console.log('===>, from hook', longitude, latitude);

        setLocation({longitude, latitude});
      },
      error => {
        setError(error);
        console.error('Error:', error);
      },
      {
        enableHighAccuracy: false,
      },
    );
  }, []);

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
        setHasPermission(true);
        getLocation();
      } else {
        setError('Permission denied');
      }
    }
  };

  useEffect(() => {
    const checkPermissions = async () => {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('always');
        setHasPermission(true);
        getLocation();
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
  }, [getLocation]);

  return {location, error, hasPermission};
};

export default useLocation;
