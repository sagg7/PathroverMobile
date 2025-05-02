import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {svgIcon} from '../../../../assets/svg';
import {MainWrapper, MapLayerSheet} from '../../../../components';
import useLocation from '../../../../hooks/getLocation';
import {
  MapTypes,
  AppHeader,
  Default_Map_Style,
  showAlert,
  mapBoxToken,
  PFColors,
  StartPointModal,
} from '../../../../shared/exporter';
import styles from './styles';
import {getTimeAndDistance} from '../../../../shared/utils/helpers';

const TrailRouteView = ({route, navigation}: any) => {
  const userRef = useRef();
  const [mapLayerSheet, setMapLayerSheet] = useState<boolean>(false);
  const [count, setCount] = useState(1);
  const [trailInfo, setTrailInfo] = useState(null);
  const [trailPath, setTrailPath] = useState(null);
  const [routes, setRoute] = useState<any>([]);
  const [tourStops, setTourStops] = useState<any>([]);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [showReachModal, setShowReachModal] = useState(false);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [trailEndPoint, setTrailEndPoint] = useState<any>(null);
  const [trailStartPoint, setTrailStartPoint] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [showSheet, setShowSheet] = useState<boolean>(false);
  const [popupcount, setPopupCount] = useState<any>(0);
  const [offRoadSegment, setOffRoadSegment] = useState<any>([]);

  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routes,
    },
  };

  const [queryParams, setQueryParams] = useState<any>({
    latitude: null,
    longitude: null,
    radius: 50,
  });

  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);

  const {location} = useLocation();

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setShowSheet(true);
    }, 1000);
  }, []);

  useEffect(() => {
    console.log('ON MAIN SCREEN', route);

    if (route) {
      const trailDetails = route;
      setTrailInfo(trailDetails?.properties?.tags);
      setTrailPath(trailDetails?.geometry?.coordinates);
      setTrailEndPoint(trailDetails?.geometry?.coordinates?.at(-1));
      setTrailStartPoint(trailDetails?.geometry?.coordinates?.[0]);
    }
  }, [route]);

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
      setQueryParams({
        ...queryParams,
        latitude: location?.longitude,
        longitude: location?.latitude,
      });
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

  useEffect(() => {
    if (trailStartPoint && currentLocation) getRoute();
  }, [trailStartPoint, currentLocation]);

  useEffect(() => {
    setTimeout(() => {
      if (currentLocation?.length > 0) {
        if (count === 1) {
          resetCompass();
          setCount(count + 1);
        }
      }
    }, 300);
  }, [currentLocation]);

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

  const handleLocationUpdate = async (location: any) => {
    if (location?.coords) {
      const {latitude, longitude} = location.coords;
      setCurrentLocation([longitude, latitude]);

      if (tourStops.length > 0) {
        const nextStep = tourStops[0];
        const [stepLng, stepLat] = nextStep.maneuver.location;
        const distanceToNextStep: any = await getTimeAndDistance(
          [longitude, latitude],
          stepLng,
          stepLat,
        );
        // setDistanceToNext(distanceToNextStep);

        if (distanceToNextStep <= 0.0124) {
          // Threshold distance to consider step reached
          setTourStops((prevStops: any) => prevStops.slice(1));
        }
      }
    }
  };

  const getRoute = async () => {
    if (trailStartPoint && currentLocation) {
      await fetchRoute(currentLocation, trailStartPoint);
    }
  };

  const getTrailData = () => {
    const trailData = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: trailPath,
      },
      properties: {
        color: '#cf4727',
        name: trailInfo?.name || 'Unknown Trail/Path',
      },
    };
    return trailData;
  };

  const fetchRoute = async (start: any, end: any) => {
    const accessToken = mapBoxToken;
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const route = data.routes[0]?.geometry?.coordinates;
      if (!route || route?.length === 0) {
        setRoute([]), setOffRoadSegment([]);
        return;
      }

      const firstRoutePoint = route[0];
      const lastRoutePoint = route[route.length - 1];
      const toRad = value => (value * Math.PI) / 180;

      const getDistanceInKm = (coord1, coord2) => {
        const [lon1, lat1] = coord1;
        const [lon2, lat2] = coord2;

        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in kilometers
      };
      const startDistance = getDistanceInKm(start, firstRoutePoint);
      const endDistance = getDistanceInKm(end, lastRoutePoint);

      const isStartOffRoad = startDistance > 0.01; // 10 meters
      const isEndOffRoad = endDistance > 0.01;

      let offRoad = [];

      if (true) {
        const formatedArr = start?.map((item: any) => Number(item));

        offRoad?.push([formatedArr, firstRoutePoint]);
      }
      if (isEndOffRoad) {
        const formatedArr = end?.map((item: any) => Number(item));

        offRoad?.push([lastRoutePoint, formatedArr]);
      }

      setRoute(route);
      setOffRoadSegment(offRoad);
      setTourStops(data.routes[0]?.legs[0]?.steps);
    } catch (error) {
      console.error('Error fetching route:', error);
      if (popupcount === 0) {
        showAlert('Error', 'No route exists between the entered locations.');
      }
      setPopupCount(2);
      return [];
    }
  };

  const handleModalOkButton = () => {
    setShowReachModal(false);
    setTourStops([]);
    setTimeout(() => {
      navigation.navigate('Hiking');
    }, 100);
  };

  return (
    <GestureHandlerRootView style={styles.gestureView}>
      <MainWrapper style={styles.container}>
        <AppHeader
          title="Trail Details"
          // clickBackIcon={() => navigation.goBack()}
        />

        <MapboxGL.MapView
          key={selectedMapType}
          // styleURL={selectedMapType}
          styleURL={MapboxGL.StyleURL.Outdoors}
          style={styles.map}
          scaleBarEnabled={false}>
          <MapboxGL.Camera
            ref={cameraRef}
            centerCoordinate={currentLocation}
            zoomLevel={18}
            followUserMode={MapboxGL.UserTrackingMode.FollowWithCourse}
            animationMode="flyTo"
            animationDuration={2000}
            pitch={60}
          />
          <MapboxGL.UserLocation
            ref={userRef}
            showsUserHeadingIndicator={true}
            onUpdate={handleLocationUpdate}
            minDisplacement={5}
            requestsAlwaysUse
            visible={true}
          />

          {trailPath && (
            <MapboxGL.ShapeSource
              key={'ds'}
              id={`trail-ds`}
              shape={getTrailData()}
              onPress={e => {}}>
              <MapboxGL.LineLayer
                id={`trail-line-${12}`}
                style={{
                  lineColor: ['get', 'color'],
                  lineWidth: 3,
                }}
              />
            </MapboxGL.ShapeSource>
          )}
          {/* Route Line */}
          {/* {routes?.length > 1 && (
            <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
              <MapboxGL.LineLayer
                id="routeLayer-unique"
                style={{
                  lineWidth: 5,
                  lineColor: PFColors.Blue.Dark,
                }}
              />
            </MapboxGL.ShapeSource>
          )} */}

          {offRoadSegment?.length > 0 &&
            offRoadSegment.map((segment, index) => (
              <MapboxGL.ShapeSource
                key={`off-road-source-${index}`}
                id={`off-road-source-${index}`}
                shape={{
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates: segment,
                  },
                }}>
                <MapboxGL.LineLayer
                  id={`off-road-line-${index}`}
                  style={{
                    lineWidth: 3,
                    lineColor: 'red',
                    lineDasharray: [0.8, 3],
                  }}
                />
              </MapboxGL.ShapeSource>
            ))}
        </MapboxGL.MapView>

        <TouchableOpacity style={styles.maplayerStyles} onPress={resetCompass}>
          {svgIcon.MapWhiteBg}
        </TouchableOpacity>
        <StartPointModal
          modalVisible={showReachModal}
          title="You have arrived at your destination."
          onPressSave={() => handleModalOkButton()}
        />
        <MapLayerSheet
          setModalVisible={() => setMapLayerSheet(false)}
          modalVisible={mapLayerSheet}
          data={mapTypesArr}
          onPressCancel={() => setMapLayerSheet(false)}
        />
        <View style={styles.actionBtnView}></View>
      </MainWrapper>
    </GestureHandlerRootView>
  );
};

export default TrailRouteView;
