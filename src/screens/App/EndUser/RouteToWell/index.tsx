import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {AppHeader, MainWrapper, MapLayerSheet} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {
  CHAT_NON_VERIFIED_TEXT,
  Default_Map_Style,
  isIOS,
  mapBoxToken,
  MapTypes,
  PFColors,
  Routes,
  showAlert,
  UNEXPECTED_ERROR,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import useLocation from '../../../../hooks/getLocation';
import {TouchableOpacity} from 'react-native';
import {RouteToWellSheet} from '../../../../components/complex/RouteToWellSheet';
import {getTimeAndDistance} from '../../../../shared/utils/helpers';
import {RouteToWellStartedSheet} from '../../../../components/complex/RouteToWellStartedSheet';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import {useSelector} from 'react-redux';
import usePremiumAlert from '../../../../hooks/usePremiumAlert';

const RouteToWell = ({route}: any) => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [routes, setRoute] = useState<any>([]);
  const [results, setResults] = useState<null>(null);
  const [destination, setDestination] = useState<any>(null);
  const [tourStarted, setTourStarted] = useState<boolean>(false);
  const [showRouteStartedSheet, setShowRouteStartedSheet] =
    useState<boolean>(false);
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const [offRoadSegment, setOffRoadSegment] = useState<any>([]);

  const [showRouteActionSheet, setShowRouteActionSheet] =
    useState<boolean>(true);
  const [actionBtn, setActionBtn] = useState<any>({
    direction: true,
    start: false,
  });
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const {subscription} = useSelector(state => state?.auth?.loginUser);
  const {showPremiumAlert} = usePremiumAlert();
  const [createRoute, {isLoading: PinLoading}] = useCreateRouteMutation();

  const {location} = useLocation();
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (route) {
      const formattedCoords = route?.params?.entranceCoords.map(coord =>
        parseFloat(coord),
      );
      setDestination(formattedCoords);
    }
  }, [route]);
  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);
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

  const toRad = value => (value * Math.PI) / 180;

  const getDistanceInKm = (coord1, coord2) => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  };

  const fetchRoute = async (start, end) => {
    const accessToken = mapBoxToken;
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const route = data?.routes[0]?.geometry?.coordinates;
      setTourStops(data.routes[0]?.legs[0]?.steps);

      if (!route || route?.length === 0) return {mainRoute: [], offRoad: []};

      const lastRoutePoint = route[route?.length - 1];
      const distance = getDistanceInKm(lastRoutePoint, end);

      const isOffRoad = distance > 0.01; // 10 meters

      // Return the main route and the off-road segment if needed
      return {
        mainRoute: route,
        offRoad: isOffRoad ? [lastRoutePoint, end] : [],
      };
    } catch (error) {
      console.error('Error fetching route:', error);
      return {mainRoute: [], offRoad: []};
    }
  };

  useEffect(() => {
    const getResults = async () => {
      const locResults: any = await getTimeAndDistance(
        currentLocation,
        destination,
      );

      setResults(locResults);
    };
    getResults();
  }, [currentLocation]);

  const getRoute = async () => {
    if (destination && currentLocation) {
      // const fetchedRoute = await fetchRoute(currentLocation, destination);
      const {mainRoute, offRoad} = await fetchRoute(
        currentLocation,
        destination,
      );

      setRoute(mainRoute);

      setOffRoadSegment(offRoad);
    }
  };
  useEffect(() => {
    if (destination && currentLocation) getRoute();
  }, [destination, currentLocation]);

  const onPressMap = (event: any) => {
    try {
      const {geometry} = event;
      if (geometry && Array.isArray(geometry.coordinates)) {
      } else {
        console.error('Invalid coordinates:', geometry);
      }
    } catch (error) {
      console.error('Error in onPressMap:', error);
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

  const onPressShare = () => {
    if (subscription)
      if (loginUser?.verified) {
        navigation.navigate(Routes.ChatUsers, {
          shareTrail: {
            startingPoint: [],
            endingPoint: destination,
            type: 'route to well',
          },
        });
      } else {
        showAlert('Alert', CHAT_NON_VERIFIED_TEXT);
      }
    else {
      showPremiumAlert({});
    }
  };

  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routes,
    },
  };
  const centerMap = () => {
    const start = currentLocation;
    const end = destination;

    const minLongitude = Math.min(start[0], end[0]);
    const maxLongitude = Math.max(start[0], end[0]);
    const minLatitude = Math.min(start[1], end[1]);
    const maxLatitude = Math.max(start[1], end[1]);

    const buffer = 0.09;
    const adjustedMinLongitude = minLongitude - buffer;
    const adjustedMaxLongitude = maxLongitude + buffer;
    const adjustedMinLatitude = minLatitude - buffer;
    const adjustedMaxLatitude = maxLatitude + buffer;

    cameraRef.current.fitBounds(
      [adjustedMinLongitude, adjustedMinLatitude],
      [adjustedMaxLongitude, adjustedMaxLatitude],
      {
        Left: 100,
        Right: 100,
        Top: 80,
        Bottom: 80,
      },
    );
  };
  const handlePinBtn = async () => {
    const startCoords = {
      latitude: currentLocation[1],
      longitude: currentLocation[0],
      name: 'Start',
    };
    const endCoords = {
      latitude: destination[1],
      longitude: destination[0],
      name: 'End Location',
    };

    const routeData = {
      user_route: {
        name: route?.params?.entranceName,
        route_type: 'maps_location_pins',
        color: PFColors.Blue.Dark,
        weight: '4',

        location_start_attributes: startCoords,
        location_end_attributes: endCoords,
      },
    };
    const resp = await createRoute(routeData);
    if (resp?.data) {
      showAlert('Alert', 'Your location has been pined.');
      navigation.goBack();
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  const handleLocationUpdate = async location => {
    if (location?.coords) {
      const {latitude, longitude, heading} = location.coords;
      setCurrentLocation([longitude, latitude]);

      if (routes?.length > 0) {
        const nextStep = routes[0];
        const [stepLng, stepLat] = nextStep.maneuver.location;
        const distanceToNextStep: any = await getTimeAndDistance(
          [longitude, latitude],
          stepLng,
          stepLat,
        );

        if (distanceToNextStep <= 0.0124) {
          // Threshold distance to consider step reached
          setRoute(prevStops => prevStops.slice(1));
        }
      }

      const routeResults: any = await getTimeAndDistance(
        [longitude, latitude],
        destination,
      );
      setResults(routeResults);
    }
  };
  const resetCompass = () => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: currentLocation,
        zoomLevel: 18,
        heading: 220,
        animationDuration: 1000,
        pitch: 60,
      });
    }
  };

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Route To Well" />

      <MapboxGL.MapView
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
        onPress={onPressMap}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={11}
          centerCoordinate={currentLocation}
          followUserLocation={actionBtn.start}
        />
        <MapboxGL.UserLocation
          // ref={userRef}
          showsUserHeadingIndicator={true}
          onUpdate={handleLocationUpdate}
          minDisplacement={5}
          requestsAlwaysUse
          visible={true}
        />
        {currentLocation && !tourStarted && (
          <MapboxGL.MarkerView coordinate={currentLocation}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}
        {destination && (
          <MapboxGL.MarkerView coordinate={destination}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}
        {/* Route Line */}
        {routes?.length > 1 && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              id="routeLayer-unique"
              style={{
                lineWidth: 3,
                lineColor: PFColors.Blue.Dark,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {offRoadSegment?.length === 2 && (
          <MapboxGL.ShapeSource
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: offRoadSegment,
              },
            }}
            id="off-road-source">
            <MapboxGL.LineLayer
              id="off-road-line"
              style={{
                lineWidth: 3,
                lineColor: 'red',
                lineDasharray: [0.8, 3], // Small dots with short gaps
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
      {showRouteActionSheet && (
        <RouteToWellSheet
          routeLength={routes?.length}
          onpressCancel={() => navigation.goBack()}
          routeName={route?.params?.entranceName}
          distanceInfo={results}
          actionBtn={actionBtn}
          onPressShare={onPressShare}
          onPressDirection={() => {
            getRoute();
            setActionBtn({
              ...actionBtn,
              direction: true,
            });
            // centerMap();
          }}
          onPressStart={() => {
            getRoute();
            setActionBtn({
              ...actionBtn,
              direction: true,
            });
            setTourStarted(true);
            setShowRouteActionSheet(false);
            setTimeout(() => {
              setShowRouteStartedSheet(true);
            }, 1000);
            resetCompass();
          }}
          onPressPin={() => handlePinBtn()}
          show={false}
        />
      )}
      {showRouteStartedSheet && (
        <RouteToWellStartedSheet
          routeName={route?.params?.entranceName}
          routeInfo={results}
          setModalVisible={() => {
            setShowRouteStartedSheet(false), navigation.goBack();
          }}
        />
      )}
      <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => {
          subscription ? setMapLayerSheeet(true) : showPremiumAlert({});
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

export default RouteToWell;
