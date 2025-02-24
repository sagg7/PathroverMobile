import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {AppButton, AppHeader, MainWrapper} from '../../../../components';
import MapboxGL from '@rnmapbox/maps';
import {useDispatch, useSelector} from 'react-redux';
import {svgIcon} from '../../../../assets/svg';
import {
  fetchSuggestions,
  PFColors,
  PFFonts,
  showAlert,
} from '../../../../shared/exporter';
import {scale, WP} from '../../../../shared/theme/responsive';
import useLocation from '../../../../hooks/getLocation';
import usePlaceName from '../../../../hooks/getPlaceName';
import {setCreateRouteData} from '../../../../redux/endUser/endUserSlice';

const ChooseStartPoint = ({route, navigation}: any) => {
  const {setPickUpAddress, isStartPoint} = route?.params;
  const {createRouteData} = useSelector(state => state?.endUser);

  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [simpleSearch, setSimpleSearch] = useState<string>('');

  const [suggestions, setSuggestions] = useState([]);
  const debounceTimeout = useRef<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  const dispatch = useDispatch();

  const {placeName, fetchPlaceName, setPlaceName, error, loading} =
    usePlaceName();
  const {location} = useLocation();

  useEffect(() => {
    console.log('CREATE ====>', createRouteData);
    if ('start' in createRouteData) {
      setCurrentLocation(
        isStartPoint
          ? createRouteData?.start?.coords
          : createRouteData?.end?.coords,
      );
      // setSimpleSearch(
      //   isStartPoint
      //     ? createRouteData?.start?.placeName
      //     : createRouteData?.end?.placeName,
      // );
      setPlaceName(
        isStartPoint
          ? createRouteData?.start?.placeName
          : createRouteData?.end?.placeName,
      );
    } else if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
      fetchPlaceName(location?.latitude, location?.longitude);
      setSimpleSearch(placeName);
    }
    // if (location) {

    // }
  }, [location, createRouteData]);

  const pickLocation = async (event: any) => {
    const selectedLocation = event.geometry.coordinates;
    const latitude = selectedLocation && selectedLocation?.[1];
    const longitude = selectedLocation && selectedLocation?.[0];

    setCurrentLocation([longitude, latitude]);
    setPickUpAddress([longitude, latitude]);

    fetchPlaceName(latitude, longitude);
  };

  const handleDone = () => {
    if (currentLocation && currentLocation?.length > 0) {
      const latitude = currentLocation && currentLocation?.[1];
      const longitude = currentLocation && currentLocation?.[0];

      const data = {
        coords: [Number(longitude), Number(latitude)],
        latitude: Number(latitude),
        longitude: Number(longitude),
        placeName: placeName,
      };
      if (isStartPoint) {
        setPickUpAddress(data);
        dispatch(setCreateRouteData({start: data}));
        navigation.goBack();
      } else {
        dispatch(setCreateRouteData({end: data}));
        navigation.goBack(-2);
      }
    }
  };

  const handleSelect = (place: any) => {
    setSimpleSearch(place?.place_name);
    const [longitude, latitude] = place.center || place;
    setCurrentLocation([longitude, latitude]);
    fetchPlaceName(latitude, longitude);
    // navigation.goBack();
    setSuggestions([]);

    const data = {
      latitude: latitude,
      longitude: longitude,
      coords: [longitude, latitude],
      placeName: place.place_name,
    };
    // dispatch(setRecentDestSearch(data));
  };
  const handleChangeText = (text: any) => {
    setSimpleSearch(text);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const fetchData = await fetchSuggestions(text);
      if (fetchData?.message === 'Empty query text') {
        setSuggestions([]);
      } else {
        setSuggestions(fetchData?.features);
      }
    }, 1500);
  };

  return (
    <MainWrapper>
      <AppHeader title={isStartPoint ? 'Pickup Location' : 'End Point'} />
      <MapboxGL.MapView
        style={styles.map}
        onPress={pickLocation}
        scaleBarEnabled={false}>
        <MapboxGL.Camera centerCoordinate={currentLocation} zoomLevel={14} />

        {currentLocation ? (
          <MapboxGL.PointAnnotation
            coordinate={currentLocation}
            id="current-location">
            {svgIcon.CurrentLocation}
          </MapboxGL.PointAnnotation>
        ) : selectedLocation ? (
          <MapboxGL.PointAnnotation
            coordinate={selectedLocation}
            id="current-location">
            {svgIcon.CurrentLocation}
          </MapboxGL.PointAnnotation>
        ) : null}
      </MapboxGL.MapView>

      <View style={styles.textinputStyles}>
        <View style={styles.searchBox}>
          {svgIcon.Search}
          <TextInput
            placeholder="Search"
            placeholderTextColor={PFColors.Gray.DarkGray}
            value={simpleSearch}
            onChangeText={handleChangeText}
            style={styles.input}
          />
        </View>
        {suggestions?.length > 0 && (
          <>
            <View style={{height: WP('17')}} />
            <FlatList
              data={suggestions}
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={styles.suggestionContainer}
              renderItem={({item}: any) => (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Text style={{padding: 10, color: PFColors.Standard.Black}}>
                    {item.place_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </View>
      <View style={styles.sheetStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <Text style={styles.messageText}>Choose Location</Text>
          <View style={styles.itemStyle}>
            <View style={styles.itemInnerView}>
              <Text style={styles.titleText}>Pickup Location</Text>
              <View style={styles.addressView}>
                {svgIcon.MapPin}
                <Text style={styles.addressText}>
                  {placeName ? placeName : 'My current location'}
                </Text>
              </View>
            </View>
          </View>
          <AppButton
            // disabled={isDisable}
            title="Done"
            buttonStyle={styles.btnStyle}
            handleClick={handleDone}
          />
        </ScrollView>
      </View>
    </MainWrapper>
  );
};

export default ChooseStartPoint;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  searchBox: {
    position: 'absolute',
    top: scale(16),
    backgroundColor: PFColors.Standard.White,
    width: scale(343),
    height: scale(44),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    zIndex: 11,
  },
  input: {
    // flex: 1,
    marginLeft: scale(12),
    fontSize: scale(16),
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    height: 50,
    width: '90%',
  },
  sheetStyle: {
    backgroundColor: PFColors.Standard.White,
    flex: 0.5,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  scrollViewStyle: {
    padding: scale(16),
  },
  messageText: {
    fontSize: scale(20),
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
    marginBottom: scale(12),
  },
  itemStyle: {
    backgroundColor: PFColors.Gray.WhisperGray,
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: scale(12),
    marginBottom: scale(16),
  },
  titleText: {
    fontSize: scale(10),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Gray.DarkGray,
    marginBottom: scale(8),
  },
  itemInnerView: {
    flex: 1,
  },
  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: scale(12),
    fontFamily: PFFonts.Foundation.Regular,
    color: PFColors.Standard.Black,
    marginLeft: scale(4),
  },
  btnStyle: {
    marginTop: scale(16),
  },
  textinputStyles: {
    position: 'absolute',
    top: 50,
    width: WP('100'),
  },
  suggestionContainer: {
    width: WP('90'),
    alignSelf: 'center',
    backgroundColor: '#fff',
    flex: 1,
    // top: 60,
  },
});
