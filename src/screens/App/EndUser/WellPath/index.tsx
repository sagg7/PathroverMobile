import React, { useEffect, useRef, useState } from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {
  AddEntranceSheet,
  MainWrapper,
  MapLayerSheet,
  PinYourLocationSheet,
  WellPathMenuSheet,
} from '../../../../components';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  AppLoader,
  CHAT_NON_VERIFIED_TEXT,
  Default_Map_Style,
  HP,
  isIOS,
  mapBoxToken,
  MapTypes,
  PFColors,
  ROUTE_LINE_STYLES,
  Routes,
  showAlert,
  UNEXPECTED_ERROR,
  WP,
} from '../../../../shared/exporter';
import { svgIcon } from '../../../../assets/svg';
import useLocation from '../../../../hooks/getLocation';
import SearchView from './SearchView';
import HeaderView from './HeaderView';
import { MapSettingSheet } from '../../../../components/complex/MapSettingSheet';
import { PinLocationAddress } from '../../../../components/complex/PinLocationAddress';
import {
  useCreateShareLinkRouteMutation,
  useGetAllWellsQuery,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
} from '../../../../redux/endUser/endUserApiSlice';
import RBSheet from 'react-native-raw-bottom-sheet';

import usePremiumAlert from '../../../../hooks/usePremiumAlert';
import {useCreateRouteMutation} from '../../../../redux/manager/managerApiSlice';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setMapLayerStyle} from '../../../../redux/manager/managerSlice';
import {RouteToWellSheet} from '../../../../components/complex/RouteToWellSheet';
import {setCreateRouteDataEmpty} from '../../../../redux/endUser/endUserSlice';
import {getTimeAndDistance} from '../../../../shared/utils/helpers';
import GeneralModal from '../../../../components/complex/GeneralModal';
import marker from '../../../../assets/icons/wellsMarker.png';
import usePlaceName from '../../../../hooks/getPlaceName';
import Share from 'react-native-share';
import SharedSheet from '../../../../components/complex/SharedSheet';
import { setLoginUser } from '../../../../redux/auth/authSlice';
import { isSubscriptionActive } from '../../../../hooks/iap-hook/iapPurchaseHook';
import { useStateShortCode } from '../../../../hooks/getStateName';

const WellPath = () => {
  const isFocused = useIsFocused();
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
  const [searchedWells, setSearchedWells] = useState<any>(null);
  const loginUser = useSelector(state => state?.auth?.loginUser);
  const [offRoadSegment, setOffRoadSegment] = useState<any>([]);
  const [selectedWell, setSelectedWell] = useState<any>(null);
  const [selectedWellName, setSelectedWellName] = useState<any>(null);
  const [showRouteActionSheet, setShowRouteActionSheet] =
    useState<boolean>(false);
  const [showNavigationSheet, setShowNavigationSheet] =
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
  const [createRoute, { isLoading: PinLoading }] = useCreateRouteMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();

  const [createShareLinkRoute, { isLoading: linkRouteLoading }] =
    useCreateShareLinkRouteMutation();
  const { shortCode, getShortCodeFromCoords } = useStateShortCode();
  const dispatch = useDispatch();
  const [selectedSearchedWell, setSelectedSearchedWell] = useState<any>(null);
  const [wellDistances, setWellDistances] = useState({});
  const [pinLocationDetails, setPinLocationDetails] = useState<any>({
    latitude: null,
    longitude: null,
    name: null,
  });
  const [waypointRoute, setWayPointRoute] = useState<any>([]);
  const { placeName, fetchPlaceName, setPlaceName, error, loading } =
    usePlaceName();
  const [pinLocationMarker, setPinLocationMarker] = useState<any>([]);

  const [showShareSheet, setShowShareSheet] = useState<boolean>(false);
  const [showShareWellSheet, setShowShareWellSheet] = useState<boolean>(false);
  const [showPlaceEntrance, setShowPlaceEntrance] = useState<boolean>(false);
  const [loaderCount, setLoaderCount] = useState(0);
  const [loaderState, setLoaderState] = useState(true);
  const [IsmapLoading, setIsmapLoading] = useState(true);
  const [filteredWells, setFilteredWells] = useState<any>([]);

  const getRadiusForZoomLevel = (zoomLevel: any) => {
    switch (zoomLevel) {
      case 12:
      case 11:
        return 50;
      case 10:
      case 9:
        return 100;
      case 8:
      case 7:
        return 120;
      case 6:
      case 5:
        return 120;
      case 4:
      case 3:
        return 120;
      default:
        return 50;
    }
  };

  useEffect(() => {
    const fetchDistances = async () => {
      if (!searchedWells?.length || !currentLocation) return;

      const distances: any = {};
      for (const well of searchedWells) {
        try {
          const result = await getTimeAndDistance(currentLocation, [
            well?.log,
            well?.lat,
          ]);
          distances[well?.id] = result.distance;
        } catch (error) {
          console.error('Error fetching distance:', error);
          distances[well?.id] = 'N/A';
        }
      }

      setWellDistances(distances);
    };

    fetchDistances();
  }, [searchedWells, currentLocation]);

  const [queryParams, setQueryParams] = useState<any>({
    latitude: null,
    longitude: null,
    radius: getRadiusForZoomLevel(zoom),
    per_page: 100,
    page: 1,
  });
  const mapLayerStyle = useSelector(state => state?.manager?.mapLayerStyle);
  const { is_subscribed } = useSelector(state => state?.auth?.loginUser);
  const user = useSelector(state => state?.auth?.loginUser);
  const { data: subscriptions } = useGetSubscriptionQuery(null);

  const { showPremiumAlert } = usePremiumAlert();

  const [pinYourLocation, setPinYourLocation] = useState<any>({
    latitude: '',
    longitude: '',
    name: '',
  });

  const {
    data: allWellLocations,
    isLoading,
    refetch,
  } = useGetAllWellsQuery(queryParams, {
    skip: queryParams.longitude === null || IsmapLoading,
  });
  const { location } = useLocation();
  const cameraRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const pinLocationSheet = useRef<any>(null);
  const pinMapLocation = useRef<any>(null);

  const [allWells, setAllWells] = useState<any>([]);
  useEffect(() => {
    if (location) {
      (async () => {
        setCurrentLocation([location.longitude, location.latitude]);

        const code = await getShortCodeFromCoords(
          location.latitude,
          location.longitude,
        );

        setQueryParams({
          ...queryParams,
          latitude: location.latitude,
          longitude: location.longitude,
          state: code, // optional: if you want to use it
        });
      })();
    }
  }, [location]);

  useEffect(() => {
    setAvailable(is_subscribed);
  }, [is_subscribed]);

  // useEffect(() => {
  //   if (queryParams.latitude) {
  //     refetch();
  //   }
  // }, [queryParams, refetch]);
  // useEffect(() => {
  //   if (queryParams.latitude && !IsmapLoading) {
  //     refetch();
  //   }
  // }, [queryParams, refetch, IsmapLoading]);

  useEffect(() => {
    if (allWellLocations?.length > 0) {
      setAllWells(prev => {
        const existingIds = prev.map(well => well.id); // Get existing IDs as an array

        const newWells = allWellLocations.filter(
          well => !existingIds.includes(well.id),
        ); // Check duplicates using `includes`

        return [...prev, ...newWells]; // Add only unique wells
      });
      setFilteredWells(prev => {
        const existingIds = prev.map(well => well.id); // Get existing IDs as an array

        const newWells = allWellLocations.filter(
          well => !existingIds.includes(well.id),
        ); // Check duplicates using `includes`

        return [...prev, ...newWells];
      });

      setLoaderState(false);
      setLoaderCount(1);
    }

    if (allWellLocations) {
      setLoaderState(false);
      setLoaderCount(1);
    }
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


  useEffect(() => {
    if (subscriptions?.length > 0 && is_subscribed) {
      checkSubscriptionStatus();
    }
  }, [isFocused, subscriptions, is_subscribed]);


  const checkSubscriptionStatus = async () => {
    const status = await isSubscriptionActive();
    const is_valid = status?.validation;

    setAvailable(is_valid);

    dispatch(
      setLoginUser({
        ...loginUser,
        is_subscribed: is_valid,
        is_aval_trial: false,
      }),
    );
    updateSubscription({
      subscription: {
        is_subscribed: is_valid,
        id: subscriptions?.[0]?.id,
      }
    });
  }

  // TODO AFTER WELL PINS FINAL FIXES

  const filterByType = (type: 'wells' | 'pin') => {
    return (
      allWellLocations?.wells?.filter((item: any) =>
        type === 'wells' ? item?.is_well : !item?.is_well,
      ) ?? []
    );
  };

  // useEffect(() => {
  //   let filteredWells;

  //   if (!nearbyPins && nearbyWells) {
  //     filteredWells = filterByType('wells');
  //   } else if (!nearbyWells && nearbyPins) {
  //     filteredWells = filterByType('pin');
  //   } else if (nearbyPins && nearbyWells) {
  //     filteredWells = allWellLocations?.wells;
  //   } else {
  //     filteredWells = [];
  //   }

  //   setAllWells(filteredWells);
  // }, [nearbyWells, nearbyPins, allWellLocations]);

  const toRad = value => (value * Math.PI) / 180;

  const getDistanceInKm = (coord1, coord2) => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  };

  const fetchRoute = async (start, end) => {
    const accessToken = mapBoxToken;
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&overview=full&steps=true&access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const route = data?.routes[0]?.geometry?.coordinates;

      if (!route || route?.length === 0) return { mainRoute: [], offRoad: [] };

      const firstRoutePoint = route[0];
      const lastRoutePoint = route[route.length - 1];

      const startDistance = getDistanceInKm(start, firstRoutePoint);
      const endDistance = getDistanceInKm(end, lastRoutePoint);

      const isStartOffRoad = startDistance > 0.01; // 10 meters
      const isEndOffRoad = endDistance > 0.01;

      let offRoad = [];

      if (isStartOffRoad) {
        const formatedArr = start?.map((item: any) => Number(item));

        offRoad?.push([formatedArr, firstRoutePoint]);
      }
      if (isEndOffRoad) {
        const formatedArr = end?.map((item: any) => Number(item));

        offRoad?.push([lastRoutePoint, formatedArr]);
      }

      return {
        mainRoute: route,
        offRoad: offRoad,
      };
    } catch (error) {
      return { mainRoute: [], offRoad: [] };
    }
  };

  const getRoute = async () => {
    if (searchLocation && currentLocation) {
      const { mainRoute, offRoad } = await fetchRoute(
        currentLocation,
        searchLocation,
      );
      setRoute(mainRoute);
      setOffRoadSegment(offRoad);
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
    const markerImage = require('../../../../assets/icons/wellsMarker.png');
    (async () => {
      await MapboxGL.Images.addImageAsync('marker', markerImage);
    })();
  }, []);

  useEffect(() => {
    if (searchLocation?.length > 0) {
      setTimeout(() => {
        (async () => {
          if (cameraRef.current) {
            cameraRef.current.moveTo(searchLocation, 1500);

            const code = await getShortCodeFromCoords(
              searchLocation[1],
              searchLocation[0],
            );
            setQueryParams({
              ...queryParams,
              latitude: searchLocation[1],
              longitude: searchLocation[0],
              page: 1,
              per_page: 2000,
              state: code,
            });

            setShowRouteActionSheet(true);
            fetchPlaceName(searchLocation[1], searchLocation[0]);

            setPinLocationDetails({
              latitude: searchLocation[1],
              longitude: searchLocation[0],
              name: pinLocationDetails?.name || placeName || '',
            });

            refetch();
          } else {
            showAlert(
              'Error',
              'Your coordinates are incorrect, Unable to locate.',
            );
          }
        })();
      }, 200);
    }
  }, [searchLocation, searchLocationName]);

  const onPressMap = async (event: any) => {
    try {
      const { geometry } = event;

      if (geometry && Array.isArray(geometry.coordinates)) {
        const coords = geometry.coordinates;
        if (showAddEntranceSheet) {
          setEntranceCoords(coords);
        } else {
          setPinLocationMarker(coords);
          setPinLocationDetails({
            latitude: coords[1],
            longitude: coords[0],
            name: pinLocationDetails?.name || '',
          });

          fetchPlaceName(coords[1], coords[0]);

          const { mainRoute, offRoad } = await fetchRoute(
            currentLocation,
            coords,
          );

          setWayPointRoute(mainRoute);
          setOffRoadSegment(offRoad);

          // Fetch time and distance asynchronously
          const locResults: any = await getTimeAndDistance(
            currentLocation,
            coords,
          );
          setResults(locResults);

          setTimeout(() => {
            setShowNavigationSheet(true);
            // fitToBounds();
          }, 1000);
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
    if (!is_subscribed) {
      navigation.navigate(Routes.Subscription);
    }
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

  const handlePinBtn = async wellData => {
    const startCoords = {
      latitude: currentLocation[1],
      longitude: currentLocation[0],
      name: 'Start',
    };
    const endCoords = {
      latitude: wellData?.lat,
      longitude: wellData?.log,
      name: 'End Location',
    };

    const routeData = {
      user_route: {
        name: wellData?.well_name || 'Pinned Well',
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
    features: wells?.map(well => ({
      type: 'Feature',
      properties: { well: well },

      geometry: {
        type: 'Point',
        coordinates: [Number(well.log), Number(well.lat)],
      },
    })),
  });

  const onRegionDidChange = async () => {
    setIsmapLoading(false);
    if (mapRef.current) {
      const zoom = await mapRef.current.getZoom();
      const zoomLevel = zoom.toFixed(0);
      const center = await mapRef.current.getCenter();
      const code = await getShortCodeFromCoords(center[1], center[0]);
      if (zoomLevel && !IsmapLoading) {
        setQueryParams({
          ...queryParams,
          latitude: center[1],
          longitude: center[0],
          page: 1,
          per_page: 2000,
          radius: getRadiusForZoomLevel(zoom),
          state: code,
        });
      }

      setZoom(zoomLevel);
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
  const onPressSearched = (item: any) => {
    const loc = [Number(item?.log), Number(item?.lat)];
    cameraRef?.current?.flyTo(loc, 1500);
    setSearchedWells([]);

    const obj = {
      ...item,
      lat: Number(item?.lat),
      log: Number(item?.log),
    };
    setSelectedSearchedWell(obj);
    setShowPinAddress(true);
    // setSelectedWell(obj);
    // setSelectedWellName(obj);

    setSelectedWell([obj?.log, obj?.lat]);
    setSelectedWellName(obj);
  };

  const onPressWaypointSave = async () => {
    try {
      const obj = {
        user_route: {
          name: pinLocationDetails.name,
          weight: '4',
          route_type: 'waypoint_route',
          notes: null,
          is_road_route: null,
          middle_location_points: [],
          locations_attributes: [
            {
              latitude: pinLocationDetails?.latitude,
              longitude: pinLocationDetails?.longitude,
              name: 'test',
            },
          ],
          pinned_points: [],
        },
      };
      const resp = await createRoute(obj);
      if (resp?.data) {
        showAlert('Alert', 'Your waypoint has been saved.');
        clearStates();
      } else {
        showAlert('Alert', UNEXPECTED_ERROR);
      }
    } catch (error) {
      showAlert('Alert', UNEXPECTED_ERROR);
    }
  };

  const waypointRouteGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: waypointRoute,
    },
  };
  const clearStates = () => {
    setWayPointRoute([]);
    setPinLocationMarker([]);
    setPinLocationDetails({
      latitude: null,
      longitude: null,
      name: null,
    });
    setShowNavigationSheet(false);
    pinMapLocation.current?.close();
    setOffRoadSegment([]);

    // setShowNavigationSheet(false);
  };

  const shareContent = async selectedRoute => {
    const options = {
      url: `https://staging.path-rover.com/download?route_type=${selectedRoute?.route_type}&route_id=${selectedRoute?.id}`, // Optional: A link to share
    };

    try {
      const res = await Share.open(options);
      setShowShareWellSheet(false);
    } catch (err) {
      if (err) {
      }
    }
  };

  const saveShareRouteLink = async (type: string) => {
    let routeData: any = {};
    if (type === 'way_point') {
      routeData = {
        user_route: {
          name: placeName,
          weight: '4',
          route_type: 'waypoint_route',
          notes: null,
          is_road_route: null,
          middle_location_points: [],
          locations_attributes: [
            {
              latitude: pinLocationDetails?.latitude,
              longitude: pinLocationDetails?.longitude,
              name: 'test',
            },
          ],
          pinned_points: [],
        },
      };
    } else if (type === 'place_entrance') {
      routeData = {
        user_route: {
          name: entranceName,
          weight: '4',
          route_type: 'maps_location_pins',
          notes: null,
          is_road_route: null,
          middle_location_points: [],
          locations_attributes: [
            {
              latitude: entranceCoords[1],
              longitude: entranceCoords[0],
              name: 'well',
            },
          ],
          pinned_points: [],
        },
      };
    } else {
      routeData = {
        user_route: {
          name: selectedWellName?.well_name,
          weight: '4',
          route_type: 'maps_location_pins',
          notes: null,
          is_road_route: null,
          middle_location_points: [],
          locations_attributes: [
            {
              latitude: selectedWellName?.lat,
              longitude: selectedWellName?.log,
              name: 'well',
            },
          ],
          pinned_points: [],
        },
      };
    }

    const resp = await createShareLinkRoute(routeData);
    if (resp?.data) {
      shareContent(resp?.data?.user_route);
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  const shareWellwithinApp = () => {
    setShowShareWellSheet(false);
    if (loginUser?.verified) {
      setShowPinAddress(false);
      selectedWell.map(Number);
      const formatedArr = selectedWell.map(Number);
      navigation.navigate(Routes.ChatUsers, {
        shareTrail: {
          startingPoint: [],
          endingPoint: formatedArr,
          type: 'Well route',
          name: selectedWellName?.wellname,
        },
      });
    } else {
      showAlert('Alert', CHAT_NON_VERIFIED_TEXT);
    }
  };

  const onPressWithinappAddEntrance = () => {
    setShowShareWellSheet(false);
    setShowPlaceEntrance(false);
    if (loginUser?.verified) {
      selectedWell.map(Number);
      const formatedArr = selectedWell.map(Number);
      navigation.navigate(Routes.ChatUsers, {
        shareTrail: {
          startingPoint: entranceCoords,
          endingPoint: formatedArr,
          type: 'Well entrance route',
          route_type: 'maps_location_pins',
        },
      });
    } else {
      showAlert('Alert', CHAT_NON_VERIFIED_TEXT);
    }
  };

  return (
    <MainWrapper style={styles.container}>
      <HeaderView onPressToggle={() => onPressToggle()} switchOn={available} />

      <SearchView
        onPressSearch={() =>
          is_subscribed
            ? navigation.navigate(Routes.SearchWellPath, {
              searchedWells,
              setSearchedWells,
              searchLocation,
              setSearchLocation,
              searchLocationName,
              setSearchLocationNames,
            })
            : showPremiumAlert({})
        }
        onPressFilter={() => {
          is_subscribed ? setShowMapSettigs(true) : showPremiumAlert({});
        }}
        onPressMenu={() =>
          is_subscribed ? setShowOptionsSheet(true) : showPremiumAlert({})
        }
      />

      <MapboxGL.MapView
        logoEnabled={false}
        compassEnabled
        compassPosition={{ top: isIOS() ? HP('8') : HP('10'), right: 8 }}
        compassFadeWhenNorth
        ref={mapRef}
        onRegionDidChange={onRegionDidChange}
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
        onPress={onPressMap}>
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={10}
          centerCoordinate={currentLocation}
        />
        <MapboxGL.UserLocation
          showsUserHeadingIndicator={true}
          minDisplacement={5}
          requestsAlwaysUse
          visible={true}
        />

        {selectedSearchedWell?.log && (
          <MapboxGL.MarkerView
            coordinate={[selectedSearchedWell?.log, selectedSearchedWell?.lat]}>
            <TouchableOpacity
              onPress={() => onPressSearched(selectedSearchedWell)}>
              <Image
                source={require('../../.././../assets/icons/wellsMarker.png')}
                style={{ height: 80, width: 80 }}
              />
              {/* {svgIcon.BlueMapMarker} */}
            </TouchableOpacity>
          </MapboxGL.MarkerView>
        )}
        {searchLocation && (
          <MapboxGL.PointAnnotation
            id="searchMarker"
            coordinate={searchLocation}
            onSelected={() => {
              setShowRouteActionSheet(true);
            }}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.PointAnnotation>
        )}
        {entranceCoords && (
          <MapboxGL.MarkerView coordinate={entranceCoords}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}
        {pinLocationMarker?.length > 0 && (
          <MapboxGL.MarkerView coordinate={pinLocationMarker}>
            {svgIcon.CurrentLocation}
          </MapboxGL.MarkerView>
        )}

        <MapboxGL.ShapeSource
          key={`wellsCluster-${allWells?.length}`}
          onPress={onPressMarker}
          id="wellsCluster"
          shape={wellsToGeoJSON(allWells)}
          cluster
          clusterRadius={50} // Adjust cluster grouping size
          clusterMaxZoom={14} // Adjust zoom level for cluster expansion
        >
          <MapboxGL.SymbolLayer
            id="clusterLayer"
            filter={['has', 'point_count']} // Only apply to clusters
            style={{
              textField: ['get', 'point_count'], // Show number of markers in cluster
              textSize: 14,
              textColor: '#FFF',
              textHaloColor: '#000',
              textHaloWidth: 2,
              textIgnorePlacement: true,
              textAllowOverlap: true,
              iconImage: 'custom-cluster-icon', // Optional: Add cluster icon
              iconSize: 1,
            }}
          />

          {/* Individual Marker Layer (Shown when zoomed in) */}
          <MapboxGL.SymbolLayer
            id="markerLayer"
            filter={['!', ['has', 'point_count']]} // Only apply to individual markers
            style={{
              iconImage: 'marker', // Reference the registered image name
              iconSize: isIOS() ? 1 : 0.7,
              iconIgnorePlacement: true,
              iconAllowOverlap: true,
              iconAnchor: 'bottom',
            }}
          />

          {/* Load Custom Images for Cluster and Markers */}
          <MapboxGL.Images
            images={{
              marker: marker,
              'custom-cluster-icon': marker, // Add a custom cluster icon
            }}
          />
        </MapboxGL.ShapeSource>
        {/* Route Line */}
        {route?.length > 1 && (
          <MapboxGL.ShapeSource shape={routeGeoJSON} id="routeSource-unique">
            <MapboxGL.LineLayer
              id="routeLayer-unique"
              style={{
                lineWidth: ROUTE_LINE_STYLES.lineWidth,
                lineColor: ROUTE_LINE_STYLES.color,
                lineOpacity: ROUTE_LINE_STYLES.opacity,
              }}
            />
          </MapboxGL.ShapeSource>
        )}

        {offRoadSegment?.length > 0 &&
          offRoadSegment.map((segment, index) => (
            <MapboxGL.ShapeSource
              key={`off-road-source-${index}`}
              id={`off-road-source-${index}`}
              shape={{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: segment,
                },
              }}>
              <MapboxGL.LineLayer
                id={`off-road-line-${index}`}
                style={{
                  lineWidth: 5,
                  lineColor: 'red',
                  lineDasharray: [0.8, 3],
                }}
              />
            </MapboxGL.ShapeSource>
          ))}

        {waypointRoute?.length > 1 && (
          <MapboxGL.ShapeSource
            shape={waypointRouteGeoJSON}
            id="routeSource-unique">
            <MapboxGL.LineLayer
              id="routeLayer-unique"
              style={{
                lineWidth: ROUTE_LINE_STYLES.lineWidth,
                lineColor: ROUTE_LINE_STYLES.color,
                lineOpacity: ROUTE_LINE_STYLES.opacity,
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
      {(route?.length < 1 || waypointRoute?.length < 1) && (
        <TouchableOpacity
          style={styles.maplayerStyles}
          onPress={() => {
            is_subscribed ? setMapLayerSheeet(true) : showPremiumAlert({});
          }}>
          {svgIcon.MapLayer}
        </TouchableOpacity>
      )}
      <WellPathMenuSheet
        modalVisible={showOptionsSheet}
        onPressCancel={() => setShowOptionsSheet(false)}
        setModalVisible={() => setShowOptionsSheet(false)}
        onPressRecordRoute={() => {
          setShowOptionsSheet(false);
          setTimeout(() => {
            {
              is_subscribed
                ? navigation.navigate(Routes.RecordRoute)
                : showPremiumAlert({});
            }
          }, 1000);
        }}
        onPressCreateRoute={() => {
          setShowOptionsSheet(false);
          dispatch(setCreateRouteDataEmpty({}));
          setTimeout(() => {
            {
              is_subscribed
                ? navigation.navigate(Routes.CreateRouteEndUser)
                : showPremiumAlert({});
            }
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
          setTimeout(() => {
            setShowShareWellSheet(true);
          }, 1000);
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
          const converted = selectedWell.map(item => Number(item));
          if (isIOS()) {
            navigation.navigate(Routes.TurnByTurnNav, {
              originCoords: currentLocation,
              entranceCoords: converted,
              entranceName: selectedWellName?.well_name,
            });
          } else {
            navigation.navigate(Routes.ViewWellPathNavigation, {
              entranceCoords: selectedWell,
              entranceName: selectedWellName?.well_name,
            });
          }
        }}
      />

      {showAddEntranceSheet && (
        <AddEntranceSheet
          onPressShare={() => setShowPlaceEntrance(true)}
          selectedWellName={selectedWellName}
          selectedPin={selectedWell}
          onChangeEntranceName={(text: string) => setEntranceName(text)}
          entranceName={entranceName}
          isEntranceMarker={entranceCoords}
          onPressPlaceToEntrance={() => {
            if (isIOS()) {
              navigation.navigate(Routes.TurnByTurnNav, {
                originCoords: currentLocation,
                entranceCoords: entranceCoords,
                entranceName: entranceName || 'Destination',
              });
            } else {
              navigation.navigate(Routes.ViewWellPathNavigation, {
                entranceCoords: entranceCoords,
                entranceName: entranceName,
              });
            }

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
          }}
          routeName={searchLocationName}
          distanceInfo={results}
          actionBtn={actionBtn}
          onPressDirection={() => {
            setActionBtn({
              ...actionBtn,
              direction: true,
            });
          }}
          onPressStart={() => {
            setShowRouteActionSheet(false);

            if (isIOS()) {
              navigation.navigate(Routes.TurnByTurnNav, {
                originCoords: currentLocation,
                entranceCoords: searchLocation,
                entranceName: searchLocationName,
              });
            } else {
              navigation.navigate(Routes.ViewWellPathNavigation, {
                entranceCoords: searchLocation,
                entranceName: searchLocationName,
              });
            }

            setOffRoadSegment([]);
          }}
          show={true}
          onPressShare={() => setShowShareSheet(true)}
          onPressPin={() => {
            setShowRouteActionSheet(false);
            setTimeout(() => {
              pinMapLocation?.current?.open();
            }, 500);
          }}
        />
      )}

      <RBSheet
        ref={pinMapLocation}
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
          values={pinLocationDetails}
          onPressCancel={() => pinMapLocation.current?.close()}
          setValues={setPinLocationDetails}
          onPressSave={() => onPressWaypointSave()}
        />
      </RBSheet>

      {showNavigationSheet && (
        <RouteToWellSheet
          routeLength={waypointRoute?.length}
          onpressCancel={() => clearStates()}
          routeName={placeName}
          distanceInfo={results}
          actionBtn={actionBtn}
          onPressDirection={() => {
            setActionBtn({
              ...actionBtn,
              direction: true,
            });
          }}
          onPressPin={() => {
            setShowNavigationSheet(false);
            setTimeout(() => {
              pinMapLocation?.current?.open();
            }, 500);
          }}
          onPressShare={() => setShowShareSheet(true)}
          onPressStart={() => {
            setShowNavigationSheet(false);
            if (isIOS()) {
              navigation.navigate(Routes.TurnByTurnNav, {
                originCoords: currentLocation,
                entranceCoords: pinLocationMarker,
                entranceName: placeName,
              });
            } else {
              navigation.navigate(Routes.ViewWellPathNavigation, {
                entranceCoords: pinLocationMarker,
                entranceName: placeName,
              });
            }

            setShowNavigationSheet(false);
            clearStates();
          }}
        />
      )}
      <SharedSheet
        modalVisible={showShareSheet}
        onPressOther={() => saveShareRouteLink('way_point')}
        onPressShare={() => {
          setShowShareSheet(false);
          navigation.navigate(Routes.ChatUsers, {
            shareTrail: {
              startingPoint: [],
              endingPoint: pinLocationMarker,
              type: 'Way point',
              route_type: 'waypoint_route',
              name: placeName,
            },
          });
        }}
        setModalVisible={() => setShowShareSheet(false)}
      />
      <SharedSheet
        modalVisible={showShareWellSheet}
        onPressOther={() => saveShareRouteLink('well')}
        onPressShare={() => shareWellwithinApp()}
        setModalVisible={() => setShowShareWellSheet(false)}
      />
      <SharedSheet
        modalVisible={showPlaceEntrance}
        onPressOther={() => saveShareRouteLink('place_entrance')}
        onPressShare={() => onPressWithinappAddEntrance()}
        setModalVisible={() => setShowPlaceEntrance(false)}
      />

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
      <GeneralModal
        title="Well"
        swipeDirection={undefined}
        contentContainerStyle={{ maxHeight: HP('70') }}
        visible={searchedWells?.length > 0}
        onClose={() => {
          setSearchedWells([]);
        }}>
        <FlatList
          data={searchedWells}
          keyboardShouldPersistTaps="always"
          keyExtractor={item =>
            item?.id?.toString() || Math.random().toString()
          }
          nestedScrollEnabled
          initialNumToRender={10}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onPressSearched(item)}>
              <View style={styles.searchWellContainer}>
                <View style={[styles.searchWellContainer]}>
                  <View style={styles.searchWellImage}>
                    {svgIcon.WellsMarker}
                  </View>
                  <View
                    style={{
                      width: '72%',
                    }}>
                    <Text style={styles.searchWellName}>{item?.well_name}</Text>

                    <Text numberOfLines={1} style={styles.searchWellDistance}>
                      {wellDistances[item?.id] || 'Calculating...'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handlePinBtn(item)}>
                  {svgIcon.SearchIcon}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </GeneralModal>
      {/* {loaderState && loaderCount === 0 && <AppLoader />} */}
    </MainWrapper >
  );
};

export default WellPath;
