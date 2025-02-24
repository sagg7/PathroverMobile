import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppButton, MainWrapper} from '../../../../../components';
import MapboxGL from '@rnmapbox/maps';
import useLocation from '../../../../../hooks/getLocation';
import {svgIcon} from '../../../../../assets/svg';
import {
  PFColors,
  PFFonts,
  PFFontSize,
  Routes,
  WP,
} from '../../../../../shared/exporter';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  setEndingPoint,
  setStartingPoint,
} from '../../../../../redux/endUser/endUserSlice';

const ChooseOnMap = () => {
  const {location} = useLocation();
  const navigation = useNavigation<any>();
  const {params} = useRoute<any>();
  const dispatch = useDispatch();
  const {isStartPoint} = params;
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    if (location?.longitude && location?.latitude) {
      const coords: [number, number] = [location.longitude, location.latitude];
      setCurrentLocation(coords);
      setSelectedLocation(coords);
    }
  }, [location]);

  const handleMapPress = (event: any) => {
    const {geometry} = event;
    if (geometry?.coordinates) {
      setSelectedLocation(geometry.coordinates as [number, number]);
    }
  };

  // Handle "Okay" button
  const handleConfirmLocation = () => {
    if (selectedLocation) {
      isStartPoint
        ? dispatch(setStartingPoint(selectedLocation))
        : dispatch(setEndingPoint(selectedLocation));
      navigation.replace(Routes.SearchTrailLatLng);
    }
  };

  return (
    <MainWrapper>
      <MapboxGL.MapView
        style={styles.map}
        scaleBarEnabled={false}
        onPress={handleMapPress} // Handle tap on map
      >
        <MapboxGL.Camera
          zoomLevel={15}
          centerCoordinate={selectedLocation ?? currentLocation ?? [0, 0]}
        />
        {currentLocation && !selectedLocation && (
          <MapboxGL.MarkerView coordinate={currentLocation}>
            <View>{svgIcon.CurrentLocation}</View>
          </MapboxGL.MarkerView>
        )}
        {selectedLocation && (
          <MapboxGL.MarkerView coordinate={selectedLocation}>
            <View>{svgIcon.CurrentLocation}</View>
          </MapboxGL.MarkerView>
        )}
      </MapboxGL.MapView>

      <View style={styles.bottomContainer}>
        <View style={styles.header}>
          <Text style={styles.heading}>{`Choose ${
            isStartPoint ? 'start' : 'end'
          } location`}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
            {svgIcon.CancelIcon}
          </TouchableOpacity>
        </View>

        <View
          style={[styles.header, {marginTop: WP('7'), marginBottom: WP('1')}]}>
          <AppButton
            title="Cancel"
            buttonStyle={{
              width: '49%',
              backgroundColor: PFColors.Gray.WhisperGray,
            }}
            handleClick={navigation.goBack}
            textStyle={{color: PFColors.Standard.Black}}
          />
          <AppButton
            title="Okay"
            buttonStyle={{width: '49%'}}
            handleClick={handleConfirmLocation}
          />
        </View>
      </View>
    </MainWrapper>
  );
};

export default ChooseOnMap;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  bottomContainer: {
    padding: WP('3.5'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: PFColors.Standard.White,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: PFFontSize.FONT_SIZE_16,
    color: PFColors.Standard.Black,
    fontFamily: PFFonts.Foundation.SemiBold,
  },
});
