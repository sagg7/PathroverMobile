import React, {useEffect, useRef, useState} from 'react';
import MapboxGL from '@rnmapbox/maps';
import styles from './styles';
import {
  AddEntranceSheet,
  AppLoader,
  MainWrapper,
  MapLayerSheet,
  PinYourLocationSheet,
  WellPathMenuSheet,
} from '../../../../components';
import {useNavigation} from '@react-navigation/native';
import {
  Default_Map_Style,
  HP,
  isIOS,
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
import {TouchableOpacity} from 'react-native';

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
  const [showPinAddress, setShowPinAddress] = useState<boolean>(false);
  const [showAddEntranceSheet, setShowAddEntranceSheet] =
    useState<boolean>(false);
  const [entranceCoords, setEntranceCoords] = useState<any>(null);
  const [entranceName, setEntranceName] = useState<any>('');
  const [createRoute, {isLoading: PinLoading}] = useCreateRouteMutation();

  const [pinYourLocation, setPinYourLocation] = useState<any>({
    latitude: '',
    longitude: '',
    name: '',
  });

  const {data: allWellLocations, isLoading} = useGetAllWellsQuery(undefined);
  const {location} = useLocation();
  const cameraRef = useRef<any>(null);
  const pinLocationSheet = useRef<any>(null);
  const [allWells, setAllWells] = useState<any>([]);
  const [allPins, setAllPins] = useState<any>([]);

  useEffect(() => {
    if (location) {
      setCurrentLocation([location?.longitude, location?.latitude]);
    }
  }, [location]);

  useEffect(() => {
    if (allWellLocations) setAllPins(allWellLocations?.pin);
    setAllWells(allWellLocations?.wells);
  }, [allWellLocations]);

  useEffect(() => {
    if (!nearbyPins && nearbyWells) {
      setAllWells(allWellLocations?.wells);
      setAllPins([]);
    } else if (!nearbyWells && nearbyPins) {
      setAllPins(allWellLocations?.pin);
      setAllWells([]);
    } else if (nearbyPins && nearbyWells) {
      setAllPins(allWellLocations?.pin);
      setAllWells(allWellLocations?.wells);
    } else if (!nearbyPins && !nearbyWells) {
      setAllPins([]);
      setAllWells([]);
    }
  }, [nearbyPins, nearbyWells, allWellLocations]);

  useEffect(() => {
    if (searchLocation) {
      setTimeout(() => {
        if (cameraRef.current) {
          cameraRef.current.moveTo(searchLocation, 1500);
        } else {
          showAlert(
            'Error',
            'Your coordinates are incorrect, Unable to locate.',
          );
        }
      }, 200);
    }
  }, [searchLocation]);

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

    setTimeout(() => {
      setMapLayerSheeet(false);
    }, 500);
  };

  const onPressToggle = () => {
    setAvailable(!available);
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

  const onpressMarker = (e: any) => {
    setShowPinAddress(true);
    setSelectedWell(e?.geometry?.coordinates);
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
        key={selectedMapType}
        styleURL={selectedMapType}
        style={styles.map}
        scaleBarEnabled={false}
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
          <MapboxGL.MarkerView coordinate={searchLocation}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}
        {entranceCoords && (
          <MapboxGL.MarkerView coordinate={entranceCoords}>
            {svgIcon.BlueMapMarker}
          </MapboxGL.MarkerView>
        )}

        {allWells
          ?.filter(
            (item: any) =>
              item?.lat !== undefined &&
              item?.lat !== '' &&
              item?.log !== undefined &&
              item?.log !== '' &&
              !isNaN(Number(item?.lat)) &&
              !isNaN(Number(item?.log)),
          )
          .map((item: any, index: number) => {
            const coordinates = [Number(item?.log), Number(item?.lat)];
            return (
              <MapboxGL.PointAnnotation
                key={`pin-${index}`}
                id={`pin-${index}`}
                onSelected={onpressMarker}
                coordinate={coordinates}>
                {svgIcon.CurrentLocation}
              </MapboxGL.PointAnnotation>
            );
          })}
        {allPins
          ?.filter(
            (item: any) =>
              item?.lat !== undefined &&
              item?.lat !== '' &&
              item?.log !== undefined &&
              item?.log !== '' &&
              !isNaN(Number(item?.lat)) &&
              !isNaN(Number(item?.log)),
          )
          .map((item: any, index: number) => {
            const coordinates = [Number(item?.log), Number(item?.lat)];
            return (
              <MapboxGL.PointAnnotation
                key={`pin-${index}`}
                id={`pin-${index}`}
                onSelected={onpressMarker}
                coordinate={coordinates}>
                {svgIcon.CurrentLocation}
              </MapboxGL.PointAnnotation>
            );
          })}

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
        style={styles.maplayerStyles}
        onPress={() => {
          setMapLayerSheeet(true);
        }}>
        {svgIcon.MapLayer}
      </TouchableOpacity>
      <WellPathMenuSheet
        modalVisible={showOptionsSheet}
        onPressCancel={() => setShowOptionsSheet(false)}
        setModalVisible={() => setShowOptionsSheet(false)}
        onPressCreateRoute={() => {
          setShowOptionsSheet(false);
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
        modalVisible={showPinAddress}
        selectedPin={selectedWell || ['', '']}
        setModalVisible={() => setShowPinAddress(false)}
        onPresAddEntrance={() => {
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
    </MainWrapper>
  );
};

export default WellPath;
