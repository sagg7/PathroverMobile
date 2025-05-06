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
  appIcons,
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
import useLocation from '../../../../hooks/getLocation';

const RecordRoute = () => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  const [liveLocation, setLiveLocation] = useState<any>(null);
  const [recordingDetails, setRecordingDetails] = useState<any>({
    name: '',
    notes: '',
  });

  const [route, setRoute] = useState<any>([]);
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const {location} = useLocation();

  const [createRoute, {isLoading: PinLoading}] = useCreateRouteMutation();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const cameraRef = useRef<any>(null);
  const [isRecordingStarted, setIsRecordingStarted] = useState<boolean>(false);
  const [saveRouteSheet, setSaveRouteSheet] = useState<boolean>(false);
  const [heading, setheading] = useState<number>(0);

  const dispatch = useDispatch();

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
    getLocationOneTime();
  }, []);

  useEffect(() => {
    if (location) {
      (async () => {
        setCurrentLocation([location.longitude, location.latitude]);
        cameraRef.current.setCamera({
          centerCoordinate: [location.longitude, location.latitude],
          zoomLevel: 16,
          animationDuration: 1000,
        });
      })();
    }
  }, [location]);

  const getLocationOneTime = async () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCurrentLocation([longitude, latitude]);
          // setLiveLocation([longitude, latitude]);
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
    if (route?.length < 2) {
      showAlert('Alert', 'Please make a route to proceed further.');
      return;
    }
    // setSaveRouteSheet(false);
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
  const handleLocationUpdate = location => {
    if (location?.coords) {
      const {latitude, longitude, heading} = location.coords;

      if (isRecordingStarted) {
        setLiveLocation([longitude, latitude]);
        setRoute(prev => [...prev, [longitude, latitude]]);
        setheading(heading);
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            heading: heading,
          });
        }
      }
    }
  };

  const resetCompass = () => {
    if (cameraRef.current && currentLocation?.length === 2) {
      console.log('Recenter to:', currentLocation);
      cameraRef.current.setCamera({
        centerCoordinate: currentLocation,
        animationDuration: 1000,
        zoomLevel: 16, // optional
      });
    } else {
      console.warn('Invalid currentLocation:', currentLocation);
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
        compassPosition={{top: 8, left: 10}}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={16}
          centerCoordinate={liveLocation}
          pitch={60}
          followUserLocation={isIOS()}
        />
        <MapboxGL.UserLocation
          // key={route?.length}
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

        {/* Route Line */}
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
      {isRecordingStarted && (
        <View style={styles.bllueView}>
          <Text style={styles.timeText}>{formatTime(elapsedTime)} </Text>
          {isRunning ? (
            <TouchableOpacity
              style={{marginHorizontal: 10}}
              onPress={() => stopTimer()}>
              {svgIcon.Pause}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{marginHorizontal: 10}}
              onPress={() => startTimer()}>
              {svgIcon.PlayBtn}
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setSaveRouteSheet(true)}>
            {svgIcon.StopSquare}
          </TouchableOpacity>
        </View>
      )}
      {!isRecordingStarted && (
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
        onPress={() => {
          setMapLayerSheeet(true);
        }}>
        {svgIcon.MapLayer}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.recenterIcon}
        onPress={() => resetCompass()}>
        {svgIcon.RecenterIcon}
      </TouchableOpacity>
      {saveRouteSheet && (
        <SaveRecordRouteSheet
          setModalVisible={() => setSaveRouteSheet(false)}
          recordingDetails={recordingDetails}
          setDetails={setRecordingDetails}
          onPressCancel={() => setSaveRouteSheet(false)}
          onPressSave={() => handleSaveBtn()}
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

      {PinLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default RecordRoute;
