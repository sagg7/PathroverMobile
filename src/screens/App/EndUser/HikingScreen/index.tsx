import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import {
  PFColors,
  MainWrapper,
  TrailInfoSheet,
  fetchSuggestions,
  AppHeader,
  WeatherSheet,
  appIcons,
  MapLayerSheet,
  Default_Map_Style,
  Routes,
  MapTypes,
  WEATHER_API_KEY,
  PinYourLocationSheet,
  showAlert,
  UNEXPECTED_ERROR,
  AppLoader,
  mapBoxToken,
  CHAT_NON_VERIFIED_TEXT,
  HP,
  WP,
  ROUTE_LINE_STYLES,
} from '../../../../shared/exporter';
import styles from './styles';
import {svgIcon} from '../../../../assets/svg';
import HeaderView from '../HikingScreen/HeaderView';
import {useDispatch, useSelector} from 'react-redux';
import HikingFilter from '../../../../components/complex/HikingFilter';
import GeneralModal from '../../../../components/complex/GeneralModal';
import {setMapLayerStyle} from '../../../../redux/manager/managerSlice';
import {
  resetTrailRoute,
  setSelectedTrail,
} from '../../../../redux/endUser/endUserSlice';
import useLocation from '../../../../hooks/getLocation';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import {RouteToWellSheet} from '../../../../components/complex/RouteToWellSheet';
import usePlaceName from '../../../../hooks/getPlaceName';
import {getTimeAndDistance, isIOS} from '../../../../shared/utils/helpers';
import SharedSheet from '../../../../components/complex/SharedSheet';
import {useCreateShareLinkRouteMutation} from '../../../../redux/endUser/endUserApiSlice';
import Share from 'react-native-share';
import RBSheet from 'react-native-raw-bottom-sheet';
import usePremiumAlert from '../../../../hooks/usePremiumAlert';

const MY_DATA_MODAL_CONTENT = [
  {
    title: 'Trails',
    type: 'hiking_trail_route',
    icon: svgIcon.RouteBlue,
  },
  {
    title: 'Routes',
    type: 'hiking_custom_route',
    icon: svgIcon.Track,
  },
  {
    title: 'WayPoint (H)',
    type: 'hiking_waypoint',
    icon: svgIcon.RouteBlue,
  },
];

const HikingScreen = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const cameraRef = useRef<any>(null);
  const [weather, setWeather] = useState<any>([]);
  const [trailsData, setTrailsData] = useState(null);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedType, setSelectedType] = useState('hiking');
  const [trailInfo, setTrailInfo] = useState<any>(null);
  const [isMyDataVisible, setIsMyDataVisible] = useState(false);
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [showFilterSheet, setShowFilterSheet] = useState<boolean>(false);
  const [showWeatherSheet, setShowWeatherSheet] = useState<boolean>(false);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [pinLocationDetails, setPinLocationDetails] = useState<any>({
    latitude: null,
    longitude: null,
    name: null,
  });
  const [results, setResults] = useState<null>(null);

  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const {is_subscribed: subscription} = useSelector(
    state => state?.auth?.loginUser,
  );
  const {showPremiumAlert} = usePremiumAlert();

  const [showNavigationSheet, setShowNavigationSheet] =
    useState<boolean>(false);
  const [pinLocationMarker, setPinLocationMarker] = useState<any>([]);
  const {placeName, fetchPlaceName} = usePlaceName();
  const {location} = useLocation();

  const [showTrailInfoSheet, setShowTrailInfoSheet] = useState<boolean>(false);
  const [routes, setRoute] = useState<any>([]);
  const [showShareSheet, setShowShareSheet] = useState<boolean>(false);
  const [showTrailShareSheet, setShowTrailShareSheet] =
    useState<boolean>(false);

  const {loginUser} = useSelector(state => state.auth);
  const [createRoute, {isLoading}] = useCreateRouteMutation();
  const [actionBtn, setActionBtn] = useState<any>({
    direction: true,
    start: false,
  });
  const [offRoadSegment, setOffRoadSegment] = useState<any>([]);

  const pinLocationSheet = useRef<any>(null);

  const [createShareLinkRoute, {isLoading: linkRouteLoading}] =
    useCreateShareLinkRouteMutation();
  // Get user location
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${location?.latitude}&lon=${location?.longitude}&cnt=7&appid=${WEATHER_API_KEY}&units=imperial`,
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch weather data: ${errorText}`);
        }
        const data = await response.json();

        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather data:', error.message);
      }
    };

    if (location && location?.latitude) {
      fetchWeatherData();
      setUserLocation([location.longitude, location.latitude]);
    }
  }, [location]);

  useEffect(() => {
    if (route?.params) {
      const latitude: any = route?.params?.latitude;
      const longitude: any = route?.params?.longitude;
      setUserLocation([longitude, latitude]);
      fetchNearbyTrails(latitude, longitude);
      setTimeout(() => {
        cameraRef.current.moveTo([longitude, latitude], 1000);
      }, 1000);
    } else {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setUserLocation([longitude, latitude]);
          fetchNearbyTrails(latitude, longitude);
        },
        error => Alert.alert('Error', error.message),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  }, [route]);

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
    if (subscription) {
      fetchNearbyTrails(userLocation?.[1], userLocation?.[0]);
    }
  }, [selectedType, userLocation]);

  const getOverpassQuery = (latitude, longitude, type) => {
    let filters = '';

    switch (type) {
      case 'hiking':
        filters = `
        way["highway"="path"](around:5000, ${latitude}, ${longitude});
        way["route"="hiking"](around:5000, ${latitude}, ${longitude});
        `;
        // way["sac_scale"](around:5000, ${latitude}, ${longitude});
        break;
      // case 'footway':
      //   filters = `way["highway"="footway"](around:5000, ${latitude}, ${longitude});`;
      //   break;
      // case 'steps':
      //   filters = `way["highway"="steps"](around:5000, ${latitude}, ${longitude});`;
      //   break;
      case 'skiing':
        filters = `way["piste:type"](around:5000, ${latitude}, ${longitude});`;
        break;
      case 'mtb':
        filters = `
        way["highway"="path"]["bicycle"~"yes|designated"](around:5000, ${latitude}, ${longitude});
        way["highway"="track"]["bicycle"~"yes|designated"](around:5000, ${latitude}, ${longitude});
        way["mtb:scale"](around:5000, ${latitude}, ${longitude});
        `;
        break;
      case 'cycleway':
        filters = `way["highway"="cycleway"](around:5000, ${latitude}, ${longitude});`;
        break;
      case 'bridleway':
        filters = `
        way["highway"="bridleway"](around:5000, ${latitude}, ${longitude});
        way["horse"="yes"](around:5000, ${latitude}, ${longitude});
        `;
        break;
      case 'track':
        filters = `
        way["highway"="track"](around:5000, ${latitude}, ${longitude});
        way["highway"="track"]["surface"~"dirt|gravel|sand|unpaved"](around:5000, ${latitude}, ${longitude});
        way["highway"="track"]["tracktype"~"grade3|grade4|grade5"](around:5000, ${latitude}, ${longitude});
        way["highway"="track"]["motor_vehicle"="yes"](around:5000, ${latitude}, ${longitude});
        way["highway"="track"]["motorcycle"="yes"](around:5000, ${latitude}, ${longitude});
        `;
        break;
      default:
        // Fetch all relevant trails if no specific type is selected
        filters = ` 
        way["route"~"hiking|mtb"](around:5000, ${latitude}, ${longitude});
        way["piste:type"](around:5000, ${latitude}, ${longitude});
        way["highway"~"footway|cycleway|bridleway|path|track"](around:5000, ${latitude}, ${longitude});
        way["highway"="track"]["surface"~"dirt|gravel|sand|unpaved"](around:5000, ${latitude}, ${longitude});
        way["highway"="track"]["tracktype"~"grade3|grade4|grade5"](around:5000, ${latitude}, ${longitude});
        `;
    }

    return `
    [out:json];
    (
      ${filters}
    );
    out geom;
    `;
  };

  const getTrailColor = (index: any) => {
    const colors = ['#13488A'];
    // const colors = ['#ff7f00', '#1f77b4', '#2ca02c', '#d62728', '#9467bd'];
    return colors[index % colors.length];
  };

  const fetchNearbyTrails = async (latitude: any, longitude: any) => {
    if (subscription) {
      const overpassQuery = getOverpassQuery(latitude, longitude, selectedType);
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
        overpassQuery,
      )}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.elements) return;

        // Convert Overpass API response to GeoJSON format
        const geoJson = {
          type: 'FeatureCollection',
          features: data.elements.map((element: any, index: any) => ({
            type: 'Feature',
            properties: {tags: element?.tags, color: getTrailColor(index)},
            geometry: {
              type: 'LineString',
              // coordinates: offsetCoordinates(
              //   element.geometry.map((point: any) => [point.lon, point.lat]),
              //   0.0001,
              // ),
              coordinates: element.geometry.map((point: any) => [
                point.lon,
                point.lat,
              ]),
            },
          })),
        };

        setTrailsData(geoJson?.features);
      } catch (error) {
        console.error('Error fetching trails:', error);
      }
    }
  };

  const handleCalloutPress = (e: any, trail: any) => {
    setTrailInfo(trail);
    setTimeout(() => {
      setShowTrailInfoSheet(true);
    }, 300);
  };

  const toRad = (value: any) => (value * Math.PI) / 180;

  const getDistanceInKm = (coord1: any, coord2: any) => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  };

  const fetchRoute = async (start: any, end: any) => {
    const accessToken = mapBoxToken;
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const route = data?.routes[0]?.geometry?.coordinates;

      if (!route || route?.length === 0) return {mainRoute: [], offRoad: []};

      const firstRoutePoint = route[0];
      const lastRoutePoint = route[route.length - 1];

      const startDistance = getDistanceInKm(start, firstRoutePoint);
      const endDistance = getDistanceInKm(end, lastRoutePoint);

      const isStartOffRoad = startDistance > 0.01; // 10 meters
      const isEndOffRoad = endDistance > 0.01;

      let offRoad = [];

      if (isStartOffRoad) {
        const formatedArr = start?.map((item: any) => Number(item));

        offRoad?.push([formatedArr, firstRoutePoint]);
      }
      if (isEndOffRoad) {
        const formatedArr = end?.map((item: any) => Number(item));

        offRoad?.push([lastRoutePoint, formatedArr]);
      }
      return {
        mainRoute: route,
        offRoad: offRoad,
      };
    } catch (error) {
      return {mainRoute: [], offRoad: []};
    }
  };

  const onPressMap = async (event: any) => {
    try {
      const {geometry} = event;
      if (geometry && Array.isArray(geometry.coordinates)) {
        const coords = geometry.coordinates;
        console.log('COORDS', coords);
        // return;
        setPinLocationMarker(coords);
        setPinLocationDetails({
          latitude: coords[1],
          longitude: coords[0],
          name: pinLocationDetails?.name ? pinLocationDetails?.name : '',
        });

        fetchPlaceName(coords[1], coords[0]);
        const {mainRoute, offRoad} = await fetchRoute(userLocation, coords);
        setRoute(mainRoute);
        setOffRoadSegment(offRoad);
        const locResults: any = await getTimeAndDistance(userLocation, coords);

        setResults(locResults);
        setTimeout(() => {
          setShowNavigationSheet(true);
          fitToBounds();
        }, 1000);
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

  const onPressPin = async (routeData: any) => {
    const trailInfo = routeData?.properties?.tags;
    const trailPath = routeData?.geometry?.coordinates;
    const locationsAttributes =
      trailPath?.length > 0
        ? [
            ...trailPath.map(([longitude, latitude], index) => ({
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              name: `Point ${index + 1}`,
            })),
          ]
        : [];
    const routeObj = {
      user_route: {
        name: trailInfo?.name || '',
        notes: '',
        route_type: 'hiking_trail_route',
        is_chosen_trail: true,
        color: PFColors.Blue.Dark,
        weight: '4',
        locations_attributes: locationsAttributes,
      },
    };

    setShowTrailInfoSheet(false);
    const resp = await createRoute(routeObj);
    if (resp?.data) {
      showAlert('Alert', 'Your trail has been saved.');
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  const onPressShare = () => {
    setShowTrailShareSheet(false);
    const routeData = trailInfo;
    const startingPoint = routeData?.geometry?.coordinates?.[0];
    const endingPoint = routeData?.geometry?.coordinates?.at(-1);
    console.log('', startingPoint);

    setShowTrailInfoSheet(false);

    setTimeout(() => {
      navigation.navigate(Routes.ChatUsers, {
        shareTrail: {
          startingPoint: startingPoint,
          endingPoint: endingPoint,
          type: 'Chosen Trail',
          data: routeData,
        },
      });
    }, 300);
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

  const moveToCurrentLocation = () => {
    cameraRef.current.flyTo(userLocation, 100);
  };

  const ActionBtn = ({icon, onPress}: any) => (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={icon}
        style={styles.actionBtnStyles}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const onPressWaypointSave = async () => {
    try {
      const obj = {
        user_route: {
          name: pinLocationDetails.name,
          weight: '4',
          route_type: 'hiking_waypoint',
          notes: null,
          is_road_route: null,
          middle_location_points: [],
          locations_attributes: [
            {
              latitude: pinLocationDetails?.latitude,
              longitude: pinLocationDetails?.longitude,
              name: 'test',
            },
          ],
          pinned_points: [],
        },
      };
      const resp = await createRoute(obj);
      if (resp?.data) {
        showAlert('Alert', 'Your waypoint has been saved.');
        clearStates();
      } else {
        showAlert('Alert', UNEXPECTED_ERROR);
      }
    } catch (error) {
      showAlert('Alert', UNEXPECTED_ERROR);
    }
  };

  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routes,
    },
  };
  const clearStates = () => {
    setRoute([]);
    setPinLocationMarker([]);
    setPinLocationDetails({
      latitude: null,
      longitude: null,
      name: null,
    });

    setShowNavigationSheet(false);
    pinLocationSheet.current.close();
    setOffRoadSegment([]);
  };

  const fitToBounds = () => {
    // if (!userLocation || !pinLocationMarker) return; // Ensure both points exist
  };

  const saveShareRouteLink = async (type: string) => {
    let routeData = {};
    if (type === 'well') {
      routeData = {
        user_route: {
          name: placeName,
          weight: '4',
          route_type: 'waypoint_route',
          notes: null,
          is_road_route: null,
          middle_location_points: [],
          locations_attributes: [
            {
              latitude: pinLocationDetails?.latitude,
              longitude: pinLocationDetails?.longitude,
              name: 'test',
            },
          ],
          pinned_points: [],
        },
      };
    } else {
      const trailPath = trailInfo?.geometry?.coordinates;
      const trailInfoName = trailInfo?.properties?.tags;

      const locationsAttributes =
        trailPath?.length > 0
          ? [
              ...trailPath.map(([longitude, latitude], index) => ({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                name: `Point ${index + 1}`,
              })),
            ]
          : [];

      routeData = {
        user_route: {
          name: trailInfoName?.name || 'UNKNOWN TRAIL/PATH',
          notes: '',
          route_type: 'hiking_trail_route',
          is_chosen_trail: true,
          color: PFColors.Blue.Dark,
          weight: '4',
          locations_attributes: locationsAttributes,
        },
      };
    }

    const resp = await createShareLinkRoute(routeData);
    if (resp?.data) {
      shareContent(resp?.data?.user_route);
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };
  const shareContent = async selectedRoute => {
    const options = {
      url: `https://staging.path-rover.com/download?route_type=${selectedRoute?.route_type}&route_id=${selectedRoute?.id}`, // Optional: A link to share
    };

    try {
      const res = await Share.open(options);
      setShowShareSheet(false);
      setShowTrailShareSheet(false);
    } catch (err) {
      if (err) {
        console.log(err);
      }
    }
  };

  const onPressExploreTrail = () => {
    if (isIOS()) {
      dispatch(setSelectedTrail(trailInfo));

      setTimeout(() => {
        navigation.navigate(Routes.TurnByTurnNav, {
          originCoords: [location?.longitude, location?.latitude],
          entranceCoords: trailInfo?.geometry?.coordinates[0],
          entranceName: 'Unknown Trail',
          isTrail: true,
        });
      }, 300);
    } else {
      navigation.navigate('TrailDetails', {trailInfo});
    }
  };

  return (
    <MainWrapper style={styles.container}>
      <HeaderView
        userPicture={loginUser?.avatar}
        onPressFilter={() => setShowFilterSheet(true)}
        onPressSearch={() =>
          subscription
            ? navigation.navigate('SearchTrails')
            : showPremiumAlert({})
        }
        onPressWeather={() => {
          subscription ? setShowWeatherSheet(true) : showPremiumAlert({});
        }}
      />
      <MapboxGL.MapView
        logoEnabled={false}
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
        onPress={onPressMap}>
        {userLocation && (
          <MapboxGL.Camera
            centerCoordinate={userLocation}
            ref={cameraRef}
            zoomLevel={14}
          />
        )}
        {pinLocationMarker?.length > 0 && (
          <MapboxGL.MarkerView coordinate={pinLocationMarker}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}

        <MapboxGL.UserLocation
          showsUserHeadingIndicator={true}
          minDisplacement={5}
          requestsAlwaysUse
          visible={true}
        />

        {/* Render Trails */}
        {trailsData?.length > 0 &&
          trailsData?.map((trail: any, index: any) => (
            <MapboxGL.ShapeSource
              key={index}
              id={`trail-${index}`}
              shape={trail}
              onPress={e => handleCalloutPress(e, trail)}>
              <MapboxGL.LineLayer
                id={`trail-line-${index}`}
                style={{
                  lineColor: ['get', 'color'],
                  lineWidth: 4,
                }}
              />
            </MapboxGL.ShapeSource>
          ))}

        {routes?.length > 1 && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              id="routeLayer-unique"
              style={{
                lineWidth: ROUTE_LINE_STYLES.lineWidth,
                lineColor: ROUTE_LINE_STYLES.color,
                lineOpacity: ROUTE_LINE_STYLES.opacity,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {offRoadSegment?.length > 0 &&
          offRoadSegment.map((segment, index) => (
            <MapboxGL.ShapeSource
              key={`off-road-source-${index}`}
              id={`off-road-source-${index}`}
              shape={{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: segment,
                },
              }}>
              <MapboxGL.LineLayer
                id={`off-road-line-${index}`}
                style={{
                  lineWidth: 3,
                  lineColor: 'red',
                  lineDasharray: [0.8, 3],
                }}
              />
            </MapboxGL.ShapeSource>
          ))}
      </MapboxGL.MapView>
      <TouchableOpacity
        style={styles.centerMapStyles}
        onPress={() => moveToCurrentLocation()}>
        {svgIcon.MapWhiteBg}
      </TouchableOpacity>
      {routes?.length < 1 && (
        <TouchableOpacity
          style={styles.maplayerStyles}
          onPress={() => {
            setMapLayerSheeet(true);
          }}>
          {svgIcon.MapLayer}
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.hikeIconStyle}
        onPress={() => {
          subscription
            ? navigation.navigate(Routes.CreateHikeRoute)
            : showPremiumAlert({});
        }}>
        {svgIcon.HikeRoute}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.searcRoute}
        onPress={() => {
          if (subscription) {
            dispatch(resetTrailRoute());
            navigation.navigate(Routes.SearchTrailLatLng);
          } else {
            showPremiumAlert({});
          }
        }}>
        {svgIcon.SearchRoute}
      </TouchableOpacity>
      <View style={styles.actionBtnView}>
        <ActionBtn
          icon={appIcons.recordTrack}
          onPress={() => {
            subscription
              ? navigation.navigate(Routes.RecordHikingRoute)
              : showPremiumAlert({});
          }}
        />
        <ActionBtn
          icon={appIcons.offlineMap}
          onPress={() => {
            subscription
              ? navigation.navigate(Routes.DownloadedMapList)
              : showPremiumAlert({});
          }}
        />
        <ActionBtn
          icon={appIcons.myData}
          onPress={() => {
            setIsMyDataVisible(true);
          }}
        />
      </View>
      {weather?.city && (
        <WeatherSheet
          modalVisible={showWeatherSheet}
          coords={userLocation}
          setModalVisible={() => setShowWeatherSheet(false)}
          weather={weather}
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
      <TrailInfoSheet
        onPressShare={() => {
          setShowTrailInfoSheet(false);
          setTimeout(() => {
            setShowTrailShareSheet(true);
          }, 1500);
        }}
        onPressPin={onPressPin}
        modalVisible={showTrailInfoSheet}
        trailInfo={trailInfo}
        setModalVisible={() => setShowTrailInfoSheet(false)}
        onPressNavigation={() => {
          onPressExploreTrail();
          setShowTrailInfoSheet(false);
        }}
      />
      {/* My Data Modal */}
      <GeneralModal
        visible={isMyDataVisible}
        title={'My data'}
        onClose={() => setIsMyDataVisible(false)}>
        <FlatList
          data={MY_DATA_MODAL_CONTENT}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.4}
                style={styles.tagView}
                onPress={() => {
                  setIsMyDataVisible(false),
                    navigation.navigate(Routes.EndUserSavedLibraryType, {item});
                }}>
                <View style={styles.tagRow}>
                  {item?.icon}
                  <Text style={styles.tagText}>{item.title}</Text>
                </View>
                {svgIcon.RightChevron}
              </TouchableOpacity>
            );
          }}
        />
      </GeneralModal>
      {/* Filter Modal */}
      <HikingFilter
        handleTrailTypeChange={(value: any) => {
          setSelectedType(value);
          setShowFilterSheet(false);
        }}
        showFilterSheet={showFilterSheet}
        setShowFilterSheet={setShowFilterSheet}
      />

      <RBSheet
        ref={pinLocationSheet}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customStyles={{
          container: {
            height: isIOS() ? HP('43') : HP('50'),
            borderTopLeftRadius: WP('3'),
            borderTopRightRadius: WP('3'),
          },
        }}>
        <PinYourLocationSheet
          values={pinLocationDetails}
          onPressCancel={() => pinLocationSheet?.current?.close()}
          setValues={setPinLocationDetails}
          onPressSave={() => onPressWaypointSave()}
        />
      </RBSheet>

      {showNavigationSheet && (
        <RouteToWellSheet
          routeLength={route?.length}
          onpressCancel={() => clearStates()}
          onPressShare={() => {
            if (subscription) {
              setShowNavigationSheet(false);
              setTimeout(() => {
                setShowShareSheet(true);
              }, 1000);
            } else {
              showPremiumAlert({});
            }
          }}
          routeName={placeName}
          distanceInfo={results}
          actionBtn={actionBtn}
          onPressDirection={() => {
            setActionBtn({
              ...actionBtn,
              direction: true,
            });
          }}
          onPressPin={() => {
            setShowNavigationSheet(false);
            setTimeout(() => {
              pinLocationSheet?.current?.open();
            }, 500);
          }}
          onPressStart={() => {
            setShowNavigationSheet(false);

            if (isIOS()) {
              navigation.navigate(Routes.TurnByTurnNav, {
                originCoords: [location.longitude, location.latitude],
                entranceCoords: pinLocationMarker,
                entranceName: placeName,
              });
            } else {
              navigation.navigate(Routes.ViewWellPathNavigation, {
                entranceCoords: pinLocationMarker,
                entranceName: placeName,
              });
            }
          }}
        />
      )}
      <SharedSheet
        modalVisible={showShareSheet}
        onPressOther={() => saveShareRouteLink('well')}
        onPressShare={() => {
          setShowNavigationSheet(false);
          setTimeout(() => {
            navigation.navigate(Routes.ChatUsers, {
              shareTrail: {
                startingPoint: [],
                endingPoint: pinLocationMarker,
                type: 'Way point',
                name: placeName,
              },
            });
          }, 1000);
        }}
        setModalVisible={() => setShowShareSheet(false)}
      />
      <SharedSheet
        modalVisible={showTrailShareSheet}
        onPressOther={() => saveShareRouteLink('trail_route')}
        onPressShare={() => onPressShare()}
        setModalVisible={() => setShowTrailShareSheet(false)}
      />

      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default HikingScreen;
