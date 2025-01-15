import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {
  AppHeader,
  CancelRideSheet,
  MainWrapper,
  OptionSelectorSheet,
  OrderAddressCard,
  RideActionCard,
  AppLoader,
} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  CancelReasons,
  mapBoxToken,
  PFColors,
  REQ_LIST_SOCKET_URL,
  RIDE_STATUS,
  showAlert,
  UNEXPECTED_ERROR,
} from '../../../../shared/exporter';
import haversine from 'haversine-distance'; // For distance calculation
import {svgIcon} from '../../../../assets/svg';
import DriverDetailSheet from './DriverDetailSheet';
import ConsentSheet from '../../../../components/complex/ConsentSheet';
import {RideCancelReasonSheet} from '../../../../components/complex/RideCancelReasonSheet';
import {
  useCancelInProgressRideRequestMutation,
  useUpdateCurrentRideStatusMutation,
} from '../../../../redux/manager/managerApiSlice';
import OrderDeliveredSheet from './OrderDelivered';
import {useActionCable} from '../../../../hooks/socket/useActionCable';
import {useChannel} from '../../../../hooks/socket/useChannel';
import {useSelector} from 'react-redux';
import useLocation from '../../../../hooks/getLocation';

const RideArriving = ({route}: any) => {
  const navigation: any = useNavigation();
  const consentSheetRef = useRef<any>();
  const cancelSheet = useRef<any>();
  const [routeCoordinates, setRouteCoordinates] = useState<any>([]);
  const [routeToPickup, setRouteToPickup] = useState<any>([]);
  const {accessToken} = useSelector((state: any) => state?.auth);

  const [item, setItem] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<any>([
    74.28242115679376, 31.45982743552883,
  ]);
  const {location} = useLocation();
  const [destination, setDestination] = useState([
    74.27898792916038, 31.500973875938808,
  ]);
  const [pickupLocation, setPickupLocation] = useState([
    74.27898792916038, 31.500973875938808,
  ]);
  const rerouteThreshold = 50; // Distance in meters to trigger reroute
  const [showCancelSheet, setShowCancelSheet] = useState<any>(false);
  const [cancelReason, setCancelReason] = useState(CancelReasons);
  const cleanedToken = accessToken.replace('Bearer ', '');
  const [cancelInProgressRideRequest, {isLoading: cancelRideLoading}] =
    useCancelInProgressRideRequestMutation();
  const [type, setType] = useState<any>('Initial');
  const [updateCurrentRideStatus, {isLoading}] =
    useUpdateCurrentRideStatusMutation();

  // Socket
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, cleanedToken);
  const {subscribe, unsubscribe, connected} = useChannel(actionCable);

  const [showOrderDeliveredSheet, setShowOrderDeliveredSheet] =
    useState<boolean>(false);

  useEffect(() => {
    if (route?.params) setItem(route?.params?.item);
  }, [route]);

  // Request location permissions (for Android)
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    if (item) {
      const fetchRoutes = async () => {
        const source = [
          Number(item?.ride_request_data?.pickup_longitude),
          Number(item?.ride_request_data?.pickup_latitude),
        ];
        const des = [
          Number(item?.ride_request_data?.dropoff_longitude),
          Number(item?.ride_request_data?.dropoff_latitude),
        ];
        const current = userLocation;

        const pickupToDesRoute = await fetchDirections(source, des);
        setRouteCoordinates(pickupToDesRoute);
        setDestination(des);
        setPickupLocation(source);

        const currentToPickup = await fetchDirections(current, source);
        setRouteToPickup(currentToPickup);
      };
      fetchRoutes();
    }
  }, [item]);

  // Fetch directions from Mapbox Directions API
  const fetchDirections = async (source, destination) => {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${source.join(
        ',',
      )};${destination.join(
        ',',
      )}?geometries=geojson&access_token=${mapBoxToken}`;
      const response = await fetch(url);

      const routeJson = await response?.json();
      const route = routeJson.routes[0].geometry.coordinates;

      return route;
      // setRouteCoordinates(route);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  // Check if the user is off the route
  const isUserOffRoute = currentLocation => {
    if (!routeCoordinates || routeCoordinates.length === 0) return false;

    // Calculate the distance between the user's current location and the nearest point on the route
    let minDistance = Infinity;
    for (const point of routeCoordinates) {
      const distance = haversine(currentLocation, point);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }

    return minDistance > rerouteThreshold;
  };

  useEffect(() => {
    // if (available) {
    subscribe(
      {
        channel: 'OrderCommunicationChannel',
      },
      {
        received: res => {
          handleBroadcastData(res);
        },
        connected: () => {
          console.log('Connected!');
        },
      },
    );
    // }

    return () => {
      // if (!available && connected)
      unsubscribe();
    };
  }, []);

  const handleBroadcastData = (res: any) => {
    const {status, cancelled_by} = res?.data;
    if (status === 'cancelled') {
      if (cancelled_by === 'manager') {
        navigation.replace('AppStack');
      } else {
        showAlert('Cancelled', res?.message, () => {
          navigation.replace('AppStack');
        });
      }
    }
    if (status === RIDE_STATUS.I_AM_HERE) {
      setType(RIDE_STATUS.I_AM_HERE);
    }
    if (status === RIDE_STATUS.START_RIDE) {
      setType(RIDE_STATUS.START_RIDE);
    }
    if (status === RIDE_STATUS.COMPLETE_RIDE) {
      setType(RIDE_STATUS.COMPLETE_RIDE);
      setTimeout(() => {
        setShowOrderDeliveredSheet(true);
      }, 1000);
    }
    if (status === RIDE_STATUS.ORDER_DELIVERED) {
      setType(RIDE_STATUS.ORDER_DELIVERED);
    }
  };

  // Get user's current location and start tracking
  useEffect(() => {
    const getCurrentLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;
      // Get initial location
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;

          setUserLocation([longitude, latitude]);

          fetchDirections([longitude, latitude], destination);
        },
        error => console.error('Error getting location:', error),
        {enableHighAccuracy: true},
      );

      // Track user's location
      const watchId = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const currentLocation = [longitude, latitude];
          setUserLocation(currentLocation);

          // Check if the user is off the route and reroute if necessary
          if (isUserOffRoute(currentLocation)) {
            console.log('User is off the route. Recalculating...');
            fetchDirections(currentLocation, destination);
          }
        },
        error => console.error('Error watching location:', error),
        {enableHighAccuracy: true, distanceFilter: 10},
      );

      return () => Geolocation.clearWatch(watchId);
    };

    getCurrentLocation();
  }, []);

  const handleCancelReason = i => {
    let temp = cancelReason?.map(val => {
      if (i.id === val.id) {
        const obj = {
          ...val,
          isSelected: true,
        };
        return obj;
      } else {
        return {
          ...val,
          isSelected: false,
        };
      }
    });
    setCancelReason(temp);
  };
  const handleCancelOrderBtn = async () => {
    const reason: any = cancelReason?.find(
      (item: any) => item?.isSelected,
    )?.title;

    cancelSheet.current.close();

    const obj: any = {
      role: 'manager',
      order: {
        reason: reason,
        ride_request_id: item?.ride_request_id,
      },
    };
    const res = await cancelInProgressRideRequest(obj);

    if (res?.data) {
      setTimeout(() => {
        navigation.replace('AppStack');
      }, 500);
    }
  };

  const handleRideStatus = async (status: string) => {
    try {
      const obj = {
        role: 'manager',
        order: {
          status: status,
          ride_request_id: item?.ride_request_id,
        },
      };

      const resp = await updateCurrentRideStatus(obj);
      if (resp?.data) {
        if (status === RIDE_STATUS.ORDER_DELIVERED)
          navigation.replace('AppStack');
      }
    } catch (error) {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Driver Arriving" />

      <MapboxGL.MapView style={styles.map} scaleBarEnabled={false}>
        <MapboxGL.Camera zoomLevel={12} centerCoordinate={userLocation} />
        {userLocation && (
          <MapboxGL.MarkerView coordinate={userLocation}>
            {svgIcon.LiveMarker}
          </MapboxGL.MarkerView>
        )}

        {destination && (
          <MapboxGL.MarkerView coordinate={destination}>
            {svgIcon.Pin2}
          </MapboxGL.MarkerView>
        )}
        {pickupLocation && (
          <MapboxGL.MarkerView coordinate={pickupLocation}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}

        {routeCoordinates?.length > 0 && (
          <MapboxGL.ShapeSource
            id="routeSourceShape"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates,
              },
            }}>
            <MapboxGL.LineLayer
              id="routeSourceLine"
              style={{
                lineWidth: 4,
                lineColor: PFColors.Blue.Dark,
              }}
            />
          </MapboxGL.ShapeSource>
        )}

        {routeToPickup?.length > 0 && (
          <MapboxGL.ShapeSource
            id="routeToPickupShape"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeToPickup,
              },
            }}>
            <MapboxGL.LineLayer
              id="routeToPickupLine"
              style={{
                lineWidth: 4,
                lineColor: PFColors.Red.RadiantRed,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      {!showCancelSheet && !showOrderDeliveredSheet && (
        <DriverDetailSheet
          type={type}
          onPressCancelOrder={() => consentSheetRef?.current.open()}
          handleRideStatus={handleRideStatus}
          item={item}
          myLocation={location}
        />
      )}

      <ConsentSheet
        ref={consentSheetRef}
        message={'Are you sure you want to cancel the Ride?'}
        cancelBtnText="Cancel"
        successBtnText={'Continue'}
        onPressCancel={() => cancelSheet.current.close()}
        onPressSuccess={() => {
          consentSheetRef.current.close();
          setTimeout(() => {
            cancelSheet.current.open();
          }, 1000);
        }}
      />
      <RideCancelReasonSheet
        ref={cancelSheet}
        data={cancelReason}
        onPressWeight={handleCancelReason}
        isCompany
        handleCancelSheetDone={handleCancelOrderBtn}
        disabled={!cancelReason?.some(val => val.isSelected)}
      />

      {showOrderDeliveredSheet && (
        <OrderDeliveredSheet
          item={item}
          onPressOrderDelivered={handleRideStatus}
        />
      )}

      {cancelRideLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default RideArriving;
