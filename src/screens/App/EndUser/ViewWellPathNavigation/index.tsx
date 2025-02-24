import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {AppHeader, MainWrapper, MapLayerSheet} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {
  Default_Map_Style,
  isIOS,
  mapBoxToken,
  MapTypes,
  PFColors,
  showAlert,
  UNEXPECTED_ERROR,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import useLocation from '../../../../hooks/getLocation';
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteToWellSheet} from '../../../../components/complex/RouteToWellSheet';
import {
  fetchSuggestions,
  getTimeAndDistance,
} from '../../../../shared/utils/helpers';
import {RouteToWellStartedSheet} from '../../../../components/complex/RouteToWellStartedSheet';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import {useSelector} from 'react-redux';
import {useGetAllWellsQuery} from '../../../../redux/endUser/endUserApiSlice';

const ViewWellPathNavigation = ({route}: any) => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [routes, setRoute] = useState<any>([]);
  const [results, setResults] = useState<null>(null);
  const [destination, setDestination] = useState<any>(null);
  const [tourStarted, setTourStarted] = useState<boolean>(false);
  const [showRouteStartedSheet, setShowRouteStartedSheet] =
    useState<boolean>(false);
  const [searchLocation, setSearchLocation] = useState<any>(null);

  const [simpleSearch, setSimpleSearch] = useState<string>('');
  const debounceTimeout = useRef<any>(null);
  const [suggestions, setSuggestions] = useState([]);
  const [queryParams, setQueryParams] = useState<any>({
    latitude: null,
    longitude: null,
    radius: 50,
  });
  const [allWells, setAllWells] = useState<any>([]);
  const [showPinAddress, setShowPinAddress] = useState<boolean>(false);
  const [showAddEntranceSheet, setShowAddEntranceSheet] =
    useState<boolean>(false);
  const [selectedWell, setSelectedWell] = useState<any>(null);
  const [selectedWellName, setSelectedWellName] = useState<any>(null);
  const [showRouteActionSheet, setShowRouteActionSheet] =
    useState<boolean>(true);
  const [actionBtn, setActionBtn] = useState<any>({
    direction: true,
    start: false,
  });
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [createRoute, {isLoading: PinLoading}] = useCreateRouteMutation();
  const {
    data: allWellLocations,
    isLoading,
    refetch,
  } = useGetAllWellsQuery(queryParams);
  const {location} = useLocation();
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (route) setDestination(route?.params?.entranceCoords);
  }, [route]);
  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);
  useEffect(() => {
    if (mapLayerStyle) {
      setSelectedMapType(mapLayerStyle);
    }
  }, [mapLayerStyle]);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useEffect(() => {
    if (allWellLocations) setAllWells(allWellLocations?.wells);
    console.log(
      'allWellLocationsallWellLocations',
      allWellLocations?.wells?.length,
    );
  }, [allWellLocations]);

  const fetchRoute = async (start, end) => {
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

  useEffect(() => {
    const getResults = async () => {
      const locResults: any = await getTimeAndDistance(
        currentLocation,
        destination,
      );

      setResults(locResults);
    };
    getResults();
  }, [currentLocation]);

  const getRoute = async () => {
    if (destination && currentLocation) {
      const fetchedRoute = await fetchRoute(currentLocation, destination);
      setRoute(fetchedRoute);
    }
  };
  useEffect(() => {
    if (destination && currentLocation) getRoute();
  }, [destination, currentLocation]);

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
  const centerMap = () => {
    const start = currentLocation;
    const end = destination;

    const minLongitude = Math.min(start[0], end[0]);
    const maxLongitude = Math.max(start[0], end[0]);
    const minLatitude = Math.min(start[1], end[1]);
    const maxLatitude = Math.max(start[1], end[1]);

    const buffer = 0.09;
    const adjustedMinLongitude = minLongitude - buffer;
    const adjustedMaxLongitude = maxLongitude + buffer;
    const adjustedMinLatitude = minLatitude - buffer;
    const adjustedMaxLatitude = maxLatitude + buffer;

    cameraRef.current.fitBounds(
      [adjustedMinLongitude, adjustedMinLatitude],
      [adjustedMaxLongitude, adjustedMaxLatitude],
      {
        Left: 100,
        Right: 100,
        Top: 80,
        Bottom: 80,
      },
    );
  };
  const handlePinBtn = async () => {
    const startCoords = {
      latitude: currentLocation[1],
      longitude: currentLocation[0],
      name: 'Start',
    };
    const endCoords = {
      latitude: destination[1],
      longitude: destination[0],
      name: 'End Location',
    };

    const routeData = {
      user_route: {
        name: route?.params?.entranceName,
        route_type: 'maps_location_pins',
        color: PFColors.Blue.Dark,
        weight: '4',

        location_start_attributes: startCoords,
        location_end_attributes: endCoords,
      },
    };
    const resp = await createRoute(routeData);
    if (resp?.data) {
      showAlert('Alert', 'Your location has been pined.');
      navigation.goBack();
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
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
  const handleSelect = (place: any) => {
    const [longitude, latitude] = place.center || place;
    cameraRef.current.moveTo([longitude, latitude], 1500);
    setSuggestions([]);
    setSearchLocation([longitude, latitude]);
    setQueryParams({
      ...queryParams,
      latitude: latitude,
      longitude: longitude,
    });
  };
  const wellsToGeoJSON = (wells: any[]) => ({
    type: 'FeatureCollection',
    features: wells.map(well => ({
      type: 'Feature',
      properties: {well: well},

      geometry: {
        type: 'Point',
        coordinates: [Number(well.log), Number(well.lat)],
      },
    })),
  });
  const onPressMarker = (e: any) => {
    const feature = e?.features[0];
    if (!feature) return;

    const coordinates = feature.geometry?.coordinates;
    const isCluster = feature.properties?.cluster || false;
    const pointCount = feature.properties?.point_count || 1;
    const selected = feature.properties?.well;

    if (!coordinates) return;

    if (isCluster && pointCount > 1) {
      showAlert(
        'Alert',
        'Markers are clustered—zoom in for a closer look!',
        () => {
          cameraRef.current?.moveTo(coordinates, 600);

          setTimeout(() => {
            cameraRef.current?.setCamera({
              centerCoordinate: coordinates,
              zoomLevel: Math.min(16, Math.max(12, 18 - Math.log2(pointCount))), // Adjust zoom
              animationDuration: 800,
            });
          }, 500);
        },
      );

      return;
    }

    setShowPinAddress(true);
    setSelectedWell([selected?.log, selected?.lat]);
    setSelectedWellName(selected);
  };

  return (
    <MainWrapper style={styles.container}>
      <AppHeader title="View Route" />

      <MapboxGL.MapView
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
        onPress={onPressMap}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={10}
          centerCoordinate={currentLocation}
          followUserLocation={actionBtn.start}
        />

        {currentLocation && (
          <MapboxGL.MarkerView coordinate={currentLocation}>
            {tourStarted ? svgIcon.LiveLocationTracking : svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}
        {destination && (
          <MapboxGL.MarkerView coordinate={destination}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}
        {searchLocation && (
          <MapboxGL.PointAnnotation
            id="searchMarker"
            coordinate={searchLocation}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.PointAnnotation>
        )}
        {/* Route Line */}
        {routes?.length > 1 && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              id="routeLayer-unique"
              style={{
                lineWidth: 3,
                lineColor: PFColors.Blue.Dark,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        <MapboxGL.Images
          images={{
            marker: require('../../../../assets/icons/wellsMarker.png'),
          }}
        />
        {/* Clustering Source */}
        {allWells?.length > 0 && (
          <MapboxGL.ShapeSource
            onPress={onPressMarker}
            id="wellsCluster"
            shape={wellsToGeoJSON(allWells)}
            cluster
            clusterRadius={20}
            clusterMaxZoom={10}
            // clusterRadius={20}
            // clusterMaxZoom={20}
          >
            {/* <MapboxGL.SymbolLayer
              id="markerLayer"
              style={{
                iconImage: 'marker',
                iconSize: 1,
                iconAllowOverlap: true,
              }}
            /> */}
            <MapboxGL.SymbolLayer
              id="markerLayer"
              style={{
                iconImage: 'marker', // Reference the registered image name
                iconSize: Platform.OS === 'android' ? 0.7 : 0.5,
                iconIgnorePlacement: true,
                // iconAllowOverlap: true,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
      {showRouteActionSheet && !keyboardVisible && (
        <RouteToWellSheet
          onpressCancel={() => navigation.goBack()}
          routeName={route?.params?.entranceName}
          distanceInfo={results}
          actionBtn={actionBtn}
          onPressDirection={() => {
            getRoute();
            setActionBtn({
              ...actionBtn,
              direction: true,
            });
            // centerMap();
          }}
          onPressStart={() => {
            getRoute();
            setActionBtn({
              ...actionBtn,
              direction: true,
            });
            setTourStarted(true);
            setShowRouteActionSheet(false);
            setTimeout(() => {
              setShowRouteStartedSheet(true);
            }, 1000);
          }}
          onPressPin={() => handlePinBtn()}
          show={false}
        />
      )}
      {showRouteStartedSheet && (
        <RouteToWellStartedSheet
          routeName={route?.params?.entranceName}
          routeInfo={results}
          setModalVisible={() => {
            setShowRouteStartedSheet(false), navigation.goBack();
          }}
        />
      )}
      <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => {
          setMapLayerSheeet(true);
        }}>
        {svgIcon.MapLayer}
      </TouchableOpacity>
      <View style={styles.searchBox}>
        {svgIcon.Search}
        <TextInput
          placeholder="Search"
          placeholderTextColor={PFColors.Gray.DarkGray}
          value={simpleSearch}
          onChangeText={handleChangeText}
          style={styles.input}
        />
        {/* {suggestions?.length > 0 && ( */}

        {/* )} */}
      </View>
      {suggestions?.length > 0 && (
        <View style={styles.listStyles}>
          <FlatList
            data={suggestions}
            keyExtractor={(item: any) => item.id}
            contentContainerStyle={styles.suggestionContainer}
            renderItem={({item}: any) => (
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Text style={{padding: 10, color: PFColors.Standard.Black}}>
                  {item.place_name}jjn
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

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

export default ViewWellPathNavigation;
