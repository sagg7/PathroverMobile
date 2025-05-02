import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {AppHeader, MainWrapper, MapLayerSheet} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {
  appIcons,
  Default_Map_Style,
  HP,
  isIOS,
  mapBoxToken,
  MapTypes,
  PFColors,
  StartPointModal,
  WP,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import useLocation from '../../../../hooks/getLocation';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getTimeAndDistance} from '../../../../shared/utils/helpers';
import {useDispatch, useSelector} from 'react-redux';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import {useGetRouteBasedIdMutation} from '../../../../redux/endUser/endUserApiSlice';
import {setMapLayerStyle} from '../../../../redux/manager/managerSlice';

const ViewWellPathNavigation = ({route}: any) => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>([]);
  const [routes, setRoute] = useState<any>([]);
  const [results, setResults] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);

  const [heading, setHeading] = useState(0);
  const [tourStops, setTourStops] = useState<any>([]);
  const [activeItem, setActiveItem] = useState(null);
  const [modalKey, setModalKey] = useState(1);
  const [showReachModal, setShowReachModal] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const memoizedTourStops = useMemo(() => tourStops, [tourStops]);
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const [getRouteBasedId, {isLoading, data}] = useGetRouteBasedIdMutation();
  const [offRoadSegment, setOffRoadSegment] = useState<any>([]);

  const {location} = useLocation();
  const cameraRef = useRef<any>(null);
  const dispatch = useDispatch();
  const userRef = useRef<any>();
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    if (route && route?.params?.entranceCoords?.length > 1) {
      setDestination(route?.params?.entranceCoords);
    } else {
      if (route?.params?.routeId) getRouteBasedId(route?.params?.routeId);
    }
  }, [route]);

  useEffect(() => {
    if (data) {
      const routeData = data?.user_routes[0];
      setDestination([
        Number(routeData?.dropoff_location?.longitude),
        Number(routeData?.dropoff_location?.latitude),
      ]);
    }
  }, [data]);

  useEffect(() => {
    if (location?.latitude) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location?.latitude]);
  useEffect(() => {
    if (mapLayerStyle) {
      setSelectedMapType(mapLayerStyle);
    }
  }, [mapLayerStyle]);

  useEffect(() => {
    activateKeepAwake();

    return () => {
      deactivateKeepAwake();
    };
  }, []);

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

      if (!route || route?.length === 0) {
        setRoute([]), setOffRoadSegment([]);
        return;
      }

      const firstRoutePoint = route[0];
      const lastRoutePoint = route[route.length - 1];

      const startDistance = getDistanceInKm(start, firstRoutePoint);
      const endDistance = getDistanceInKm(end, lastRoutePoint);

      const isStartOffRoad = startDistance > 0.01; // 10 meters
      const isEndOffRoad = endDistance > 0.01;

      let offRoad = [];

      if (isStartOffRoad) {
        const formatedArr = start?.map((item: any) => Number(item));

        offRoad?.push([formatedArr, firstRoutePoint]);
      }
      if (isEndOffRoad) {
        const formatedArr = end?.map((item: any) => Number(item));

        offRoad?.push([lastRoutePoint, formatedArr]);
      }

      setRoute(route);
      setOffRoadSegment(offRoad);
    } catch (error) {
      console.error('Error fetching route:', error);
      setRoute([]);
      setOffRoadSegment([]);
      return {mainRoute: [], offRoad: []};
    }
  };

  useEffect(() => {
    if (currentLocation) {
      const getResults = async () => {
        const locResults: any = await getTimeAndDistance(
          currentLocation,
          destination,
        );

        setResults(locResults);
        // DISTANCE CALCULATED IN MILES
        if (
          locResults?.distance <= '0.0621371' ||
          locResults?.distance <= 0.0621371
        ) {
          setShowReachModal(true);
        }
      };

      getResults();
    }
  }, [currentLocation]);

  const getRoute = async () => {
    if (destination && currentLocation) {
      await fetchRoute(currentLocation, destination);
    }
  };
  useEffect(() => {
    if (destination && currentLocation) getRoute();
  }, [currentLocation]);

  const onSelectMapType = (item: any) => {
    setMapTypesArr(prev =>
      prev.map(v => ({
        ...v,
        isSelected: v.id === item.id,
      })),
    );
  };

  const handleModalOkButton = () => {
    setShowReachModal(false);
    setTimeout(() => {
      navigation.goBack();
    }, 100);
  };

  const onPressSave = () => {
    const selected: any = mapTypesArr.find(
      (item: any) => item.isSelected,
    )?.type;
    setSelectedMapType(selected);
    dispatch(setMapLayerStyle(selected));

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
  const maneuverIcons = {
    depart: require('../../../../assets/icons/depart.png'), // Start point
    turn: {
      left: require('../../../../assets/icons/turn-left.png'),
      right: require('../../../../assets/icons/turn-right.png'),
      straight: require('../../../../assets/icons/destination.png'),
    },
    // merge: require('../../../../assets/icons/merge.png'),
    roundabout: require('../../../../assets/icons/roundAbout.png'),
    arrive: require('../../../../assets/icons/destination.png'), // End point
  };

  const getManeuverIcon = (maneuver: any) => {
    const {type, modifier} = maneuver;

    if (type === 'turn' && maneuverIcons.turn[modifier]) {
      return maneuverIcons.turn[modifier];
    }

    return maneuverIcons[type] || maneuverIcons.turn.straight;
  };
  const handleViewableItemsChanged = useCallback(({viewableItems}: any) => {
    if (viewableItems?.[0]?.index > 0 && viewableItems.length > 0) {
      const newActiveItem = viewableItems[0].item;
      setActiveItem(newActiveItem?.maneuver?.location);
    } else {
      setActiveItem(null);
    }
  }, []);

  const resetCompass = () => {
    if (cameraRef.current && currentLocation?.length > 0) {
      setActiveItem(null);
      cameraRef.current.setCamera({
        centerCoordinate: currentLocation,
        zoomLevel: 18,
        heading: 220,
        animationDuration: 1000,
        pitch: 60,
      });
      resetFlatList();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      resetCompass();
    }, 300);
  }, []);

  const handleLocationUpdate = async location => {
    if (location?.coords) {
      const {latitude, longitude, heading} = location.coords;
      setCurrentLocation([longitude, latitude]);
      setHeading(heading);

      if (tourStops.length > 0) {
        const nextStep = tourStops[0];
        const [stepLng, stepLat] = nextStep.maneuver.location;
        const distanceToNextStep: any = await getTimeAndDistance(
          [longitude, latitude],
          stepLng,
          stepLat,
        );

        if (distanceToNextStep <= 0.0124) {
          // Threshold distance to consider step reached
          setTourStops((prevStops: any) => prevStops.slice(1));
        }
      }

      const routeResults: any = await getTimeAndDistance(
        [longitude, latitude],
        destination,
      );
      setResults(routeResults);
    }
  };

  const resetFlatList = () => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  };
  const isValidCoordinate = (coord: any): coord is [number, number] => {
    return (
      Array.isArray(coord) &&
      coord.length === 2 &&
      typeof coord[0] === 'number' &&
      typeof coord[1] === 'number' &&
      !isNaN(coord[0]) &&
      !isNaN(coord[1])
    );
  };

  return (
    <MainWrapper style={styles.container}>
      {tourStops?.length > 0 &&
        data?.user_routes[0]?.route_type != 'maps_location_pins' && (
          <View style={styles.stepsContainer}>
            <FlatList
              ref={flatListRef}
              data={tourStops}
              horizontal
              style={{marginTop: isIOS() ? HP('5') : 0}}
              pagingEnabled
              snapToAlignment="center"
              keyExtractor={(item, index) => index.toString()}
              getItemLayout={(data, index) => ({
                length: screenWidth * 0.8,
                offset: screenWidth * 0.8 * index,
                index,
              })}
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={handleViewableItemsChanged}
              viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
              renderItem={({item, index}) => (
                <View style={styles.instructionCard}>
                  <View>
                    <Image
                      resizeMode="contain"
                      source={getManeuverIcon(tourStops[index]?.maneuver)}
                      style={styles.directonIcon}
                    />
                    <Text style={styles.distanceText}>
                      {/* {item?.distance?.toFixed(0)} m */}
                      {(item?.distance * 0.000621371)?.toFixed(2) + ' mi'}
                    </Text>
                  </View>
                  <Text style={styles.instructionText}>
                    {item.maneuver.instruction}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
      {isValidCoordinate(currentLocation) && (
        <MapboxGL.MapView
          key={selectedMapType}
          styleURL={selectedMapType}
          style={styles.map}
          compassEnabled
          compassPosition={{top: isIOS() ? HP('62') : HP('66'), right: 20}}
          scaleBarEnabled={false}>
          <MapboxGL.Camera
            key={`${currentLocation[0]}-${currentLocation[1]}`}
            ref={cameraRef}
            // centerCoordinate={
            //   activeItem?.length === 2
            //     ? activeItem
            //     : currentLocation?.length === 2
            //     ? currentLocation
            //     : undefined
            // }
            centerCoordinate={activeItem ?? currentLocation}
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
          {activeItem && (
            <MapboxGL.MarkerView coordinate={activeItem}>
              <Image
                source={appIcons.liveLocation}
                style={{
                  height: 40,
                  width: 40,
                  transform: [{rotate: `${heading}deg`}],
                }}
              />
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
                  lineWidth: 6,
                  lineColor: PFColors.Blue.Dark,
                }}
              />
            </MapboxGL.ShapeSource>
          )}
          {/* {offRoadSegment?.length > 0 && (
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
      )}

      <View style={styles.navigationInfoView}>
        <View style={styles.titleView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {svgIcon.CancelIcon}
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>
          {route?.params?.entranceName || data?.user_routes[0]?.name || 'N/A'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text>
            {svgIcon.MapWindow}
            <View style={{width: 5}} />

            <Text style={styles.routeInfoText}>
              {results?.distance ? results?.distance : 'calculating'}
            </Text>
          </Text>
          <View style={{marginLeft: 40}} />
          <Text>
            {svgIcon.BlueClock}
            <View style={{width: 5}} />
            <Text style={styles.routeInfoText}>
              {results?.duration ? results?.duration : 'calculating'}
            </Text>
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.recenterIcon} onPress={resetCompass}>
        {svgIcon.RecenterIcon}
      </TouchableOpacity>
      {modalKey === 1 && (
        <StartPointModal
          modalVisible={showReachModal}
          title="You have arrived at your destination."
          onPressSave={() => handleModalOkButton()}
        />
      )}
      <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => setMapLayerSheeet(true)}>
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

export default ViewWellPathNavigation;
