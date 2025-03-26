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
  showAlert,
  StartPointModal,
  UNEXPECTED_ERROR,
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
import {RouteToWellStartedSheet} from '../../../../components/complex/RouteToWellStartedSheet';
import {useSelector} from 'react-redux';
import {InteractionManager} from 'react-native';
// import { activateKeepAwake, deactivateKeepAwake } from 'react-native-keep-awake';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';

const ViewWellPathNavigation = ({route}: any) => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>([
    74.275364, 31.454158,
  ]);
  const [routes, setRoute] = useState<any>([]);
  const [results, setResults] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [tourStarted, setTourStarted] = useState<boolean>(true);
  const [routeSteps, setRouteSteps] = useState<any>([]);
  const [showRouteStartedSheet, setShowRouteStartedSheet] =
    useState<boolean>(true);
  const [heading, setHeading] = useState(0);
  const [tourStops, setTourStops] = useState<any>([]);
  const [activeItem, setActiveItem] = useState(null);
  const [modalKey, setModalKey] = useState(1);
  const [showReachModal, setShowReachModal] = useState(false);
  const [distanceToNext, setDistanceToNext] = useState(25);
  const screenWidth = Dimensions.get('window').width;
  const memoizedTourStops = useMemo(() => tourStops, [tourStops]);
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const [count, setCount] = useState<any>(1);

  const {location} = useLocation();
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (route) setDestination(route?.params?.entranceCoords);
  }, [route]);
  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);
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

  const fetchRoute = async (start, end) => {
    const accessToken = mapBoxToken;
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const route = data.routes[0]?.geometry?.coordinates;
      setRoute(route);
      setTourStops(data.routes[0]?.legs[0]?.steps);
    } catch (error) {
      // if (count === 1) {
      //   showAlert('Error', 'No route exists between the entered locations.');
      // }
      // setCount(2);
      return [];
    }
  };

  useEffect(() => {
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
  }, [currentLocation]);
  // useEffect(() => {
  //   if (currentLocation && cameraRef.current) {
  //     cameraRef.current.setCamera({
  //       centerCoordinate: currentLocation,
  //       zoomLevel: 18,
  //       animationMode: 'flyTo',
  //       animationDuration: 2000,
  //       pitch: 60,
  //     });

  //     setTimeout(() => setEnableFollow(true), 1500); // Delay to allow zoom first
  //   }
  // }, [currentLocation]);

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
      navigation.navigate('Hiking');
    }, 100);
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
  const activeItemRef = useRef(null);
  const handleViewableItemsChanged = useCallback(({viewableItems}: any) => {
    if (viewableItems?.[0]?.index > 0 && viewableItems.length > 0) {
      const newActiveItem = viewableItems[0].item;
      setActiveItem(newActiveItem?.maneuver?.location);
    } else {
      setActiveItem(null);
    }
  }, []);

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
        setDistanceToNext(distanceToNextStep);

        if (distanceToNextStep <= 0.0124) {
          // Threshold distance to consider step reached
          setTourStops(prevStops => prevStops.slice(1));
        }
      }

      const routeResults: any = await getTimeAndDistance(
        [longitude, latitude],
        destination,
      );
      setResults(routeResults);
    }
  };

  const userRef = useRef();
  const flatListRef = useRef(null);

  const resetFlatList = () => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  };
  return (
    <MainWrapper style={styles.container}>
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

      <MapboxGL.MapView
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        compassEnabled
        compassPosition={{top: isIOS() ? HP('62') : HP('66'), right: 20}}
        scaleBarEnabled={false}>
        <MapboxGL.Camera
          ref={cameraRef}
          centerCoordinate={activeItem ?? currentLocation}
          // followUserLocation={true}
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
      </MapboxGL.MapView>

      {/* {showRouteStartedSheet && (
        <RouteToWellStartedSheet
          routeName={route?.params?.entranceName}
          routeInfo={results}
          setModalVisible={() => {
            setShowRouteStartedSheet(false), navigation.goBack();
          }}
        />
      )} */}
      <View style={styles.navigationInfoView}>
        <View style={styles.titleView}>
          <TouchableOpacity
            onPress={() => {
              setShowRouteStartedSheet(false), navigation.goBack();
            }}>
            {svgIcon.CancelIcon}
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>{route?.params?.entranceName}</Text>
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
      <TouchableOpacity style={styles.maplayerStyles} onPress={resetCompass}>
        {svgIcon.MapWhiteBg}
      </TouchableOpacity>
      {modalKey === 1 && (
        <StartPointModal
          modalVisible={showReachModal}
          title="You have arrived at your destination."
          onPressSave={() => handleModalOkButton()}
        />
      )}

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
