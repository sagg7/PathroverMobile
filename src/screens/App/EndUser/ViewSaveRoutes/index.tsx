import React, {useEffect, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import MapboxGL from '@rnmapbox/maps';
import {svgIcon} from '../../../../assets/svg';
import {
  AppHeader,
  MainWrapper,
  MapLayerSheet,
  StartPointModal,
} from '../../../../components';
import {RouteToWellSheet} from '../../../../components/complex/RouteToWellSheet';
import {RouteToWellStartedSheet} from '../../../../components/complex/RouteToWellStartedSheet';
import {
  Default_Map_Style,
  mapBoxToken,
  MapTypes,
  PFColors,
  showAlert,
} from '../../../../shared/exporter';
import {getTimeAndDistance} from '../../../../shared/utils/helpers';
import styles from './styles';

const ViewSaveRoutes = ({route}: any) => {
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>([
    74.2751233, 31.4541549,
  ]);
  const [routes, setRoute] = useState<any>([]);
  const [routeToStartPoint, setRouteToStartPoint] = useState<any>([]);

  const [destination, setDestination] = useState<any>(null);
  const [startPoint, setStartPoint] = useState<any>(null);
  const [endPoint, setEndPoint] = useState<any>(null);
  const navigation = useNavigation();
  const [liveLocation, setLiveLocation] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [timeDistance, setTimeDistance] = useState(null);
  const [routeStartedFromCurrent, setRouteStartedFromCurrent] =
    useState<boolean>(false);
  const [isStartBtnPressed, setIsStartBtnPressed] = useState<boolean>(false);
  const [showReachModal, setShowReachModal] = useState(false);
  const [modalKey, setModalKey] = useState(1);

  const [actionBtn, setActionBtn] = useState<any>({
    direction: true,
    start: false,
  });
  const [showRouteActionSheet, setShowRouteActionSheet] =
    useState<boolean>(true);

  const [routeLineColor, setRouteLineColor] = useState<string>(
    PFColors.Blue.Dark,
  );
  const [routeLineHeight, setRouteLineHeight] = useState<any>(4);
  const [showRouteStartedSheet, setShowRouteStartedSheet] =
    useState<boolean>(false);
  const cameraRef = useRef<any>(null);
  const [results, setResults] = useState<null>(null);

  useEffect(() => {
    if (mapLayerStyle) {
      setSelectedMapType(mapLayerStyle);
    }
  }, [mapLayerStyle]);

  useEffect(() => {
    if (route) {
      const selectedRoute = route?.params?.item;
      console.log('selectedRoute', selectedRoute?.pinned_points);

      const endCoordinates = [
        parseFloat(selectedRoute?.dropoff_location.longitude),
        parseFloat(selectedRoute?.dropoff_location.latitude),
      ];
      const startCoordinates = [
        parseFloat(selectedRoute?.pickup_location?.longitude),
        parseFloat(selectedRoute?.pickup_location?.latitude),
      ];
      setStartPoint(startCoordinates);
      setEndPoint(endCoordinates);
      const formattedPoints = selectedRoute?.middle_location_points
        .filter((point: any) => point.latitude && point.longitude)
        .map((point: any) => [
          parseFloat(point.longitude),
          parseFloat(point.latitude),
        ]);

      setDestination(endCoordinates);
      formattedPoints.unshift(startCoordinates);
      formattedPoints.push(endCoordinates);
      if (selectedRoute?.route_type === 'maps_location_pins') {
        getRoadRoute(startCoordinates, endCoordinates);
      } else {
        setRoute(formattedPoints);
      }
      setRouteLineColor(selectedRoute?.color);
      setRouteLineHeight(Number(selectedRoute?.weight));
      setSelectedRoute(route?.params?.item);
    }
  }, [route]);

  const getRoadRoute = async (start, end) => {
    try {
      const path = await fetchRoute(start, end);
      setRoute(path);
    } catch (error: any) {
      showAlert('Error fetching road route', error);
    }
  };

  const getTimeDistanceDetails = async () => {
    const locResults: any = await getTimeAndDistance(liveLocation, startPoint);
    setTimeDistance(locResults);
    const match = locResults?.distance?.match(/([\d.]+)\s*(km|m)/);
    const distanceValue = match
      ? parseFloat(match[1]) * (match[2] === 'km' ? 1000 : 1)
      : Number(locResults?.distance) || 0;

    if (distanceValue < 300) {
      setRouteStartedFromCurrent(true);
      setShowReachModal(true);
    }
  };

  useEffect(() => {
    if (startPoint && endPoint) {
      getRouteTotalDistance();
    }
  }, [startPoint, endPoint]);

  const getRouteTotalDistance = async () => {
    const routeResults: any = await getTimeAndDistance(startPoint, endPoint);
    setResults(routeResults);
  };
  useEffect(() => {
    getLocationOneTime();
  }, []);

  const getRoute = async () => {
    if (currentLocation) {
      try {
        const path = await fetchRoute(currentLocation, startPoint);
        setRouteToStartPoint(path);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }
  };
  useEffect(() => {
    getTimeDistanceDetails();
  }, [currentLocation]);
  useEffect(() => {
    if (liveLocation) getTimeDistanceDetails();
  }, [liveLocation]);

  const getLocationOneTime = async () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCurrentLocation([longitude, latitude]);
          getTimeDistanceDetails();
        },

        error => {
          showAlert('Location Error', error.message);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 5000},
      );
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchRoute = async (start, end) => {
    const accessToken = mapBoxToken;
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const route = data.routes[0]?.geometry?.coordinates;
      return route;
    } catch (error) {
      console.error('Error fetching route:', error);
      showAlert('Error', 'No route exists between the entered locations.');
      return [];
    }
  };

  const onSelectMapType = (item: any) => {
    setMapTypesArr(prev =>
      prev.map(v => ({
        ...v,
        isSelected: v.id === item.id,
      })),
    );
  };

  const onPressSave = () => {
    const selected: any = mapTypesArr.find(
      (item: any) => item.isSelected,
    )?.type;
    setSelectedMapType(selected);

    setTimeout(() => {
      setMapLayerSheeet(false);
    }, 500);
  };

  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routes,
    },
  };
  const routeGeoJSONToStart = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routeToStartPoint,
    },
  };

  const haversineDistance = (coord1: any, coord2: any) => {
    const toRad = (angle: any) => (Math.PI * angle) / 180;

    const R = 6371;
    const lat1 = toRad(coord1[1]);
    const lon1 = toRad(coord1[0]);
    const lat2 = toRad(coord2[1]);
    const lon2 = toRad(coord2[0]);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };
  const calculateTotalDistance = (routePoints: any): number => {
    let totalDistanceKm = 0;
    for (let i = 0; i < routePoints.length - 1; i++) {
      totalDistanceKm += haversineDistance(routePoints[i], routePoints[i + 1]);
    }
    const totalDistanceMiles = totalDistanceKm * 0.621371;
    return totalDistanceMiles;
  };

  const totalDistance = calculateTotalDistance(routes);
  const estimateTravelTime = (distance: number, speed = 5): string => {
    const timeInHours = distance / speed;
    const timeInMinutes = timeInHours * 60;

    if (timeInMinutes < 60) {
      return `${timeInMinutes.toFixed(0)} min`;
    } else {
      return `${timeInHours.toFixed(2)} hrs`;
    }
  };

  const estimatedTime = estimateTravelTime(totalDistance, 5);

  const handleLocationUpdate = async location => {
    if (location?.coords) {
      const {latitude, longitude} = location.coords;
      setLiveLocation([longitude, latitude]);
      const routeResults: any = await getTimeAndDistance(
        [longitude, latitude],
        endPoint,
      );
      setResults(routeResults);
    }
  };
  const handleStartModalSaveBtn = () => {
    setRouteToStartPoint([]);
    setShowReachModal(false);
    setModalKey(2);

    const endCoordinates = [
      parseFloat(selectedRoute?.dropoff_location.longitude),
      parseFloat(selectedRoute?.dropoff_location.latitude),
    ];
    const startCoordinates = [
      parseFloat(selectedRoute?.pickup_location?.longitude),
      parseFloat(selectedRoute?.pickup_location?.latitude),
    ];

    const formattedPoints = selectedRoute?.middle_location_points
      .filter((point: any) => point.latitude && point.longitude)
      .map((point: any) => [
        parseFloat(point.longitude),
        parseFloat(point.latitude),
      ]);
    formattedPoints.unshift(startCoordinates);
    formattedPoints.push(endCoordinates);
    if (selectedRoute?.route_type === 'maps_location_pins') {
      getRoadRoute(startCoordinates, endCoordinates);
    } else {
      setRoute(formattedPoints);
    }
    // setRoute(formattedPoints);
  };
  const onPressStartBtn = async () => {
    getRoute();
    setShowRouteActionSheet(false);
    setIsStartBtnPressed(true);
    const routeResults: any = await getTimeAndDistance(startPoint, endPoint);
    setResults(routeResults);
    setTimeout(() => {
      setShowRouteStartedSheet(true);
    }, 1000);
    setRoute([]);
  };
  const calculateBounds = coordinates => {
    if (!coordinates || coordinates.length === 0) return undefined;

    let minLng = Infinity,
      maxLng = -Infinity;
    let minLat = Infinity,
      maxLat = -Infinity;

    for (const [lng, lat] of coordinates) {
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }

    return {
      ne: [maxLng, maxLat], // North-East (Top-Right)
      sw: [minLng, minLat], // South-West (Bottom-Left)
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 30,
      paddingBottom: 180,
    };
  };

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title={route?.params?.item?.name} />

      <MapboxGL.MapView
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={10}
          centerCoordinate={currentLocation}
          bounds={routes?.length > 0 ? calculateBounds(routes) : undefined}
          // bounds={
          //   routes?.length > 0 && {
          //     ne: routes?.reduce(
          //       (acc, coord) => [
          //         Math.max(acc[0], coord[0]),
          //         Math.max(acc[1], coord[1]),
          //       ],
          //       [-Infinity, -Infinity],
          //     ),
          //     sw: routes.reduce(
          //       (acc, coord) => [
          //         Math.min(acc[0], coord[0]),
          //         Math.min(acc[1], coord[1]),
          //       ],
          //       [Infinity, Infinity],
          //     ),
          //     paddingLeft: 30,
          //     paddingRight: 30,
          //     paddingTop: 30,
          //     paddingBottom: 180,
          //   }
          // }
        />
        <MapboxGL.UserLocation visible onUpdate={handleLocationUpdate} />
        {startPoint && (
          <MapboxGL.MarkerView coordinate={startPoint}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}
        {selectedRoute?.pinned_points?.map(point => (
          <MapboxGL.MarkerView
            key={point.id}
            coordinate={[
              parseFloat(point.longitude),
              parseFloat(point.latitude),
            ]} // Convert to numbers
          >
            {svgIcon.RedPin}
          </MapboxGL.MarkerView>
        ))}

        {destination && (
          <MapboxGL.MarkerView coordinate={destination}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}
        {routes?.length > 1 && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              key={route?.length}
              id="routeLayer-unique"
              style={{
                lineWidth: routeLineHeight || 4,
                lineColor: routeLineColor,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {routeToStartPoint?.length > 0 && (
          <MapboxGL.ShapeSource shape={routeGeoJSONToStart} id="245">
            <MapboxGL.LineLayer
              key={routeToStartPoint?.length}
              id="routeLayer-unique"
              style={{
                lineWidth: routeLineHeight || 4,
                lineColor: routeLineColor,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {/* {route?.params?.item?.route_type === 'custom_route' &&
          routes?.map((coordinate, index) => (
            <MapboxGL.PointAnnotation
              key={`pin-${index}`}
              id={`pin-${index}`}
              coordinate={coordinate}>
              <View style={styles.routeStopStyles} />
            </MapboxGL.PointAnnotation>
          ))} */}
        <View style={styles.bottomView}>
          <View style={styles.routeInfoView}>
            <Text>
              {svgIcon.MapWindow}
              <View style={{width: 5}} />

              <Text style={styles.routeInfoText}>
                {totalDistance.toFixed(2)} miles
              </Text>
            </Text>
            <View style={{marginLeft: 40}} />
            <Text>
              {svgIcon.BlueClock}
              <View style={{width: 5}} />
              <Text style={styles.routeInfoText}>{estimatedTime}</Text>
            </Text>
          </View>
        </View>
      </MapboxGL.MapView>
      {showRouteStartedSheet && (
        <RouteToWellStartedSheet
          setModalVisible={() => navigation.goBack()}
          routeName={
            modalKey === 1
              ? 'Enroute to starting point'
              : 'Enroute to destination point'
          }
          routeInfo={timeDistance}
        />
      )}
      {modalKey === 1 && isStartBtnPressed && (
        <StartPointModal
          modalVisible={showReachModal}
          onPressSave={() => handleStartModalSaveBtn()}
        />
      )}
      {showRouteActionSheet && (
        <RouteToWellSheet
          onpressCancel={() => {
            setShowRouteActionSheet(false);
            setShowRouteStartedSheet(false);
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          }}
          routeName={route?.params?.entranceName}
          distanceInfo={results}
          actionBtn={actionBtn}
          onPressDirection={() => {
            setActionBtn({
              ...actionBtn,
              direction: true,
            });
          }}
          onPressStart={() => onPressStartBtn()}
          show={false}
          // onPressPin={() => handlePinBtn()}
        />
      )}

      <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => {
          setMapLayerSheeet(true);
        }}>
        {svgIcon.MapLayer}
      </TouchableOpacity>
      <MapLayerSheet
        setModalVisible={() => setMapLayerSheeet(false)}
        modalVisible={mapLayerSheeet}
        data={mapTypesArr}
        onPressCard={onSelectMapType}
        onPressCancel={() => setMapLayerSheeet(false)}
        onPressSave={() => onPressSave()}
      />
    </MainWrapper>
  );
};

export default ViewSaveRoutes;
