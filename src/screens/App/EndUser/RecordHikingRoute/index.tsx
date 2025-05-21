import React, {useEffect, useMemo, useRef, useState} from 'react';
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
  isIOS,
  MapTypes,
  PFColors,
  showAlert,
  UNEXPECTED_ERROR,
  WP,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';

import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import {
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setMapLayerStyle} from '../../../../redux/manager/managerSlice';
import haversine from 'haversine-distance';
import GeneralModal from '../../../../components/complex/GeneralModal';
import ProgressCircle from '../../../../components/complex/ProgressCircle';
import {
  REPORTS_LIST,
  ROUTE_LINE_STYLES,
} from '../../../../shared/utils/constant';
import {
  useAddRouteReportMutation,
  useGetRouteReportQuery,
} from '../../../../redux/endUser/endUserApiSlice';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import useLocation from '../../../../hooks/getLocation';

const RecordHikingRoute = () => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [reportsVisible, setReportsVisible] = useState(false);
  const [confirmReportVisible, setConfirmReportVisible] = useState(false);
  const [selectedReport, setSelectedReport] =
    useState<(typeof REPORTS_LIST)[0]>();
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const {data: allReports, refetch} = useGetRouteReportQuery({});

  const [liveLocation, setLiveLocation] = useState<any>(null);
  const [recordingDetails, setRecordingDetails] = useState<any>({
    name: '',
    note: '',
  });

  const [route, setRoute] = useState<any>([]);
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);

  const [createRoute, {isLoading: PinLoading}] = useCreateRouteMutation();
  const [hideActionBtn, setHideActionBtn] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const cameraRef = useRef<any>(null);
  const [isRecordingStarted, setIsRecordingStarted] = useState<boolean>(false);
  const [saveRouteSheet, setSaveRouteSheet] = useState<boolean>(false);
  const [speed, setSpeed] = useState<any>(0);
  const [elevation, setElevation] = useState<any>(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [progress, setProgress] = useState(0);
  const [addRouteReport] = useAddRouteReportMutation();
  const [heading, setheading] = useState<number>(0);
  const lastCameraUpdateTimeRef = useRef(0);
  const dispatch = useDispatch();
  const BOTTOM_SHEET_HEIGHT = -8;
  const PIXEL_TO_COORDINATE_FACTOR = 0.0002;
  const {location} = useLocation();
  const [hasCenteredOnce, setHasCenteredOnce] = useState(false);

  const routeRef = useRef<any>([]); // Stores route without triggering re-renders
  const distanceRef = useRef<any>(0);
  const updateRouteThrottled = useRef<any>(null);
  useEffect(() => {
    activateKeepAwake();

    return () => {
      deactivateKeepAwake();
    };
  }, []);

  useEffect(() => {
    if (mapLayerStyle) {
      setSelectedMapType(mapLayerStyle);
    }
  }, [mapLayerStyle]);

  useEffect(() => {
    if (location && !hasCenteredOnce) {
      const {longitude, latitude} = location;
      const coords: [number, number] = [longitude, latitude];
      setLiveLocation(coords);
      setHasCenteredOnce(true);

      setTimeout(() => {
        cameraRef.current?.setCamera({
          centerCoordinate: coords,
          zoomLevel: 16,
          pitch: 60,
          animationDuration: 1000,
        });
      }, 500);
    }
  }, [location]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1); // Increment by 1 per second
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

  const handleSaveBtn = async () => {
    if (route?.length < 2) {
      showAlert('Alert', 'Please make a route to proceed further.');
      return;
    }

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
        notes: recordingDetails?.note,
        route_type: 'hiking_trail_route',
        color: PFColors.Blue.Dark,
        weight: '4',
        locations_attributes: locationsAttributes,
        isChosenTrail: false,
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

  const routeGeoJSON = useMemo(
    () => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: routeRef.current,
      },
    }),
    [route],
  );

  const handleLocationUpdate = location => {
    if (!location?.coords || !isRecordingStarted) return;
    const {latitude, longitude, speed, altitude, heading} = location.coords;
    const speedMph = speed ? (speed * 2.23694).toFixed(1) : '0.00';
    const elevationFeet = altitude ? (altitude * 3.28084).toFixed(0) : '0.00';

    setLiveLocation([longitude, latitude]);
    setSpeed(speedMph);
    setElevation(elevationFeet);
    setheading(heading);
    const now = Date.now();
    const shouldMoveCamera = now - lastCameraUpdateTimeRef.current > 1000; // move at most once per second
    const newPoint = [longitude, latitude];
    if (shouldMoveCamera && cameraRef.current) {
      cameraRef?.current?.moveTo(newPoint, 1000);
      lastCameraUpdateTimeRef.current = now;
    }

    if (routeRef.current.length > 0) {
      const lastPoint = routeRef.current[routeRef.current.length - 1];
      const distanceBetween = haversine(
        {lat: lastPoint[1], lon: lastPoint[0]},
        {lat: latitude, lon: longitude},
      );
      if (distanceBetween > 3) {
        // Only update if moved > 3 meters
        distanceRef.current += distanceBetween * 0.000621371;

        if (!updateRouteThrottled.current) {
          updateRouteThrottled.current = setTimeout(() => {
            setRoute([...routeRef.current]);
            updateRouteThrottled.current = null;
          }, 1000); // update at most once per second
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
        setTotalDistance(distanceRef.current?.toFixed(2));
        routeRef.current.push([longitude, latitude]);
      }
    } else {
      routeRef.current.push([longitude, latitude]);
      setRoute([...routeRef.current]);

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

  const handleStartRecording = () => {
    setIsRecordingStarted(true);
    startTimer();
  };

  const toggleReport = () => {
    setTimeout(() => {
      setReportsVisible(true);
    }, 300);
  };
  const handleCloseReportModal = () => {
    setReportsVisible(false);
    setTimeout(() => {}, 300);
  };
  const handleSelectReport = (item: (typeof REPORTS_LIST)[0]) => {
    setSelectedReport(item);
    setReportsVisible(false);
    setTimeout(() => {
      setConfirmReportVisible(true);
    }, 400);
  };
  useEffect(() => {
    let interval: any;
    if (confirmReportVisible) {
      interval = setInterval(() => {
        if (progress < 1) {
          setProgress(prevProgress =>
            prevProgress >= 1 ? 0 : prevProgress + 0.01,
          );
        } else {
          handleCloseConfirmReport();
          const data = {
            route_report: {
              report_type: selectedReport?.key,
              latitude: liveLocation[1],
              longitude: liveLocation[0],
              name: 'ucp',
            },
          };
          addRouteReport(data)
            .unwrap()
            .then(res => {
              refetch();
            })
            .catch(e => console.log(e));
        }
      }, 1);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [confirmReportVisible, progress]);
  const handleCloseConfirmReport = () => {
    setProgress(0);
    setConfirmReportVisible(false);
    setTimeout(() => {}, 300);
  };

  const centerToLiveLocation = () => {
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

  const adjustLocationForBottomSheet = location => {
    if (!location) return null;
    const latitude = location[1];
    const longitude = location[0];

    const adjustedLatitude =
      latitude + BOTTOM_SHEET_HEIGHT * PIXEL_TO_COORDINATE_FACTOR;

    return [longitude, adjustedLatitude];
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
          animationMode="flyTo"
          animationDuration={1000}
          heading={heading}
          centerCoordinate={liveLocation}
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
        {allReports?.length > 0 &&
          allReports?.map((report: any) => {
            return (
              <MapboxGL.MarkerView
                coordinate={[report?.longitude, report?.latitude]}>
                <View style={styles.markerReport}>
                  <Image
                    source={
                      REPORTS_LIST.find(rep => rep.key == report?.report_type)
                        ?.icon
                    }
                    style={styles.report}
                  />
                </View>
              </MapboxGL.MarkerView>
            );
          })}
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
      <View>
        {isRecordingStarted && !hideActionBtn && (
          <>
            <AppButton
              title="Emergency"
              icon={svgIcon.EmergencyCall}
              handleClick={() => Linking.openURL(`tel:911`)}
              buttonStyle={styles.emergencyBtn}
            />
            <AppButton
              title="Recenter"
              icon={svgIcon.PaperPlane}
              handleClick={() => centerToLiveLocation()}
              buttonStyle={styles.recenterBtn}
            />
            <AppButton
              title="Report"
              handleClick={toggleReport}
              buttonStyle={styles.reportAction}
            />
          </>
        )}
      </View>
      <GeneralModal
        title={'Add a report'}
        visible={reportsVisible}
        onClose={handleCloseReportModal}>
        <FlatList
          numColumns={2}
          data={REPORTS_LIST}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSelectReport(item)}
                style={styles.reportCard}>
                <Image source={item.icon} style={styles.reportIcon} />
                <Text style={styles.reportCardTitle}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </GeneralModal>
      <GeneralModal
        visible={confirmReportVisible}
        title="Adding report"
        onClose={handleCloseConfirmReport}>
        <View style={styles.confirmReportContainer}>
          <ProgressCircle
            imageSource={selectedReport?.icon}
            progress={progress}
            size={WP('16')}
            color={PFColors.Standard.Black}
          />
          <Text
            style={[
              styles.reportCardTitle,
              {marginVertical: WP('4')},
            ]}>{`Add ${selectedReport?.name} to the map`}</Text>
          <AppButton
            title="Undo"
            buttonStyle={{width: WP('90')}}
            handleClick={handleCloseConfirmReport}
          />
        </View>
      </GeneralModal>

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
          onChange={setRecordingDetails}
          setHideActionBtn={setHideActionBtn}
        />
      )}
      {PinLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default RecordHikingRoute;
