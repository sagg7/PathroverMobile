import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {
  AppButton,
  AppHeader,
  AppLoader,
  MainWrapper,
  MapLayerSheet,
  SaveRecordHikingRouteSheet,
} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {
  Default_Map_Style,
  MapTypes,
  PFColors,
  showAlert,
  UNEXPECTED_ERROR,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import Geolocation from 'react-native-geolocation-service';

import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import {TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setMapLayerStyle} from '../../../../redux/manager/managerSlice';
import haversine from 'haversine-distance';

const RecordHikingRoute = () => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>([
    74.272999, 31.453079,
  ]);

  const [liveLocation, setLiveLocation] = useState<any>(null);
  const [recordingDetails, setRecordingDetails] = useState<any>('');

  const [route, setRoute] = useState<any>([]);
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);

  const [createRoute, {isLoading: PinLoading}] = useCreateRouteMutation();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const cameraRef = useRef<any>(null);
  const [isRecordingStarted, setIsRecordingStarted] = useState<boolean>(false);
  const [saveRouteSheet, setSaveRouteSheet] = useState<boolean>(false);
  const [speed, setSpeed] = useState<any>(0);
  const [elevation, setElevation] = useState<any>(0);
  const [totalDistance, setTotalDistance] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (mapLayerStyle) {
      setSelectedMapType(mapLayerStyle);
    }
  }, [mapLayerStyle]);

  useEffect(() => {
    getLocationOneTime();
  }, []);

  const getLocationOneTime = async () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCurrentLocation([longitude, latitude]);
          setLiveLocation([longitude, latitude]);
        },

        error => {
          showAlert('Location Error', error.message);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 5000},
      );
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (startTime) {
          const currentTime = Date.now();
          const timePassed = (currentTime - startTime) / 1000;
          setElapsedTime(elapsedTime + timePassed);
          setStartTime(currentTime);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const startTimer = () => {
    setStartTime(Date.now());
    setIsRunning(true);
  };

  // Stop Timer
  const stopTimer = () => {
    setIsRunning(false);
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
    dispatch(setMapLayerStyle(selected));

    setTimeout(() => {
      setMapLayerSheeet(false);
    }, 500);
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
  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: route,
    },
  };

  const handleSaveBtn = async () => {
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
        name: recordingDetails,
        route_type: 'hiking_trail_route',
        color: PFColors.Blue.Dark,
        weight: '4',
        locations_attributes: locationsAttributes,
      },
    };
    const resp = await createRoute(routeData);
    setSaveRouteSheet(false);
    if (resp?.data) {
      showAlert('Alert', 'Your recording has been saved.');
      navigation.goBack();
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };
  const handleLocationUpdate = location => {
    if (location?.coords) {
      const {latitude, longitude, heading, speed, altitude} = location.coords;

      if (isRecordingStarted) {
        setLiveLocation([longitude, latitude]);
        // setRoute(prev => [...prev, [longitude, latitude]]);
        const speedMph = speed ? (speed * 2.23694).toFixed(2) : '0.00';
        const elevationFeet = altitude
          ? (altitude * 3.28084).toFixed(0)
          : '0.00';

        setRoute(prev => {
          if (prev.length > 0) {
            const lastPoint = prev[prev.length - 1];
            const newPoint = {latitude, longitude};

            // Calculate distance using Haversine formula
            const distanceBetween = haversine(
              {lat: lastPoint[1], lon: lastPoint[0]},
              newPoint,
            );

            // Convert meters to miles and update total distance
            setTotalDistance(
              prevDistance => prevDistance + distanceBetween * 0.000621371,
            );
          }

          return [...prev, [longitude, latitude]];
        });

        setSpeed(speedMph);
        setElevation(elevationFeet);
      }
      if (cameraRef.current) {
        cameraRef?.current.setCamera({
          centerCoordinate: [longitude, latitude],
          zoomLevel: 16,
          animationDuration: 1000, // Smooth animation
          bearing: heading,
        });
      }
    }
  };

  const handleStartRecording = () => {
    setIsRecordingStarted(true);
    startTimer();
  };

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Record Route" />

      <MapboxGL.MapView
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
        compassEnabled
        compassPosition={{top: 8, left: 10}}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={16}
          followUserLocation={true}
          followZoomLevel={16}
          centerCoordinate={liveLocation}
        />
        <MapboxGL.UserLocation visible onUpdate={handleLocationUpdate} />

        {currentLocation && (
          <MapboxGL.MarkerView coordinate={currentLocation}>
            {svgIcon.CurrentMarker}
          </MapboxGL.MarkerView>
        )}

        {/* {liveLocation && isRecordingStarted && (
          <MapboxGL.MarkerView coordinate={liveLocation}>
            {svgIcon.CurrentMarker}
          </MapboxGL.MarkerView>
        )} */}

        {/* Route Line */}
        {route?.length > 1 && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              id="routeLayer-unique"
              style={{
                lineWidth: 3,
                lineColor: PFColors.Blue.Dark,
                lineJoin: 'round',
                lineCap: 'round',
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      {!isRecordingStarted && (
        <AppButton
          title="Start Recording"
          buttonStyle={styles.recordBtn}
          handleClick={() => handleStartRecording()}
        />
      )}

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
      {isRecordingStarted && (
        <SaveRecordHikingRouteSheet
          onPressSave={() => handleSaveBtn()}
          onPressResume={() => startTimer()}
          onPressPause={() => stopTimer()}
          time={formatTime(elapsedTime)}
          speed={speed}
          elevation={elevation}
          distance={totalDistance}
          value={recordingDetails}
          onChange={text => setRecordingDetails(text)}
          // setModalVisible={()=>}
        />
      )}
      {PinLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default RecordHikingRoute;
