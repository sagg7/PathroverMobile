import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {
  AppButton,
  AppLoader,
  CreateRouteSheet,
  MainWrapper,
  MapLayerSheet,
  SearchInput,
} from '../../../../components';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  appIcons,
  Default_Map_Style,
  mapBoxToken,
  MapTypes,
  PFColors,
  Routes,
  showAlert,
  UNEXPECTED_ERROR,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import {useDispatch, useSelector} from 'react-redux';
import {setManagerRouteEmpty} from '../../../../redux/manager/managerSlice';
import useLocation from '../../../../hooks/getLocation';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import SwitchToggle from 'react-native-switch-toggle';
import SearchView from './SearchView';
import HeaderView from './HeaderView';
import {MapSettingSheet} from '../../../../components/complex/MapSettingSheet';

const WellPath = () => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [createRoute, {isLoading}] = useCreateRouteMutation();
  const [route, setRoute] = useState<any>([]);
  const [available, setAvailable] = useState(false);

  const {managerRoute} = useSelector(state => state.manager);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [waypoints, setWaypoints] = useState<any>([]);

  const [isTouchablePressed, setIsTouchablePressed] = useState<boolean>(false);
  const [showCreateRouteSheet, setShowCreateRouteSheet] =
    useState<boolean>(false);
  const {location} = useLocation();
  const dispatch = useDispatch();
  const cameraRef = useRef<any>(null);
  const startData = {
    latitude: managerRoute?.pickup?.coords[1],
    longitude: managerRoute?.pickup?.coords[0],
    name: managerRoute?.pickup?.placeName,
  };
  const endData = {
    latitude: managerRoute?.destination?.coords[1],
    longitude: managerRoute?.destination?.coords[0],
    name: managerRoute?.destination?.placeName,
  };

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);

  const onPressMap = event => {
    if (!isTouchablePressed) {
      if ('destination' in managerRoute) {
        const {geometry} = event;
        const [longitude, latitude] = geometry.coordinates;
        setWaypoints(prevWaypoints => {
          const newWaypoints = [...prevWaypoints, [longitude, latitude]];
          setUndoStack([...undoStack, prevWaypoints]);
          setRedoStack([]);
          return newWaypoints;
        });

        if (managerRoute?.pickup?.coords && managerRoute?.destination?.coords) {
          updateRoute(
            managerRoute?.pickup?.coords,
            managerRoute?.destination?.coords,
            [...waypoints, [longitude, latitude]],
          );
        }
      }
    } else {
      setIsTouchablePressed(false);
    }
  };
  const updateRoute = async ({start, end, updatedWaypoints}: any) => {
    const fetchedRoute = await fetchRoute(start, end, updatedWaypoints);
    setRoute(fetchedRoute);
  };

  useEffect(() => {
    if ('destination' in managerRoute) {
      const getRoute = async () => {
        const fetchedRoute = await fetchRoute(
          managerRoute?.pickup?.coords,
          managerRoute?.destination?.coords,
        );
        setRoute(fetchedRoute);
      };

      getRoute();
    }
  }, [managerRoute]);

  const fetchRoute = async (start, end, waypoints = []) => {
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
    if (managerRoute?.pickup?.coords && managerRoute?.destination?.coords) {
      const getRoute = async () => {
        const fetchedRoute = await fetchRoute(
          managerRoute?.pickup?.coords,
          managerRoute?.destination?.coords,
          waypoints,
        );
        setRoute(fetchedRoute);
      };

      getRoute();
    }
  }, [managerRoute, waypoints]);

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

  const handleUndo = () => {
    if (waypoints.length > 0) {
      const prevState = undoStack.pop();
      setRedoStack([...redoStack, waypoints]);
      setWaypoints(prevState);
      if (managerRoute?.pickup?.coords && managerRoute?.destination?.coords) {
        updateRoute(
          managerRoute?.pickup?.coords,
          managerRoute?.destination?.coords,
          prevState || [],
        );
      }
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setUndoStack([...undoStack, waypoints]);
      setWaypoints(nextState);
      if (managerRoute?.pickup?.coords && managerRoute?.destination?.coords) {
        updateRoute(
          managerRoute?.pickup?.coords,
          managerRoute?.destination?.coords,
          nextState || [],
        );
      }
    }
  };

  const centerMap = () => {
    if ('pickup' in managerRoute && 'destination' in managerRoute) {
      const startCoords: any = managerRoute?.pickup?.coords;
      const endCoords: any = managerRoute?.destination?.coords;

      const allPoints = [startCoords, endCoords, ...waypoints];
      const longitudes = allPoints?.map(point => point[0]);
      const latitudes = allPoints?.map(point => point[1]);
      const minLongitude = Math.min(...longitudes);
      const maxLongitude = Math.max(...longitudes);
      const minLatitude = Math.min(...latitudes);
      const maxLatitude = Math.max(...latitudes);

      if (cameraRef.current && startCoords && endCoords) {
        cameraRef.current.fitBounds(
          [minLongitude, minLatitude],
          [maxLongitude, maxLatitude],
          {
            Left: 80,
            Right: 80,
            Top: 50,
            Bottom: 50,
          },
        );
      }
    } else {
      if (cameraRef.current && currentLocation) {
        cameraRef.current.fitBounds(
          [currentLocation[0] - 0.01, currentLocation[1] - 0.01],
          [currentLocation[0] + 0.01, currentLocation[1] + 0.01],
          {
            paddingTop: 50,
            paddingBottom: 50,
            paddingLeft: 80,
            paddingRight: 80,
          },
        );
      }
    }
  };

  const onPressSaveRoute = async (routeName: any) => {
    if (routeName) {
      const locationsAttributes =
        waypoints?.length > 0
          ? [
              startData,
              ...waypoints.map(([longitude, latitude], index) => ({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                name: `Location ${index + 1}`,
              })),
              endData,
            ]
          : [startData, endData];

      const routeData = {
        user_route: {
          name: routeName,
          locations_attributes: locationsAttributes,
        },
      };
      setShowCreateRouteSheet(false);
      const resp = await createRoute(routeData);
      if (resp?.data) {
        dispatch(setManagerRouteEmpty({}));
        setWaypoints([]);
        setUndoStack([]);
        setRedoStack([]);
        setRoute([]);
        showAlert('Alert', 'Your route has been created successfully.');
      } else {
        showAlert('Error', UNEXPECTED_ERROR);
      }
    } else {
      showAlert('Alert', 'Please enter route name to continue.');
    }
  };
  const onPressToggle = () => {
    setAvailable(!available);
  };

  return (
    <MainWrapper style={styles.container}>
      <HeaderView onPressToggle={() => onPressToggle()} switchOn={available} />
      <SearchView
        onPressSearch={() => console.log('WOrking')}
        onPressFilter={{}}
        onPressMenu={{}}
      />

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
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}

        {managerRoute?.pickup?.coords && (
          <MapboxGL.MarkerView coordinate={managerRoute?.pickup?.coords}>
            {svgIcon.RedPin}
          </MapboxGL.MarkerView>
        )}
        {managerRoute?.destination?.coords && (
          <MapboxGL.MarkerView coordinate={managerRoute?.destination?.coords}>
            {svgIcon.StartPoint}
          </MapboxGL.MarkerView>
        )}
        {waypoints?.map((waypoint: any, index: number) => (
          <MapboxGL.MarkerView key={index} coordinate={waypoint}>
            {svgIcon.RedPin}
          </MapboxGL.MarkerView>
        ))}

        {/* Route Line */}
        {route?.length > 0 && (
          <MapboxGL.ShapeSource
            id="routeSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: route,
              },
            }}>
            <MapboxGL.LineLayer
              id="routeLayer"
              style={{
                lineWidth: 4,
                lineColor: PFColors.Blue.Dark,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
      {/* <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => {
          setMapLayerSheeet(true);
        }}>
        {svgIcon.MapLayer}
      </TouchableOpacity> */}

      {'destination' in managerRoute && 'pickup' && (
        <AppButton
          title="Create Route"
          buttonStyle={styles.createRouteBtn}
          handleClick={() =>
            setTimeout(() => {
              setShowCreateRouteSheet(true);
            }, 500)
          }
        />
      )}
      {'destination' in managerRoute && 'pickup' && route?.length > 0 && (
        <View style={styles.undoRedoContainer}>
          <TouchableOpacity
            style={[styles.button]}
            onPress={handleRedo}
            disabled={redoStack.length === 0}>
            {redoStack.length === 0 ? svgIcon.Redo : svgIcon.RedoActive}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button]}
            onPress={handleUndo}
            disabled={undoStack.length === 0}>
            {undoStack.length === 0 ? svgIcon.Undo : svgIcon.UndoActive}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button]} onPress={() => centerMap()}>
            {svgIcon.MapWhiteBg}
          </TouchableOpacity>
        </View>
      )}
      <CreateRouteSheet
        onPressCross={() => setShowCreateRouteSheet(false)}
        modalVisible={showCreateRouteSheet}
        start={startData}
        end={endData}
        handleSave={onPressSaveRoute}
        // disabled={isLoading}
      />

      <MapLayerSheet
        setModalVisible={() => setMapLayerSheeet(false)}
        modalVisible={mapLayerSheeet}
        data={mapTypesArr}
        onPressCard={onSelectMapType}
        onPressCancel={() => setMapLayerSheeet(false)}
        onPressSave={() => onPressSave()}
      />
      <MapSettingSheet
        setModalVisible={() => setMapLayerSheeet(false)}
        // modalVisible={true}
        // data={mapTypesArr}
        // onPressCard={onSelectMapType}
        // onPressCancel={() => setMapLayerSheeet(false)}
        // onPressSave={() => onPressSave()}
      />
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default WellPath;
