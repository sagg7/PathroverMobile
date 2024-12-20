import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {AppHeader, MainWrapper, SearchInput} from '../../../../components';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {appIcons} from '../../../../assets/icons';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../../../shared/exporter';

const CreateRoute = () => {
  const navigation: any = useNavigation();
  const onPressMap = event => {
    const {geometry} = event; // geometry contains coordinates
    const [longitude, latitude] = geometry.coordinates;
    fetchPlaceName(latitude, longitude);
  };

  const fetchPlaceName = async (latitude, longitude) => {
    const accessToken =
      'sk.eyJ1IjoibWF0YW9zbWFuIiwiYSI6ImNtMHhsejduczBkOGEycXBnbmh2NG5oaDcifQ.pPM1yQbjLKE-C0Mjg8mi0Q';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const place = data.features[0].place_name;
        console.log('Place name===>', place);
      } else {
        // setPlaceName('Place not found');
        console.log('Place name===> not found');
      }
    } catch (error) {
      console.error('Error fetching place name:', error);
    }
  };

  return (
    <MainWrapper style={styles.container}>
      <TouchableOpacity
        style={styles.inputStyles}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(Routes.SearchLatLng)}>
        <SearchInput />
      </TouchableOpacity>

      <MapboxGL.MapView
        style={styles.map}
        scaleBarEnabled={false}
        onPress={onPressMap}>
        <MapboxGL.Camera
          zoomLevel={15}
          centerCoordinate={[74.2753883, 31.4541112]}
        />

        <MapboxGL.MarkerView coordinate={[74.2753883, 31.4541112]}>
          <View>
            <Image
              source={appIcons.alertMiniIcon}
              style={{height: 30, width: 30}}
            />
            <Text>Current Position</Text>
          </View>
        </MapboxGL.MarkerView>
      </MapboxGL.MapView>
    </MainWrapper>
  );
};

export default CreateRoute;
