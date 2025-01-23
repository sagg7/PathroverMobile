import {useNavigation} from '@react-navigation/native';
import MapboxGL from '@rnmapbox/maps';
import haversine from 'haversine-distance'; // For distance calculation
import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useSelector} from 'react-redux';
import {svgIcon} from '../../../../assets/svg';
import {
  AppHeader,
  AppLoader,
  CancelRideSheet,
  MainWrapper,
  OrderAddressCard,
  ReviewModal,
  RideActionCard,
  WaitingModal,
} from '../../../../components';
import {useActionCable} from '../../../../hooks/socket/useActionCable';
import {useChannel} from '../../../../hooks/socket/useChannel';
import {useRateManagerMutation} from '../../../../redux/driver/driverApiSlice';
import {
  useCancelInProgressRideRequestMutation,
  useUpdateCurrentRideStatusMutation,
} from '../../../../redux/manager/managerApiSlice';
import {
  mapBoxToken,
  PFColors,
  REQ_LIST_SOCKET_URL,
  RIDE_STATUS,
  showAlert,
  UNEXPECTED_ERROR,
} from '../../../../shared/exporter';
import styles from './styles';

const OrderPickup = ({route}: any) => {
  const navigation: any = useNavigation();
  const [pickerOffer, setPickedOffer] = useState<any>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any>([]);
  const [routeToPickup, setRouteToPickup] = useState<any>([]);
  const {accessToken} = useSelector((state: any) => state?.auth);
  const [showWaitingModal, setShowWaitingModal] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState([74.275388, 31.454111]);
  const [destination, setDestination] = useState([
    74.27898792916038, 31.500973875938808,
  ]);
  const [pickupLocation, setPickupLocation] = useState([
    74.27898792916038, 31.500973875938808,
  ]);
  const [openModal, setOpenModal] = useState(false);
  const rerouteThreshold = 50; // Distance in meters to trigger reroute
  const [showRideActionSheet, setShowRideActionSheet] = useState<any>(false);

  const [showCancelSheet, setShowCancelSheet] = useState<any>(false);
  const {userPickedOffer} = useSelector((state: any) => state?.driver);
  const [type, setType] = useState<any>('Initial');
  const cleanedToken = accessToken.replace('Bearer ', '');
  const [showDriverLine, setShowDriverLine] = useState(false);

  // Socket
  const {actionCable} = useActionCable(REQ_LIST_SOCKET_URL, cleanedToken);
  const {subscribe, unsubscribe, connected} = useChannel(actionCable);
  const [updateCurrentRideStatus, {isLoading}] =
    useUpdateCurrentRideStatusMutation();
  const [cancelInProgressRideRequest, {isLoading: cancelRideLoading}] =
    useCancelInProgressRideRequestMutation();
  const [rateManager, {isLoading: isRateLoading}] = useRateManagerMutation();

  useEffect(() => {
    if (userPickedOffer) {
      setPickedOffer(userPickedOffer);
    }
  }, [userPickedOffer]);

  // useEffect(() => {
  //   if (route?.params?.item) {
  //     setPickedOffer(route?.params?.item);
  //     setType(
  //       route?.params?.item?.order_status
  //         ? route?.params?.item?.order_status
  //         : 'Initial',
  //     );
  //   }
  // }, [route]);

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
    if (pickerOffer) {
      const fetchRoutes = async () => {
        const source = [
          Number(pickerOffer?.pickup_longitude),
          Number(pickerOffer?.pickup_latitude),
        ];
        const des = [
          Number(pickerOffer?.dropoff_longitude),
          Number(pickerOffer?.dropoff_latitude),
        ];
        setDestination(des);
        setPickupLocation(source);
        const pickupToDesRoute = await fetchDirections(source, des);
        setRouteCoordinates(pickupToDesRoute);
        const currentToPickup = await fetchDirections(userLocation, source);
        setRouteToPickup(currentToPickup);
      };
      fetchRoutes();
    }
  }, [pickerOffer]);

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

  useEffect(() => {
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
    if (status === RIDE_STATUS.COMPLETE_RIDE) {
      setType(RIDE_STATUS.COMPLETE_RIDE);
      setShowWaitingModal(true);
    }
    if (status === RIDE_STATUS.ORDER_DELIVERED) {
      setShowWaitingModal(false);
      //TODO: SHOW RATING MODAL
      setTimeout(() => {
        setOpenModal(true);
        //   navigation.replace('AppStack');
      }, 500);
    }
  };

  // Check if the user is off the route
  const isUserOffRoute = currentLocation => {
    if (!routeCoordinates || routeCoordinates.length === 0) {
      return false;
    }

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
  useEffect(() => {
    const getCurrentLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }

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

  const handleRideStatus = async (status: string) => {
    try {
      const obj = {
        role: 'driver',
        order: {
          status: status,
          ride_request_id: pickerOffer?.id,
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
        role: 'manager',
        order: {
          reason: '',
          ride_request_id: pickerOffer?.id,
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

  const rateUser = async (data: object) => {
    try {
      const obj = {
        role: 'driver',
        ride_request_id: pickerOffer?.id,
        manager_id: pickerOffer?.manager_id,
        rating: {
          rating: data?.rating || 0,
          feedback: data?.comment || '',
        },
      };
      await rateManager(obj);
      setOpenModal(false);
      setTimeout(() => {
        setOpenModal(true);
        navigation.replace('AppStack');
      }, 300);
    } catch (error) {
      //
    }
  };

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Pickup Address" />
      <OrderAddressCard
        item={pickerOffer}
        type={'Initial'}
        onPressNavigation={() => setShowDriverLine(!showDriverLine)}
      />

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
        {/* {routeCoordinates?.length > 0 && ( */}
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
        {/* )} */}

        {showDriverLine && routeToPickup?.length > 0 && (
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
      {showWaitingModal && <WaitingModal isModalVisible={showWaitingModal} />}
      {cancelRideLoading && <AppLoader />}
      {openModal && (
        <ReviewModal
          details={pickerOffer}
          modalVisible={openModal}
          loading={isRateLoading}
          onPressCross={() => {
            setOpenModal(false);
            setTimeout(() => {
              setOpenModal(true);
              navigation.replace('AppStack');
            }, 300);
          }}
          onPressDone={data => rateUser(data)}
        />
      )}
    </MainWrapper>
  );
};

export default OrderPickup;
