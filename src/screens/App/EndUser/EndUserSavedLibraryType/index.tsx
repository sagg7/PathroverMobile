import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {svgIcon} from '../../../../assets/svg';
import DeleteSvg from '../../../../assets/svg/chatDelete.svg';
import EditSvg from '../../../../assets/svg/Edit.svg';
import {
  AppButton,
  AppHeader,
  AppLoader,
  MainWrapper,
} from '../../../../components';
import GeneralModal from '../../../../components/complex/GeneralModal';
import {
  useDeleteRouteMutation,
  useEditRouteMutation,
  useGetAllSaveRoutesQuery,
} from '../../../../redux/endUser/endUserApiSlice';
import {
  isIOS,
  PFColors,
  Routes,
  SaveRouteSheet,
  WP,
} from '../../../../shared/exporter';
import styles from './styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import SharedSheet from '../../../../components/complex/SharedSheet';
import Share from 'react-native-share';
import useLocation from '../../../../hooks/getLocation';
import {useDispatch} from 'react-redux';
import {setSelectedTrail} from '../../../../redux/endUser/endUserSlice';

const EndUserSavedLibraryType = ({route, navigation}: any) => {
  const item = route?.params?.item;
  const isFocused = useIsFocused();
  const [routeName, setRouteName] = useState('');
  const [error, setError] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [modalType, setModalType] = useState<'menu' | 'edit' | 'delete' | null>(
    null,
  );
  const [showShareSheet, setShowShareSheet] = useState<boolean>(false);
  const queryParams = {route_type: item?.type};
  const {data, isLoading, refetch} = useGetAllSaveRoutesQuery(queryParams);
  const [editRoute, {isLoading: isEditing}] = useEditRouteMutation();
  const [deleteRoute, {isLoading: isDeleting}] = useDeleteRouteMutation();
  const refScrollable = useRef<any>();
  const {location} = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (modalType === 'edit') {
      refScrollable.current.open();
    }
  }, [modalType]);

  useEffect(() => {
    if (isFocused) refetch();
  }, [isFocused]);

  const handleNavigation = (selectedItem: any) => {
    if (
      selectedItem?.route_type === 'waypoint_route' ||
      selectedItem?.route_type === 'hiking_waypoint' ||
      selectedItem?.route_type === 'maps_location_pins'
    ) {
      if (isIOS()) {
        navigation.navigate(Routes.TurnByTurnNav, {
          originCoords: [location.longitude, location.latitude],
          entranceCoords: [
            Number(selectedItem?.dropoff_location?.longitude),
            Number(selectedItem?.dropoff_location?.latitude),
          ],
          entranceName: selectedItem?.name,
          isTrail: false,
          routeInfo: selectedItem,
        });
      } else {
        navigation.navigate(Routes.ViewWellPathNavigation, {
          entranceCoords: [
            Number(selectedItem?.dropoff_location?.longitude),
            Number(selectedItem?.dropoff_location?.latitude),
          ],
          entranceName: selectedItem?.name,
        });
      }
    } else if (selectedItem?.route_type === 'hiking_trail_route') {
      const coordinates = [
        [
          parseFloat(selectedItem?.pickup_location?.longitude),
          parseFloat(selectedItem?.pickup_location?.latitude),
        ],
        ...selectedItem?.middle_location_points.map(point => [
          parseFloat(point.longitude),
          parseFloat(point.latitude),
        ]),
        [
          parseFloat(selectedItem?.dropoff_location?.longitude),
          parseFloat(selectedItem?.dropoff_location?.latitude),
        ],
      ];
      const geoJsonFeature = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
        properties: {
          color: selectedItem.color,
          tags: {
            highway: 'path',
          },
        },
      };

      if (isIOS()) {
        dispatch(setSelectedTrail(geoJsonFeature));
        setTimeout(() => {
          navigation.navigate(Routes.TurnByTurnNav, {
            originCoords: [location?.longitude, location?.latitude],
            entranceCoords: geoJsonFeature?.geometry?.coordinates[0],
            entranceName: 'Unknown Trail',
            isTrail: true,
          });
        }, 300);
      } else {
        navigation.navigate('TrailDetails', {geoJsonFeature});
      }

      return;
    } else {
      if (isIOS()) {
        setTimeout(() => {
          const coords = selectedItem?.pickup_location;
          const lngLat = [Number(coords?.longitude), Number(coords?.latitude)];

          navigation.navigate(Routes.TurnByTurnNav, {
            originCoords: [location?.longitude, location?.latitude],
            entranceCoords: lngLat,
            entranceName: selectedItem?.name,
            isTrail: false,
            routeInfo: selectedItem,
            isLibrary: true,
          });
        }, 300);
      } else {
        navigation.navigate(Routes.ViewSaveRoutes, {
          item: selectedItem,
        });
      }
    }
  };

  const handleModal = (
    routeId: any | null,
    type: 'menu' | 'edit' | 'delete' | null,
  ) => {
    setSelectedRoute(routeId);
    setRouteName(routeId?.name);
    setModalType(null);

    if (type) {
      setTimeout(() => {
        setModalType(type);
      }, 100);
    }
  };

  const handleSave = () => {
    if (!routeName.trim()) {
      setError('Route name cannot be empty');
      return;
    }
    setError('');
    const updatedRoute = {
      ...selectedRoute,
      name: routeName,
    };
    editRoute(updatedRoute)
      .unwrap()
      .then(() => {
        refetch();
        setRouteName('');
        handleModal(null, null);
        refScrollable.current.close();
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const handleDelete = async () => {
    try {
      if (!selectedRoute?.id) {
        console.log('No route selected to delete.');
        return;
      }

      const res = await deleteRoute(selectedRoute.id).unwrap();
      refetch();
      handleModal(null, null);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const renderView = ({item}: any) => (
    <TouchableOpacity
      style={styles.listConatainer}
      onPress={() => handleNavigation(item)}>
      <View style={styles.innerContainer}>
        <View style={styles.iconContainer}>{svgIcon.MapWindow}</View>
        <Text style={styles.listOptionText}>{item?.name || 'N/A'}</Text>
      </View>
      <TouchableOpacity hitSlop={20} onPress={() => handleModal(item, 'menu')}>
        {svgIcon.MenuDot}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleUpdateName = (text: string) => {
    setRouteName(text);
    if (!!text?.trim()) {
      setError('');
    } else {
      setError('Route name cannot be empty');
    }
  };
  const extractCoordinates = location => {
    if (!location || !location.latitude || !location.longitude) return null;

    return [Number(location.longitude), Number(location.latitude)];
  };

  const transformData = (data: any) => {
    return {
      ...data, // Keep all other key-value pairs unchanged
      middle_location_points: data.middle_location_points?.map((point: any) => [
        parseFloat(point.longitude), // Convert to float if needed
        parseFloat(point.latitude),
      ]),
    };
  };

  const handleShareOption = (routeData: any) => {
    setShowShareSheet(false);

    if (routeData?.is_chosen_trail) {
      const trailPath = routeData?.middle_location_points;
      const startingPoint = trailPath?.[0];
      const endingPoint = trailPath?.at(-1);

      const outputPath = transformData(routeData);

      const trailInfo = {
        geometry: {coordinates: outputPath?.middle_location_points},
        properties: {
          color: '#13488A',
          tags: {name: ''},
        },
        type: 'Feature',
      };

      handleModal(null, null);
      setTimeout(() => {
        navigation.navigate(Routes.ChatUsers, {
          shareTrail: {
            startingPoint: startingPoint,
            endingPoint: endingPoint,
            type: 'Chosen Trail',
            data: trailInfo,
          },
        });
      }, 300);
    } else {
      // const hasCustom = routeData?.route_type.includes('custom');
      const startingPoint = extractCoordinates(routeData?.pickup_location);
      const endingPoint = extractCoordinates(routeData?.dropoff_location);
      const {pickup_location, dropoff_location, ...data} = routeData;
      handleModal(null, null);
      // return;
      if (routeData?.route_type) {
        navigation.navigate(Routes.ChatUsers, {
          shareTrail: {
            startingPoint: startingPoint,
            endingPoint: endingPoint,
            ...routeData,
            type:
              routeData.route_type == 'custom_route' ||
              routeData.route_type == 'hiking_custom_route'
                ? 'custom route'
                : routeData.route_type == 'recording_route'
                ? 'Recording'
                : routeData.route_type == 'maps_location_pins'
                ? 'Well pin'
                : routeData.route_type == 'hiking_trail_route'
                ? 'trail'
                : routeData.route_type == 'waypoint_route'
                ? 'Way point'
                : 'route',
          },
        });
      }
    }
  };

  const shareContent = async () => {
    const options = {
      // message: 'Shared location',
      url: `https://staging.path-rover.com/download?route_type=${selectedRoute?.route_type}&route_id=${selectedRoute?.id}`, // Optional: A link to share
    };

    try {
      const res = await Share.open(options);
      console.log(res);
    } catch (err) {
      if (err) {
        console.log(err);
      }
    }
  };

  return (
    <MainWrapper>
      <AppHeader title={item?.title} />
      <FlatList
        data={data?.user_routes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderView}
        ListHeaderComponent={
          data?.user_routes?.length ? (
            <Text style={styles.titleText}>Your Save Library</Text>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <Text style={styles.noFound}>No Record Found.</Text>
          ) : null
        }
      />
      <GeneralModal
        title="Action"
        visible={modalType === 'menu'}
        onClose={() => handleModal(null, null)}>
        <TouchableOpacity
          style={styles.menuOption}
          // onPress={() => handleShareOption(selectedRoute)}
          onPress={() => {
            setModalType(null);
            setTimeout(() => {
              setShowShareSheet(true);
            }, 1000);
          }}>
          {/* <EditSvg fill={PFColors.Blue.Dark} height={20} width={20} /> */}
          {svgIcon.Share}
          <Text style={styles.menuOptionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuOption}
          onPress={() => handleModal(selectedRoute, 'edit')}>
          <EditSvg fill={PFColors.Blue.Dark} height={20} width={20} />
          <Text style={styles.menuOptionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuOption}
          onPress={() => handleModal(selectedRoute, 'delete')}>
          <DeleteSvg fill={PFColors.Blue.Dark} height={20} width={20} />
          <Text style={styles.menuOptionText}>Delete</Text>
        </TouchableOpacity>
      </GeneralModal>
      <GeneralModal
        title=""
        hideCross
        visible={modalType === 'delete'}
        onClose={() => handleModal(null, null)}>
        <Text style={styles.deletedDesc}>
          {'Are you sure you want to delete ?'}
        </Text>
        <View style={styles.innerContainer}>
          <AppButton
            title="Cancel"
            disabled={isDeleting}
            buttonStyle={styles.cancelBtn}
            handleClick={() => handleModal(null, null)}
            textStyle={{color: PFColors.Standard.Black}}
          />
          <AppButton
            title="Delete"
            disabled={isDeleting}
            buttonStyle={styles.deleteBtn}
            handleClick={handleDelete}
            isLoading={isDeleting}
          />
        </View>
      </GeneralModal>
      <SharedSheet
        modalVisible={showShareSheet}
        onPressOther={() => shareContent()}
        onPressShare={() => handleShareOption(selectedRoute)}
        setModalVisible={() => setShowShareSheet(false)}
      />

      <RBSheet
        ref={refScrollable}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customStyles={{
          container: {
            borderTopLeftRadius: WP('3'),
            borderTopRightRadius: WP('3'),
          },
        }}>
        <SaveRouteSheet
          onPressCancel={() => refScrollable.current.close()}
          title="Edit"
          routeName={routeName || ''}
          onChangeText={handleUpdateName}
          onPressSave={() => handleSave()}
          btnTitle="Save"
        />
        {/* )} */}
      </RBSheet>
      {(isLoading || isEditing) && <AppLoader />}
    </MainWrapper>
  );
};

export default EndUserSavedLibraryType;
