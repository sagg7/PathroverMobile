import React, {useEffect, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import MapboxGL from '@rnmapbox/maps';
import {svgIcon} from '../../../../assets/svg';
import {
  AppHeader,
  MainWrapper,
  MapLayerSheet,
  StartPointModal,
} from '../../../../components';
import {RouteToWellStartedSheet} from '../../../../components/complex/RouteToWellStartedSheet';
import {
  Default_Map_Style,
  HP,
  MapTypes,
  PFColors,
  ROUTE_LINE_STYLES,
  showAlert,
} from '../../../../shared/exporter';
import {
  getTimeAndDistance,
  getTimeAndDistanceForWaypoint,
  isIOS,
} from '../../../../shared/utils/helpers';
import styles from './styles';
import useLocation from '../../../../hooks/getLocation';

const ViewCustomizedSaveRoutes = ({route}: any) => {
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [routes, setRoute] = useState<any>([]);

  const [destination, setDestination] = useState<any>(null);
  const [startPoint, setStartPoint] = useState<any>(null);
  const [endPoint, setEndPoint] = useState<any>(null);
  const navigation = useNavigation();
  const [liveLocation, setLiveLocation] = useState<any>(currentLocation);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [timeDistance, setTimeDistance] = useState(null);

  const [showReachModal, setShowReachModal] = useState(false);
  const [modalKey, setModalKey] = useState(1);
  const [hasCenteredOnce, setHasCenteredOnce] = useState(false);

  const [routeLineColor, setRouteLineColor] = useState<string>(
    PFColors.Blue.Dark,
  );
  const isFocused = useIsFocused();
  const [routeLineHeight, setRouteLineHeight] = useState<any>(6);
  const [showRouteStartedSheet, setShowRouteStartedSheet] =
    useState<boolean>(false);
  const cameraRef = useRef<any>(null);
  const userRef = useRef<any>(null);

  const [results, setResults] = useState<any>(null);
  const [heading, setheading] = useState<number>(0);

  const {location} = useLocation();

  useEffect(() => {
    if (mapLayerStyle) {
      setSelectedMapType(mapLayerStyle);
      const tempMap = mapTypesArr.map(item => ({
        ...item,
        isSelected: item.type === mapLayerStyle,
      }));
      setMapTypesArr(tempMap);
    }
  }, [mapLayerStyle]);

  useEffect(() => {
    if (route && location?.latitude) {
      const selectedRoute =
        route || route?.params?.item || route?.params || route?.params?.data;

      const endCoordinates = [
        parseFloat(selectedRoute?.dropoff_location?.longitude),
        parseFloat(selectedRoute?.dropoff_location?.latitude),
      ];
      const startCoordinates = [
        parseFloat(location?.longitude),
        parseFloat(location?.latitude),
      ];

      setCurrentLocation(startCoordinates);
      setLiveLocation(startCoordinates);
      setStartPoint(startCoordinates);
      setEndPoint(endCoordinates);
      const formattedPoints =
        selectedRoute?.middle_location_points &&
        selectedRoute?.middle_location_points
          .filter((point: any) => point?.latitude && point?.longitude)
          .map((point: any) => [
            parseFloat(point?.longitude),
            parseFloat(point?.latitude),
          ]);

      setDestination(endCoordinates);
      formattedPoints?.unshift(startCoordinates);
      formattedPoints?.push(endCoordinates);
      if (selectedRoute?.route_type === 'maps_location_pins') {
        // getRoadRoute(startCoordinates, endCoordinates);
      } else {
        console.log(formattedPoints?.length);
        setRoute(formattedPoints);
      }
      setRouteLineColor(selectedRoute?.color);
      setRouteLineHeight(Number(selectedRoute?.weight));
      setSelectedRoute(selectedRoute);
    }
  }, [route, location]);

  const getTimeDistanceDetails = async () => {
    const locResults: any = await getTimeAndDistance(currentLocation, endPoint);

    setTimeDistance(locResults);

    let distanceValue = 0;

    if (typeof locResults?.distance === 'string') {
      const match = locResults?.distance.match(/([\d.]+)\s*miles/);
      if (match) {
        distanceValue = parseFloat(match[1]); // Distance is already in miles
      }
    } else if (typeof locResults?.distance === 'number') {
      distanceValue = locResults.distance; // Already in miles
    }

    if (distanceValue < 0.0379) {
      // 300 meters ≈ 0.186 miles
      setShowReachModal(true);
    }
  };

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);

  useEffect(() => {
    if (startPoint && endPoint) {
      getRouteTotalDistance();
    }
  }, [startPoint, endPoint]);

  const getRouteTotalDistance = async () => {
    const routeResults: any = await getTimeAndDistanceForWaypoint(routes);

    setResults(routeResults);
  };
  useEffect(() => {
    // getLocationOneTime();
  }, []);

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

  const handleLocationUpdate = location => {
    if (location?.coords) {
      const {latitude, longitude, heading} = location.coords;
      setLiveLocation([longitude, latitude]);
      setheading(heading);

      if (!hasCenteredOnce) {
        setHasCenteredOnce(true);
        setTimeout(() => {
          cameraRef.current?.setCamera({
            centerCoordinate: [longitude, latitude],
            heading: heading,
            pitch: 60,
            zoomLevel: 16,
            animationDuration: 1000,
          });
        }, 300);
      }
    }
  };

  const resetCompass = () => {
    if (liveLocation?.length === 2) {
      cameraRef.current?.setCamera({
        centerCoordinate: liveLocation,
        heading: heading,
        zoomLevel: 16,
        pitch: 60,
        animationDuration: 1000,
      });
    } else {
      console.log('Error', 'Current location not available.');
    }
  };

  useEffect(() => {
    if (isFocused)
      if (cameraRef && currentLocation?.length)
        cameraRef?.current?.setCamera({
          centerCoordinate: currentLocation,
          zoomLevel: 18,
          pitch: 60,
          animationDuration: 1000,
          heading: heading,
        });
  }, [currentLocation, isFocused]);

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title={selectedRoute?.name || route?.params?.name} />

      <MapboxGL.MapView
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
        compassEnabled
        compassFadeWhenNorth
        compassPosition={{top: isIOS() ? HP('62') : HP('66'), right: 20}}>
        {liveLocation?.length > 0 && (
          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={16}
            pitch={60}
            heading={heading}
            centerCoordinate={liveLocation}
            animationMode="flyTo"
            animationDuration={1000}
            followUserLocation={isIOS() ? true : false}
          />
        )}
        <MapboxGL.UserLocation
          visible
          onUpdate={handleLocationUpdate}
          minDisplacement={isIOS() ? 3 : 10}
          requestsAlwaysUse
          showsUserHeadingIndicator
          androidRenderMode="compass"
        />

        {selectedRoute?.is_road_route &&
          selectedRoute?.pinned_points?.map(point => (
            <MapboxGL.MarkerView
              key={point.id}
              coordinate={[
                parseFloat(point.longitude),
                parseFloat(point.latitude),
              ]}>
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
              key={routes?.length}
              id="routeLayer-unique"
              style={{
                lineWidth:
                  selectedRoute?.route_type === 'recording_route'
                    ? ROUTE_LINE_STYLES.lineWidth
                    : routeLineHeight || ROUTE_LINE_STYLES.lineWidth,
                lineColor:
                  selectedRoute?.route_type === 'recording_route'
                    ? ROUTE_LINE_STYLES.color
                    : routeLineColor || ROUTE_LINE_STYLES.color,
                lineOpacity:
                  selectedRoute?.route_type === 'recording_route'
                    ? 0.8
                    : ROUTE_LINE_STYLES.opacity,
              }}
            />
          </MapboxGL.ShapeSource>
        )}

        {!selectedRoute?.is_road_route &&
          (selectedRoute?.route_type === 'custom_route' ||
            selectedRoute?.route_type === 'hiking_custom_route') &&
          routes?.map((coordinate, index) => (
            <MapboxGL.PointAnnotation
              key={`pin-${index}`}
              id={`pin-${index}`}
              coordinate={coordinate}>
              <View style={styles.routeStopStyles} />
            </MapboxGL.PointAnnotation>
          ))}
        <View style={styles.bottomView}>
          <View style={styles.routeInfoView}>
            <Text>
              {svgIcon.MapWindow}
              <View style={{width: 5}} />

              <Text style={styles.routeInfoText}>{results?.distance}</Text>
            </Text>
            <View style={{marginLeft: 40}} />
            <Text>
              {svgIcon.BlueClock}
              <View style={{width: 5}} />
              <Text style={styles.routeInfoText}>{results?.duration}</Text>
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
          // routeInfo={timeDistance}
          routeInfo={results}
        />
      )}
      {modalKey === 1 && (
        <StartPointModal
          modalVisible={showReachModal}
          title={`Your are now at ${selectedRoute?.name}`}
          onPressSave={() => navigation.goBack()}
        />
      )}

      {/* {isStartBtnPressed && ( */}
      <TouchableOpacity style={styles.recenterIcon} onPress={resetCompass}>
        {svgIcon.RecenterIcon}
      </TouchableOpacity>
      {/* )} */}

      {/* <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => {
          setMapLayerSheeet(true);
        }}>
        {svgIcon.MapLayer}
      </TouchableOpacity> */}
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

export default ViewCustomizedSaveRoutes;
