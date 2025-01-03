import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppButton, AppHeader, MainWrapper} from '../../../../../components';
import MapboxGL from '@rnmapbox/maps';
import {circle} from '@turf/turf';
import {getDistance} from 'geolib';
import {useDispatch, useSelector} from 'react-redux';
import {svgIcon} from '../../../../../assets/svg';
import {PFColors, PFFonts, showAlert} from '../../../../../shared/exporter';
import {scale} from '../../../../../shared/theme/responsive';
import useLocation from '../../../../../hooks/getLocation';
import usePlaceName from '../../../../../hooks/getPlaceName';
import {setManagerRoute} from '../../../../../redux/manager/managerSlice';

const PickUp = ({route, navigation}: any) => {
  const {pickUpAddress, setPickUpAddress} = route?.params;
  const {managerRoute} = useSelector(state => state.manager);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [pickUpLoc, setPickUpLoc] = useState<any>(
    managerRoute?.pickup ? managerRoute?.pickup?.coords : null,
  );
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  const dispatch = useDispatch();
  const RADIUS_IN_METERS = 500;

  const {placeName, fetchPlaceName, setPlaceName, error, loading} =
    usePlaceName();
  const {location} = useLocation();

  useEffect(() => {
    if (managerRoute?.pickup) setPlaceName(managerRoute?.pickup?.placeName);
  }, [managerRoute]);

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
      fetchPlaceName(location?.latitude, location?.longitude);
      setPickUpLoc([location?.longitude, location?.latitude]);
    }
  }, [location]);

  const pickLocation = event => {
    const selectedLocation = event.geometry.coordinates;
    const selectedLoc = {
      latitude: selectedLocation[1],
      longitude: selectedLocation[0],
    };

    const distanceFromCurrent = getDistance(
      {latitude: location.latitude, longitude: location.longitude},
      {latitude: selectedLoc.latitude, longitude: selectedLoc.longitude},
      100,
    );

    if (distanceFromCurrent <= RADIUS_IN_METERS) {
      fetchPlaceName(selectedLocation[1], selectedLocation[0]);
      setPickUpLoc(selectedLocation);
      setSelectedLocation([selectedLocation[0], selectedLocation[1]]);
    } else {
      showAlert('Alert', 'Select location in the green zone.');
    }
  };

  const handleDone = () => {
    const data = {
      coords: [pickUpLoc[0], pickUpLoc[1]],
      // latitude: pickUpLoc[0],
      // longitude: pickUpLoc[1],
      placeName: placeName,
    };

    setPickUpAddress(data);
    dispatch(setManagerRoute({pickup: data}));

    navigation.goBack();
  };

  const createGeoJSONCircle = (center: any, radiusInMeters: any) => {
    const options: any = {steps: 64, units: 'meters'};
    return circle(center, radiusInMeters, options);
  };

  const radiusGeoJSON =
    currentLocation &&
    createGeoJSONCircle(currentLocation, RADIUS_IN_METERS + 50);

  return (
    <MainWrapper>
      <AppHeader title="Pickup Location" />
      <MapboxGL.MapView
        style={styles.map}
        onPress={pickLocation}
        scaleBarEnabled={false}>
        <MapboxGL.Camera centerCoordinate={currentLocation} zoomLevel={14} />

        {location && (
          <MapboxGL.ShapeSource id="radiusSource" shape={radiusGeoJSON}>
            <MapboxGL.FillLayer
              id="radiusFill"
              style={{
                fillColor: 'rgba(14, 146, 75, 0.15)',
                fillOutlineColor: 'rgba(14, 146, 75, 1)',
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {!selectedLocation && currentLocation ? (
          <MapboxGL.PointAnnotation
            coordinate={currentLocation}
            id="current-location"
          />
        ) : selectedLocation ? (
          <MapboxGL.PointAnnotation
            coordinate={selectedLocation}
            id="start-point"
          />
        ) : null}
      </MapboxGL.MapView>
      <View style={styles.sheetStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <Text style={styles.messageText}>
            Select pickup location in the green zone
          </Text>
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
            {svgIcon.LeftArrow}
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

export default PickUp;

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
  },
  input: {
    flex: 1,
    marginLeft: scale(12),
    fontSize: scale(16),
    fontFamily: PFFonts.Foundation.SemiBold,
    color: PFColors.Standard.Black,
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
});
