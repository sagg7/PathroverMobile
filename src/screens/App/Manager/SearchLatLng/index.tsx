import React, {useEffect, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {AppHeader, MainWrapper} from '../../../../components';
import {View} from 'react-native';
import useLocation from '../../../../hooks/getLocation';
import {svgIcon} from '../../../../assets/svg';
import SearchAddressSelector from '../../../../components/complex/SearchAddressSelector';

const SearchLatLng = () => {
  const {location} = useLocation();
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);

  const getRouteData = (data: any) => {};

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Search" />

      <SearchAddressSelector setRouteData={getRouteData} />
      <MapboxGL.MapView style={styles.map} scaleBarEnabled={false}>
        <MapboxGL.Camera zoomLevel={15} centerCoordinate={currentLocation} />
        {location && (
          <MapboxGL.MarkerView
            coordinate={[location?.longitude, location?.latitude]}>
            <View>{svgIcon.CurrentLocation}</View>
          </MapboxGL.MarkerView>
        )}
      </MapboxGL.MapView>
    </MainWrapper>
  );
};

export default SearchLatLng;
