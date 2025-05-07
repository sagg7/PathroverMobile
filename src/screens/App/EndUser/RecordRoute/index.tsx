import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {
  AppHeader,
  AppLoader,
  MainWrapper,
  MapLayerSheet,
  SaveRecordRouteSheet,
} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {
  Default_Map_Style,
  isIOS,
  MapTypes,
  PFColors,
  ROUTE_LINE_STYLES,
  showAlert,
  UNEXPECTED_ERROR,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import Geolocation from 'react-native-geolocation-service';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import {Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setMapLayerStyle} from '../../../../redux/manager/managerSlice';

const RecordRoute = () => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  const [mapLayerSheeet, setMapLayerSheeet] = useState(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [liveLocation, setLiveLocation] = useState<any>(null);
  const [recordingDetails, setRecordingDetails] = useState({
    name: '',
    notes: '',
  });
  const [route, setRoute] = useState<any>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const [saveRouteSheet, setSaveRouteSheet] = useState(false);
  const [heading, setheading] = useState(0);
  const [hasCenteredOnce, setHasCenteredOnce] = useState(false);

  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [createRoute, {isLoading: PinLoading}] = useCreateRouteMutation();
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);

  // Set custom map layer style
  useEffect(() => {
    if (mapLayerStyle) {
      setSelectedMapType(mapLayerStyle);
      const updated = mapTypesArr.map(item => ({
        ...item,
        isSelected: item.type === mapLayerStyle,
      }));
      setMapTypesArr(updated);
    }
  }, [mapLayerStyle]);

  // Get current location once
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation([longitude, latitude]);
      },
      error => {
        showAlert('Location Error', error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 5000},
    );
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1); // 1 per second
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Start/Stop timer
  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);

  // Save map layer selection
  const onSelectMapType = item => {
    setMapTypesArr(prev =>
      prev.map(v => ({
        ...v,
        isSelected: v.id === item.id,
      })),
    );
  };

  const onPressSave = () => {
    const selected: any = mapTypesArr.find(item => item.isSelected)?.type;
    setSelectedMapType(selected);
    dispatch(setMapLayerStyle(selected));
    setTimeout(() => setMapLayerSheeet(false), 500);
  };

  const formatTime = time => {
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
    if (route?.length < 2) {
      showAlert('Alert', 'Please make a route to proceed further.');
      return;
    }

    const locationsAttributes = route.map(([longitude, latitude], index) => ({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      name: `Point ${index + 1}`,
    }));

    const routeData = {
      user_route: {
        name: recordingDetails?.name,
        notes: recordingDetails?.notes,
        route_type: 'recording_route',
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

  // Set location + heading + center camera once
  const handleLocationUpdate = location => {
    if (location?.coords) {
      const {latitude, longitude, heading} = location.coords;
      setLiveLocation([longitude, latitude]);
      setheading(heading);

      if (isRecordingStarted) {
        setRoute(prev => [...prev, [longitude, latitude]]);
      }

      if (!hasCenteredOnce) {
        setHasCenteredOnce(true);
        setTimeout(() => {
          cameraRef.current?.setCamera({
            centerCoordinate: [longitude, latitude],
            heading: heading,
            pitch: 60,
            zoomLevel: 16,
            animationDuration: 1000,
          });
        }, 300);
      }
    }
  };

  const resetCompass = () => {
    if (liveLocation?.length === 2) {
      cameraRef.current?.setCamera({
        centerCoordinate: liveLocation,
        heading: heading,
        zoomLevel: 16,
        pitch: 60,
        animationDuration: 1000,
      });
    } else {
      console.log('Error', 'Current location not available.');
    }
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
        compassFadeWhenNorth
        compassPosition={{top: 8, left: 10}}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={16}
          pitch={60}
          heading={heading}
          centerCoordinate={liveLocation}
          animationMode="flyTo"
          animationDuration={1000}
        />

        <MapboxGL.UserLocation
          visible
          onUpdate={handleLocationUpdate}
          minDisplacement={isIOS() ? 3 : 10}
          requestsAlwaysUse
          showsUserHeadingIndicator
          androidRenderMode="compass"
        />

        {currentLocation && (
          <MapboxGL.MarkerView coordinate={currentLocation}>
            {svgIcon.CurrentMarker}
          </MapboxGL.MarkerView>
        )}

        {route?.length > 1 && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              id="routeLayer-unique"
              style={{
                lineWidth: ROUTE_LINE_STYLES.lineWidth,
                lineColor: ROUTE_LINE_STYLES.color,
                lineJoin: 'round',
                lineCap: 'round',
                lineOpacity: ROUTE_LINE_STYLES.opacity,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      {isRecordingStarted ? (
        <View style={styles.bllueView}>
          <Text style={styles.timeText}>{formatTime(elapsedTime)}</Text>
          {isRunning ? (
            <TouchableOpacity
              style={{marginHorizontal: 10}}
              onPress={stopTimer}>
              {svgIcon.Pause}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{marginHorizontal: 10}}
              onPress={startTimer}>
              {svgIcon.PlayBtn}
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setSaveRouteSheet(true)}>
            {svgIcon.StopSquare}
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.videoCam}
          onPress={() => {
            setIsRecordingStarted(true);
            startTimer();
          }}>
          {svgIcon.VideoCam}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => setMapLayerSheeet(true)}>
        {svgIcon.MapLayer}
      </TouchableOpacity>

      <TouchableOpacity style={styles.recenterIcon} onPress={resetCompass}>
        {svgIcon.RecenterIcon}
      </TouchableOpacity>

      {saveRouteSheet && (
        <SaveRecordRouteSheet
          setModalVisible={() => setSaveRouteSheet(false)}
          recordingDetails={recordingDetails}
          setDetails={setRecordingDetails}
          onPressCancel={() => setSaveRouteSheet(false)}
          onPressSave={handleSaveBtn}
        />
      )}

      <MapLayerSheet
        setModalVisible={() => setMapLayerSheeet(false)}
        modalVisible={mapLayerSheeet}
        data={mapTypesArr}
        onPressCard={onSelectMapType}
        onPressCancel={() => setMapLayerSheeet(false)}
        onPressSave={onPressSave}
      />

      {PinLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default RecordRoute;
