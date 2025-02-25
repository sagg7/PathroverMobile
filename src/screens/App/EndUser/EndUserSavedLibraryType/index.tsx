import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {svgIcon} from '../../../../assets/svg';
import {
  AppButton,
  AppHeader,
  AppInput,
  AppLoader,
  MainWrapper,
} from '../../../../components';
import {
  useDeleteRouteMutation,
  useEditRouteMutation,
  useGetAllSaveRoutesQuery,
} from '../../../../redux/endUser/endUserApiSlice';
import {
  setEndingPoint,
  setStartingPoint,
} from '../../../../redux/endUser/endUserSlice';
import {PFColors, Routes, WP} from '../../../../shared/exporter';
import styles from './styles';
import GeneralModal from '../../../../components/complex/GeneralModal';
import EditSvg from '../../../../assets/svg/Edit.svg';
import DeleteSvg from '../../../../assets/svg/chatDelete.svg';

const EndUserSavedLibraryType = ({route, navigation}: any) => {
  const item = route?.params?.item;
  const isHiking = !!route?.params?.isHiking;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [routeName, setRouteName] = useState('');
  const [error, setError] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [modalType, setModalType] = useState<'menu' | 'edit' | 'delete' | null>(
    null,
  );

  const queryParams = {route_type: item?.type};
  const {data, isLoading, refetch} = useGetAllSaveRoutesQuery(queryParams);
  const [editRoute, {isLoading: isEditing}] = useEditRouteMutation();
  const [deleteRoute, {isLoading: isDeleting}] = useDeleteRouteMutation();

  useEffect(() => {
    if (isFocused) refetch();
  }, [isFocused]);

  const handleNavigation = (selectedItem: any) => {
    if (isHiking) {
      dispatch(
        setStartingPoint([
          +selectedItem?.pickup_location?.longitude,
          +selectedItem?.pickup_location?.latitude,
        ]),
      );
      dispatch(
        setEndingPoint([
          +selectedItem?.dropoff_location?.longitude,
          +selectedItem?.dropoff_location?.latitude,
        ]),
      );
      navigation.navigate(Routes.SearchTrailLatLng);
    } else {
      navigation.navigate(Routes.ViewSaveRoutes, {item: selectedItem});
    }
  };

  const handleModal = (
    routeId: number | null,
    type: 'menu' | 'edit' | 'delete' | null,
  ) => {
    setSelectedRoute(routeId);
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
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const handleDelete = () => {
    deleteRoute(selectedRoute?.id)
      .unwrap()
      .then(() => {
        refetch();
        handleModal(null, null);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const renderView = ({item}: any) => (
    <TouchableOpacity
      style={styles.listConatainer}
      onPress={() => handleNavigation(item)}>
      <View style={styles.innerContainer}>
        <View style={styles.iconContainer}>{svgIcon.MapWindow}</View>
        <Text style={styles.listOptionText}>{item?.name}</Text>
      </View>
      <TouchableOpacity hitSlop={20} onPress={() => handleModal(item, 'menu')}>
        {svgIcon.MenuDot}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleUpdateName = (text: string) => {
    setRouteName(text);
    if (!!text.trim()) {
      setError('');
    } else {
      setError('Route name cannot be empty');
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
        title="Edit"
        visible={modalType === 'edit'}
        onClose={() => handleModal(null, null)}>
        <AppInput
          touched={true}
          errorMessage={`${error}`}
          placeholder="Enter name"
          onChangeText={handleUpdateName}
        />
        <AppButton
          title="Save"
          buttonStyle={{marginTop: WP('2')}}
          handleClick={handleSave}
          isLoading={isEditing}
        />
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
            buttonStyle={styles.cancelBtn}
            handleClick={() => handleModal(null, null)}
            textStyle={{color: PFColors.Standard.Black}}
          />
          <AppButton
            title="Delete"
            buttonStyle={styles.deleteBtn}
            handleClick={handleDelete}
            isLoading={isDeleting}
          />
        </View>
      </GeneralModal>
      {isLoading && <AppLoader />}
    </MainWrapper>
  );
};

export default EndUserSavedLibraryType;
