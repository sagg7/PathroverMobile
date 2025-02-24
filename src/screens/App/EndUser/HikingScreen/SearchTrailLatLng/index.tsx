import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import MapboxGL from '@rnmapbox/maps';
import {svgIcon} from '../../../../../assets/svg';
import {
  AppButton,
  AppHeader,
  MainWrapper,
  StartPointModal,
} from '../../../../../components';
import {RouteToWellSheet} from '../../../../../components/complex/RouteToWellSheet';
import SearchTrailSelector from '../../../../../components/complex/SearchTrailSelector';
import useLocation from '../../../../../hooks/getLocation';
import {
  appIcons,
  mapBoxToken,
  PFColors,
  Routes,
  showAlert,
  WP,
} from '../../../../../shared/exporter';
import {getTimeAndDistance} from '../../../../../shared/utils/helpers';
import styles from './styles';
import {RouteToWellStartedSheet} from '../../../../../components/complex/RouteToWellStartedSheet';
import {
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GeneralModal from '../../../../../components/complex/GeneralModal';
import {
  REPORTS_LIST,
  UNEXPECTED_ERROR,
} from '../../../../../shared/utils/constant';
import ProgressCircle from '../../../../../components/complex/ProgressCircle';
import {
  useAddRouteReportMutation,
  useGetRouteReportQuery,
} from '../../../../../redux/endUser/endUserApiSlice';
import {useCreateRouteMutation} from '../../../../../redux/manager/managerApiSlice';

const SearchTrailLatLng = () => {
  const {location} = useLocation();
  const navigation = useNavigation<any>();
  const mapCameraRef = useRef();
  const {endingPoint, startingPoint} = useSelector(
    (state: any) => state?.endUser?.trailRoute,
  );
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [results, setResults] = useState<null>(null);
  const [routeToStartPoint, setRouteToStartPoint] = useState<any>([]);
  const [isStartBtnPressed, setIsStartBtnPressed] = useState<boolean>(false);
  const [showReachModal, setShowReachModal] = useState(false);
  const [modalKey, setModalKey] = useState(1);
  const [timeDistance, setTimeDistance] = useState(null);
  const [reportsVisible, setReportsVisible] = useState(false);
  const [confirmReportVisible, setConfirmReportVisible] = useState(false);
  const [liveLocation, setLiveLocation] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [selectedReport, setSelectedReport] =
    useState<(typeof REPORTS_LIST)[0]>();
  const [showRouteActionSheet, setShowRouteActionSheet] =
    useState<boolean>(false);
  const [showRouteStartedSheet, setShowRouteStartedSheet] =
    useState<boolean>(false);
  const [routes, setRoute] = useState<any>([]);
  const [actionBtn, setActionBtn] = useState<any>({
    direction: true,
    start: false,
  });

  // API
  const [addRouteReport] = useAddRouteReportMutation();
  const {data: allReports, refetch} = useGetRouteReportQuery({});
  const [createRoute, {isLoading: PinLoading}] = useCreateRouteMutation();

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);

  const fetchRoute = async (start: any, end: any) => {
    const accessToken = mapBoxToken;
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`;

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

  const getRoute = async () => {
    if (currentLocation) {
      try {
        const path = await fetchRoute(currentLocation, startingPoint);
        setRouteToStartPoint(path);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }
  };

  const getRoadRoute = async () => {
    try {
      const path = await fetchRoute(startingPoint, endingPoint);
      setRoute(path);
    } catch (error: any) {
      showAlert('Error fetching road route', error);
    }
  };

  useEffect(() => {
    if (startingPoint?.length > 0 && endingPoint?.length > 0) {
      getRoadRoute();
      setShowRouteActionSheet(true);
    }
  }, [startingPoint, endingPoint]);

  useEffect(() => {
    if (startingPoint && endingPoint) {
      getRouteTotalDistance();
    }
  }, [startingPoint, endingPoint]);

  const getRouteTotalDistance = async () => {
    const routeResults: any = await getTimeAndDistance(
      startingPoint,
      endingPoint,
    );
    setResults(routeResults);
  };

  const handleStartModalSaveBtn = () => {
    setRouteToStartPoint([]);
    setShowReachModal(false);
    setModalKey(2);

    const endCoordinates = endingPoint;
    const startCoordinates = startingPoint;

    // const formattedPoints = selectedRoute?.middle_location_points
    //   .filter((point: any) => point.latitude && point.longitude)
    //   .map((point: any) => [
    //     parseFloat(point.longitude),
    //     parseFloat(point.latitude),
    //   ]);
    // formattedPoints.unshift(startCoordinates);
    // formattedPoints.push(endCoordinates);
    // if (selectedRoute?.route_type === 'maps_location_pins') {
    getRoadRoute(startCoordinates, endCoordinates);
    setIsStartBtnPressed(false);
    // } else {
    //   setRoute(formattedPoints);
    // }
    // setRoute(formattedPoints);
  };

  const getTimeDistanceDetails = async () => {
    const locResults: any = await getTimeAndDistance(
      liveLocation,
      startingPoint,
    );
    setTimeDistance(locResults);
    const match = locResults?.distance?.match(/([\d.]+)\s*(km|m)/);
    const distanceValue = match
      ? parseFloat(match[1]) * (match[2] === 'km' ? 1000 : 1)
      : Number(locResults?.distance) || 0;

    if (distanceValue < 300) {
      setShowReachModal(true);
    }
  };

  useEffect(() => {
    getTimeDistanceDetails();
  }, [currentLocation]);
  useEffect(() => {
    if (liveLocation) getTimeDistanceDetails();
  }, [liveLocation]);

  const onPressStartBtn = async () => {
    getRoute();
    setIsStartBtnPressed(true);
    setShowRouteActionSheet(false);
    const routeResults: any = await getTimeAndDistance(
      startingPoint,
      endingPoint,
    );
    setResults(routeResults);
    setTimeout(() => {
      setShowRouteStartedSheet(true);
    }, 1000);
    setRoute([]);
  };

  const routeGeoJSON = useMemo(
    () => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: isStartBtnPressed ? routeToStartPoint : routes,
      },
    }),
    [isStartBtnPressed, routeToStartPoint, routes],
  );

  const handleLocationUpdate = async (location: any) => {
    if (location?.coords) {
      const {latitude, longitude} = location.coords;
      setLiveLocation([longitude, latitude]);
      const routeResults: any = await getTimeAndDistance(
        [longitude, latitude],
        endingPoint,
      );
      setResults(routeResults);
    }
  };

  const recenterMap = () => {
    if (currentLocation) {
      mapCameraRef?.current?.setCamera({
        centerCoordinate: currentLocation,
        zoomLevel: 15,
        animationDuration: 1000, // Smooth transition effect
      });
    }
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
          console.debug('!');
          handleCloseConfirmReport();
          const data = {
            route_report: {
              report_type: selectedReport?.key,
              latitude: location?.latitude,
              longitude: location?.longitude,
              name: 'ucp',
            },
          };
          console.log(' interval=setInterval ~ data==>', data);
          addRouteReport(data)
            .unwrap()
            .then(res => {
              console.log('RESPONSE:', res), refetch();
            })
            .catch(e => console.log(e));
        }
      }, 1);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [confirmReportVisible, progress]);

  const toggleReport = () => {
    setShowRouteStartedSheet(false);
    setTimeout(() => {
      setReportsVisible(true);
    }, 300);
  };

  const handleCloseReportModal = () => {
    setReportsVisible(false);
    setTimeout(() => {
      setShowRouteStartedSheet(true);
    }, 300);
  };

  const handleSelectReport = (item: (typeof REPORTS_LIST)[0]) => {
    setSelectedReport(item);
    setReportsVisible(false);
    setTimeout(() => {
      setConfirmReportVisible(true);
    }, 400);
  };

  const handleCloseConfirmReport = () => {
    setProgress(0);
    setConfirmReportVisible(false);
    setTimeout(() => {
      setShowRouteStartedSheet(true);
    }, 300);
  };

  const handlePinBtn = async () => {
    const startCoords = {
      latitude: currentLocation[1],
      longitude: currentLocation[0],
      name: 'Start',
    };
    const endCoords = {
      latitude: startingPoint[1],
      longitude: startingPoint[0],
      name: 'End Location',
    };

    const routeData = {
      user_route: {
        name: '',
        route_type: 'maps_location_pins',
        color: PFColors.Blue.Dark,
        weight: '4',

        location_start_attributes: startCoords,
        location_end_attributes: endCoords,
      },
    };
    const resp = await createRoute(routeData);
    if (resp?.data) {
      showAlert('Alert', 'Your location has been pined.');
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  const onPressShare = () => {
    navigation.navigate(Routes.ChatUsers, {
      shareTrail: {startingPoint, endingPoint},
    });
  };

  return (
    <MainWrapper style={styles.container}>
      {!showRouteStartedSheet && <AppHeader title="Search" />}
      {!showRouteStartedSheet && <SearchTrailSelector />}
      <MapboxGL.MapView style={styles.map} scaleBarEnabled={false}>
        <MapboxGL.Camera
          zoomLevel={15}
          ref={mapCameraRef}
          centerCoordinate={
            startingPoint?.length > 0 ? startingPoint : currentLocation
          }
        />
        <MapboxGL.UserLocation visible onUpdate={handleLocationUpdate} />
        {routes?.length > 1 && !isStartBtnPressed && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              key={routes?.length}
              id="routeLayer-unique"
              style={{
                lineWidth: 4,
                lineColor: 'red',
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {routeToStartPoint?.length > 1 && isStartBtnPressed && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              key={routeToStartPoint?.length}
              id="routeLayer-unique"
              style={{
                lineWidth: 4,
                lineColor: 'red',
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {startingPoint?.length > 0 && (
          <MapboxGL.MarkerView coordinate={startingPoint}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}
        {endingPoint?.length > 0 && (
          <MapboxGL.MarkerView coordinate={endingPoint}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
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
      {showRouteStartedSheet && (
        <RouteToWellStartedSheet
          routeName={
            modalKey === 1
              ? 'Enroute to starting point'
              : 'Enroute to destination point'
          }
          routeInfo={timeDistance}
          setModalVisible={() => {
            setShowRouteStartedSheet(false);
            setIsStartBtnPressed(false);
            getRoadRoute();
            setShowRouteActionSheet(true);
          }}
        />
      )}
      {modalKey === 1 && isStartBtnPressed && (
        <StartPointModal
          modalVisible={showReachModal}
          onPressSave={() => handleStartModalSaveBtn()}
          onPressCancel={() => {}}
        />
      )}
      {showRouteActionSheet && (
        <RouteToWellSheet
          onpressCancel={() => navigation.navigate('Hiking')}
          routeName={'Enroute to starting point'}
          distanceInfo={results}
          actionBtn={actionBtn}
          onPressDirection={() => {
            // getRoute();
            setActionBtn({
              ...actionBtn,
              direction: true,
            });
            // centerMap();
          }}
          onPressStart={() => onPressStartBtn()}
          show
          onPressShare={onPressShare}
          onPressPin={() => handlePinBtn()}
        />
      )}
      {showRouteStartedSheet && (
        <>
          <AppButton
            title="Emergency"
            icon={svgIcon.EmergencyCall}
            handleClick={() => Linking.openURL(`tel:911`)}
            buttonStyle={{
              position: 'absolute',
              width: WP('37'),
              right: WP('3'),
              backgroundColor: PFColors.Red.RadiantRed,
              height: 40,
              alignItems: 'center',
              bottom: WP('45'),
            }}
          />
          <AppButton
            title="Recenter"
            icon={svgIcon.PaperPlane}
            handleClick={recenterMap}
            buttonStyle={{
              position: 'absolute',
              width: WP('35'),
              left: WP('3'),
              backgroundColor: '#A0AFC3',
              height: 40,
              alignItems: 'center',
              bottom: WP('45'),
            }}
          />
          <AppButton
            title="Report"
            handleClick={toggleReport}
            buttonStyle={{
              position: 'absolute',
              width: WP('37'),
              right: WP('3'),
              height: 40,
              alignItems: 'center',
              top: WP('5'),
            }}
          />
        </>
      )}
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
    </MainWrapper>
  );
};

export default SearchTrailLatLng;
