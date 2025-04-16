import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {svgIcon} from '../../../../assets/svg';
import {MainWrapper, MapLayerSheet} from '../../../../components';
import useLocation from '../../../../hooks/getLocation';
import {
  MapTypes,
  AppHeader,
  Default_Map_Style,
  isIOS,
  HP,
  scrWidth,
  showAlert,
  mapBoxToken,
  PFColors,
  StartPointModal,
} from '../../../../shared/exporter';
import styles from './styles';
import LocationDetail from '../LocationDetail';
import {getTimeAndDistance} from '../../../../shared/utils/helpers';

const SearchTrailResult = ({route, navigation}: any) => {
  const userRef = useRef();
  const flatListRef = useRef(null);
  const [mapLayerSheet, setMapLayerSheet] = useState<boolean>(false);
  const [count, setCount] = useState(1);
  const [trailInfo, setTrailInfo] = useState(null);
  const [trailPath, setTrailPath] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [routes, setRoute] = useState<any>([]);
  const [modalKey, setModalKey] = useState(1);
  const [results, setResults] = useState<any>(null);
  const [tourStops, setTourStops] = useState<any>([]);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [showReachModal, setShowReachModal] = useState(false);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [trailEndPoint, setTrailEndPoint] = useState<any>(null);
  const [trailStartPoint, setTrailStartPoint] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [showSheet, setShowSheet] = useState<boolean>(false);
  const [popupcount, setPopupCount] = useState<any>(0);

  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routes,
    },
  };

  const maneuverIcons: any = {
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
    if (route?.params) {
      const trailDetails = route?.params?.trailInfo;
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
    const getResults = async () => {
      const locResults: any = await getTimeAndDistance(
        currentLocation,
        trailEndPoint,
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
  }, [trailStartPoint, currentLocation]);

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

  const resetFlatList = () => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
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

      const routeResults: any = await getTimeAndDistance(
        [longitude, latitude],
        trailStartPoint,
      );
      setResults(routeResults);
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
      setRoute(route);
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

  return (
    <GestureHandlerRootView style={styles.gestureView}>
      <MainWrapper style={styles.container}>
        <AppHeader
          title="Trail Details"
          // clickBackIcon={() => navigation.goBack()}
        />
        {tourStops?.length > 0 && (
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
                length: scrWidth * 0.8,
                offset: scrWidth * 0.8 * index,
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
                      style={styles.directionIcon}
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
          {/* {currentLocation && (
            <MapboxGL.MarkerView coordinate={currentLocation}>
              {svgIcon.CurrentLocation}
            </MapboxGL.MarkerView>
          )} */}
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
          {routes?.length > 1 && (
            <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
              <MapboxGL.LineLayer
                id="routeLayer-unique"
                style={{
                  lineWidth: 5,
                  lineColor: PFColors.Blue.Dark,
                }}
              />
            </MapboxGL.ShapeSource>
          )}
        </MapboxGL.MapView>
        {tourStops?.length > 0 && (
          <View style={styles.navigationInfoView}>
            <View style={styles.titleView}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                {svgIcon.CancelIcon}
              </TouchableOpacity>
            </View>
            <Text style={styles.headerText}>
              {trailInfo?.name || 'Unknown Trail/Path'}
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
        )}
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
      {/* {showSheet && (
        <LocationDetail
          modalVisible={showSheet}
          setModalVisible={() => {
            setShowSheet(!showSheet);
          }}
        />
      )} */}
    </GestureHandlerRootView>
  );
};

export default SearchTrailResult;
