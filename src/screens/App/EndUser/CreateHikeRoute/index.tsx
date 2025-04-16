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
  MapTypes,
  PFColors,
  Routes,
  showAlert,
  UNEXPECTED_ERROR,
  WP,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import useLocation from '../../../../hooks/getLocation';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {setMapLayerStyle} from '../../../../redux/manager/managerSlice';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import usePremiumAlert from '../../../../hooks/usePremiumAlert';

const CreateHikeRoute = () => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [route, setRoute] = useState<any>([]);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [routeName, setRouteName] = useState<string>('');
  const [showRouteLineCustomizeSheet, setShowRouteLineCustomizeSheet] =
    useState(false);
  const isFocused = useIsFocused();
  const [waypoints, setWaypoints] = useState<any>([]);
  const [routeLineColor, setRouteLineColor] = useState<string>(
    PFColors.Blue.Dark,
  );
  const [routeLineHeight, setRouteLineHeight] = useState<any>(4);
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const dispatch = useDispatch();
  const {subscription} = useSelector(state => state?.auth?.loginUser);
  const {showPremiumAlert} = usePremiumAlert();
  const refScrollable = useRef<any>();

  const {location} = useLocation();
  const cameraRef = useRef<any>(null);
  const [createRoute, {isLoading}] = useCreateRouteMutation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  const onPressMap = async event => {
    try {
      const {geometry} = event;
      const [longitude, latitude] = geometry.coordinates;
      setWaypoints(prevWaypoints => {
        const newWaypoints = [...prevWaypoints, [longitude, latitude]];
        setUndoStack([...undoStack, prevWaypoints]);
        setRedoStack([]);
        return newWaypoints;
      });

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

  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: route,
    },
  };

  const centerMap = () => {
    if (route?.length > 2) {
      const allPoints = route;
      const longitudes = allPoints?.map(point => point[0]);
      const latitudes = allPoints?.map(point => point[1]);
      const minLongitude = Math.min(...longitudes);
      const maxLongitude = Math.max(...longitudes);
      const minLatitude = Math.min(...latitudes);
      const maxLatitude = Math.max(...latitudes);

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
    } else {
      cameraRef.current.flyTo(currentLocation, 100);
    }
  };

  const undoRoutes = () => {
    if (undoStack?.length > 0) {
      const prevState = undoStack.pop();

      if (prevState) {
        setRedoStack(prev => [...prev, waypoints]);

        setRoute(prevState);
        setWaypoints(prevState);
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
      }
    }
  };

  const handleSaveRouteBtn = async () => {
    refScrollable.current.close();
    if (routeName) {
      const locationsAttributes =
        route?.length > 0
          ? [
              ...route.map(([longitude, latitude], index) => ({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                name: `Point ${index + 1}`,
              })),
            ]
          : [];
      const pinnedPoints =
        waypoints?.length > 0
          ? [
              ...waypoints?.map(([longitude, latitude], index) => ({
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
          route_type: 'hiking_custom_route',
          color: routeLineColor,
          weight: routeLineHeight,
          pinned_points: pinnedPoints,
          is_road_route: false,
        },
      };

      const resp = await createRoute(routeData);

      if (resp?.data) {
        setUndoStack([]);
        setRedoStack([]);
        setWaypoints([]);
        setRoute([]);
        setRouteName('');
        navigation.goBack();
        showAlert('Alert', 'Your route has been created successfully.');
      } else {
        showAlert('Error', UNEXPECTED_ERROR);
      }
    } else {
      showAlert('Alert', 'Please enter route name to continue.');
    }
  };

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Create Route" />

      <MapboxGL.MapView
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
        onPress={onPressMap}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={currentLocation}
        />
        {currentLocation && (
          <MapboxGL.MarkerView coordinate={currentLocation}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}

        {route?.map((coordinate, index) => (
          <MapboxGL.PointAnnotation
            key={`pin-${index}`}
            id={`pin-${index}`}
            coordinate={coordinate}>
            <View style={[styles.routeStopStyles]} />
          </MapboxGL.PointAnnotation>
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
            modalVisible={refScrollable}
            routeName={routeName}
            onChangeText={(text: any) => setRouteName(text)}
            onPressSave={() => handleSaveRouteBtn()}
            onPressCancel={() => refScrollable.current.close()}
          />
        </RBSheet>
      </KeyboardAvoidingView>
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default CreateHikeRoute;
