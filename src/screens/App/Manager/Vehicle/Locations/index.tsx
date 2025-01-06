import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {
  AppButton,
  AppHeader,
  AppInput,
  MainWrapper,
} from '../../../../../components';
import MapboxGL from '@rnmapbox/maps';
import {svgIcon} from '../../../../../assets/svg';
import {PFColors, Routes} from '../../../../../shared/exporter';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import useLocation from '../../../../../hooks/getLocation';
import usePlaceName from '../../../../../hooks/getPlaceName';

const Locations = ({navigation, route}: any) => {
  const {selectedRouteDetails, setSelectedRouteDetails} = route.params || {};

  const [search, setSearch] = useState<string>('');
  const [pickUpAddress, setPickUpAddress] = useState<any>(null);
  const [destinationAddress, setDestinationAddress] = useState<any>(null);
  const {location} = useLocation();
  const {placeName, fetchPlaceName, setPlaceName, error, loading} =
    usePlaceName();

  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    const getLocationPermission = async () => {
      try {
        const permission =
          Platform.OS === 'android'
            ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

        const result = await check(permission);

        if (result === RESULTS.GRANTED) {
          setPermissionGranted(true);
        } else if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
          const requestResult = await request(permission);
          if (requestResult === RESULTS.GRANTED) {
            setPermissionGranted(true);
          } else {
            Alert.alert(
              'Permission Denied',
              'Please enable location permissions.',
            );
          }
        } else {
          Alert.alert('Permission Error', 'Unable to access location.');
        }
      } catch (error) {
        console.error('Permission error:', error);
      }
    };

    getLocationPermission();
  }, []);

  const handleSave = () => {
    setSelectedRouteDetails({
      pickup_latitude:
        pickUpAddress?.latitude || pickUpAddress?.pickup_latitude,

      pickup_longitude:
        pickUpAddress?.longitude || pickUpAddress?.pickup_longitude,
      dropoff_latitude: destinationAddress?.latitude,
      dropoff_longitude: destinationAddress?.longitude,
    });

    navigation.goBack();
  };

  const navigateToPickup = () => {
    navigation.navigate(Routes.PickUp, {pickUpAddress, setPickUpAddress});
  };
  const navigateToDestination = () => {
    navigation.navigate(Routes.Destination, {
      destinationAddress,
      setDestinationAddress,
    });
  };

  useEffect(() => {
    if (location) {
      fetchPlaceName(location?.latitude, location?.longitude);
      setPickUpAddress({
        pickup_latitude: location?.latitude,
        pickup_longitude: location?.longitude,
      });
    }
  }, [location]);

  const isDisable = !pickUpAddress || !destinationAddress;
  return (
    <MainWrapper>
      <AppHeader title="Locations" />
      <MapboxGL.MapView style={styles.map}>
        <View style={styles.searchBox}>
          {svgIcon.Search}
          <TextInput
            editable={false}
            placeholder="Search"
            placeholderTextColor={PFColors.Gray.DarkGray}
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
        </View>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[74.2753883, 31.4541112]}
        />
        <MapboxGL.UserLocation
          visible
          showsUserHeadingIndicator
          onUpdate={() => {}} // Automatically updates current location
        />
      </MapboxGL.MapView>
      <View style={styles.sheetStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <Pressable
            style={styles.itemStyle}
            onPress={() => navigateToPickup()}>
            <View style={styles.itemInnerView}>
              <Text style={styles.titleText}>Pickup Location</Text>
              <View style={styles.addressView}>
                {svgIcon.MapPin}
                <Text style={styles.addressText}>{placeName || ''}</Text>
              </View>
            </View>
            {svgIcon.LeftArrow}
          </Pressable>
          <Pressable
            style={styles.itemStyle}
            onPress={() => navigateToDestination()}>
            <View style={styles.itemInnerView}>
              <Text style={styles.titleText}>Destination Location</Text>
              <View style={styles.addressView}>
                {svgIcon.Location}
                <Text style={styles.addressText}>
                  {destinationAddress?.placeName
                    ? destinationAddress?.placeName
                    : 'choose desitination address'}
                </Text>
              </View>
            </View>
            {svgIcon.LeftArrow}
          </Pressable>
          <AppButton
            disabled={isDisable}
            title="Save"
            buttonStyle={styles.btnStyle}
            handleClick={handleSave}
          />
        </ScrollView>
      </View>
    </MainWrapper>
  );
};

export default Locations;
