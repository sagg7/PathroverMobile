import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {
  AddEntranceSheet,
  AppLoader,
  MainWrapper,
  MapLayerSheet,
  PinYourLocationSheet,
  SaveRecordHikingRouteSheet,
  WellPathMenuSheet,
} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {
  Default_Map_Style,
  HP,
  isIOS,
  mapBoxToken,
  MapTypes,
  PFColors,
  Routes,
  showAlert,
  UNEXPECTED_ERROR,
  WP,
} from '../../../../shared/exporter';
import {svgIcon} from '../../../../assets/svg';
import useLocation from '../../../../hooks/getLocation';
import SearchView from './SearchView';
import HeaderView from './HeaderView';
import {MapSettingSheet} from '../../../../components/complex/MapSettingSheet';
import {PinLocationAddress} from '../../../../components/complex/PinLocationAddress';
import {useGetAllWellsQuery} from '../../../../redux/endUser/endUserApiSlice';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import {Image, Platform, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setMapLayerStyle} from '../../../../redux/manager/managerSlice';
import {RouteToWellSheet} from '../../../../components/complex/RouteToWellSheet';
import {setCreateRouteDataEmpty} from '../../../../redux/endUser/endUserSlice';
import {RouteToWellStartedSheet} from '../../../../components/complex/RouteToWellStartedSheet';
import {getTimeAndDistance} from '../../../../shared/utils/helpers';

const WellPath = () => {
  const navigation: any = useNavigation();
  const [mapLayerSheeet, setMapLayerSheeet] = useState<boolean>(false);
  const [mapTypesArr, setMapTypesArr] = useState(MapTypes);
  const [selectedMapType, setSelectedMapType] = useState(Default_Map_Style);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [route, setRoute] = useState<any>([]);
  const [available, setAvailable] = useState(false);
  const [showMapSettigs, setShowMapSettigs] = useState<boolean>(false);
  const [nearbyPins, setNearbyPins] = useState<boolean>(true);
  const [nearbyWells, setNearbyWells] = useState<boolean>(true);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [searchLocation, setSearchLocation] = useState<any>(null);
  const [searchLocationName, setSearchLocationNames] = useState<any>(null);
  const [selectedWell, setSelectedWell] = useState<any>(null);
  const [selectedWellName, setSelectedWellName] = useState<any>(null);
  const [showRouteActionSheet, setShowRouteActionSheet] =
    useState<boolean>(false);
  const [showRouteStartedSheet, setShowRouteStartedSheet] =
    useState<boolean>(false);
  const [zoom, setZoom] = useState<any>(12);
  const [results, setResults] = useState<null>(null);
  const [actionBtn, setActionBtn] = useState<any>({
    direction: true,
    start: false,
  });
  const [showPinAddress, setShowPinAddress] = useState<boolean>(false);
  const [showAddEntranceSheet, setShowAddEntranceSheet] =
    useState<boolean>(false);
  const [entranceCoords, setEntranceCoords] = useState<any>(null);
  const [entranceName, setEntranceName] = useState<any>('');
  const [createRoute, {isLoading: PinLoading}] = useCreateRouteMutation();
  const dispatch = useDispatch();
  const [queryParams, setQueryParams] = useState<any>({
    latitude: null,
    longitude: null,
    radius: 50,
  });

  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);

  const [pinYourLocation, setPinYourLocation] = useState<any>({
    latitude: '',
    longitude: '',
    name: '',
  });

  const {
    data: allWellLocations,
    isLoading,
    refetch,
  } = useGetAllWellsQuery(queryParams);
  const {location} = useLocation();
  const cameraRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const pinLocationSheet = useRef<any>(null);
  const [allWells, setAllWells] = useState<any>([]);
  // const [allPins, setAllPins] = useState<any>([]);

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
      setQueryParams({
        ...queryParams,
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
    }
  }, [location]);
  useEffect(() => {
    if (queryParams) {
      refetch();
    }
  }, [queryParams, refetch]);

  useEffect(() => {
    if (allWellLocations) setAllWells(allWellLocations?.wells);
    console.log(
      'allWellLocationsallWellLocations',
      allWellLocations?.wells?.length,
    );
  }, [allWellLocations]);

  useEffect(() => {
    if (mapLayerStyle) {
      setSelectedMapType(mapLayerStyle);
      const tempMap = mapTypesArr.map(item => ({
        ...item,
        isSelected: item.type === mapLayerStyle,
      }));
      setMapTypesArr(tempMap);
    }
  }, [mapLayerStyle]);
  const filterByType = (type: string) => {
    const filtered = allWellLocations?.wells?.filter(
      (item: any) => item?.well_type === type,
    );

    return filtered?.length ? filtered : [];
  };

  useEffect(() => {
    if (!nearbyPins && nearbyWells) {
      setAllWells(filterByType('well'));
    } else if (!nearbyWells && nearbyPins) {
      setAllWells(filterByType('pin'));
    } else if (nearbyPins && nearbyWells) {
      setAllWells(allWellLocations?.wells);
    } else if (!nearbyPins && !nearbyWells) {
      setAllWells([]);
    }
  }, [nearbyWells, allWellLocations]);

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

  const getRoute = async () => {
    if (searchLocation && currentLocation) {
      const fetchedRoute = await fetchRoute(currentLocation, searchLocation);
      setRoute(fetchedRoute);
    }
  };
  useEffect(() => {
    if (searchLocation && currentLocation) getRoute();
  }, [searchLocation, currentLocation]);

  useEffect(() => {
    const getResults = async () => {
      const locResults: any = await getTimeAndDistance(
        currentLocation,
        searchLocation,
      );

      setResults(locResults);
    };
    getResults();
  }, [currentLocation, searchLocation]);

  useEffect(() => {
    if (searchLocation?.length > 0) {
      setTimeout(() => {
        if (cameraRef.current) {
          cameraRef.current.moveTo(searchLocation, 1500);

          setQueryParams({
            ...queryParams,
            latitude: searchLocation[1],
            longitude: searchLocation[0],
          });
          setShowRouteActionSheet(true);

          // navigation.navigate(Routes.ViewWellPathNavigation, {
          //   entranceCoords: searchLocation,
          //   entranceName: searchLocationName,
          // });
          refetch();
        } else {
          showAlert(
            'Error',
            'Your coordinates are incorrect, Unable to locate.',
          );
        }
      }, 200);
    }
  }, [searchLocation, searchLocationName]);

  const onPressMap = (event: any) => {
    try {
      const {geometry} = event;
      if (geometry && Array.isArray(geometry.coordinates)) {
        if (showAddEntranceSheet) {
          setEntranceCoords(geometry.coordinates);
        }
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
    dispatch(setMapLayerStyle(selected));

    setTimeout(() => {
      setMapLayerSheeet(false);
    }, 500);
  };

  const onPressToggle = () => {
    setAvailable(!available);
    navigation.navigate(Routes.Subscription);
  };
  const routeGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: route,
    },
  };
  const onPressMapSettingClear = () => {
    setNearbyPins(true);
    setNearbyWells(true);
    setTimeout(() => {
      setShowMapSettigs(false);
    }, 1000);
  };

  const _handlePinBtn = async () => {
    const startCoords = {
      latitude: currentLocation[1],
      longitude: currentLocation[0],
      name: 'Start',
    };
    const endCoords = {
      latitude: selectedWell[1],
      longitude: selectedWell[0],
      name: 'End Location',
    };

    const routeData = {
      user_route: {
        name: 'Pin Location',
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

  const moveToCurrentLocation = () => {
    if (
      !currentLocation ||
      !Array.isArray(currentLocation) ||
      currentLocation?.length !== 2
    ) {
      console.error('Invalid coordinates:', currentLocation);
      return;
    }

    if (cameraRef?.current) {
      cameraRef.current?.setCamera({
        centerCoordinate: currentLocation,
      });
    }
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

  const onRegionDidChange = async () => {
    if (mapRef.current) {
      const zoom = await mapRef.current.getZoom();
      setZoom(zoom);
    }
  };

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
      <HeaderView onPressToggle={() => onPressToggle()} switchOn={available} />
      <SearchView
        onPressSearch={() =>
          navigation.navigate(Routes.SearchWellPath, {
            searchLocation,
            setSearchLocation,
            searchLocationName,
            setSearchLocationNames,
          })
        }
        onPressFilter={() => setShowMapSettigs(true)}
        onPressMenu={() => setShowOptionsSheet(true)}
      />

      <MapboxGL.MapView
        ref={mapRef}
        onRegionDidChange={onRegionDidChange}
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
        onDidFinishLoadingMap={() => {
          if (searchLocation) {
            cameraRef?.current?.flyTo(searchLocation, 1500);
          }
        }}
        onPress={onPressMap}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={currentLocation}
        />

        {currentLocation && (
          <MapboxGL.MarkerView coordinate={currentLocation}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}
        {searchLocation && (
          <MapboxGL.PointAnnotation
            id="searchMarker"
            coordinate={searchLocation}
            onSelected={() => {
              setShowRouteActionSheet(true);
              // navigation.navigate(Routes.ViewWellPathNavigation, {
              //   entranceCoords: searchLocation,
              //   entranceName: searchLocationName,
              // });
            }}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.PointAnnotation>
        )}
        {entranceCoords && (
          <MapboxGL.MarkerView coordinate={entranceCoords}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
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
            clusterMaxZoom={10}>
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

        {/* Route Line */}
        {route?.length > 1 && (
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
      </MapboxGL.MapView>
      <TouchableOpacity
        style={styles.recenter}
        onPress={() => moveToCurrentLocation()}>
        {svgIcon.MapWhiteBg}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.maplayerStyles}
        onPress={() => setMapLayerSheeet(true)}>
        {svgIcon.MapLayer}
      </TouchableOpacity>
      <WellPathMenuSheet
        modalVisible={showOptionsSheet}
        onPressCancel={() => setShowOptionsSheet(false)}
        setModalVisible={() => setShowOptionsSheet(false)}
        onPressRecordRoute={() => {
          setShowOptionsSheet(false);
          setTimeout(() => {
            navigation.navigate(Routes.RecordRoute);
          }, 1000);
        }}
        onPressCreateRoute={() => {
          setShowOptionsSheet(false);
          dispatch(setCreateRouteDataEmpty({}));
          setTimeout(() => {
            navigation.navigate(Routes.CreateRouteEndUser);
          }, 1000);
        }}
      />

      <MapLayerSheet
        setModalVisible={() => setMapLayerSheeet(false)}
        modalVisible={mapLayerSheeet}
        data={mapTypesArr}
        onPressCard={onSelectMapType}
        onPressCancel={() => setMapLayerSheeet(false)}
        onPressSave={() => onPressSave()}
      />
      <MapSettingSheet
        setModalVisible={() => setShowMapSettigs(false)}
        modalVisible={showMapSettigs}
        onPressCancel={() => setShowMapSettigs(false)}
        well={nearbyWells}
        pin={nearbyPins}
        setPin={setNearbyPins}
        setWell={setNearbyWells}
        onPressClear={() => onPressMapSettingClear()}
      />
      <PinLocationAddress
        onPressShare={() => {
          setShowPinAddress(false);
          selectedWell.map(Number);
          const formatedArr = selectedWell.map(Number);
          navigation.navigate(Routes.ChatUsers, {
            shareTrail: {
              startingPoint: [],
              endingPoint: formatedArr,
              type: 'Well route',
            },
          });
        }}
        modalVisible={showPinAddress}
        selectedPin={selectedWell || ['', '']}
        selectedWell={selectedWellName || ['', '']}
        setModalVisible={() => setShowPinAddress(false)}
        onPresAddEntrance={() => {
          setShowRouteActionSheet(false);

          setShowPinAddress(false);
          setTimeout(() => {
            setShowAddEntranceSheet(true);
          }, 1000);
        }}
        onPressRouteToWell={() => {
          setShowPinAddress(false);

          navigation.navigate(Routes.RouteToWell, {
            entranceCoords: selectedWell,
            entranceName: '',
          });
        }}
      />
      {showAddEntranceSheet && (
        <AddEntranceSheet
          onPressShare={() => {
            selectedWell.map(Number);
            const formatedArr = selectedWell.map(Number);
            navigation.navigate(Routes.ChatUsers, {
              shareTrail: {
                startingPoint: entranceCoords,
                endingPoint: formatedArr,
                type: 'Well entrance route',
              },
            });
          }}
          selectedWellName={selectedWellName}
          selectedPin={selectedWell}
          onChangeEntranceName={(text: string) => setEntranceName(text)}
          entranceName={entranceName}
          isEntranceMarker={entranceCoords}
          onPressPlaceToEntrance={() => {
            navigation.navigate(Routes.RouteToWell, {
              entranceCoords: entranceCoords,
              entranceName: entranceName,
            });
            setShowAddEntranceSheet(false);
            setEntranceCoords(null);
            setEntranceName(null);
          }}
          setModalVisible={() => {
            setEntranceCoords(null);
            setShowAddEntranceSheet(false);
            setEntranceName(null);
          }}
        />
      )}
      {showRouteActionSheet && (
        <RouteToWellSheet
          routeLength={route?.length}
          onpressCancel={() => {
            setRoute([]);
            setShowRouteActionSheet(false);
            // cameraRef.current.flyTo(currentLocation, 1000);
          }}
          routeName={searchLocationName}
          distanceInfo={results}
          actionBtn={actionBtn}
          onPressDirection={() => {
            // getRoute();
            setActionBtn({
              ...actionBtn,
              direction: true,
            });
            // centerMap();
          }}
          onPressStart={() => {
            setShowRouteActionSheet(false);
            navigation.navigate(Routes.ViewWellPathNavigation, {
              entranceCoords: searchLocation,
              entranceName: searchLocationName,
            });
          }}
          // onPressPin={() => handlePinBtn()}
          show={false}
        />
      )}

      <RBSheet
        ref={pinLocationSheet}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customStyles={{
          container: {
            height: isIOS() ? HP('43') : HP('50'),
            borderTopLeftRadius: WP('3'),
            borderTopRightRadius: WP('3'),
          },
        }}>
        <PinYourLocationSheet
          onPressCancel={() => pinLocationSheet.current.close()}
          values={pinYourLocation}
          setValues={setPinYourLocation}
        />
      </RBSheet>
      {/* {isLoading && <AppLoader />} */}
    </MainWrapper>
  );
};

export default WellPath;
