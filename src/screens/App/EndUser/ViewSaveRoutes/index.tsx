import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {AppHeader, MainWrapper, MapLayerSheet} from '../../../../components';
import {
  Default_Map_Style,
  isIOS,
  mapBoxToken,
  MapTypes,
  PFColors,
  showAlert,
  WP,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import {Text, TouchableOpacity, View} from 'react-native';
import {getTimeAndDistance} from '../../../../shared/utils/helpers';

const ViewSaveRoutes = ({route}: any) => {
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [routes, setRoute] = useState<any>([]);
  const [results, setResults] = useState<null>(null);
  const [destination, setDestination] = useState<any>(null);
  const [startPoint, setStartPoint] = useState<any>(null);

  const [routeLineColor, setRouteLineColor] = useState<string>(
    PFColors.Blue.Dark,
  );
  const [routeLineHeight, setRouteLineHeight] = useState<any>(4);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (route) {
      const selectedRoute = route?.params?.item;
      const endCoordinates = [
        parseFloat(selectedRoute?.dropoff_location.longitude),
        parseFloat(selectedRoute?.dropoff_location.latitude),
      ];
      const startCoordinates = [
        parseFloat(selectedRoute?.pickup_location?.longitude),
        parseFloat(selectedRoute?.pickup_location?.latitude),
      ];
      const formattedPoints = selectedRoute?.middle_location_points
        .filter((point: any) => point.latitude && point.longitude)
        .map((point: any) => [
          parseFloat(point.longitude),
          parseFloat(point.latitude),
        ]);

      setCurrentLocation(startCoordinates);
      setDestination(endCoordinates);
      formattedPoints.unshift(startCoordinates);
      formattedPoints.push(endCoordinates);

      setRoute(formattedPoints);
      setRouteLineColor(route?.params?.item?.color);
      setRouteLineHeight(Number(route?.params?.item?.weight));
    }
  }, [route]);

  const fetchRoute = async (start, end) => {
    console.log('start', start);

    const accessToken = mapBoxToken;
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const route = data.routes[0]?.geometry?.coordinates;
      return route;
    } catch (error) {
      console.error('Error fetching route:', error);
      showAlert('Error', 'No route exists between the entered locations.');
      return [];
    }
  };

  // useEffect(() => {
  //   if (destination && currentLocation) getRoute();
  // }, [destination, currentLocation]);

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

    setTimeout(() => {
      setMapLayerSheeet(false);
    }, 500);
  };

  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routes,
    },
  };

  const haversineDistance = (coord1: any, coord2: any) => {
    const toRad = (angle: any) => (Math.PI * angle) / 180;

    const R = 6371;
    const lat1 = toRad(coord1[1]);
    const lon1 = toRad(coord1[0]);
    const lat2 = toRad(coord2[1]);
    const lon2 = toRad(coord2[0]);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };
  const calculateTotalDistance = (routePoints: any): number => {
    let totalDistanceKm = 0;
    for (let i = 0; i < routePoints.length - 1; i++) {
      totalDistanceKm += haversineDistance(routePoints[i], routePoints[i + 1]);
    }
    const totalDistanceMiles = totalDistanceKm * 0.621371;
    return totalDistanceMiles;
  };

  const totalDistance = calculateTotalDistance(routes);
  const estimateTravelTime = (distance: number, speed = 5): string => {
    const timeInHours = distance / speed;
    const timeInMinutes = timeInHours * 60;

    if (timeInMinutes < 60) {
      return `${timeInMinutes.toFixed(0)} min`;
    } else {
      return `${timeInHours.toFixed(2)} hrs`;
    }
  };

  const estimatedTime = estimateTravelTime(totalDistance, 5);
  return (
    <MainWrapper style={styles.container}>
      <AppHeader title={route?.params?.item?.name} />

      <MapboxGL.MapView
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
        onPress={onPressMap}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={10}
          bounds={{
            ne: routes?.reduce(
              (acc, coord) => [
                Math.max(acc[0], coord[0]),
                Math.max(acc[1], coord[1]),
              ],
              [-Infinity, -Infinity],
            ),
            sw: routes.reduce(
              (acc, coord) => [
                Math.min(acc[0], coord[0]),
                Math.min(acc[1], coord[1]),
              ],
              [Infinity, Infinity],
            ),
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 30,
            paddingBottom: 180,
          }}
        />

        {currentLocation && (
          <MapboxGL.MarkerView coordinate={currentLocation}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}
        {destination && (
          <MapboxGL.MarkerView coordinate={destination}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}

        {/* Route Line */}
        {routes?.length > 1 && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              id="routeLayer-unique"
              style={{
                lineWidth: routeLineHeight,
                lineColor: routeLineColor,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {routes?.map((coordinate, index) => (
          <MapboxGL.PointAnnotation
            key={`pin-${index}`}
            id={`pin-${index}`}
            coordinate={coordinate}>
            <View style={styles.routeStopStyles} />
          </MapboxGL.PointAnnotation>
        ))}
        <View style={styles.bottomView}>
          <View style={styles.routeInfoView}>
            <Text>
              {svgIcon.MapWindow}
              <View style={{width: 5}} />

              <Text style={styles.routeInfoText}>
                {totalDistance.toFixed(2)} miles
              </Text>
            </Text>
            <View style={{marginLeft: 40}} />
            <Text>
              {svgIcon.BlueClock}
              <View style={{width: 5}} />
              <Text style={styles.routeInfoText}>{estimatedTime}</Text>
            </Text>
          </View>
        </View>
      </MapboxGL.MapView>

      <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => {
          setMapLayerSheeet(true);
        }}>
        {svgIcon.MapLayer}
      </TouchableOpacity>
      <MapLayerSheet
        setModalVisible={() => setMapLayerSheeet(false)}
        modalVisible={mapLayerSheeet}
        data={mapTypesArr}
        onPressCard={onSelectMapType}
        onPressCancel={() => setMapLayerSheeet(false)}
        onPressSave={() => onPressSave()}
      />
    </MainWrapper>
  );
};

export default ViewSaveRoutes;
