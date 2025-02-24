import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MapboxGL from '@rnmapbox/maps';
import {svgIcon} from '../../../../assets/svg';
import {MainWrapper, MapLayerSheet, WeatherSheet} from '../../../../components';
import GeneralModal from '../../../../components/complex/GeneralModal';
import useLocation from '../../../../hooks/getLocation';
import {
  appIcons,
  Default_Map_Style,
  MapTypes,
  PFColors,
  showAlert,
  UNEXPECTED_ERROR,
  Routes,
  WEATHER_API_KEY,
} from '../../../../shared/exporter';
import HeaderView from './HeaderView';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import {Image, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setMapLayerStyle} from '../../../../redux/manager/managerSlice';
import styles from './styles';
import { resetTrailRoute } from '../../../../redux/endUser/endUserSlice';


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
    title: 'Offline maps',
    type: '',
    icon: svgIcon.MapWindow,
  },
];

const HikingScreen = () => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [showWeatherSheet, setShowWeatherSheet] = useState<boolean>(false);
  const [weather, setWeather] = useState<any>([]);
  const dispatch = useDispatch();
  const {loginUser} = useSelector(state => state.auth);
  const [isMyDataVisible, setIsMyDataVisible] = useState(false);

  const [queryParams, setQueryParams] = useState<any>({
    latitude: null,
    longitude: null,
    radius: 50,
  });

  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);

  const {location} = useLocation();

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${location?.latitude}&lon=${location?.longitude}&cnt=7&appid=${WEATHER_API_KEY}&units=metric`,
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
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
      setQueryParams({
        ...queryParams,
        latitude: location?.longitude,
        longitude: location?.latitude,
      });
    }
  }, [location]);

  useEffect(() => {
    if (mapLayerStyle) {
      setSelectedMapType(mapLayerStyle);
    }
  }, [mapLayerStyle]);

  const onPressMap = (event: any) => {
    try {
      const {geometry} = event;
      if (geometry && Array.isArray(geometry.coordinates)) {
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
    dispatch(setMapLayerStyle(selected));

    setTimeout(() => {
      setMapLayerSheeet(false);
    }, 500);
  };

  const moveToCurrentLocation = () => {
    if (
      !currentLocation ||
      !Array.isArray(currentLocation) ||
      currentLocation.length !== 2
    ) {
      console.error('Invalid coordinates:', currentLocation);
      return;
    }

    if (cameraRef?.current) {
      cameraRef.current?.setCamera({
        centerCoordinate: currentLocation,
      });
    }
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

  return (
    <MainWrapper style={styles.container}>
      <HeaderView
        userPicture={loginUser?.avatar}
        onPressFilter={() => {}}
        onPressSearch={() => {}}
        onPressWeather={() => setShowWeatherSheet(true)}
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
      </MapboxGL.MapView>

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

      <MapLayerSheet
        setModalVisible={() => setMapLayerSheeet(false)}
        modalVisible={mapLayerSheeet}
        data={mapTypesArr}
        onPressCard={onSelectMapType}
        onPressCancel={() => setMapLayerSheeet(false)}
        onPressSave={() => onPressSave()}
      />
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
          coords={[location?.longitude, location?.latitude]}
          setModalVisible={() => setShowWeatherSheet(false)}
          weather={weather}
        />
      )}
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
    </MainWrapper>
  );
};

export default HikingScreen;
