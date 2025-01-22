import {FlatList, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  AppHeader,
  AppLoader,
  CreateRouteSheet,
  MainWrapper,
  SaveRouteCard,
} from '../../../../components';
import {
  useDeleteRouteMutation,
  useGetAllSaveRouteQuery,
  useUpdateRouteMutation,
} from '../../../../redux/manager/managerApiSlice';
import styles from './styles';
import ConsentSheet from '../../../../components/complex/ConsentSheet';
import {showAlert, UNEXPECTED_ERROR} from '../../../../shared/exporter';

const SavedLibrary = () => {
  const {
    data: allRoutes,
    isLoading,
    refetch,
  } = useGetAllSaveRouteQuery(undefined);
  const [updateRoute, {isLoading: editLoading}] = useUpdateRouteMutation();
  const [deleteRoute, {isLoading: delLoading}] = useDeleteRouteMutation();
  const [showCreateRouteSheet, setShowCreateRouteSheet] =
    useState<boolean>(false);
  const [startData, setstartData] = useState<any>(null);
  const [endData, setEndData] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const consentSheetRef = useRef<any>(null);

  const onPressEdit = async (item: any) => {
    const endItem = item?.dropoff_location;
    const firstItem = item?.pickup_location;

    setEndData({
      latitude: endItem?.latitude,
      longitude: endItem?.longitude,
      name: endItem?.name,
    });
    setstartData({
      latitude: firstItem?.latitude,
      longitude: firstItem?.longitude,
      name: firstItem?.name,
    });
    setRoute(item);
    setTimeout(() => {
      setShowCreateRouteSheet(true);
    }, 1000);
  };

  const onPressUpdate = async (item: any) => {
    const id = route?.id;
    const formatedArr = [startData, ...route?.middle_location_points, endData];
    const data = {
      user_route: {
        name: item,
        locations_attributes: formatedArr,
      },
    };

    const resp = await updateRoute({data, id});
    if (resp?.data) {
      setShowCreateRouteSheet(false);
      refetch();
    }
  };

  const onPressDel = async (itemId: any) => {
    consentSheetRef?.current?.open();
    setRoute(itemId);
  };

  const renderSaveRoutes = ({item}: any) => {
    return (
      <SaveRouteCard
        item={item}
        onPressDel={() => onPressDel(item?.id)}
        onPressEdit={() => onPressEdit(item)}
      />
    );
  };
  const handleSuccess = async () => {
    const resp = await deleteRoute(route);
    if (resp?.data) {
      consentSheetRef?.current?.close();

      refetch();
    } else {
      showAlert('Error', UNEXPECTED_ERROR);
    }
  };

  return (
    <MainWrapper>
      <AppHeader title="Save Library" />
      <FlatList
        contentContainerStyle={styles.flatlistContainerStyle}
        data={allRoutes?.user_routes}
        renderItem={renderSaveRoutes}
        ListEmptyComponent={() => (
          <View style={styles.noDataView}>
            <Text>No data found</Text>
          </View>
        )}
      />
      <CreateRouteSheet
        onPressCross={() => setShowCreateRouteSheet(false)}
        modalVisible={showCreateRouteSheet}
        start={startData}
        end={endData}
        title={route?.name}
        handleSave={onPressUpdate}
      />

      {isLoading || editLoading || (delLoading && <AppLoader />)}

      <ConsentSheet
        ref={consentSheetRef}
        message={'Do you want to delete this\nroute?'}
        cancelBtnText="Cancel"
        successBtnText={'Delete'}
        onPressCancel={() => consentSheetRef?.current.close()}
        onPressSuccess={handleSuccess}
        fontSize={20}
      />
    </MainWrapper>
  );
};

export default SavedLibrary;
