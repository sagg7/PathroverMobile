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
} from '../../../../shared/exporter';
import styles from './styles';
import {svgIcon} from '../../../../assets/svg';
import HeaderView from '../HikingScreen/HeaderView';
import {useDispatch, useSelector} from 'react-redux';
import HikingFilter from '../../../../components/complex/HikingFilter';
import GeneralModal from '../../../../components/complex/GeneralModal';
import {setMapLayerStyle} from '../../../../redux/manager/managerSlice';
import {resetTrailRoute} from '../../../../redux/endUser/endUserSlice';
import useLocation from '../../../../hooks/getLocation';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';

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
    title: 'WayPoint',
    type: 'waypoint_route',
    icon: svgIcon.RouteBlue,
  },
];

const HikingScreen = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const cameraRef = useRef<any>(null);
  const debounceTimeout = useRef<any>(null);
  const [weather, setWeather] = useState<any>([]);
  const [trailsData, setTrailsData] = useState(null);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedType, setSelectedType] = useState('hiking');
  const [simpleSearch, setSimpleSearch] = useState<string>('');
  const [suggestions, setSuggestions] = useState([]);
  const [trailInfo, setTrailInfo] = useState<boolean>(null);
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
  const [showPinLocationSheet, setShowPinLocationSheet] =
    useState<boolean>(false);
  const [pinLocationMarker, setPinLocationMarker] = useState<any>([]);

  const {location} = useLocation();

  const [showTrailInfoSheet, setShowTrailInfoSheet] = useState<boolean>(false);

  const {loginUser} = useSelector(state => state.auth);
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const [createRoute, {isLoading}] = useCreateRouteMutation();

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
    if (userLocation) fetchNearbyTrails(userLocation?.[1], userLocation?.[0]);
  }, [selectedType]);

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

  // const getOverpassQuery1 = (latitude, longitude, type) => {
  //   return `
  //   [out:json];
  //   (
  //     way["highway"~"path|track|footway|steps|bridleway|cycleway"](around:5000, ${latitude}, ${longitude});
  //   );
  //   out geom;
  //   `;
  // };

  // Function to Get Overpass Query

  const getTrailColor = (index: any) => {
    const colors = ['#13488A'];
    // const colors = ['#ff7f00', '#1f77b4', '#2ca02c', '#d62728', '#9467bd'];
    return colors[index % colors.length];
  };

  const offsetCoordinates = (coords: any, offset: any) =>
    coords.map(([lon, lat], index) => [
      lon + (index % 2 === 0 ? offset : -offset),
      lat + (index % 2 === 0 ? offset : -offset),
    ]);

  const fetchNearbyTrails = async (latitude: any, longitude: any) => {
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
  };

  const handleCalloutPress = (e: any, trail: any) => {
    setTrailInfo(trail);
    setTimeout(() => {
      setShowTrailInfoSheet(true);
    }, 300);
  };

  const handlePlaceSelect = (place: any) => {
    const [longitude, latitude] = place.center || place;
    setSimpleSearch(place?.place_name);
    setSuggestions([]);
    setUserLocation([longitude, latitude]);
    fetchNearbyTrails(latitude, longitude);
  };

  const onPressMap = (event: any) => {
    try {
      const {geometry} = event;
      if (geometry && Array.isArray(geometry.coordinates)) {
        const coords = geometry.coordinates;
        setPinLocationMarker(coords);
        setPinLocationDetails({
          latitude: coords[1],
          longitude: coords[0],
          name: pinLocationDetails?.name ? pinLocationDetails?.name : '',
        });
        setTimeout(() => {
          setShowPinLocationSheet(true);
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
      showAlert('Alert', 'Your recording has been saved.');
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  const onPressShare = (routeData: any) => {
    const trailPath = routeData?.geometry?.coordinates;
    const startingPoint = routeData?.geometry?.coordinates?.[0];
    const endingPoint = routeData?.geometry?.coordinates?.at(-1);

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
      const resp = await createRoute(obj);
      if (resp?.data) {
        showAlert('Alert', 'Your waypoint has been saved.');
        setPinLocationDetails({
          latitude: null,
          longitude: null,
          name: null,
        });
        setShowPinLocationSheet(false);
      } else {
        showAlert('Alert', UNEXPECTED_ERROR);
      }
    } catch (error) {
      showAlert('Alert', UNEXPECTED_ERROR);
    }
  };

  return (
    <MainWrapper style={styles.container}>
      <HeaderView
        userPicture={loginUser?.avatar}
        onPressFilter={() => setShowFilterSheet(true)}
        onPressSearch={() => navigation.navigate('SearchTrails')}
        onPressWeather={() => setShowWeatherSheet(true)}
      />
      <MapboxGL.MapView
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
        // styleURL={MapboxGL.StyleURL.Outdoors}
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
        {/* <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={14}
          centerCoordinate={userLocation}
        /> */}
        {/* Show user location */}

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
              {/* <MapboxGL.PointAnnotation
                id={`trail-point-${index}`}
                coordinate={trail.geometry.coordinates[0]}
                onSelected={() => handleCalloutPress(trail)}>
                <MapboxGL.Callout title={trail.properties.name || 'Trail'} />
              </MapboxGL.PointAnnotation> */}
            </MapboxGL.ShapeSource>
          ))}
      </MapboxGL.MapView>
      <TouchableOpacity
        style={styles.centerMapStyles}
        onPress={() => moveToCurrentLocation()}>
        {svgIcon.MapWhiteBg}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => setMapLayerSheeet(true)}>
        {svgIcon.MapLayer}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.hikeIconStyle}
        onPress={() => navigation.navigate(Routes.CreateHikeRoute)}>
        {svgIcon.HikeRoute}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.searcRoute}
        onPress={() => {
          dispatch(resetTrailRoute());
          navigation.navigate(Routes.SearchTrailLatLng);
        }}>
        {svgIcon.SearchRoute}
      </TouchableOpacity>

      <View style={styles.actionBtnView}>
        <ActionBtn
          icon={appIcons.recordTrack}
          onPress={() => navigation.navigate(Routes.RecordHikingRoute)}
        />
        <ActionBtn
          icon={appIcons.offlineMap}
          onPress={() => navigation.navigate(Routes.DownloadedMapList)}
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
        onPressShare={onPressShare}
        onPressPin={onPressPin}
        modalVisible={showTrailInfoSheet}
        trailInfo={trailInfo}
        setModalVisible={() => setShowTrailInfoSheet(false)}
        onPressNavigation={() => {
          setShowTrailInfoSheet(false);
          setTimeout(() => {
            navigation.navigate('TrailDetails', {trailInfo});
          }, 300);
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
      {showPinLocationSheet && (
        <PinYourLocationSheet
          values={pinLocationDetails}
          onPressCancel={() => setShowPinLocationSheet(false)}
          setValues={setPinLocationDetails}
          onPressSave={() => onPressWaypointSave()}
        />
      )}
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default HikingScreen;
