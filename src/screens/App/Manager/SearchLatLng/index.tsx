import React, {useEffect, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {AppHeader, MainWrapper, SearchInput} from '../../../../components';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {appIcons} from '../../../../assets/icons';
import useLocation from '../../../../hooks/getLocation';
import {svgIcon} from '../../../../assets/svg';
import SearchAddressSelector from '../../../../components/complex/SearchAddressSelector';

const SearchLatLng = () => {
  const {location, error, hasPermission} = useLocation();
  const [startPoint, setStartPoint] = useState<any>(null);
  const [endPoint, setEndPoint] = useState<any>(null);
  const [placeName, setPlaceName] = useState<any>('');
  const [route, setRoute] = useState([]);
  const start = [74.2753707252891, 31.454161451112693];
  const end = [74.34018932626725, 31.534243995250755];

  const onPressMap = event => {
    const {geometry} = event;
    const [longitude, latitude] = geometry.coordinates;
    setStartPoint([longitude, latitude]);
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
        setPlaceName(place);
      } else {
        // setPlaceName('Place not found');
        console.log('Place name===> not found');
      }
    } catch (error) {
      console.error('Error fetching place name:', error);
    }
  };

  const fetchRoute = async (start, end) => {
    const accessToken =
      'sk.eyJ1IjoibWF0YW9zbWFuIiwiYSI6ImNtMHhsejduczBkOGEycXBnbmh2NG5oaDcifQ.pPM1yQbjLKE-C0Mjg8mi0Q';
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const route = data.routes[0]?.geometry?.coordinates;
      console.log('ROUTES===>', route);

      return route;
    } catch (error) {
      console.error('Error fetching route:', error);
      return [];
    }
  };

  useEffect(() => {
    const getRoute = async () => {
      const fetchedRoute = await fetchRoute(start, end);
      console.log('FETCHED====>', fetchedRoute);

      setRoute(fetchedRoute);
    };

    getRoute();
  }, []);

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="Search" />
      {/* <TouchableOpacity style={styles.inputStyles} activeOpacity={0.7}>
        <SearchInput />
      </TouchableOpacity> */}
      <SearchAddressSelector />
      <MapboxGL.MapView style={styles.map} scaleBarEnabled={false}>
        <MapboxGL.Camera
          zoomLevel={15}
          centerCoordinate={[74.2753883, 31.4541112]}
        />
        {location && (
          <MapboxGL.MarkerView
            coordinate={[location?.longitude, location?.latitude]}>
            <View>
              <Image
                source={appIcons.alertMiniIcon}
                style={{height: 30, width: 30}}
              />
              <Text>Current Position</Text>
            </View>
          </MapboxGL.MarkerView>
        )}
        {startPoint && (
          // <MapboxGL.MarkerView coordinate={startPoint}>
          //   <View>
          //     <Image
          //       source={appIcons.alertMiniIcon}
          //       style={{height: 30, width: 30}}
          //     />
          //     {svgIcon.StartPoint}
          //     <Text>Start Point</Text>
          //   </View>
          // </MapboxGL.MarkerView>
          <MapboxGL.PointAnnotation coordinate={startPoint} id="start-point" />
        )}
        {endPoint && (
          <MapboxGL.MarkerView coordinate={endPoint}>
            <View>
              <Image
                source={appIcons.alertMiniIcon}
                style={{height: 30, width: 30}}
              />
              {svgIcon.RedPin}
              <Text>Start Point</Text>
            </View>
          </MapboxGL.MarkerView>
        )}
        {/* Start Marker */}
        <MapboxGL.PointAnnotation coordinate={start} id="start-point" />
        {/* End Marker */}
        <MapboxGL.PointAnnotation coordinate={end} id="end-point" />
        {/* Route Line */}
        {/* {route?.length > 0 && (
          <MapboxGL.ShapeSource
            id="routeSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: route,
              },
            }}>
            <MapboxGL.LineLayer
              id="routeLayer"
              style={{
                lineWidth: 4,
                lineColor: '#007AFF',
              }}
            />
          </MapboxGL.ShapeSource>
        )} */}
      </MapboxGL.MapView>
    </MainWrapper>
  );
};

export default SearchLatLng;
