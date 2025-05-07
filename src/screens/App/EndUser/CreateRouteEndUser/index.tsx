import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {
  AppHeader,
  AppLoader,
  MainWrapper,
  MapLayerSheet,
  RouteCustomizationSheet,
  SaveRouteSheet,
  WellPathMenuSheet,
} from '../../../../components';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  Default_Map_Style,
  HP,
  isIOS,
  mapBoxToken,
  MapTypes,
  PFColors,
  Routes,
  showAlert,
  UNEXPECTED_ERROR,
  WP,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import useLocation from '../../../../hooks/getLocation';
import SearchView from './SearchView';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {setMapLayerStyle} from '../../../../redux/manager/managerSlice';
import {setCreateRouteDataEmpty} from '../../../../redux/endUser/endUserSlice';
import usePremiumAlert from '../../../../hooks/usePremiumAlert';

const CreateRouteEndUser = () => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>([
    74.276313, 31.454005,
  ]);
  const [route, setRoute] = useState<any>([]);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const {createRouteData} = useSelector(
    (state: any) => state?.endUser?.trailRoute,
  );

  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [routeName, setRouteName] = useState<string>('');
  const [startingPointName, setStartingPointName] = useState<string>('');
  const [endingPointName, setEndingPointName] = useState<string>('');
  const [showRouteLineCustomizeSheet, setShowRouteLineCustomizeSheet] =
    useState(false);
  const isFocused = useIsFocused();
  const [waypoints, setWaypoints] = useState<any>([]);

  const [routeLineColor, setRouteLineColor] = useState<string>(
    PFColors.Blue.Dark,
  );
  const [routeLineHeight, setRouteLineHeight] = useState<any>(4);
  const mapLayerStyle = useSelector(
    (state: any) => state?.manager?.mapLayerStyle,
  );
  const dispatch = useDispatch();
  const [heading, setHeading] = useState(0);
  2;
  const [searchValues, setSearchValues] = useState<any>({
    start: '',
    end: '',
  });
  const [searchValuesByAddress, setSearchValuesByAddress] = useState<any>({
    start: '',
    end: '',
  });

  const refScrollable = useRef<any>();
  const hasInitialLocation = useRef(false);

  const {location} = useLocation();
  const cameraRef = useRef<any>(null);
  const [createRoute, {isLoading}] = useCreateRouteMutation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const {subscription} = useSelector((state: any) => state?.auth?.loginUser);
  const {showPremiumAlert} = usePremiumAlert();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const isAdddress =
    Array.isArray(searchValuesByAddress?.start) &&
    searchValuesByAddress?.start.length === 2;
  const isCoordinates =
    Array.isArray(searchValues?.start) && searchValues?.start.length === 2;

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
      // setHeading(location?.heading);
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

  const updateLongRoute = async (
    start: any,
    end: any,
    updatedWaypoints: any,
  ) => {
    const fetchedRoute = await fetchRoute(start, end, updatedWaypoints);
    setRoute(fetchedRoute);
  };

  const onPressMap = async (event: any) => {
    try {
      const {geometry} = event;
      if (searchValues?.end || searchValuesByAddress?.start) {
        const [longitude, latitude] = geometry.coordinates;
        setWaypoints((prevWaypoints: any) => {
          const newWaypoints = [...prevWaypoints, [longitude, latitude]];
          setUndoStack([...undoStack, prevWaypoints]);
          setRedoStack([]);
          return newWaypoints;
        });
        if (searchValuesByAddress?.start) {
          updateLongRoute(
            searchValuesByAddress?.start,
            searchValuesByAddress?.end,
            [...waypoints, [longitude, latitude]],
          );
        } else {
          const updatedState = {
            end: searchValues?.end.map(Number),
            start: searchValues?.start.map(Number),
          };
          updateLongRoute(updatedState?.start, updatedState?.end, [
            ...waypoints,
            [longitude, latitude],
          ]);
        }
      } else {
        if (geometry && Array.isArray(geometry.coordinates)) {
          setRoute((prevCoordinates: any) => [
            ...prevCoordinates,
            geometry.coordinates,
          ]);

          setUndoStack([...undoStack, route]);
          setRedoStack([]);
        } else {
          console.error('Invalid coordinates:', geometry);
        }
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
    const selected: any = mapTypesArr?.find(
      (item: any) => item.isSelected,
    )?.type;
    setSelectedMapType(selected);
    dispatch(setMapLayerStyle(selected));

    setTimeout(() => {
      setMapLayerSheeet(false);
    }, 500);
  };

  const routeGeoJSON: any = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: route,
    },
  };

  const centerMap = () => {
    if (route?.length > 1) {
      const allPoints = route;
      const longitudes = allPoints?.map((point: any) => point[0]);
      const latitudes = allPoints?.map((point: any) => point[1]);
      const minLongitude = Math.min(...longitudes);
      const maxLongitude = Math.max(...longitudes);
      const minLatitude = Math.min(...latitudes);
      const maxLatitude = Math.max(...latitudes);

      const buffer = 0.0019;
      const adjustedMinLongitude = minLongitude - buffer;
      const adjustedMaxLongitude = maxLongitude + buffer;
      const adjustedMinLatitude = minLatitude - buffer;
      const adjustedMaxLatitude = maxLatitude + buffer;

      cameraRef.current.fitBounds(
        [adjustedMinLongitude, adjustedMinLatitude],
        [adjustedMaxLongitude, adjustedMaxLatitude],
        {
          left: 100,
          right: 100,
          top: 80,
          bottom: 80,
        },
      );
    } else {
      cameraRef.current?.setCamera({
        centerCoordinate: currentLocation,
        // heading: heading,
        zoomLevel: 16,
        pitch: 60,
        animationDuration: 1000,
      });
    }
  };

  const undoRoutes = () => {
    if (undoStack?.length > 0) {
      const prevState = undoStack.pop();

      if (prevState) {
        setRedoStack(prev => [...prev, waypoints]); // Store current state in redoStack before changing

        setRoute(prevState);
        setWaypoints(prevState);

        if (searchValuesByAddress?.start) {
          updateLongRoute(
            searchValuesByAddress?.start,
            searchValuesByAddress?.end,
            prevState,
          );
        } else if (searchValues?.start) {
          const updatedState = {
            end: searchValues?.end?.map(Number),
            start: searchValues?.start?.map(Number),
          };
          updateLongRoute(updatedState?.start, updatedState?.end, prevState);
        }
      }
    }
  };

  const redoRoutes = () => {
    if (redoStack.length > 0) {
      setUndoStack(prev => [...prev, waypoints]);

      const nextState = redoStack.pop();

      if (nextState) {
        setRoute(nextState);
        setWaypoints(nextState);

        if (searchValuesByAddress?.start) {
          updateLongRoute(
            searchValuesByAddress?.start,
            searchValuesByAddress?.end,
            nextState,
          );
        } else if (searchValues?.start) {
          const updatedState = {
            end: searchValues?.end?.map(Number),
            start: searchValues?.start?.map(Number),
          };
          updateLongRoute(updatedState?.start, updatedState?.end, nextState);
        }
      }
    }
  };

  const handleSaveRouteBtn = async () => {
    refScrollable.current.close();
    if (routeName) {
      const locationsAttributes =
        route?.length > 0
          ? [
              ...route.map(([longitude, latitude]: any, index: any) => ({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                name: `Point ${index + 1}`,
              })),
            ]
          : [];
      const pinnedPoints =
        waypoints?.length > 0
          ? [
              ...waypoints?.map(([longitude, latitude]: any, index: any) => ({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                name: `Point ${index + 1}`,
              })),
            ]
          : [];

      const routeData = {
        user_route: {
          name: routeName,
          locations_attributes: locationsAttributes,
          route_type: 'custom_route',
          color: routeLineColor,
          weight: routeLineHeight,
          pinned_points: pinnedPoints,
          is_road_route: searchValuesByAddress?.start?.length > 1,
        },
      };

      const resp = await createRoute(routeData);

      if (resp?.data) {
        setUndoStack([]);
        setRedoStack([]);
        setWaypoints([]);
        setRoute([]);
        setRouteName('');
        showAlert('Alert', 'Your route has been created successfully.');
        dispatch(setCreateRouteDataEmpty({}));
      } else {
        showAlert('Error', UNEXPECTED_ERROR);
      }
    } else {
      showAlert('Alert', 'Please enter route name to continue.');
    }
  };

  const fetchRoute = async (start: any, end: any, waypoints = []) => {
    const accessToken = mapBoxToken;
    let url = null;
    const waypointString = waypoints.map(wp => `${wp[0]},${wp[1]}`).join(';');
    waypoints?.length > 0
      ? (url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${waypointString};${end[0]},${end[1]}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`)
      : (url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`);

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

  useEffect(() => {
    if (isFocused) {
      const fetchRoutes = async () => {
        if (
          'start' in createRouteData &&
          createRouteData?.start?.coords?.length &&
          createRouteData?.end?.coords?.length
        ) {
          setSearchValuesByAddress({
            start: createRouteData?.start?.coords,
            end: createRouteData?.end?.coords,
          });
          const fetchedRoute = await fetchRoute(
            createRouteData?.start?.coords,
            createRouteData?.end?.coords,
            waypoints,
          );

          setRoute(fetchedRoute);

          setTimeout(() => {
            centerMap();
          }, 1000);
        }
      };
      fetchRoutes();
    }
  }, [createRouteData, isFocused]);

  const handleLocationUpdate = location => {
    if (hasInitialLocation.current || !location?.coords) return;

    const {latitude, longitude, heading} = location.coords;

    hasInitialLocation.current = true; // prevent future updates
    setHeading(heading);
    setTimeout(() => {
      cameraRef.current?.setCamera({
        centerCoordinate: [longitude, latitude],
        heading: heading,
        pitch: 60,
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }, 300);
  };

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Create Route" />
      <SearchView
        onPressSearch={() =>
          navigation.navigate(Routes.CreateRouteSearch, {
            searchValues,
            setSearchValues,
            searchValuesByAddress,
            setSearchValuesByAddress,
            startingPointName,
            endingPointName,
            setStartingPointName,
            setEndingPointName,
          })
        }
        onPressMenu={() => setShowOptionsSheet(true)}
      />
      <MapboxGL.MapView
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
        onPress={onPressMap}
        compassEnabled
        // compassFadeWhenNorth
        compassPosition={{top: isIOS() ? HP('15') : HP('4'), right: 12}}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={16}
          centerCoordinate={currentLocation}
          animationMode="flyTo"
          animationDuration={1000}
          pitch={60}
          heading={heading}
        />
        <MapboxGL.UserLocation
          visible
          minDisplacement={isIOS() ? 3 : 10}
          requestsAlwaysUse
          showsUserHeadingIndicator
          androidRenderMode="compass"
          onUpdate={handleLocationUpdate}
        />

        {searchValuesByAddress?.start && (
          <MapboxGL.MarkerView coordinate={searchValuesByAddress?.start}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}
        {searchValues?.start && (
          <MapboxGL.MarkerView coordinate={searchValues?.start}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}
        {searchValuesByAddress?.end && (
          <MapboxGL.MarkerView coordinate={searchValuesByAddress?.end}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}
        {searchValues?.end && (
          <MapboxGL.MarkerView coordinate={searchValues?.end}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}

        {!isCoordinates &&
          !isAdddress &&
          route?.map((coordinate: any, index: any) => (
            <MapboxGL.PointAnnotation
              key={`pin-${index}`}
              id={`pin-${index}`}
              coordinate={coordinate}>
              <View style={[styles.routeStopStyles]} />
            </MapboxGL.PointAnnotation>
          ))}
        {(isCoordinates || isAdddress) &&
          waypoints?.map((waypoint: any, index: number) => (
            <MapboxGL.MarkerView key={index} coordinate={waypoint}>
              {svgIcon.RedPin}
            </MapboxGL.MarkerView>
          ))}

        {/* Route Line */}
        {route?.length > 1 && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              id="routeLayer-unique"
              style={{
                lineWidth: routeLineHeight,
                lineColor: routeLineColor,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
      <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => {
          subscription ? setMapLayerSheeet(true) : showPremiumAlert({});
        }}>
        {svgIcon.MapLayer}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.centerMapStyles}
        onPress={() => centerMap()}>
        {svgIcon.MapWhiteBg}
      </TouchableOpacity>
      {/* )} */}
      <TouchableOpacity
        style={styles.SaveButton}
        onPress={() => {
          if (route?.length > 1) {
            refScrollable.current.open();
          } else {
            showAlert('Alert', 'Please create route of atleast two points');
          }
        }}>
        {svgIcon.SaveButton}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.pencilBtn}
        onPress={() => setShowRouteLineCustomizeSheet(true)}>
        {svgIcon.DrawRoute}
      </TouchableOpacity>
      {undoStack?.length > 0 && (
        <TouchableOpacity style={styles.undoBtn} onPress={() => undoRoutes()}>
          {svgIcon.UndoRoute}
        </TouchableOpacity>
      )}
      {redoStack.length > 0 && (
        <TouchableOpacity style={styles.redoBtn} onPress={() => redoRoutes()}>
          {svgIcon.RedoRoute}
        </TouchableOpacity>
      )}
      <WellPathMenuSheet
        show={false}
        modalVisible={showOptionsSheet}
        onPressCancel={() => setShowOptionsSheet(false)}
        setModalVisible={() => setShowOptionsSheet(false)}
        onPressCreateRoute={() => {
          setShowOptionsSheet(false);
          setTimeout(() => {
            navigation.navigate(Routes.CreateRouteSearch);
          }, 1000);
        }}
        onPressRecordRoute={() => {
          setShowOptionsSheet(false);
          setTimeout(() => {
            navigation.navigate(Routes.RecordRoute);
          }, 1000);
        }}
      />
      <MapLayerSheet
        setModalVisible={() => setMapLayerSheeet(false)}
        modalVisible={mapLayerSheeet}
        data={mapTypesArr}
        onPressCard={onSelectMapType}
        onPressCancel={() => setMapLayerSheeet(false)}
        onPressSave={() => onPressSave()}
      />

      <RouteCustomizationSheet
        modalVisible={showRouteLineCustomizeSheet}
        setColor={setRouteLineColor}
        setRouteLineHeight={setRouteLineHeight}
        onPressCancel={() => setShowRouteLineCustomizeSheet(false)}
        onPressSave={() => setShowRouteLineCustomizeSheet(false)}
      />
      <KeyboardAvoidingView behavior={isIOS() ? 'padding' : 'height'}>
        <RBSheet
          ref={refScrollable}
          customModalProps={{
            animationType: 'slide',
            statusBarTranslucent: true,
          }}
          customStyles={{
            container: {
              borderTopLeftRadius: WP('3'),
              borderTopRightRadius: WP('3'),
              height: keyboardVisible ? HP('35') : HP('29'),
            },
          }}>
          <SaveRouteSheet
            routeName={routeName}
            onChangeText={(text: any) => setRouteName(text)}
            onPressSave={() => {
              setTimeout(() => {
                Keyboard.dismiss();
              }, 1000);
              handleSaveRouteBtn();
            }}
            onPressCancel={() => refScrollable.current.close()}
            onEndEditing={() => console.log('isss')}
          />
        </RBSheet>
      </KeyboardAvoidingView>
      {/* <PinLocationAddress modalVisible /> */}
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default CreateRouteEndUser;
