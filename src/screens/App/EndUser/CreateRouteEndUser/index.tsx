import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {TouchableOpacity, View} from 'react-native';
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
import {useNavigation} from '@react-navigation/native';
import {
  Default_Map_Style,
  HP,
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
import {MapSettingSheet} from '../../../../components';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import RBSheet from 'react-native-raw-bottom-sheet';

const CreateRouteEndUser = () => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [route, setRoute] = useState<any>([]);
  const [showMapSettigs, setShowMapSettigs] = useState<boolean>(false);
  const [nearbyPins, setNearbyPins] = useState<boolean>(false);
  const [nearbyWells, setNearbyWells] = useState<boolean>(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [routeName, setRouteName] = useState<string>('');
  const [startingPointName, setStartingPointName] = useState<string>('');
  const [endingPointName, setEndingPointName] = useState<string>('');
  const [showRouteLineCustomizeSheet, setShowRouteLineCustomizeSheet] =
    useState(false);
  const [showSaveRouteSheet, setShowSaveRouteSheet] = useState(false);
  const [routeLineColor, setRouteLineColor] = useState<string>(
    PFColors.Blue.Dark,
  );
  const [routeLineHeight, setRouteLineHeight] = useState<any>(4);

  const [searchValues, setSearchValues] = useState<any>({
    start: '',
    end: '',
  });
  const [searchValuesByAddress, setSearchValuesByAddress] = useState<any>({
    start: '',
    end: '',
  });
  const refScrollable = useRef<any>();

  const {location} = useLocation();
  const cameraRef = useRef<any>(null);
  const [createRoute, {isLoading}] = useCreateRouteMutation();

  const isCoordinates =
    Array.isArray(searchValuesByAddress?.start) &&
    searchValuesByAddress.start.length === 2;

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);

  const onPressMap = event => {
    try {
      const {geometry} = event;
      if (geometry && Array.isArray(geometry.coordinates)) {
        setRoute((prevCoordinates: any) => {
          const start = searchValuesByAddress?.start;
          const end = searchValuesByAddress?.end;
          const newPoint = geometry.coordinates;

          if (!start || !end) {
            return [...prevCoordinates, newPoint];
          }

          let filteredRoute = prevCoordinates.filter(
            (point: any) =>
              !(
                (point[0] === start[0] && point[1] === start[1]) ||
                (point[0] === end[0] && point[1] === end[1])
              ),
          );

          return [start, ...filteredRoute, newPoint, end];
        });

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
      coordinates: route,
    },
  };

  const centerMap = () => {
    const isEmptyLatLng = Object.values(searchValues)?.every(
      value => value === '',
    );
    const isEmptyAdress = Object.values(searchValuesByAddress)?.every(
      value => value === '',
    );
    const hasSearchValues =
      Array.isArray(searchValues.start) &&
      searchValues?.start?.length > 0 &&
      Array.isArray(searchValues?.end) &&
      searchValues?.end.length > 0;

    const hasAddressValues =
      Array.isArray(searchValuesByAddress.start) &&
      searchValuesByAddress?.start?.length > 0 &&
      Array.isArray(searchValuesByAddress?.end) &&
      searchValuesByAddress?.end.length > 0;

    if (isEmptyAdress && hasSearchValues) {
      const convertedState = {
        start: searchValues.start?.map(Number),
        end: searchValues?.end.map(Number),
      };
      const {start, end} = convertedState;
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
    }

    if (isEmptyLatLng && hasAddressValues) {
      const {start, end} = searchValuesByAddress;
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
    }
    if (route?.length > 2 && isEmptyLatLng && isEmptyAdress) {
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
    }
  };

  const undoRoutes = () => {
    if (undoStack?.length > 0) {
      const previousState = undoStack.pop();
      setRedoStack([...redoStack, route]);
      setRoute(previousState);
      setUndoStack([...undoStack]);
    }
  };

  const redoRoutes = () => {
    if (redoStack.length > 0) {
      const lastState = redoStack[redoStack.length - 1];
      setRoute(lastState);
      setRedoStack(redoStack.slice(0, redoStack.length - 1));
      setUndoStack(prevHistory => [...prevHistory, route]);
    }
  };

  const handleSaveRouteBtn = async () => {
    setShowSaveRouteSheet(false);
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
      const routeData = {
        user_route: {
          name: routeName,
          locations_attributes: locationsAttributes,
          route_type: 'custom_route',
          color: routeLineColor,
          weight: routeLineHeight,
        },
      };

      const resp = await createRoute(routeData);

      if (resp?.data) {
        setUndoStack([]);
        setRedoStack([]);
        setRoute([]);
        setRouteName('');
        showAlert('Alert', 'Your route has been created successfully.');
      } else {
        showAlert('Error', UNEXPECTED_ERROR);
      }
    } else {
      showAlert('Alert', 'Please enter route name to continue.');
    }
  };

  useEffect(() => {
    if (searchValuesByAddress || searchValues) {
      const temp = updateRoute(searchValuesByAddress || searchValues);
      setRoute(temp);
    }
  }, [searchValuesByAddress]);

  function updateRoute(dataArr) {
    const start = dataArr?.start;
    const end = dataArr?.end;

    if (!start || !end) return route;
    let filteredRoute = route.filter(
      point =>
        !(
          (point[0] === start[0] && point[1] === start[1]) ||
          (point[0] === end[0] && point[1] === end[1])
        ),
    );

    return [start, ...filteredRoute, end];
  }

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
        onPressFilter={() => setShowMapSettigs(true)}
        onPressMenu={() => setShowOptionsSheet(true)}
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
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}
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
          setMapLayerSheeet(true);
        }}>
        {svgIcon.MapLayer}
      </TouchableOpacity>
      {/* {isCoordinates && ( */}
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
            setShowSaveRouteSheet(true);
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
      <MapSettingSheet
        setModalVisible={() => setShowMapSettigs(false)}
        modalVisible={showMapSettigs}
        onPressCancel={() => setShowMapSettigs(false)}
        well={nearbyWells}
        pin={nearbyPins}
        setPin={setNearbyPins}
        setWell={setNearbyWells}
        onPressClear={() => {
          setNearbyPins(false);
          setNearbyWells(false);
          setTimeout(() => {
            setShowMapSettigs(false);
            setRoute([]);
          }, 1000);
        }}
      />
      <RouteCustomizationSheet
        modalVisible={showRouteLineCustomizeSheet}
        setColor={setRouteLineColor}
        setRouteLineHeight={setRouteLineHeight}
        onPressCancel={() => setShowRouteLineCustomizeSheet(false)}
        onPressSave={() => setShowRouteLineCustomizeSheet(false)}
      />

      <RBSheet
        ref={refScrollable}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customStyles={{
          container: {
            height: HP('29'),
            borderTopLeftRadius: WP('3'),
            borderTopRightRadius: WP('3'),
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

      {/* <PinLocationAddress modalVisible /> */}
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default CreateRouteEndUser;
