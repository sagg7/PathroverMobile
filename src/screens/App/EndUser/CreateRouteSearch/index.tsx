import React, {useEffect, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {AppButton, AppHeader, MainWrapper} from '../../../../components';
import {View} from 'react-native';
import useLocation from '../../../../hooks/getLocation';
import {svgIcon} from '../../../../assets/svg';
import {SearchStartEndRoute} from '../../../../components';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const SearchLatLng = () => {
  const {location} = useLocation();
  const [title, setTitle] = useState({
    start: '',
    end: '',
  });
  const {createRouteData} = useSelector((state: any) => state?.endUser);

  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);

  useEffect(() => {
    if (createRouteData) {
      setTitle({
        start: createRouteData?.start?.placeName,
        end: createRouteData?.end?.placeName,
      });
    }
  }, [createRouteData]);

  const getRouteData = (data: any) => {
    console.log('CLABCK', data);
  };

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Search" />

      <SearchStartEndRoute setRouteData={getRouteData} title={title} />

      <MapboxGL.MapView style={styles.map} scaleBarEnabled={false}>
        <MapboxGL.Camera zoomLevel={15} centerCoordinate={currentLocation} />
        {location && (
          <MapboxGL.MarkerView
            coordinate={[location?.longitude, location?.latitude]}>
            <View>{svgIcon.CurrentLocation}</View>
          </MapboxGL.MarkerView>
        )}
      </MapboxGL.MapView>
      {title?.start && title?.end && (
        <AppButton
          title="Create Route"
          buttonStyle={styles.doneBtn}
          handleClick={() => navigation.goBack()}
        />
      )}
    </MainWrapper>
  );
};

export default SearchLatLng;
