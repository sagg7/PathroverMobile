import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {
  AppHeader,
  AppLoader,
  CancelRideSheet,
  MainWrapper,
  OrderAddressCard,
  RideActionCard,
} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  mapBoxToken,
  PFColors,
  REQ_LIST_SOCKET_URL,
  RIDE_STATUS,
  showAlert,
  UNEXPECTED_ERROR,
} from '../../../../shared/exporter';
import haversine from 'haversine-distance'; // For distance calculation
import {svgIcon} from '../../../../assets/svg';
import {useChannel} from '../../../../hooks/socket/useChannel';
import {useActionCable} from '../../../../hooks/socket/useActionCable';
import {useSelector} from 'react-redux';
import {
  useCancelInProgressRideRequestMutation,
  useUpdateCurrentRideStatusMutation,
} from '../../../../redux/manager/managerApiSlice';

const OrderPickup = ({route}: any) => {
  const [pickerOffer, setPickedOffer] = useState<any>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any>([]);
  const [routeToPickup, setRouteToPickup] = useState<any>([]);
  const {accessToken} = useSelector((state: any) => state?.auth);

  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState([
    // item?.dropoff_longitude,
    // item?.dropoff_latitude,
    74.27898792916038, 31.500973875938808,
  ]); // Example destination: Empire State Building
  const rerouteThreshold = 50; // Distance in meters to trigger reroute
  const [showRideActionSheet, setShowRideActionSheet] = useState<any>(false);
  const [showCancelSheet, setShowCancelSheet] = useState<any>(false);
  const {userPickedOffer} = useSelector((state: any) => state?.driver);
  const [type, setType] = useState<any>(RIDE_STATUS.ORDER_DELIVERED);
  const cleanedToken = accessToken.replace('Bearer ', '');

  // Socket
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, cleanedToken);
  const {subscribe, unsubscribe, connected} = useChannel(actionCable);
  const [updateCurrentRideStatus, {isLoading}] =
    useUpdateCurrentRideStatusMutation();
  const [cancelInProgressRideRequest, {isLoading: cancelRideLoading}] =
    useCancelInProgressRideRequestMutation();

  const navigation = useNavigation();

  useEffect(() => {
    if (userPickedOffer) setPickedOffer(userPickedOffer);
  }, [userPickedOffer]);

  useEffect(() => {
    setTimeout(() => {
      setShowRideActionSheet(true);
    }, 3000);
  }, []);

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
    const fetchRoutes = async () => {
      const source = [74.27597312625042, 31.442345933668406];
      const des = [74.27898792916038, 31.500973875938808];
      const current = [74.28242115679376, 31.45982743552883];

      const pickupToDesRoute = await fetchDirections(source, des);
      setRouteCoordinates(pickupToDesRoute);
      const currentToPickup = await fetchDirections(current, source);
      setRouteToPickup(currentToPickup);
    };
    fetchRoutes();
  }, []);

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

      // console.log('ROUTE Formated==>', route);
      return route;
      // setRouteCoordinates(route);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
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

  const handleBroadcastData = res => {
    const {status, cancelled_by} = res?.data;
    if (status === 'cancelled') {
      if (cancelled_by === 'driver') {
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
    if (status === RIDE_STATUS.ORDER_DELIVERED) {
      setType(RIDE_STATUS.ORDER_DELIVERED);
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

  // Get user's current location and start tracking
  // useEffect(() => {
  //   const getCurrentLocation = async () => {
  //     const hasPermission = await requestLocationPermission();
  //     if (!hasPermission) return;

  //     // Get initial location
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         const {latitude, longitude} = position.coords;
  //         setUserLocation([longitude, latitude]);
  //         fetchDirections([longitude, latitude], destination);
  //       },
  //       error => console.error('Error getting location:', error),
  //       {enableHighAccuracy: true},
  //     );

  //     // Track user's location
  //     const watchId = Geolocation.watchPosition(
  //       position => {
  //         const {latitude, longitude} = position.coords;
  //         const currentLocation = [longitude, latitude];
  //         setUserLocation(currentLocation);

  //         // Check if the user is off the route and reroute if necessary
  //         if (isUserOffRoute(currentLocation)) {
  //           console.log('User is off the route. Recalculating...');
  //           fetchDirections(currentLocation, destination);
  //         }
  //       },
  //       error => console.error('Error watching location:', error),
  //       {enableHighAccuracy: true, distanceFilter: 10},
  //     );

  //     return () => Geolocation.clearWatch(watchId);
  //   };

  //   getCurrentLocation();
  // }, [destination]);
  // LDA 31.45982743552883, 74.28242115679376
  // whadat Road 31.500973875938808, 74.27898792916038
  // dummy current 31.442345933668406, 74.27597312625042

  const handleRideStatus = async (status: string) => {
    try {
      const obj = {
        role: 'driver',
        order: {
          status: status,
          ride_request_id: 204,
        },
      };

      const resp = await updateCurrentRideStatus(obj);
      if (resp?.data) {
      }
    } catch (error) {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  const handleCancelRide = async () => {
    try {
      const obj = {
        role: 'driver',
        order: {
          reason: '',
          ride_request_id: 207,
        },
      };

      const resp = await cancelInProgressRideRequest(obj);
      if (resp?.data) {
        navigation.replace('AppStack');
      } else {
        showAlert('Error', resp?.error?.data?.errors[0]);
      }
    } catch (error) {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Pickup Address" />
      <OrderAddressCard item={pickerOffer} type={'Initial'} />

      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[74.28242115679376, 31.45982743552883]}
        />
        {/* Draw the route */}
        {destination && (
          <MapboxGL.MarkerView coordinate={destination}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}
        {true && (
          <MapboxGL.MarkerView coordinate={destination}>
            {svgIcon.MapPin}
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
      {!showCancelSheet && (
        <RideActionCard
          onPressBtn={handleRideStatus}
          type={type}
          modalVisible={showRideActionSheet}
          data={pickerOffer}
          onPressCancel={() => {
            setShowRideActionSheet(false);
            setTimeout(() => {
              setShowCancelSheet(true);
            }, 1000);
          }}
        />
      )}

      <CancelRideSheet
        modalVisible={showCancelSheet}
        onPressDone={() => {
          setShowCancelSheet(false);
          // navigation.goBack();
          handleCancelRide();
        }}
        setModalVisible={() => {
          setShowCancelSheet(false);
          setTimeout(() => {
            setShowRideActionSheet(true);
          }, 1000);
        }}
      />
      {cancelRideLoading && <AppLoader />}

      {/* <RideCancelReasonSheet
        ref={cancelSheet}
        data={cancelReason}
        onPressWeight={handleCancelReason}
        isCompany
        handleCancelSheetDone={() => {
          const sel: any = cancelReason?.find(i => i.isSelected)?.title;
          handleCancelRide(sel);
        }}
        disabled={!cancelReason?.some(val => val.isSelected)}
      /> */}
    </MainWrapper>
  );
};

export default OrderPickup;
