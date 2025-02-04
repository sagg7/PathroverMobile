import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {
  AddEntranceSheet,
  AppHeader,
  AppLoader,
  MainWrapper,
  MapLayerSheet,
  PinYourLocationSheet,
  WellPathMenuSheet,
} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
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
import SearchView from './SearchView';
import HeaderView from './HeaderView';
import {MapSettingSheet} from '../../../../components/complex/MapSettingSheet';
import {PinLocationAddress} from '../../../../components/complex/PinLocationAddress';
import {useGetAllWellsQuery} from '../../../../redux/endUser/endUserApiSlice';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import {Text, TouchableOpacity, View} from 'react-native';

const RecordRoute = () => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [route, setRoute] = useState<any>([]);
  const [available, setAvailable] = useState(false);
  const [showMapSettigs, setShowMapSettigs] = useState<boolean>(false);
  const [nearbyPins, setNearbyPins] = useState<boolean>(true);
  const [nearbyWells, setNearbyWells] = useState<boolean>(true);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [searchLocation, setSearchLocation] = useState<any>(null);
  const [searchLocationName, setSearchLocationNames] = useState<any>(null);
  const [selectedWell, setSelectedWell] = useState<any>(null);
  const [showPinAddress, setShowPinAddress] = useState<boolean>(false);
  const [showAddEntranceSheet, setShowAddEntranceSheet] =
    useState<boolean>(false);
  const [entranceCoords, setEntranceCoords] = useState<any>(null);
  const [entranceName, setEntranceName] = useState<any>('');
  const [createRoute, {isLoading: PinLoading}] = useCreateRouteMutation();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [pinYourLocation, setPinYourLocation] = useState<any>({
    latitude: '',
    longitude: '',
    name: '',
  });

  const {data: allWellLocations, isLoading} = useGetAllWellsQuery(undefined);
  const {location} = useLocation();
  const cameraRef = useRef<any>(null);
  const pinLocationSheet = useRef<any>(null);
  const [allWells, setAllWells] = useState<any>([]);
  const [allPins, setAllPins] = useState<any>([]);

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (startTime) {
          const currentTime = Date.now();
          const timePassed = (currentTime - startTime) / 1000; // Convert ms to seconds
          setElapsedTime(elapsedTime + timePassed);
          setStartTime(currentTime); // Update start time to avoid cumulative addition
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const startTimer = () => {
    setStartTime(Date.now());
    // setElapsedTime(0);
    setIsRunning(true);
  };

  // Stop Timer

  // Stop Timer
  const stopTimer = () => {
    setIsRunning(false);
  };

  useEffect(() => {
    if (allWellLocations) setAllPins(allWellLocations?.pin);
    setAllWells(allWellLocations?.wells);
  }, [allWellLocations]);

  useEffect(() => {
    if (!nearbyPins && nearbyWells) {
      setAllWells(allWellLocations?.wells);
      setAllPins([]);
    } else if (!nearbyWells && nearbyPins) {
      setAllPins(allWellLocations?.pin);
      setAllWells([]);
    } else if (nearbyPins && nearbyWells) {
      setAllPins(allWellLocations?.pin);
      setAllWells(allWellLocations?.wells);
    } else if (!nearbyPins && !nearbyWells) {
      setAllPins([]);
      setAllWells([]);
    }
  }, [nearbyPins, nearbyWells, allWellLocations]);

  useEffect(() => {
    if (searchLocation) {
      setTimeout(() => {
        if (cameraRef.current) {
          cameraRef.current.moveTo(searchLocation, 1500);
        } else {
          showAlert(
            'Error',
            'Your coordinates are incorrect, Unable to locate.',
          );
        }
      }, 200);
    }
  }, [searchLocation]);

  const onPressMap = (event: any) => {
    try {
      const {geometry} = event;
      if (geometry && Array.isArray(geometry.coordinates)) {
        if (showAddEntranceSheet) {
          setEntranceCoords(geometry.coordinates);
        }
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

  const onpressMarker = (e: any) => {
    setShowPinAddress(true);
    setSelectedWell(e?.geometry?.coordinates);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Record Route" />

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
        {searchLocation && (
          <MapboxGL.MarkerView coordinate={searchLocation}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}
        {entranceCoords && (
          <MapboxGL.MarkerView coordinate={entranceCoords}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}

        {allWells
          ?.filter(
            (item: any) =>
              item?.lat !== undefined &&
              item?.lat !== '' &&
              item?.log !== undefined &&
              item?.log !== '' &&
              !isNaN(Number(item?.lat)) &&
              !isNaN(Number(item?.log)),
          )
          .map((item: any, index: number) => {
            const coordinates = [Number(item?.log), Number(item?.lat)];
            return (
              <MapboxGL.PointAnnotation
                key={`pin-${index}`}
                id={`pin-${index}`}
                onSelected={onpressMarker}
                coordinate={coordinates}>
                {svgIcon.CurrentLocation}
              </MapboxGL.PointAnnotation>
            );
          })}
        {allPins
          ?.filter(
            (item: any) =>
              item?.lat !== undefined &&
              item?.lat !== '' &&
              item?.log !== undefined &&
              item?.log !== '' &&
              !isNaN(Number(item?.lat)) &&
              !isNaN(Number(item?.log)),
          )
          .map((item: any, index: number) => {
            const coordinates = [Number(item?.log), Number(item?.lat)];
            return (
              <MapboxGL.PointAnnotation
                key={`pin-${index}`}
                id={`pin-${index}`}
                onSelected={onpressMarker}
                coordinate={coordinates}>
                {svgIcon.PinMarker}
              </MapboxGL.PointAnnotation>
            );
          })}

        {/* Route Line */}
        {/* {route?.length > 1 && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              id="routeLayer-unique"
              style={{
                lineWidth: 3,
                lineColor: PFColors.Blue.Dark,
              }}
            />
          </MapboxGL.ShapeSource>
        )} */}
        <View style={styles.bllueView}>
          <Text style={styles.timeText}>{formatTime(elapsedTime)}</Text>

          <TouchableOpacity
            style={{marginHorizontal: 10}}
            onPress={() => startTimer()}>
            {svgIcon.Pause}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => stopTimer()}>
            {svgIcon.StopSquare}
          </TouchableOpacity>
        </View>
      </MapboxGL.MapView>
      <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => {
          setMapLayerSheeet(true);
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

export default RecordRoute;
